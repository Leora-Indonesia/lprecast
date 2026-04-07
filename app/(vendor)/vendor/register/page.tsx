"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react"
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
    contacts: [
      { no_hp: "", nama: "", jabatan: "" },
      { no_hp: "", nama: "", jabatan: "" },
      { no_hp: "", nama: "", jabatan: "" },
    ],
  },
  legal_documents: {
    ktp_file: null,
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
      alamat_pabrik: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle")
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const router = useRouter()

  const form = useForm<VendorRegistrationFormData>({
    resolver: zodResolver(vendorRegistrationSchema) as never,
    defaultValues,
    mode: "onChange",
  })

  const { hasSavedData, loadSavedData, clearSavedData, savedTimestamp } =
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
      setShowLoadDialog(true)
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
        "operational.factory_address.alamat_pabrik": "alamat_pabrik",
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
      ])
    } else if (currentStep === 1) {
      isValid = await form.trigger("legal_documents.ktp_file")
    } else if (currentStep === 2) {
      isValid = await form.trigger([
        "operational.bank.bank_nama",
        "operational.bank.bank_nomor",
        "operational.bank.bank_atas_nama",
        "operational.factory_address.alamat_pabrik",
      ])
    } else if (currentStep === 3) {
      isValid = await form.trigger("review.legal_agreement")
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
    const isValid = await form.trigger("review.legal_agreement")
    if (!isValid) return

    setIsSubmitting(true)
    try {
      const result = await submitRegistration(form.getValues())
      if (result.success) {
        clearSavedData()
        toast.success("Pendaftaran berhasil dikirim!", {
          description: "Tim kami akan segera memproses pendaftaran Anda.",
        })
        router.push("/vendor/register/success")
      } else {
        console.error("Submission error:", result.error)
        toast.error("Gagal mengirim data", {
          description: result.error || "Silakan coba lagi.",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Gagal mengirim data", {
        description:
          error instanceof Error ? error.message : "Silakan coba lagi.",
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengirim...</span>
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
