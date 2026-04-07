"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

export interface CompanyInfoFormProps {
  form: UseFormReturn<VendorRegistrationFormData>
}

export function CompanyInfoForm({ form }: CompanyInfoFormProps) {
  const {
    register,
    formState: { errors },
  } = form

  const contactFields = [
    {
      index: 0,
      label: "Kontak Administrasi",
      placeholder: { nama: "Budi Santoso", jabatan: "Admin" },
    },
    {
      index: 1,
      label: "Kontak Keuangan",
      placeholder: { nama: "Deni Wijaya", jabatan: "Finance" },
    },
    {
      index: 2,
      label: "Kontak Operasional (Opsional)",
      placeholder: { nama: "Ari Purnomo", jabatan: "Supervisor" },
    },
  ]

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
            {...register("company_info.nama_perusahaan")}
            className={cn(
              "form-input",
              errors.company_info?.nama_perusahaan && "border-destructive"
            )}
          />
          {errors.company_info?.nama_perusahaan && (
            <p className="mt-1 text-xs text-destructive">
              {errors.company_info.nama_perusahaan.message}
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
            {...register("company_info.email")}
            className={cn(
              "form-input",
              errors.company_info?.email && "border-destructive"
            )}
          />
          {errors.company_info?.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.company_info.email.message}
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
            {...register("company_info.nama_pic")}
            className={cn(
              "form-input",
              errors.company_info?.nama_pic && "border-destructive"
            )}
          />
          {errors.company_info?.nama_pic && (
            <p className="mt-1 text-xs text-destructive">
              {errors.company_info.nama_pic.message}
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
            {...register("company_info.kontak_pic")}
            className={cn(
              "form-input",
              errors.company_info?.kontak_pic && "border-destructive"
            )}
          />
          {errors.company_info?.kontak_pic && (
            <p className="mt-1 text-xs text-destructive">
              {errors.company_info.kontak_pic.message}
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
            {...register("company_info.website")}
            className="form-input"
          />
        </div>
        <div>
          <Label htmlFor="instagram" className="form-label">
            Instagram
          </Label>
          <Input
            id="instagram"
            placeholder="@namaptjaya"
            {...register("company_info.instagram")}
            className="form-input"
          />
        </div>

        <div>
          <Label htmlFor="facebook" className="form-label">
            Facebook
          </Label>
          <Input
            id="facebook"
            placeholder="facebook.com/PTMajuJaya"
            {...register("company_info.facebook")}
            className="form-input"
          />
        </div>
        <div>
          <Label htmlFor="linkedin" className="form-label">
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/company/PTMajuJaya"
            {...register("company_info.linkedin")}
            className="form-input"
          />
        </div>
      </div>

      <div className="mt-10 border-t border-gray-100 pt-8">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          Kontak Alternatif (Backup)
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Mohon sediakan minimal 2 kontak aktif.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full rounded border border-gray-100 text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">No. HP</th>
                <th className="px-4 py-3 text-left font-medium">
                  Nama Lengkap
                </th>
                <th className="px-4 py-3 text-left font-medium">Jabatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contactFields.map(({ index, placeholder }, i) => (
                <tr key={i}>
                  <td className="px-2 py-2">
                    <Input
                      placeholder="081234567890"
                      {...register(`company_info.contacts.${index}.no_hp`)}
                      className={cn(
                        "border-0 focus:ring-0",
                        errors.company_info?.contacts?.[index]?.no_hp &&
                          "border-destructive"
                      )}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      placeholder={placeholder.nama}
                      {...register(`company_info.contacts.${index}.nama`)}
                      className={cn(
                        "border-0 focus:ring-0",
                        errors.company_info?.contacts?.[index]?.nama &&
                          "border-destructive"
                      )}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      placeholder={placeholder.jabatan}
                      {...register(`company_info.contacts.${index}.jabatan`)}
                      className={cn(
                        "border-0 focus:ring-0",
                        errors.company_info?.contacts?.[index]?.jabatan &&
                          "border-destructive"
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.company_info?.contacts && (
          <p className="mt-2 text-xs text-destructive">
            {errors.company_info.contacts.message}
          </p>
        )}
      </div>
    </div>
  )
}
