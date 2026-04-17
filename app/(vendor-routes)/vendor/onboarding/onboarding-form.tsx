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
import { transformToDraftData } from "./transform"
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
      mobilisasi_demobilisasi: false,
      penginapan_tukang: false,
      biaya_pengiriman: false,
      biaya_langsir: false,
      instalasi: false,
      ppn: false,
    },
    additional_costs: [],
  },
  review: {
    legal_agreement: false,
  },
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
  const [uploadedDocPaths, setUploadedDocPaths] = useState<
    | {
        ktp_path?: string | null
        npwp_path?: string | null
        nib_path?: string | null
        siup_sbu_path?: string | null
        company_profile_path?: string | null
      }
    | undefined
  >(draftData?.documents)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isDirtyRef = useRef(false)
  const isSavingRef = useRef(false)
  const isInitializingRef = useRef(false)
  const persistSaveRef = useRef<
    ((options?: { isAutoSave?: boolean }) => Promise<void>) | null
  >(null)
  const draftDataRef = useRef(draftData)

  const form = useForm<VendorRegistrationFormData>({
    // Zod v4 + RHF v7 type incompatibility: z.boolean().refine() produces
    // `boolean | undefined` which conflicts with RHF's expected `boolean`.
    // This is a known upstream type gap between Zod v4 and @hookform/resolvers v5.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(vendorRegistrationSchema) as any,
    defaultValues,
    mode: "onTouched",
  })

  const { reset, getValues, trigger, watch } = form

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (currentStep < 3) {
      handleNext()
    }
  }

  useEffect(() => {
    if (isInitializingRef.current) return

    const subscription = watch(() => {
      isDirtyRef.current = true
      setHasUnsavedChanges(true)
    })

    return () => subscription.unsubscribe()
  }, [watch])

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
            mobilisasi_demobilisasi:
              draftData.operational.cost_inclusions.mobilisasi_demobilisasi,
            penginapan_tukang:
              draftData.operational.cost_inclusions.penginapan_tukang,
            biaya_pengiriman:
              draftData.operational.cost_inclusions.biaya_pengiriman,
            biaya_langsir: draftData.operational.cost_inclusions.biaya_langsir,
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
      isInitializingRef.current = true
      reset(transformedValues)
      isInitializingRef.current = false
      isDirtyRef.current = false
      setHasUnsavedChanges(false)
      toast.info("Draft ditemukan", {
        description: "Data Anda telah dimuat dari penyimpanan.",
      })
    } else if (userData) {
      isInitializingRef.current = true
      reset({
        ...getValues(),
        company_info: {
          ...getValues().company_info,
          nama_perusahaan: userData.nama_perusahaan,
          email: userData.email,
          nama_pic: userData.nama_pic || "",
          kontak_pic: userData.kontak_pic || "",
        },
      })
      isInitializingRef.current = false
      isDirtyRef.current = false
      setHasUnsavedChanges(false)
      toast.info("Data dari registrasi dimuat", {
        description: "Nama perusahaan dan PIC telah terisi otomatis.",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persistSave = useCallback(
    async (options: { isAutoSave?: boolean } = {}) => {
      if (isSavingRef.current) return
      if (!isDirtyRef.current) return

      isSavingRef.current = true
      setIsSaving(true)
      try {
        const currentValues = form.getValues()
        const draft = transformToDraftData(currentValues)

        if (draftDataRef.current?.documents) {
          draft.documents = {
            ...draft.documents,
            ktp_path: draftDataRef.current.documents.ktp_path,
            npwp_path: draftDataRef.current.documents.npwp_path,
            nib_path: draftDataRef.current.documents.nib_path,
            siup_sbu_path: draftDataRef.current.documents.siup_sbu_path,
            company_profile_path:
              draftDataRef.current.documents.company_profile_path,
          }
        }

        const files = new Map<string, File>()
        const fileFields: [string, File | null | undefined][] = [
          ["ktp_file", currentValues.legal_documents.ktp_file],
          ["npwp_file", currentValues.legal_documents.npwp_file],
          ["nib_file", currentValues.legal_documents.nib_file],
          ["siup_file", currentValues.legal_documents.siup_file],
          ["compro_file", currentValues.legal_documents.compro_file],
        ]

        for (const [key, file] of fileFields) {
          if (file && file.size > 0) {
            files.set(key, file as File)
          }
        }

        const result = await saveDraft(draft, currentStep + 1, files)

        if (result.success) {
          isDirtyRef.current = false
          setHasUnsavedChanges(false)
          setLastSaved(new Date())
          if (draftDataRef.current?.documents) {
            draftDataRef.current = {
              ...draftDataRef.current,
              documents: draft.documents,
            }
          }
          setUploadedDocPaths({ ...draft.documents })
          if (options.isAutoSave) {
            toast.success("Draft tersimpan otomatis")
          }
        }
      } catch (err) {
        console.error("Error saving draft:", err)
      } finally {
        isSavingRef.current = false
        setIsSaving(false)
      }
    },
    [currentStep, form]
  )

  persistSaveRef.current = persistSave

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (isDirtyRef.current && persistSaveRef.current) {
        persistSaveRef.current({ isAutoSave: true })
      }
    }, 30000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  const handleNext = async () => {
    let isValid = false

    if (currentStep === 0) {
      isValid = await trigger([
        "company_info.nama_perusahaan",
        "company_info.email",
        "company_info.nama_pic",
        "company_info.kontak_pic",
        "company_info.contact_1",
        "company_info.contact_2",
      ])
    } else if (currentStep === 1) {
      const hasKtpFromDraft = draftData?.documents?.ktp_path
      if (hasKtpFromDraft) {
        isValid = true
      } else {
        isValid = await trigger("legal_documents.ktp_file")
      }
    } else if (currentStep === 2) {
      isValid = await trigger([
        "operational.bank.bank_nama",
        "operational.bank.bank_nomor",
        "operational.bank.bank_atas_nama",
        "operational.factory_address.alamat_detail",
        "operational.factory_address.provinsi_id",
        "operational.factory_address.kabupaten_id",
        "operational.factory_address.kecamatan",
        "operational.factory_address.kode_pos",
        "operational.products",
        "operational.delivery_areas",
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

  const onFormSubmit = async () => {
    const hasKtpFromDraft = draftData?.documents?.ktp_path
    let isValid = false

    if (hasKtpFromDraft) {
      isValid = await trigger([
        "company_info",
        "legal_documents.npwp_nomor",
        "legal_documents.nib_nomor",
        "operational",
        "review.legal_agreement",
      ])
    } else {
      isValid = await trigger()
    }

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

      if (draftData?.documents) {
        payload.documents = {
          ...payload.documents,
          ktp_path: draftData.documents.ktp_path,
          npwp_path: draftData.documents.npwp_path,
          nib_path: draftData.documents.nib_path,
          siup_sbu_path: draftData.documents.siup_sbu_path,
          company_profile_path: draftData.documents.company_profile_path,
        }
      }

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
            <form onSubmit={onSubmit}>
              <div className="space-y-8">
                {currentStep === 0 && <CompanyInfoForm form={form} />}
                {currentStep === 1 && (
                  <LegalDocumentsForm
                    form={form}
                    uploadedFiles={uploadedDocPaths}
                  />
                )}
                {currentStep === 2 && (
                  <OperationalForm form={form} onForceSave={persistSave} />
                )}
                {currentStep === 3 && <ReviewSubmit form={form} />}
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => persistSave()}
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
                    onClick={currentStep < 3 ? handleNext : onFormSubmit}
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
