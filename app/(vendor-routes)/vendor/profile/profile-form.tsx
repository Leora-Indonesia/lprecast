"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import {
  vendorRegistrationSchema,
  type VendorRegistrationFormData,
} from "@/lib/validations/vendor-registration"
import { Button } from "@/components/ui/button"
import { CompanyInfoForm } from "@/components/vendor/register/company-info-form"
import { LegalDocumentsForm } from "@/components/vendor/register/legal-documents-form"
import { OperationalForm } from "@/components/vendor/register/operational-form"

import { saveDraft } from "@/app/(vendor-routes)/vendor/onboarding/mutations"
import { transformToDraftData } from "@/app/(vendor-routes)/vendor/onboarding/transform"
import type {
  OnboardingDraftData,
  UserRegistrationData,
} from "@/app/(vendor-routes)/vendor/onboarding/types"

const STEPS = [
  { label: "Informasi Perusahaan" },
  { label: "Dokumen Legal" },
  { label: "Operasional" },
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

export function VendorProfileForm({
  userData,
  draftData,
}: {
  userData: UserRegistrationData | null
  draftData: OnboardingDraftData | null
}) {
  const [currentStep, setCurrentStep] = useState(
    draftData ? Math.min(2, Math.max(0, draftData.currentStep - 1)) : 0
  )
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
    // Zod v4 + RHF v7 type incompatibility.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(vendorRegistrationSchema) as any,
    defaultValues,
    mode: "onTouched",
  })

  const { reset, getValues, trigger, watch } = form

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
          contact_1:
            draftData.company_info.contacts.find((c) => c.sequence === 1) ||
            ({ no_hp: "", nama: "", jabatan: "" } as never),
          contact_2:
            draftData.company_info.contacts.find((c) => c.sequence === 2) ||
            ({ no_hp: "", nama: "", jabatan: "" } as never),
          contact_3:
            draftData.company_info.contacts.find((c) => c.sequence === 3) ||
            ({ no_hp: "", nama: "", jabatan: "" } as never),
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
            bank_atas_nama: draftData.operational.bank_account.account_holder_name,
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
            description: "",
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
        review: { legal_agreement: false },
      }

      isInitializingRef.current = true
      reset(transformedValues)
      isInitializingRef.current = false
      isDirtyRef.current = false
      setHasUnsavedChanges(false)
      toast.info("Data profil dimuat")
      return
    }

    if (userData) {
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
            company_profile_path: draftDataRef.current.documents.company_profile_path,
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
            draftDataRef.current = { ...draftDataRef.current, documents: draft.documents }
          }
          setUploadedDocPaths({ ...draft.documents })
          if (options.isAutoSave) {
            toast.success("Draft tersimpan otomatis")
          } else {
            toast.success("Perubahan tersimpan")
          }
        } else {
          toast.error("Gagal menyimpan", { description: result.error })
        }
      } catch (err) {
        console.error("Error saving profile draft:", err)
        toast.error("Gagal menyimpan perubahan")
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
      const hasKtpFromDraft = draftDataRef.current?.documents?.ktp_path
      if (hasKtpFromDraft) {
        isValid = true
      } else {
        isValid = await trigger("legal_documents.ktp_file")
      }
    }

    if (isValid) {
      await persistSave()
      setCurrentStep((s) => Math.min(2, s + 1))
    } else {
      toast.error("Lengkapi semua field yang diperlukan")
    }
  }

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(0, s - 1))
  }

  const handleStepClick = (step: number) => {
    if (step === currentStep) return
    void (async () => {
      await persistSave()
      setCurrentStep(step)
    })()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold">Profil Vendor</h1>
            <p className="text-sm text-muted-foreground">
              Edit data onboarding untuk melengkapi profil
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Save className="h-4 w-4" />
            {isSaving ? (
              <span>Menyimpan...</span>
            ) : lastSaved ? (
              <span>
                Terakhir disimpan: {" "}
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
        <div className="grid grid-cols-3 text-sm font-medium">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isActive = index === currentStep
            return (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`flex items-center gap-3 px-6 py-4 transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                } ${index < STEPS.length - 1 ? "border-r border-border" : ""}`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    isActive
                      ? "border-primary-foreground/70 bg-primary-foreground text-primary"
                      : isCompleted
                        ? "border-primary bg-primary-foreground text-primary"
                        : "border-muted-foreground/50 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 text-primary" strokeWidth={4} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="truncate">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {currentStep === 0 && <CompanyInfoForm form={form} />}
          {currentStep === 1 && (
            <LegalDocumentsForm form={form} uploadedFiles={uploadedDocPaths} />
          )}
          {currentStep === 2 && (
            <OperationalForm form={form} onForceSave={persistSave} />
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
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
                Simpan
              </>
            )}
          </Button>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            )}

            <Button
              type="button"
              onClick={currentStep < 2 ? handleNext : () => persistSave()}
              disabled={isSaving}
            >
              {currentStep < 2 ? (
                <>
                  <span>Lanjutkan</span>
                  <ArrowRight className="ml-2 h-3 w-3" />
                </>
              ) : (
                <>
                  <span>Simpan Perubahan</span>
                  <Save className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
