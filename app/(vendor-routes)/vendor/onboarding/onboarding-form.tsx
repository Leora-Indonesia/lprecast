"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ArrowLeft, ArrowRight, Send, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { type VendorRegistrationFormData } from "@/lib/validations/vendor-registration"
import { vendorRegistrationSchema } from "@/lib/validations/vendor-registration"

import { CompanyInfoForm } from "@/components/vendor/register/company-info-form"
import { LegalDocumentsForm } from "@/components/vendor/register/legal-documents-form"
import { OperationalForm } from "@/components/vendor/register/operational-form"
import { ReviewSubmit } from "@/components/vendor/register/review-submit"

import { saveDraft, submitOnboarding } from "./mutations"
import type { OnboardingDraftData, UserRegistrationData } from "./types"

import { Button } from "@/components/ui/button"

const STEPS = [
  { label: "Informasi Perusahaan" },
  { label: "Dokumen Legal" },
  { label: "Operasional" },
  { label: "Review & Submit" },
]

const defaultValues: VendorRegistrationFormData = {
  company_info: {
    nama_perusahaan: "",
    email: "",
    nama_pic: "",
    kontak_pic: "",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    contact_1: { no_hp: "", nama: "", jabatan: "" },
    contact_2: { no_hp: "", nama: "", jabatan: "" },
    contact_3: { no_hp: "", nama: "", jabatan: "" },
  },
  legal_documents: {
    ktp_file: undefined,
    npwp_nomor: "",
    npwp_file: undefined,
    nib_nomor: "",
    nib_file: undefined,
    siup_file: undefined,
    compro_file: undefined,
  },
  operational: {
    bank: { bank_nama: "", bank_nomor: "", bank_atas_nama: "" },
    factory_address: {
      alamat_detail: "",
      provinsi_id: "",
      provinsi_name: "",
      kabupaten_id: "",
      kabupaten_name: "",
      kecamatan: "",
      kode_pos: "",
    },
    products: [],
    delivery_areas: [],
    cost_inclusions: {
      mobilisasi: false,
      penginapan: false,
      pengiriman: false,
      langsir: false,
      instalasi: false,
      ppn: false,
    },
    additional_costs: [],
  },
  review: {
    legal_agreement: false,
  },
}

export function transformToDraftData(
  formData: VendorRegistrationFormData
): OnboardingDraftData {
  return {
    currentStep: 1,
    company_info: {
      nama_perusahaan: formData.company_info.nama_perusahaan,
      email: formData.company_info.email,
      nama_pic: formData.company_info.nama_pic,
      kontak_pic: formData.company_info.kontak_pic,
      website: formData.company_info.website || "",
      instagram: formData.company_info.instagram || "",
      facebook: formData.company_info.facebook || "",
      linkedin: formData.company_info.linkedin || "",
      contacts: [
        { sequence: 1, ...formData.company_info.contact_1 },
        { sequence: 2, ...formData.company_info.contact_2 },
        formData.company_info.contact_3?.nama
          ? { sequence: 3, ...formData.company_info.contact_3 }
          : null,
      ].filter(Boolean) as OnboardingDraftData["company_info"]["contacts"],
    },
    documents: {
      ktp_path: null,
      ktp_number: null,
      npwp_path: null,
      npwp_number: formData.legal_documents.npwp_nomor || null,
      nib_path: null,
      nib_number: formData.legal_documents.nib_nomor || null,
      siup_sbu_path: null,
      company_profile_path: null,
    },
    operational: {
      factory_address: {
        address: formData.operational.factory_address.alamat_detail || "",
        province: formData.operational.factory_address.provinsi_name || "",
        kabupaten: formData.operational.factory_address.kabupaten_name || "",
        kecamatan: formData.operational.factory_address.kecamatan || "",
        postal_code: formData.operational.factory_address.kode_pos || "",
      },
      delivery_areas: formData.operational.delivery_areas.map((area) => ({
        province_id: area.province_id || "",
        province_name: area.province_name || "",
        city_id: area.city_id || "",
        city_name: area.city_name || "",
      })),
      products: formData.operational.products.map((p) => ({
        name: p.name,
        satuan: p.satuan,
        price: p.price,
        dimensions: p.dimensions || "",
        material: p.material || "",
        finishing: p.finishing || "",
        weight_kg: (p as { berat?: number }).berat || 0,
        lead_time_days: p.lead_time_days || 0,
        moq: p.moq || 0,
      })),
      bank_account: {
        bank_name: formData.operational.bank.bank_nama,
        account_number: formData.operational.bank.bank_nomor,
        account_holder_name: formData.operational.bank.bank_atas_nama,
      },
      cost_inclusions: {
        mobilisasi_demobilisasi:
          formData.operational.cost_inclusions.mobilisasi,
        penginapan_tukang: formData.operational.cost_inclusions.penginapan,
        biaya_pengiriman: formData.operational.cost_inclusions.pengiriman,
        biaya_langsir: formData.operational.cost_inclusions.langsir,
        instalasi: formData.operational.cost_inclusions.instalasi,
        ppn: formData.operational.cost_inclusions.ppn,
      },
      additional_costs: formData.operational.additional_costs.map((c) => ({
        description: c.description || "",
        amount: c.amount || 0,
        unit: c.unit || "",
      })),
    },
  }
}

interface OnboardingFormProps {
  userData: UserRegistrationData | null
  draftData: OnboardingDraftData | null
}

export function OnboardingForm({ userData, draftData }: OnboardingFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(
    draftData ? Math.max(0, draftData.currentStep - 1) : 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isDirtyRef = useRef(false)

  const form = useForm<VendorRegistrationFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(vendorRegistrationSchema) as any,
    defaultValues,
    mode: "onTouched",
  })

  const { watch, reset, getValues, trigger } = form
  const formValues = watch()

  useEffect(() => {
    isDirtyRef.current = true
    setHasUnsavedChanges(true)
  }, [formValues])

  useEffect(() => {
    if (draftData) {
      const transformedValues: VendorRegistrationFormData = {
        company_info: {
          nama_perusahaan: draftData.company_info.nama_perusahaan,
          email: draftData.company_info.email,
          nama_pic: draftData.company_info.nama_pic,
          kontak_pic: draftData.company_info.kontak_pic,
          website: draftData.company_info.website,
          instagram: draftData.company_info.instagram,
          facebook: draftData.company_info.facebook,
          linkedin: draftData.company_info.linkedin,
          contact_1: draftData.company_info.contacts.find(
            (c) => c.sequence === 1
          ) || { no_hp: "", nama: "", jabatan: "" },
          contact_2: draftData.company_info.contacts.find(
            (c) => c.sequence === 2
          ) || { no_hp: "", nama: "", jabatan: "" },
          contact_3: draftData.company_info.contacts.find(
            (c) => c.sequence === 3
          ) || { no_hp: "", nama: "", jabatan: "" },
        },
        legal_documents: {
          ktp_file: undefined,
          npwp_nomor: draftData.documents.npwp_number || "",
          npwp_file: undefined,
          nib_nomor: draftData.documents.nib_number || "",
          nib_file: undefined,
          siup_file: undefined,
          compro_file: undefined,
        },
        operational: {
          bank: {
            bank_nama: draftData.operational.bank_account.bank_name,
            bank_nomor: draftData.operational.bank_account.account_number,
            bank_atas_nama:
              draftData.operational.bank_account.account_holder_name,
          },
          factory_address: {
            alamat_detail: draftData.operational.factory_address.address,
            provinsi_id: "",
            provinsi_name: draftData.operational.factory_address.province,
            kabupaten_id: "",
            kabupaten_name: draftData.operational.factory_address.kabupaten,
            kecamatan: draftData.operational.factory_address.kecamatan,
            kode_pos: draftData.operational.factory_address.postal_code,
          },
          products: draftData.operational.products.map((p) => ({
            name: p.name,
            satuan: p.satuan,
            price: p.price,
            dimensions: p.dimensions,
            material: p.material,
            finishing: p.finishing,
            weight_kg: p.weight_kg,
            lead_time_days: p.lead_time_days,
            moq: p.moq,
          })),
          delivery_areas: draftData.operational.delivery_areas.map((a) => ({
            province_id: a.province_id,
            province_name: a.province_name,
            city_id: a.city_id,
            city_name: a.city_name,
          })),
          cost_inclusions: {
            mobilisasi:
              draftData.operational.cost_inclusions.mobilisasi_demobilisasi,
            penginapan: draftData.operational.cost_inclusions.penginapan_tukang,
            pengiriman: draftData.operational.cost_inclusions.biaya_pengiriman,
            langsir: draftData.operational.cost_inclusions.biaya_langsir,
            instalasi: draftData.operational.cost_inclusions.instalasi,
            ppn: draftData.operational.cost_inclusions.ppn,
          },
          additional_costs: draftData.operational.additional_costs.map((c) => ({
            description: c.description,
            amount: c.amount,
            unit: c.unit,
          })),
        },
        review: {
          legal_agreement: false,
        },
      }
      reset(transformedValues)
      toast.info("Draft ditemukan", {
        description: "Data Anda telah dimuat dari penyimpanan.",
      })
    } else if (userData) {
      reset({
        ...getValues(),
        company_info: {
          ...getValues().company_info,
          nama_perusahaan: userData.nama_perusahaan,
          nama_pic: userData.nama_pic,
          email: userData.email,
          kontak_pic: userData.kontak_pic || "",
        },
      })
      toast.info("Data dari registrasi dimuat", {
        description: "Nama perusahaan dan PIC telah terisi otomatis.",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persistSave = useCallback(async () => {
    if (isSaving) return
    if (!isDirtyRef.current) return

    setIsSaving(true)
    try {
      const currentValues = getValues()
      const draft = transformToDraftData(currentValues)
      const result = await saveDraft(draft, currentStep + 1)

      if (result.success) {
        isDirtyRef.current = false
        setHasUnsavedChanges(false)
        setLastSaved(new Date())
      }
    } catch (err) {
      console.error("Error saving draft:", err)
    } finally {
      setIsSaving(false)
    }
  }, [currentStep, getValues, isSaving])

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (isDirtyRef.current) {
        persistSave()
      }
    }, 30000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [persistSave, formValues])

  const handleNext = async () => {
    let isValid = false

    if (currentStep === 0) {
      isValid = await trigger([
        "company_info.nama_perusahaan",
        "company_info.email",
        "company_info.nama_pic",
        "company_info.kontak_pic",
        "company_info.contact_1",
      ])
    } else if (currentStep === 1) {
      isValid = await trigger("legal_documents.ktp_file")
    } else if (currentStep === 2) {
      isValid = await trigger([
        "operational.bank.bank_nama",
        "operational.bank.bank_nomor",
        "operational.bank.bank_atas_nama",
        "operational.factory_address.alamat_detail",
      ])
    }

    if (isValid) {
      await persistSave()
      setCurrentStep(currentStep + 1)
    } else {
      toast.error("Lengkapi semua field yang diperlukan")
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) {
      toast.error("Lengkapi semua field yang diperlukan")
      return
    }

    const legalAgreement = getValues("review.legal_agreement")
    if (!legalAgreement) {
      toast.error("Anda harus menyetujui syarat dan ketentuan")
      return
    }

    setIsSubmitting(true)

    try {
      const data = getValues()
      const formDataToSubmit = new FormData()

      const fileEntries: [string, File | undefined][] = [
        ["ktp_file", data.legal_documents.ktp_file ?? undefined],
        ["npwp_file", data.legal_documents.npwp_file ?? undefined],
        ["nib_file", data.legal_documents.nib_file ?? undefined],
        ["siup_file", data.legal_documents.siup_file ?? undefined],
        ["compro_file", data.legal_documents.compro_file ?? undefined],
      ]

      for (const [key, file] of fileEntries) {
        if (file && file.size > 0) {
          formDataToSubmit.append(key, file)
        }
      }

      const payload = transformToDraftData(data)
      formDataToSubmit.append("payload", JSON.stringify(payload))

      const result = await submitOnboarding(formDataToSubmit)

      if (result && !result.success) {
        toast.error("Gagal submit", {
          description: result.error,
        })
      } else if (result?.redirectTo) {
        toast.success("Berhasil!", {
          description: "Mengalihkan ke dashboard...",
        })
        router.push(result.redirectTo)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-8 pt-8 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Lengkapi Data Vendor
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Isi data perusahaan Anda untuk menyelesaikan pendaftaran
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Save className="h-4 w-4" />
                {isSaving ? (
                  <span>Menyimpan...</span>
                ) : lastSaved ? (
                  <span>
                    Terakhir disimpan:{" "}
                    {lastSaved.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ) : (
                  <span>Belum disimpan</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-border bg-muted/50">
            <div className="grid grid-cols-4 text-sm font-medium">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep
                const isActive = index === currentStep

                return (
                  <div
                    key={index}
                    onClick={() => isCompleted && handleStepClick(index)}
                    className={`flex cursor-pointer items-center gap-3 px-8 py-4 transition ${
                      isActive
                        ? "border-b-2 border-b-primary bg-card text-primary"
                        : isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent text-gray-600 hover:text-gray-900"
                    } ${index < STEPS.length - 1 ? "border-r border-border" : ""} ${
                      isCompleted ? "cursor-pointer" : ""
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                        isActive
                          ? "border-primary"
                          : isCompleted
                            ? "border-primary bg-primary-foreground text-primary"
                            : "border-gray-400 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <Check
                          className="h-3 w-3 text-primary"
                          strokeWidth={4}
                        />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span>{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-10">
            <form>
              <div className="space-y-8">
                {currentStep === 0 && <CompanyInfoForm form={form} />}
                {currentStep === 1 && <LegalDocumentsForm form={form} />}
                {currentStep === 2 && (
                  <OperationalForm form={form} onForceSave={persistSave} />
                )}
                {currentStep === 3 && <ReviewSubmit form={form} />}
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={persistSave}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Draft
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-3">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={currentStep < 3 ? handleNext : handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : currentStep < 3 ? (
                      <>
                        <span>Lanjutkan</span>
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <span>Kirim Data</span>
                        <Send className="ml-2 h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-muted">
          &copy; {year} LPrecast Vendor Portal. Butuh bantuan? Hubungi Admin.
        </div>
      </div>
    </div>
  )
}
