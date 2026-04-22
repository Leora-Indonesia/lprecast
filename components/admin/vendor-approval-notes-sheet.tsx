"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useVendorApprovalReview } from "@/components/admin/vendor-approval-review-context"

function formatDecisionLabel(status: string) {
  if (status === "approved") return "Disetujui"
  if (status === "conditional") return "Disetujui Bersyarat"
  if (status === "rejected") return "Ditolak"
  if (status === "revision_requested") return "Perlu Revisi"
  return "Belum Diputuskan"
}

export function VendorApprovalNotesSheet({
  registrationStatus,
  existingNote,
}: {
  registrationStatus: string
  existingNote?: string | null
}) {
  const {
    notes,
    setNotes,
    isSavingDraft,
    saveDraft,
    isNotesOpen,
    openNotes,
    closeNotes,
  } = useVendorApprovalReview()

  const saveAndClose = async () => {
    await saveDraft()
    closeNotes()
  }

  const requiresHistory = registrationStatus === "revision_requested" || registrationStatus === "rejected"

  return (
    <Sheet open={isNotesOpen} onOpenChange={(open) => (open ? openNotes() : closeNotes())}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Catatan Review</SheetTitle>
          <SheetDescription>
            Catatan dipakai untuk revisi dan penolakan. Bisa simpan sebagai draft atau langsung dipakai saat approve.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">{formatDecisionLabel(registrationStatus)}</Badge>
            {requiresHistory && <Badge variant="destructive">Riwayat penting</Badge>}
          </div>

          {requiresHistory && existingNote ? (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div className="mb-1 text-xs text-muted-foreground">Catatan terakhir</div>
              <div className="whitespace-pre-wrap">{existingNote}</div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="vendor-review-notes-drawer">Catatan baru</Label>
            <Textarea
              id="vendor-review-notes-drawer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan approval, alasan revisi, atau alasan penolakan..."
              rows={8}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={saveAndClose} disabled={isSavingDraft}>
              Simpan Draft
            </Button>
            <Button variant="ghost" onClick={closeNotes}>
              Tutup
            </Button>
          </div>

          {requiresHistory ? (
            <div className="text-xs text-muted-foreground">
              Catatan wajib diisi untuk revisi/penolakan.
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
