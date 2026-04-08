"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  FileCheck,
  Settings,
  Truck,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { VendorHeader } from "@/components/vendor/vendor-header"

interface VendorData {
  company_info: {
    nama_perusahaan: string
    email: string
    nama_pic: string
    kontak_pic: string
    website: string
    instagram: string
    facebook: string
    linkedin: string
    contact_1: { no_hp: string; nama: string; jabatan: string }
    contact_2: { no_hp: string; nama: string; jabatan: string }
    contact_3: { no_hp: string; nama: string; jabatan: string } | null
  }
  legal_documents: {
    ktp_file: File | null
    npwp_nomor: string
    npwp_file: File | null
    nib_nomor: string
    nib_file: File | null
    siup_file: File | null
    compro_file: File | null
  }
  operational: {
    bank: {
      bank_nama: string
      bank_nomor: string
      bank_atas_nama: string
    }
    factory_address: {
      alamat_detail: string
      provinsi_id: string
      provinsi_name: string
      kabupaten_id: string
      kabupaten_name: string
      kecamatan: string
      kode_pos: string
    }
    products: Array<{
      name: string
      satuan: string
      price: number
      dimensions?: string
      material?: string
      finishing?: string
      berat?: number
      lead_time_days?: number
      moq?: number
      description?: string
    }>
    delivery_areas: Array<{
      city_id: string
      city_name: string
      province_id: string
      province_name: string
    }>
    cost_inclusions: {
      mobilisasi: boolean
      penginapan: boolean
      pengiriman: boolean
      langsir: boolean
      instalasi: boolean
      ppn: boolean
    }
    additional_costs: Array<{
      description: string
      amount: number
      unit: string
    }>
  }
}

export default function ReviewAllDataPage() {
  const [data, setData] = useState<VendorData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = sessionStorage.getItem("vendor-submitted-data")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        requestAnimationFrame(() => {
          setData(parsed as VendorData)
        })
      } catch {
        router.push("/vendor/register")
      }
    } else {
      router.push("/vendor/register")
    }
  }, [router])

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

  if (!data) {
    return null
  }

  const companyInfo = data.company_info
  const legalDocs = data.legal_documents
  const operational = data.operational

  return (
    <div className="min-h-screen bg-background">
      <VendorHeader />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/vendor/register")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Form
        </Button>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-8 pt-8 pb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Review Semua Data Submitted
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Hasil submission dari formulir pendaftaran vendor
            </p>
          </div>

          <div className="space-y-6 p-8">
            {/* Company Info */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
                <Building2 className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-700">
                  Informasi Perusahaan
                </span>
              </div>
              <div className="space-y-3 bg-white p-4 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Nama Perusahaan:</span>
                  <span className="col-span-2 font-medium text-gray-800">
                    {companyInfo.nama_perusahaan || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Email:</span>
                  <span className="col-span-2 text-gray-800">
                    {companyInfo.email || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Nama PIC:</span>
                  <span className="col-span-2 text-gray-800">
                    {companyInfo.nama_pic || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Kontak PIC:</span>
                  <span className="col-span-2 text-gray-800">
                    {companyInfo.kontak_pic || "-"}
                  </span>
                </div>
                {companyInfo.contact_1?.nama && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Kontak 1:</span>
                    <span className="col-span-2 text-gray-800">
                      {getContactDisplay(companyInfo.contact_1)}
                    </span>
                  </div>
                )}
                {companyInfo.contact_2?.nama && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Kontak 2:</span>
                    <span className="col-span-2 text-gray-800">
                      {getContactDisplay(companyInfo.contact_2)}
                    </span>
                  </div>
                )}
                {companyInfo.contact_3?.nama && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Kontak 3:</span>
                    <span className="col-span-2 text-gray-800">
                      {getContactDisplay(companyInfo.contact_3)}
                    </span>
                  </div>
                )}
                {companyInfo.website && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Website:</span>
                    <span className="col-span-2 text-gray-800">
                      {companyInfo.website}
                    </span>
                  </div>
                )}
                {companyInfo.instagram && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Instagram:</span>
                    <span className="col-span-2 text-gray-800">
                      {companyInfo.instagram}
                    </span>
                  </div>
                )}
                {companyInfo.facebook && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Facebook:</span>
                    <span className="col-span-2 text-gray-800">
                      {companyInfo.facebook}
                    </span>
                  </div>
                )}
                {companyInfo.linkedin && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">LinkedIn:</span>
                    <span className="col-span-2 text-gray-800">
                      {companyInfo.linkedin}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Documents */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
                <FileCheck className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-700">
                  Dokumen Legal
                </span>
              </div>
              <div className="space-y-3 bg-white p-4 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Nomor NPWP:</span>
                  <span className="col-span-2 font-mono text-gray-800">
                    {legalDocs.npwp_nomor || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">File NPWP:</span>
                  <span className="col-span-2 text-gray-800">
                    {legalDocs.npwp_file ? "✓ Diupload" : "Belum upload"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Nomor NIB:</span>
                  <span className="col-span-2 font-mono text-gray-800">
                    {legalDocs.nib_nomor || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">File NIB:</span>
                  <span className="col-span-2 text-gray-800">
                    {legalDocs.nib_file ? "✓ Diupload" : "Belum upload"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">File SIUP/SBU:</span>
                  <span className="col-span-2 text-gray-800">
                    {legalDocs.siup_file ? "✓ Diupload" : "Belum upload"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">File Company Profile:</span>
                  <span className="col-span-2 text-gray-800">
                    {legalDocs.compro_file ? "✓ Diupload" : "Belum upload"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">File KTP:</span>
                  <span className="col-span-2 text-gray-800">
                    {legalDocs.ktp_file ? "✓ Diupload" : "Belum upload"}
                  </span>
                </div>
              </div>
            </div>

            {/* Operational */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-700">
                  Informasi Operasional
                </span>
              </div>
              <div className="space-y-3 bg-white p-4 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Bank:</span>
                  <span className="col-span-2 text-gray-800">
                    {operational.bank?.bank_nama
                      ? `${operational.bank.bank_nama} - ${operational.bank.bank_nomor}`
                      : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Atas Nama:</span>
                  <span className="col-span-2 text-gray-800">
                    {operational.bank?.bank_atas_nama || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Alamat Pabrik:</span>
                  <span className="col-span-2 text-gray-800">
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

                {/* Products */}
                {operational.products && operational.products.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        Produk ({operational.products.length})
                      </span>
                    </div>
                    <div className="ml-6 space-y-2">
                      {operational.products.map((product, i) => (
                        <div
                          key={i}
                          className="rounded border border-gray-100 bg-gray-50 p-3"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              {product.name}
                            </span>
                            <span className="text-gray-600">
                              {product.satuan} @ {formatCurrency(product.price)}
                            </span>
                          </div>
                          <div className="mt-1 space-y-1 text-xs text-gray-500">
                            {product.dimensions && (
                              <div>Dimensi: {product.dimensions}</div>
                            )}
                            {product.material && (
                              <div>Material: {product.material}</div>
                            )}
                            {product.finishing && (
                              <div>Finishing: {product.finishing}</div>
                            )}
                            {product.berat && (
                              <div>Berat: {product.berat} kg</div>
                            )}
                            {product.lead_time_days && (
                              <div>
                                Lead Time: {product.lead_time_days} hari
                              </div>
                            )}
                            {product.moq && <div>MOQ: {product.moq}</div>}
                            {product.description && (
                              <div>Deskripsi: {product.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Areas */}
                {operational.delivery_areas &&
                  operational.delivery_areas.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700">
                          Area Pengiriman ({operational.delivery_areas.length})
                        </span>
                      </div>
                      <div className="ml-6 flex flex-wrap gap-2">
                        {operational.delivery_areas.map((area, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                          >
                            {area.city_name}, {area.province_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Cost Inclusions */}
                <div className="mt-4">
                  <span className="font-medium text-gray-700">
                    Termasuk dalam Harga:
                  </span>
                  <div className="mt-2 ml-2 flex flex-wrap gap-2">
                    {operational.cost_inclusions?.mobilisasi && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Mobilisasi
                      </span>
                    )}
                    {operational.cost_inclusions?.penginapan && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Penginapan
                      </span>
                    )}
                    {operational.cost_inclusions?.pengiriman && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Pengiriman
                      </span>
                    )}
                    {operational.cost_inclusions?.langsir && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Langsir
                      </span>
                    )}
                    {operational.cost_inclusions?.instalasi && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Instalasi
                      </span>
                    )}
                    {operational.cost_inclusions?.ppn && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        PPN
                      </span>
                    )}
                    {Object.values(operational.cost_inclusions || {}).every(
                      (v) => !v
                    ) && (
                      <span className="text-sm text-gray-500">Tidak ada</span>
                    )}
                  </div>
                </div>

                {/* Additional Costs */}
                {operational.additional_costs &&
                  operational.additional_costs.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-700">
                        Biaya Tambahan:
                      </span>
                      <div className="mt-2 ml-2 space-y-1">
                        {operational.additional_costs.map((cost, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {cost.description}
                            </span>
                            <span className="text-gray-800">
                              {cost.unit} @ {formatCurrency(cost.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-muted">
          &copy; 2024 LPrecast Vendor Portal. Butuh bantuan? Hubungi Admin.
        </div>
      </div>
    </div>
  )
}
