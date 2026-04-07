"use client"

import { useState } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2, X, Package, Pencil, Info, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductModal } from "./product-modal"
import { AreaModal } from "./area-modal"
import { cn } from "@/lib/utils"
import type {
  VendorRegistrationFormData,
  ProductFormData,
} from "@/lib/validations/vendor-registration"

export interface OperationalFormProps {
  form: UseFormReturn<VendorRegistrationFormData>
}

interface DeliveryArea {
  id: number
  name: string
  province: string
}

export function OperationalForm({ form }: OperationalFormProps) {
  const {
    register,
    watch,
    formState: { errors },
    control,
  } = form

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
    update: updateProduct,
  } = useFieldArray({
    name: "operational.products",
    control,
  })

  const {
    fields: areaFields,
    append: appendArea,
    remove: removeArea,
  } = useFieldArray({
    name: "operational.delivery_areas",
    control,
  })

  const {
    fields: costFields,
    append: appendCost,
    remove: removeCost,
  } = useFieldArray({
    name: "operational.additional_costs",
    control,
  })

  const [showMap, setShowMap] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
    null
  )
  const [showAreaModal, setShowAreaModal] = useState(false)

  const handleAddProduct = () => {
    setEditingProductIndex(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (index: number) => {
    setEditingProductIndex(index)
    setShowProductModal(true)
  }

  const handleSaveProduct = (product: ProductFormData) => {
    if (editingProductIndex !== null) {
      updateProduct(editingProductIndex, product)
    } else {
      appendProduct(product)
    }
    setEditingProductIndex(null)
    setShowProductModal(false)
  }

  const handleDeleteProduct = (index: number) => {
    removeProduct(index)
  }

  const handleApplyAreas = (areas: DeliveryArea[]) => {
    areas.forEach((area) => {
      appendArea(area)
    })
  }

  const handleRemoveArea = (index: number) => {
    removeArea(index)
  }

  const handleAddCostRow = () => {
    appendCost({ description: "", amount: 0, unit: "unit" })
  }

  const handleRemoveCost = (index: number) => {
    removeCost(index)
  }

  const getEditingProduct = (): ProductFormData | undefined => {
    if (editingProductIndex !== null && productFields[editingProductIndex]) {
      return productFields[editingProductIndex] as unknown as ProductFormData
    }
    return undefined
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Informasi Operasional & Produk
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-b border-gray-100 pb-8 md:grid-cols-2">
        <div>
          <Label htmlFor="bank_nama" className="form-label">
            Nama Bank<span className="required-star">*</span>
          </Label>
          <Input
            id="bank_nama"
            placeholder="BCA / Mandiri / BRI"
            {...register("operational.bank.bank_nama")}
            className={cn(
              "form-input",
              errors.operational?.bank?.bank_nama && "border-destructive"
            )}
          />
        </div>
        <div>
          <Label htmlFor="bank_nomor" className="form-label">
            Nomor Rekening<span className="required-star">*</span>
          </Label>
          <Input
            id="bank_nomor"
            placeholder="1234567890"
            {...register("operational.bank.bank_nomor")}
            className={cn(
              "form-input",
              errors.operational?.bank?.bank_nomor && "border-destructive"
            )}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="bank_atas_nama" className="form-label">
            Nama Pemilik Rekening (Sesuai Buku Bank)
            <span className="required-star">*</span>
          </Label>
          <Input
            id="bank_atas_nama"
            placeholder="PT. Maju Jaya"
            {...register("operational.bank.bank_atas_nama")}
            className={cn(
              "form-input",
              errors.operational?.bank?.bank_atas_nama && "border-destructive"
            )}
          />
        </div>
      </div>

      <div className="pt-6">
        <Label htmlFor="alamat_pabrik" className="form-label">
          Alamat Pabrik / Workshop Utama<span className="required-star">*</span>
        </Label>
        <Textarea
          id="alamat_pabrik"
          placeholder="Jl. Industri No. 123, Kawasan Industri Jababeka, Cikarang, Bekasi 17530"
          className="form-input h-24 resize-none"
          {...register("operational.factory_address.alamat_pabrik")}
        />
        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
          </Button>
        </div>
        {showMap && (
          <div className="mt-3 h-80 w-full overflow-hidden rounded-lg border border-gray-200">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                watch("operational.factory_address.alamat_pabrik") || ""
              )}&zoom=15`}
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Harga Produk
            </h3>
            <p className="text-sm text-gray-500">Kelola produk dan harga</p>
          </div>
          <Button type="button" size="sm" onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-600">
              <tr>
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-4 py-3 text-left">Nama Item</th>
                <th className="px-4 py-3 text-center">Satuan</th>
                <th className="px-4 py-3 text-right">Harga (Rp)</th>
                <th className="px-4 py-3 text-center">Lead Time</th>
                <th className="px-4 py-3 text-center">MOQ</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {productFields.length === 0 ? (
                <tr className="border-b border-gray-100">
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <Package className="mb-2 h-10 w-10 text-gray-300" />
                    <p>Belum ada produk ditambahkan</p>
                    <p className="text-xs">
                      Klik &quot;Tambah Produk&quot; untuk memulai
                    </p>
                  </td>
                </tr>
              ) : (
                productFields.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3 text-center font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-left font-medium text-gray-800">
                      {(product as unknown as ProductFormData).name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                        {(product as unknown as ProductFormData).satuan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {formatCurrency(
                        (product as unknown as ProductFormData).price
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(product as unknown as ProductFormData).lead_time_days
                        ? `${(product as unknown as ProductFormData).lead_time_days} hari`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(product as unknown as ProductFormData).moq || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(index)}
                        className="mr-2 text-primary hover:text-primary/80"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          <Info className="mr-1 inline h-3 w-3" />
          Klik &quot;Edit&quot; untuk tambah informasi spesifikasi, lead time,
          MOQ, dan informasi tambahan lainnya
        </p>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          Area Pengiriman
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Wilayah yang dapat dilayani
        </p>
        <div className="flex flex-wrap gap-2">
          {areaFields.length === 0 ? (
            <Button type="button" onClick={() => setShowAreaModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Area
            </Button>
          ) : (
            <>
              <Button type="button" onClick={() => setShowAreaModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Area
              </Button>
              <div className="mt-4 flex flex-wrap gap-2">
                {areaFields.map((area, index) => (
                  <span
                    key={area.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    <MapPin className="h-3 w-3" />
                    <span>
                      {(area as unknown as DeliveryArea).name},{" "}
                      {(area as unknown as DeliveryArea).province}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Biaya & Inklusi
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Komponen biaya dan inklusi dalam penawaran
        </p>

        <div className="mb-8">
          <Label className="form-label mb-3">Checklist Inklusi Biaya</Label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                {...register("operational.cost_inclusions.mobilisasi")}
              />
              Mobilisasi & demobilisasi tukang
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                {...register("operational.cost_inclusions.penginapan")}
              />
              Penginapan tukang
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                {...register("operational.cost_inclusions.pengiriman")}
              />
              Biaya pengiriman
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox {...register("operational.cost_inclusions.langsir")} />
              Biaya langsir/bongkar muat
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                {...register("operational.cost_inclusions.instalasi")}
              />
              Instalasi/pemasangan
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox {...register("operational.cost_inclusions.ppn")} />
              PPN 11%
            </label>
          </div>
        </div>

        <div>
          <Label className="form-label mb-3">Biaya Tambahan Lain</Label>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 text-left">Keterangan</th>
                <th className="w-32 py-2 text-right">Nilai (Rp)</th>
                <th className="w-24 py-2 text-right">Satuan</th>
                <th className="w-8 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {costFields.map((cost, index) => (
                <tr key={cost.id} className="border-b">
                  <td className="py-1">
                    <Input
                      placeholder="Biaya Listrik"
                      {...register(
                        `operational.additional_costs.${index}.description`
                      )}
                      className="text-sm"
                    />
                  </td>
                  <td className="py-1">
                    <Input
                      type="number"
                      placeholder="0"
                      {...register(
                        `operational.additional_costs.${index}.amount`,
                        { valueAsNumber: true }
                      )}
                      className="text-right text-sm"
                    />
                  </td>
                  <td className="py-1">
                    <Input
                      placeholder="unit"
                      {...register(
                        `operational.additional_costs.${index}.unit`
                      )}
                      className="text-right text-sm"
                    />
                  </td>
                  <td className="py-1 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCost(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            type="button"
            variant="link"
            onClick={handleAddCostRow}
            className="mt-2 text-xs font-semibold text-primary"
          >
            + Tambah Biaya
          </Button>
        </div>
      </div>

      <ProductModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        onSave={handleSaveProduct}
        editingProduct={getEditingProduct()}
      />

      <AreaModal
        open={showAreaModal}
        onOpenChange={setShowAreaModal}
        onApply={handleApplyAreas}
        selectedAreas={areaFields as unknown as DeliveryArea[]}
      />
    </div>
  )
}
