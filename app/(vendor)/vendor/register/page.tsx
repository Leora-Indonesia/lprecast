"use client"

import { useState, useEffect } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ArrowLeft, ArrowRight, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  vendorRegistrationSchema,
  type VendorRegistrationFormData,
} from "@/lib/validations/vendor-registration"
import { useFormPersistence } from "@/lib/hooks/use-form-persistence"

import {
  CompanyInfoForm,
  type CompanyInfoFormProps,
} from "@/components/vendor/register/company-info-form"
import {
  LegalDocumentsForm,
  type LegalDocumentsFormProps,
} from "@/components/vendor/register/legal-documents-form"
import {
  OperationalForm,
  type OperationalFormProps,
} from "@/components/vendor/register/operational-form"
import {
  ReviewSubmit,
  type ReviewSubmitProps,
} from "@/components/vendor/register/review-submit"
import { VendorHeader } from "@/components/vendor/vendor-header"
import { submitRegistration } from "./actions"
import { uploadVendorDocument } from "@/lib/upload"
import { Loader2 } from "lucide-react"

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
    bank: {
      bank_nama: "",
      bank_nomor: "",
      bank_atas_nama: "",
    },
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

export default function VendorRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle")
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<VendorRegistrationFormData>({
    resolver: zodResolver(vendorRegistrationSchema) as never,
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldFocusError: true,
  })

  const {
    hasSavedData,
    loadSavedData,
    clearSavedData,
    savedTimestamp,
    forceSave,
  } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFormPersistence<any>({
      key: "vendor-registration-draft",
      form,
      onSave: () => {
        setAutoSaveStatus("saved")
      },
    })

  useEffect(() => {
    if (hasSavedData) {
      requestAnimationFrame(() => {
        setShowLoadDialog(true)
      })
    }
  }, [hasSavedData])

  useEffect(() => {
    if (autoSaveStatus === "saved") {
      const timer = setTimeout(() => {
        setAutoSaveStatus("idle")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [autoSaveStatus])

  const getNestedValue = (
    obj: Record<string, unknown>,
    path: string
  ): unknown => {
    return path.split(".").reduce((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj as unknown)
  }

  const scrollToFirstError = () => {
    const errors = form.formState.errors

    const fieldIds: Record<number, Record<string, string>> = {
      0: {
        "company_info.nama_perusahaan": "nama_perusahaan",
        "company_info.email": "email",
        "company_info.nama_pic": "nama_pic",
        "company_info.kontak_pic": "kontak_pic",
      },
      1: {
        "legal_documents.ktp_file": "ktp_file",
      },
      2: {
        "operational.bank.bank_nama": "bank_nama",
        "operational.bank.bank_nomor": "bank_nomor",
        "operational.bank.bank_atas_nama": "bank_atas_nama",
        "operational.factory_address.alamat_detail": "alamat_detail",
        "operational.factory_address.provinsi_id": "provinsi_id",
        "operational.factory_address.kabupaten_id": "kabupaten_id",
        "operational.factory_address.kecamatan": "kecamatan",
        "operational.factory_address.kode_pos": "kode_pos",
        "operational.products": "products-section",
        "operational.delivery_areas": "delivery-areas-section",
      },
    }

    const currentFieldIds = fieldIds[currentStep]
    if (!currentFieldIds) return

    for (const [fieldPath, elementId] of Object.entries(currentFieldIds)) {
      const error = getNestedValue(errors, fieldPath)
      if (error) {
        const element = document.getElementById(elementId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          element.classList.add("ring-2", "ring-red-400", "ring-offset-2")
          setTimeout(() => {
            element.focus()
            element.classList.remove("ring-2", "ring-red-400", "ring-offset-2")
          }, 1000)
        }
        break
      }
    }
  }

  const handleNext = async () => {
    let isValid = false

    if (currentStep === 0) {
      isValid = await form.trigger([
        "company_info.nama_perusahaan",
        "company_info.email",
        "company_info.nama_pic",
        "company_info.kontak_pic",
        "company_info.contact_1",
        "company_info.contact_2",
        "company_info.contact_3.no_hp",
        "company_info.contact_3.nama",
        "company_info.contact_3.jabatan",
      ])
    } else if (currentStep === 1) {
      const npwpNomor = form.getValues("legal_documents.npwp_nomor")
      const nibNomor = form.getValues("legal_documents.nib_nomor")

      if (npwpNomor && nibNomor) {
        isValid = await form.trigger([
          "legal_documents.ktp_file",
          "legal_documents.npwp_nomor",
          "legal_documents.nib_nomor",
        ])
      } else if (npwpNomor) {
        isValid = await form.trigger([
          "legal_documents.ktp_file",
          "legal_documents.npwp_nomor",
        ])
      } else if (nibNomor) {
        isValid = await form.trigger([
          "legal_documents.ktp_file",
          "legal_documents.nib_nomor",
        ])
      } else {
        isValid = await form.trigger("legal_documents.ktp_file")
      }
    } else if (currentStep === 2) {
      isValid = await form.trigger([
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
    } else if (currentStep === 3) {
      isValid = true
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else if (!isValid) {
      toast.error("Lengkapi semua field yang diperlukan", {
        description: "Pastikan semua field wajib diisi sebelum melanjutkan.",
      })
      scrollToFirstError()
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
    const isValid = await form.trigger([
      "review.legal_agreement",
      "review.document_confirmation",
    ])
    if (!isValid) return

    setIsSubmitting(true)

    try {
      const data = form.getValues()
      const registrationId = crypto.randomUUID()

      const documentUploads: Array<{
        type: string
        file: File | undefined
        result?: {
          url: string
          fileName: string
          fileSize: number
          mimeType: string
        }
      }> = [
        { type: "ktp", file: data.legal_documents.ktp_file || undefined },
        { type: "npwp", file: data.legal_documents.npwp_file || undefined },
        { type: "nib", file: data.legal_documents.nib_file || undefined },
        { type: "siup_sbu", file: data.legal_documents.siup_file || undefined },
        {
          type: "company_profile",
          file: data.legal_documents.compro_file || undefined,
        },
      ]

      for (const doc of documentUploads) {
        if (doc.file) {
          try {
            doc.result = await uploadVendorDocument(
              doc.file,
              registrationId,
              doc.type
            )
          } catch (uploadError) {
            toast.error("Gagal upload dokumen", {
              description: `Dokumen ${doc.type} gagal diupload. Cek koneksi dan coba lagi.`,
            })
            setIsSubmitting(false)
            return
          }
        }
      }

      const documents = {
        ktp: documentUploads[0].result
          ? {
              url: documentUploads[0].result.url,
              fileName: documentUploads[0].result.fileName,
              fileSize: documentUploads[0].result.fileSize,
              mimeType: documentUploads[0].result.mimeType,
            }
          : null,
        npwp: documentUploads[1].result
          ? {
              url: documentUploads[1].result.url,
              fileName: documentUploads[1].result.fileName,
              fileSize: documentUploads[1].result.fileSize,
              mimeType: documentUploads[1].result.mimeType,
            }
          : null,
        npwp_nomor: data.legal_documents.npwp_nomor || null,
        nib: documentUploads[2].result
          ? {
              url: documentUploads[2].result.url,
              fileName: documentUploads[2].result.fileName,
              fileSize: documentUploads[2].result.fileSize,
              mimeType: documentUploads[2].result.mimeType,
            }
          : null,
        nib_nomor: data.legal_documents.nib_nomor || null,
        siup_sbu: documentUploads[3].result
          ? {
              url: documentUploads[3].result.url,
              fileName: documentUploads[3].result.fileName,
              fileSize: documentUploads[3].result.fileSize,
              mimeType: documentUploads[3].result.mimeType,
            }
          : null,
        company_profile: documentUploads[4].result
          ? {
              url: documentUploads[4].result.url,
              fileName: documentUploads[4].result.fileName,
              fileSize: documentUploads[4].result.fileSize,
              mimeType: documentUploads[4].result.mimeType,
            }
          : null,
      }

      const payload = {
        registrationId,
        company_info: data.company_info,
        legal_documents: documents,
        operational: data.operational,
      }

      const result = await submitRegistration(payload)

      if (result.success) {
        toast.success("Pendaftaran berhasil!", {
          description: "Data vendor telah tersimpan.",
        })
        clearSavedData()
        router.push("/vendor/register/success")
      } else {
        toast.error("Gagal submit", {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <VendorHeader />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-8 pt-8 pb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Pendaftaran Vendor Baru
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              LPrecast Vendor Portal
            </p>
          </div>

          <div className="border-b border-border bg-muted/50">
            <div className="grid grid-cols-4 text-sm font-medium">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep
                const isActive = index === currentStep

                return (
                  <div
                    key={index}
                    id={`stepHeader${index}`}
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
                        <span className={isCompleted ? "text-primary" : ""}>
                          {index + 1}
                        </span>
                      )}
                    </span>
                    <span>{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <form className="p-10">
            <div className="space-y-8">
              {currentStep === 0 && (
                <CompanyInfoForm
                  form={form as unknown as CompanyInfoFormProps["form"]}
                />
              )}
              {currentStep === 1 && (
                <LegalDocumentsForm
                  form={form as unknown as LegalDocumentsFormProps["form"]}
                />
              )}
              {currentStep === 2 && (
                <OperationalForm
                  form={form as unknown as OperationalFormProps["form"]}
                  onForceSave={forceSave}
                />
              )}
              {currentStep === 3 && (
                <ReviewSubmit
                  form={form as unknown as ReviewSubmitProps["form"]}
                />
              )}
            </div>

            <div className="mt-12 flex items-center justify-end gap-3 border-t border-border pt-8">
              {currentStep === 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/vendor/login")}
                >
                  Batal
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={handlePrev}>
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
                    <ArrowRight className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <span>Kirim Data</span>
                    <Send className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center text-xs text-muted">
          &copy; 2024 LPrecast Vendor Portal. Butuh bantuan? Hubungi Admin.
        </div>
      </div>

      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draft Tersimpan</DialogTitle>
            <DialogDescription>
              Ditemukan draft yang tersimpan pada{" "}
              {savedTimestamp
                ? new Date(savedTimestamp).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "sebelumnya"}
              . Apakah Anda ingin melanjutkan draft tersebut?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                clearSavedData()
                toast.info("Draft dihapus. Silakan mulai dari awal.")
                setShowLoadDialog(false)
              }}
            >
              Mulai Baru
            </Button>
            <Button
              onClick={() => {
                loadSavedData()
                toast.success("Draft berhasil dimuat")
                setShowLoadDialog(false)
              }}
            >
              Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
