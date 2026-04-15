"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ApproveVendorDialogProps {
  registrationId: string
  adminUserId: string
  companyName: string
}

export function ApproveVendorDialog({
  registrationId,
  adminUserId,
  companyName,
}: ApproveVendorDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleApprove() {
    setIsLoading(true)
    try {
      const res = await fetch(`/admin/vendors/${registrationId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          adminUserId,
          notes,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Vendor disetujui", {
          description: `Vendor ${companyName} telah disetujui.`,
        })
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error("Gagal", {
          description: data.error || "Tidak dapat menyetujui vendor.",
        })
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Setujui
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setujui Vendor</DialogTitle>
          <DialogDescription>
            Anda akan menyetujui vendor {companyName}. Vendor akan mendapatkan
            akses penuh ke sistem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Catatan (opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk vendor..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? "Menyetujui..." : "Setujui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
