"use client"

import { UseFormReturn } from "react-hook-form"
import Link from "next/link"

import { Building2, FileCheck, Settings } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

export interface ReviewSubmitProps {
  form: UseFormReturn<VendorRegistrationFormData>
}

export function ReviewSubmit({ form }: ReviewSubmitProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form
  const data = watch()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getContactDisplay = (contact: {
    no_hp?: string
    nama?: string
    jabatan?: string
  }) => {
    const parts = [contact.no_hp, contact.nama, contact.jabatan].filter(Boolean)
    return parts.length > 0 ? parts.join(" / ") : "-"
  }

  const companyInfo = data.company_info
  const legalDocs = data.legal_documents
  const operational = data.operational

  const contactsList = [
    companyInfo.contact_1,
    companyInfo.contact_2,
    companyInfo.contact_3,
  ].filter((c): c is NonNullable<typeof c> => Boolean(c))

  const hasMissingDocuments =
    !legalDocs.npwp_file ||
    !legalDocs.nib_file ||
    !legalDocs.siup_file ||
    !legalDocs.compro_file

  const getIncompleteDocuments = () => {
    const missing: string[] = []
    if (!legalDocs.npwp_file) missing.push("NPWP")
    if (!legalDocs.nib_file) missing.push("NIB")
    if (!legalDocs.siup_file) missing.push("SIUP/SBU")
    if (!legalDocs.compro_file) missing.push("Company Profile")
    return missing
  }

  const incompleteDocs = getIncompleteDocuments()
  const docConfirmationText =
    incompleteDocs.length > 0
      ? `Saya akan melengkapi dokumen ${incompleteDocs.join(", ")} dalam jangka waktu 30 hari`
      : ""

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Review & Submit</h2>
        <p className="text-sm text-gray-500">
          Periksa kembali semua data sebelum kirim
        </p>
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <span className="font-semibold text-gray-700">
              <Building2 className="mr-2 inline h-4 w-4" />
              Informasi Perusahaan
            </span>
          </div>
          <div className="space-y-2 bg-white p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Nama Perusahaan:</span>
              <span className="text-gray-800">
                {companyInfo.nama_perusahaan || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-800">{companyInfo.email || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Nama PIC:</span>
              <span className="text-gray-800">
                {companyInfo.nama_pic || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Kontak PIC:</span>
              <span className="text-gray-800">
                {companyInfo.kontak_pic || "-"}
              </span>
            </div>
            {contactsList.slice(0, 2).map((contact, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <span className="text-gray-500">Kontak {i + 1}:</span>
                <span className="text-gray-800">
                  {getContactDisplay(contact)}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Website:</span>
              <span className="text-gray-800">
                {companyInfo.website || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Username Instagram:</span>
              <span className="text-gray-800">
                {companyInfo.instagram || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Link Facebook:</span>
              <span className="text-gray-800">
                {companyInfo.facebook || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Link LinkedIn:</span>
              <span className="text-gray-800">
                {companyInfo.linkedin || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <span className="font-semibold text-gray-700">
              <FileCheck className="mr-2 inline h-4 w-4" />
              Dokumen Legal
            </span>
          </div>
          <div className="space-y-2 bg-white p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">NPWP:</span>
              <span className="font-mono text-gray-800">
                {legalDocs.npwp_nomor || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Status Dokumen NPWP:</span>
              <span className="text-gray-800">
                {legalDocs.npwp_file ? "✓ Diupload" : "Belum upload"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">NIB:</span>
              <span className="font-mono text-gray-800">
                {legalDocs.nib_nomor || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Status Dokumen NIB:</span>
              <span className="text-gray-800">
                {legalDocs.nib_file ? "✓ Diupload" : "Belum upload"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">SIUP/SBU:</span>
              <span className="font-mono text-gray-800">
                {legalDocs.siup_file ? "✓ Diupload" : "Belum upload"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Status Dokumen SIUP/SBU:</span>
              <span className="text-gray-800">
                {legalDocs.siup_file ? "✓ Diupload" : "Belum upload"}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <span className="font-semibold text-gray-700">
              <Settings className="mr-2 inline h-4 w-4" />
              Informasi Operasional
            </span>
          </div>
          <div className="space-y-2 bg-white p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Bank:</span>
              <span className="text-gray-800">
                {operational.bank?.bank_nama
                  ? `${operational.bank.bank_nama} - ${operational.bank.bank_nomor}`
                  : "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Atas Nama:</span>
              <span className="text-gray-800">
                {operational.bank?.bank_atas_nama || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Alamat Pabrik:</span>
              <span className="text-gray-800">
                {operational.factory_address?.alamat_detail
                  ? `${operational.factory_address.alamat_detail}${
                      operational.factory_address.kecamatan
                        ? `, Kec. ${operational.factory_address.kecamatan}`
                        : ""
                    }${
                      operational.factory_address.kabupaten_name
                        ? `, ${operational.factory_address.kabupaten_name}`
                        : ""
                    }${
                      operational.factory_address.provinsi_name
                        ? `, ${operational.factory_address.provinsi_name}`
                        : ""
                    }${
                      operational.factory_address.kode_pos
                        ? ` ${operational.factory_address.kode_pos}`
                        : ""
                    }`
                  : "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Jumlah Produk:</span>
              <span className="text-gray-800">
                {operational.products?.length || 0} item
              </span>
            </div>
            {operational.products && operational.products.length > 0 && (
              <div className="mt-2 space-y-1">
                {operational.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex justify-between rounded bg-gray-50 p-2 text-sm"
                  >
                    <span className="text-gray-600">• {product.name}</span>
                    <span className="font-medium text-gray-800">
                      {product.satuan} @ {formatCurrency(product.price)}
                      {product.lead_time_days &&
                        ` | LT: ${product.lead_time_days} hari`}
                      {product.moq && ` | MOQ: ${product.moq}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={watch("review.legal_agreement") === true}
                onCheckedChange={(checked) =>
                  setValue("review.legal_agreement", checked === true, {
                    shouldValidate: true,
                  })
                }
                className={cn(
                  "mt-1 h-4 w-4 rounded",
                  errors.review?.legal_agreement && "border-destructive"
                )}
              />
              <span className="text-sm leading-relaxed font-medium text-gray-700">
                Saya menyatakan bahwa seluruh data perusahaan dan dokumen yang
                diunggah adalah sah, benar, dan dapat dipertanggungjawabkan di
                mata hukum.{" "}
                <Link
                  href="/terms/vendor"
                  target="_blank"
                  className="text-primary underline hover:text-primary/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  Baca Syarat & Ketentuan Vendor
                </Link>
              </span>
            </label>
          </div>
          {errors.review?.legal_agreement && (
            <p className="mt-2 text-xs text-destructive">
              {errors.review.legal_agreement.message}
            </p>
          )}
        </div>

        {hasMissingDocuments && (
          <div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <label className="flex items-start gap-3">
                <Checkbox
                  checked={watch("review.document_confirmation") === true}
                  onCheckedChange={(checked) =>
                    setValue("review.document_confirmation", checked === true, {
                      shouldValidate: true,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-amber-400"
                />
                <span className="text-sm text-amber-800">
                  {docConfirmationText}
                </span>
              </label>
            </div>
            {errors.review?.document_confirmation && (
              <p className="mt-2 text-xs text-destructive">
                {errors.review.document_confirmation.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
