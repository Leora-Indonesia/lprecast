"use client"

import { Button } from "@/components/ui/button"
import { useVendorApprovalReview } from "@/components/admin/vendor-approval-review-context"

export function VendorApprovalNoteCallout({
  note,
}: {
  note: string | null
}) {
  const { openNotes } = useVendorApprovalReview()

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
      <div className="min-w-0">
        <div className="font-medium">Catatan terakhir</div>
        <div className="truncate text-xs text-amber-800 dark:text-amber-200">
          {note || "Catatan belum diisi"}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={openNotes}>
        Lihat Catatan
      </Button>
    </div>
  )
}
