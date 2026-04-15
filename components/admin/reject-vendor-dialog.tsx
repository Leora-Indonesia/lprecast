"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { XCircle } from "lucide-react"
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

interface RejectVendorDialogProps {
  registrationId: string
  adminUserId: string
  companyName: string
}

export function RejectVendorDialog({
  registrationId,
  adminUserId,
  companyName,
}: RejectVendorDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleReject() {
    if (!reason.trim()) {
      toast.error("Alasan penolakan harus diisi")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/admin/vendors/${registrationId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          adminUserId,
          reason,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Vendor ditolak", {
          description: `Vendor ${companyName} telah ditolak.`,
        })
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error("Gagal", {
          description: data.error || "Tidak dapat menolak vendor.",
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
        <Button variant="outline" size="sm" className="text-destructive">
          <XCircle className="mr-1 h-4 w-4" />
          Tolak
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tolak Vendor</DialogTitle>
          <DialogDescription>
            Anda akan menolak vendor {companyName}. Vendor akan diberitahu
            tentang penolakan ini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">
              Alasan Penolakan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan..."
              className="mt-2"
              rows={4}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? "Menolak..." : "Tolak"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
