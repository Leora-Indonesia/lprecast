"use client"

import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useVendorApprovalReview } from "@/components/admin/vendor-approval-review-context"

export function VendorApprovalHeaderActions() {
  const {
    hasRedFlag,
    totalScore,
    isSavingDraft,
    isSubmitting,
    openNotes,
    saveDraft,
    submitReview,
  } = useVendorApprovalReview()

  const canFullyApprove = totalScore >= 85
  const canConditionallyApprove = totalScore >= 70
  const approveAction = canFullyApprove ? "approve" : "conditional"
  const approveLabel = canFullyApprove ? "Approve" : "Approve (Bersyarat)"
  const isApproveDisabled =
    isSubmitting || isSavingDraft || hasRedFlag || !canConditionallyApprove

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        variant="outline"
        onClick={saveDraft}
        disabled={isSavingDraft || isSubmitting}
      >
        Simpan Draft
      </Button>

      <Button variant="outline" onClick={openNotes} disabled={isSubmitting}>
        Catatan
      </Button>

      <Separator orientation="vertical" className="hidden h-9 md:block" />

      <Button
        onClick={() => submitReview(approveAction)}
        disabled={isApproveDisabled}
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        {approveLabel}
      </Button>
      <Button
        variant="outline"
        onClick={() => submitReview("revision_requested")}
        disabled={isSubmitting || isSavingDraft || hasRedFlag}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Request Revision
      </Button>
      <Button
        variant="destructive"
        onClick={() => submitReview("reject")}
        disabled={isSubmitting || isSavingDraft}
      >
        <ShieldAlert className="mr-2 h-4 w-4" />
        Reject
      </Button>
    </div>
  )
}
