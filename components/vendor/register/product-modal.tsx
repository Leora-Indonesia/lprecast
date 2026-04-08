"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProductFormData } from "@/lib/validations/vendor-registration"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: ProductFormData) => void
  editingProduct?: ProductFormData | null
}

const SATUAN_OPTIONS = [
  { value: "meter", label: "meter" },
  { value: "lembar", label: "lembar" },
  { value: "m³", label: "m³" },
  { value: "unit", label: "unit" },
  { value: "paket", label: "paket" },
]

const FINISHING_OPTIONS = [
  { value: "Natural", label: "Natural" },
  { value: "Cat", label: "Cat" },
  { value: "Acian", label: "Acian" },
]

const KATEGORI_OPTIONS = [
  { value: "Pagar", label: "Pagar" },
  { value: "Panel", label: "Panel" },
  { value: "Pondasi", label: "Pondasi" },
  { value: "Aksesoris", label: "Aksesoris" },
]

const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Made to Order", label: "Made to Order" },
]

const initialProduct: ProductFormData = {
  name: "",
  satuan: "",
  price: 0,
  dimensions: "",
  material: "",
  finishing: "",
  berat: undefined,
  lead_time_days: undefined,
  moq: undefined,
  description: "",
}

interface FormErrors {
  name?: string
  satuan?: string
  price?: string
}

export function ProductModal({
  open,
  onOpenChange,
  onSave,
  editingProduct,
}: ProductModalProps) {
  const [product, setProduct] = useState<ProductFormData>(
    editingProduct || initialProduct
  )
  const [activeTab, setActiveTab] = useState("core")
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!product.name || product.name.trim() === "") {
      newErrors.name = "Nama produk wajib diisi"
    }
    if (!product.satuan || product.satuan.trim() === "") {
      newErrors.satuan = "Satuan wajib dipilih"
    }
    if (!product.price || product.price <= 0) {
      newErrors.price = "Harga wajib diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Mohon lengkapi data produk yang wajib diisi")
      return
    }
    onSave(product)
    onOpenChange(false)
    setProduct(initialProduct)
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    setProduct(initialProduct)
    setErrors({})
  }

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            <i className="fa-solid fa-box mr-2" />
            {editingProduct ? "Edit Produk" : "Tambah Produk"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="core">Core Info</TabsTrigger>
            <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
            <TabsTrigger value="info">Informasi Tambahan</TabsTrigger>
          </TabsList>

          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <TabsContent value="core" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_nama"
                    className="text-xs font-bold text-gray-500"
                  >
                    Nama Item*
                  </Label>
                  <Input
                    id="prod_nama"
                    placeholder="Pagar Precast 5 susun"
                    value={product.name}
                    onChange={(e) => {
                      setProduct({ ...product, name: e.target.value })
                      clearError("name")
                    }}
                    className={cn(errors.name && "border-destructive")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_satuan"
                    className="text-xs font-bold text-gray-500"
                  >
                    Satuan*
                  </Label>
                  <Select
                    value={product.satuan}
                    onValueChange={(val) => {
                      setProduct({ ...product, satuan: val })
                      clearError("satuan")
                    }}
                  >
                    <SelectTrigger
                      className={cn(errors.satuan && "border-destructive")}
                    >
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SATUAN_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.satuan && (
                    <p className="text-xs text-destructive">{errors.satuan}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_harga"
                    className="text-xs font-bold text-gray-500"
                  >
                    Harga (Rp)*
                  </Label>
                  <Input
                    id="prod_harga"
                    type="number"
                    placeholder="370000"
                    value={product.price || ""}
                    onChange={(e) => {
                      setProduct({ ...product, price: Number(e.target.value) })
                      clearError("price")
                    }}
                    className={cn(errors.price && "border-destructive")}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_dimensi"
                    className="text-xs font-bold text-gray-500"
                  >
                    Dimensi
                  </Label>
                  <Input
                    id="prod_dimensi"
                    placeholder="200cm × 150cm × 10cm"
                    value={product.dimensions || ""}
                    onChange={(e) =>
                      setProduct({ ...product, dimensions: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_material"
                    className="text-xs font-bold text-gray-500"
                  >
                    Material / Ketebalan
                  </Label>
                  <Input
                    id="prod_material"
                    placeholder="Beton K-300, besi Ø10mm"
                    value={product.material || ""}
                    onChange={(e) =>
                      setProduct({ ...product, material: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_finishing"
                    className="text-xs font-bold text-gray-500"
                  >
                    Finishing / Warna
                  </Label>
                  <Select
                    value={product.finishing || ""}
                    onValueChange={(val) =>
                      setProduct({ ...product, finishing: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FINISHING_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_berat"
                    className="text-xs font-bold text-gray-500"
                  >
                    Berat per Unit (kg)
                  </Label>
                  <Input
                    id="prod_berat"
                    type="number"
                    placeholder="45"
                    value={product.berat || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        berat: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_leadtime"
                    className="text-xs font-bold text-gray-500"
                  >
                    Lead Time (hari)
                  </Label>
                  <Input
                    id="prod_leadtime"
                    type="number"
                    placeholder="14"
                    value={product.lead_time_days || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        lead_time_days: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <p className="text-xs text-gray-600">
                    Waktu produksi hingga produk siap dikirim
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_moq"
                    className="text-xs font-bold text-gray-500"
                  >
                    MOQ
                  </Label>
                  <Input
                    id="prod_moq"
                    type="number"
                    placeholder="10"
                    value={product.moq || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        moq: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <p className="text-xs text-gray-600">
                    Kuantitas minimum untuk setiap pemesanan
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_kategori"
                    className="text-xs font-bold text-gray-500"
                  >
                    Kategori Produk
                  </Label>
                  <Select
                    value={product.description || ""}
                    onValueChange={(val) =>
                      setProduct({ ...product, description: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {KATEGORI_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prod_status"
                    className="text-xs font-bold text-gray-500"
                  >
                    Status Ketersediaan
                  </Label>
                  <Select
                    value={product.finishing || "Available"}
                    onValueChange={(val) =>
                      setProduct({ ...product, finishing: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label
                    htmlFor="prod_catatan"
                    className="text-xs font-bold text-gray-500"
                  >
                    Catatan Tambahan
                  </Label>
                  <Textarea
                    id="prod_catatan"
                    placeholder="Keterangan khusus..."
                    value={product.description || ""}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    className="h-20"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            <i className="fa-solid fa-check mr-2" />
            Simpan Produk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
