"use client"

import { useState } from "react"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  deleteVendor,
  VendorTransactionStatus,
} from "@/app/(admin)/admin/vendors/[id]/actions"

interface DeleteVendorDialogProps {
  vendorId: string
  companyName: string
  transactionStatus: VendorTransactionStatus
  disabled?: boolean
}

export function DeleteVendorDialog({
  vendorId,
  companyName,
  transactionStatus,
  disabled = false,
}: DeleteVendorDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canDelete = !transactionStatus.hasTransactions
  const isConfirmValid = confirmText === "HAPUS"

  async function handleDelete() {
    if (!isConfirmValid) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await deleteVendor(vendorId)
      if (result && !result.success) {
        setError(result.error)
        setIsLoading(false)
      }
      // If successful, redirect happens in server action
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled}
          className={disabled ? "cursor-not-allowed opacity-50" : ""}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Hapus Vendor
          </DialogTitle>
          <DialogDescription>
            Tindakan ini akan menghapus semua data vendor secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {canDelete ? (
            <>
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Vendor yang akan dihapus:</p>
                <p className="text-lg font-semibold">{companyName}</p>
              </div>

              <div className="rounded-lg bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  <strong>Perhatian:</strong> Tindakan ini tidak dapat
                  dibatalkan. Semua data vendor termasuk informasi perusahaan,
                  kontak, rekening bank, dokumen legal, dan produk akan dihapus
                  secara permanen.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium">
                  Ketik <strong>HAPUS</strong> untuk konfirmasi:
                </label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Ketik HAPUS"
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="mb-2 text-sm font-medium text-amber-800">
                Vendor tidak dapat dihapus
              </p>
              <p className="mb-3 text-sm text-amber-700">
                Vendor ini memiliki riwayat transaksi yang menghalangi
                penghapusan:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-amber-700">
                {transactionStatus.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Vendor
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
