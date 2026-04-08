"use client"

import { UseFormReturn, Controller, FieldErrors } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

export interface LegalDocumentsFormProps {
  form: UseFormReturn<VendorRegistrationFormData>
}

type FileFieldPath =
  | "legal_documents.ktp_file"
  | "legal_documents.npwp_file"
  | "legal_documents.nib_file"
  | "legal_documents.siup_file"
  | "legal_documents.compro_file"

interface FileInputProps {
  label: string
  name: FileFieldPath
  control: LegalDocumentsFormProps["form"]["control"]
  errors?: FieldErrors<VendorRegistrationFormData>
  required?: boolean
}

function FileInputField({
  label,
  name,
  control,
  errors,
  required,
}: FileInputProps) {
  const fieldName = name.split(
    "."
  )[1] as keyof VendorRegistrationFormData["legal_documents"]

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const file = value as File | undefined
        const fieldError = errors?.legal_documents?.[fieldName] as
          | { message?: string }
          | undefined

        return (
          <div>
            {label && (
              <Label className="form-label text-base">
                {label}
                {required && <span className="required-star">*</span>}
              </Label>
            )}
            <div className="mt-3 flex items-center gap-3 rounded-md border border-gray-200 bg-white p-2">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null
                  onChange(selectedFile)
                }}
                className="flex w-full cursor-pointer text-sm text-gray-500 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-900 hover:file:bg-primary/20"
              />
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="ml-1 text-gray-400 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {fieldError?.message && (
              <p className="mt-2 text-xs text-destructive">
                {fieldError.message}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}

export function LegalDocumentsForm({ form }: LegalDocumentsFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className="space-y-8">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Upload Dokumen Legalitas
      </h2>
      <p className="mb-8 text-sm text-gray-500">
        Format file: PDF/JPG/PNG, Maksimal 5MB per file.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-5">
          <FileInputField
            label="1. KTP Penanggung Jawab"
            name="legal_documents.ktp_file"
            control={control}
            errors={errors}
            required
          />
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-5">
          <Label className="form-label text-base">
            2. NPWP Perusahaan<span className="required-star">*</span>
          </Label>
          <Input
            id="npwp_nomor"
            placeholder="16 digit angka (contoh: 1234567890123456)"
            {...register("legal_documents.npwp_nomor")}
            className={cn(
              "form-input mb-1",
              errors.legal_documents?.npwp_nomor && "border-destructive"
            )}
          />
          {errors.legal_documents?.npwp_nomor && (
            <p className="mb-2 text-xs text-destructive">
              {errors.legal_documents.npwp_nomor.message as string}
            </p>
          )}
          <p className="mb-3 text-xs text-gray-500">
            Masukkan 16 digit NPWP tanpa titik atau spasi
          </p>
          <FileInputField
            label=""
            name="legal_documents.npwp_file"
            control={control}
            errors={errors}
          />
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-5">
          <Label className="form-label text-base">
            3. NIB (Nomor Induk Berusaha)
            <span className="required-star">*</span>
          </Label>
          <Input
            id="nib_nomor"
            placeholder="13 digit angka (contoh: 0123456789013)"
            {...register("legal_documents.nib_nomor")}
            className={cn(
              "form-input mb-1",
              errors.legal_documents?.nib_nomor && "border-destructive"
            )}
          />
          {errors.legal_documents?.nib_nomor && (
            <p className="mb-2 text-xs text-destructive">
              {errors.legal_documents.nib_nomor.message as string}
            </p>
          )}
          <p className="mb-3 text-xs text-gray-500">
            Masukkan 13 digit NIB tanpa spasi
          </p>
          <FileInputField
            label=""
            name="legal_documents.nib_file"
            control={control}
            errors={errors}
            required
          />
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-5">
          <FileInputField
            label="4. SIUP / SBU (Opsional)"
            name="legal_documents.siup_file"
            control={control}
            errors={errors}
          />
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-5 md:col-span-2">
          <FileInputField
            label="5. Company Profile (Opsional)"
            name="legal_documents.compro_file"
            control={control}
            errors={errors}
          />
        </div>
      </div>
    </div>
  )
}
