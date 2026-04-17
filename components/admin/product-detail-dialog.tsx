"use client"

import { useState } from "react"
import {
  Package,
  Clock,
  Box,
  DollarSign,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { VendorProductDetail } from "@/app/(admin)/admin/vendors/actions"

interface ProductDetailDialogProps {
  product: VendorProductDetail
  trigger: React.ReactNode
}

const SATUAN_LABELS: Record<string, string> = {
  meter: "meter",
  lembar: "lembar",
  "m³": "m³",
  unit: "unit",
  paket: "paket",
}

const KATEGORI_LABELS: Record<string, string> = {
  Pagar: "Pagar",
  Panel: "Panel",
  Pondasi: "Pondasi",
  Aksesoris: "Aksesoris",
}

const FINISHING_LABELS: Record<string, string> = {
  Natural: "Natural",
  Cat: "Cat",
  Acian: "Acian",
}

const STATUS_LABELS: Record<string, string> = {
  Available: "Tersedia",
  "Made to Order": "Made to Order",
}

export function ProductDetailDialog({
  product,
  trigger,
}: ProductDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSatuanLabel = (satuan: string) => {
    return SATUAN_LABELS[satuan] || satuan
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detail Produk
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang produk {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              {product.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>
            {product.is_active !== null && (
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? STATUS_LABELS["Available"] : "Nonaktif"}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Harga Satuan</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(product.price)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {getSatuanLabel(product.satuan)}
              </span>
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium">Spesifikasi</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Nama Item</p>
                <p className="font-medium">{product.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Satuan</p>
                <p className="font-medium">{getSatuanLabel(product.satuan)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dimensi</p>
                <p className="font-medium">{product.dimensions || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Material</p>
                <p className="font-medium">{product.material || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Finishing</p>
                <p className="font-medium">
                  {product.finishing && FINISHING_LABELS[product.finishing]
                    ? FINISHING_LABELS[product.finishing]
                    : product.finishing || "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Berat</p>
                <p className="font-medium">
                  {product.weight_kg !== null ? `${product.weight_kg} kg` : "-"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium">Informasi Tambahan</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Lead Time
                </p>
                <p className="font-medium">
                  {product.lead_time_days !== null
                    ? `${product.lead_time_days} hari`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Box className="h-3 w-3" />
                  MOQ
                </p>
                <p className="font-medium">
                  {product.moq !== null
                    ? `${product.moq} ${getSatuanLabel(product.satuan)}`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  Kategori
                </p>
                <p className="font-medium">
                  {product.kategori && KATEGORI_LABELS[product.kategori]
                    ? KATEGORI_LABELS[product.kategori]
                    : product.kategori || "-"}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-muted-foreground">
                  {product.is_active !== null ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  Status
                </p>
                <Badge
                  variant={
                    product.is_active === null
                      ? "outline"
                      : product.is_active
                        ? "default"
                        : "secondary"
                  }
                >
                  {product.is_active === null
                    ? "-"
                    : product.is_active
                      ? STATUS_LABELS["Available"]
                      : "Nonaktif"}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  Catatan
                </p>
                <p className="font-medium">{product.description || "-"}</p>
              </div>
            </div>
          </div>

          {product.created_at && (
            <div className="text-xs text-muted-foreground">
              Dibuat: {new Date(product.created_at).toLocaleDateString("id-ID")}
              {product.updated_at &&
                product.updated_at !== product.created_at && (
                  <span>
                    {" "}
                    | Diedit:{" "}
                    {new Date(product.updated_at).toLocaleDateString("id-ID")}
                  </span>
                )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
