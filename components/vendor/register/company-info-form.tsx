"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

export interface CompanyInfoFormProps {
  form: UseFormReturn<VendorRegistrationFormData>
}

interface ContactFieldConfig {
  key: "contact_1" | "contact_2" | "contact_3"
  label: string
  placeholder: string
  required: boolean
}

const contactFields: ContactFieldConfig[] = [
  { key: "contact_1", label: "1", placeholder: "Supervisor", required: true },
  { key: "contact_2", label: "2", placeholder: "Finance", required: true },
  { key: "contact_3", label: "3", placeholder: "Admin", required: false },
]

function ContactField({
  form,
  config,
}: {
  form: CompanyInfoFormProps["form"]
  config: ContactFieldConfig
}) {
  const {
    register,
    formState: { errors },
  } = form
  const errorRoot = errors.company_info?.[config.key]

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="mb-3 font-medium text-gray-900">
        Kontak {config.label}
        {config.required && <span className="required-star">*</span>}
        {!config.required && (
          <span className="ml-1 text-xs text-gray-400">(Opsional)</span>
        )}
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label
            htmlFor={`${config.key}.no_hp`}
            className="text-sm text-gray-600"
          >
            No. HP
          </Label>
          <Input
            id={`${config.key}.no_hp`}
            placeholder="081234567890"
            {...register(`company_info.${config.key}.no_hp`)}
            className={cn("mt-1", errorRoot?.no_hp && "border-destructive")}
          />
          {errorRoot?.no_hp && (
            <p className="mt-1 text-xs text-destructive">
              {errorRoot.no_hp.message as string}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor={`${config.key}.nama`}
            className="text-sm text-gray-600"
          >
            Nama Lengkap
          </Label>
          <Input
            id={`${config.key}.nama`}
            placeholder="Contoh Nama"
            {...register(`company_info.${config.key}.nama`)}
            className={cn("mt-1", errorRoot?.nama && "border-destructive")}
          />
          {errorRoot?.nama && (
            <p className="mt-1 text-xs text-destructive">
              {errorRoot.nama.message as string}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor={`${config.key}.jabatan`}
            className="text-sm text-gray-600"
          >
            Jabatan
          </Label>
          <Input
            id={`${config.key}.jabatan`}
            placeholder={config.placeholder}
            {...register(`company_info.${config.key}.jabatan`)}
            className={cn("mt-1", errorRoot?.jabatan && "border-destructive")}
          />
          {errorRoot?.jabatan && (
            <p className="mt-1 text-xs text-destructive">
              {errorRoot.jabatan.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function CompanyInfoForm({ form }: CompanyInfoFormProps) {
  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Informasi Profil
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <div>
          <Label htmlFor="nama_perusahaan" className="form-label">
            Nama Perusahaan<span className="required-star">*</span>
          </Label>
          <Input
            id="nama_perusahaan"
            placeholder="PT. Maju Jaya"
            {...form.register("company_info.nama_perusahaan")}
            className={cn(
              "form-input",
              form.formState.errors.company_info?.nama_perusahaan &&
                "border-destructive"
            )}
          />
          {form.formState.errors.company_info?.nama_perusahaan && (
            <p className="mt-1 text-xs text-destructive">
              {
                form.formState.errors.company_info.nama_perusahaan
                  .message as string
              }
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email" className="form-label">
            Email Perusahaan/PIC<span className="required-star">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="vendor@perusahaan.com"
            {...form.register("company_info.email")}
            className={cn(
              "form-input",
              form.formState.errors.company_info?.email && "border-destructive"
            )}
          />
          {form.formState.errors.company_info?.email && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.company_info.email.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="nama_pic" className="form-label">
            Nama PIC Penanggung Jawab<span className="required-star">*</span>
          </Label>
          <Input
            id="nama_pic"
            placeholder="Budi Santoso"
            {...form.register("company_info.nama_pic")}
            className={cn(
              "form-input",
              form.formState.errors.company_info?.nama_pic &&
                "border-destructive"
            )}
          />
          {form.formState.errors.company_info?.nama_pic && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.company_info.nama_pic.message as string}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="kontak_pic" className="form-label">
            Nomor Kontak PIC<span className="required-star">*</span>
          </Label>
          <Input
            id="kontak_pic"
            placeholder="081234567890"
            {...form.register("company_info.kontak_pic")}
            className={cn(
              "form-input",
              form.formState.errors.company_info?.kontak_pic &&
                "border-destructive"
            )}
          />
          {form.formState.errors.company_info?.kontak_pic && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.company_info.kontak_pic.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="website" className="form-label">
            Website Perusahaan
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://www.perusahaan.com"
            {...form.register("company_info.website")}
            className="form-input"
          />
        </div>
        <div>
          <Label htmlFor="instagram" className="form-label">
            Username Instagram
          </Label>
          <Input
            id="instagram"
            placeholder="@namaptjaya"
            {...form.register("company_info.instagram")}
            className="form-input"
          />
        </div>

        <div>
          <Label htmlFor="facebook" className="form-label">
            Link Facebook
          </Label>
          <Input
            id="facebook"
            placeholder="facebook.com/PTMajuJaya"
            {...form.register("company_info.facebook")}
            className="form-input"
          />
        </div>
        <div>
          <Label htmlFor="linkedin" className="form-label">
            Link LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/company/PTMajuJaya"
            {...form.register("company_info.linkedin")}
            className="form-input"
          />
        </div>
      </div>

      <div className="mt-10 border-t border-gray-100 pt-8">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          Kontak Alternatif (Backup)
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          Kontak cadangan. Isi kontak cadangan minimal 2 kontak.
        </p>

        <div className="space-y-4">
          {contactFields.map((config) => (
            <ContactField key={config.key} form={form} config={config} />
          ))}
        </div>
      </div>
    </div>
  )
}
