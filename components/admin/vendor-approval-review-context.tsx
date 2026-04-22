"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  computeApprovalTier,
  computeRecommendation,
  computeTotalScore,
  getChecklistMetrics,
  hasRedFlag as computeHasRedFlag,
} from "@/lib/vendor-approval"

type VendorApprovalDraft = {
  vendor_id: string
  checked_items: Record<string, boolean>
  red_flags: Record<string, boolean>
  notes: string | null
  score: number | null
  tier: string | null
  updated_by: string | null
  updated_by_name?: string | null
  updated_at: string
}

type ReviewAction = "approve" | "conditional" | "revision_requested" | "reject"

type VendorApprovalReviewContextValue = {
  checkedItems: Record<string, boolean>
  redFlagFindings: Record<string, boolean>
  notes: string
  setNotes: (value: string) => void
  setRedFlag: (id: string, value: boolean) => void
  setCheckedItem: (id: string, value: boolean) => void

  hasRedFlag: boolean
  totalScore: number
  checklistCheckedCount: number
  checklistTotalCount: number
  checklistRemainingItems: number
  checklistCompletionPct: number
  recommendation: "APPROVED" | "CONDITIONAL" | "REJECT"
  approvalTier: string

  isSavingDraft: boolean
  isSubmitting: boolean
  lastSavedAt: string | null
  lastSavedBy: string | null
  isNotesOpen: boolean

  saveDraft: () => Promise<void>
  submitReview: (action: ReviewAction) => Promise<void>
  openNotes: () => void
  closeNotes: () => void
}

const VendorApprovalReviewContext = createContext<VendorApprovalReviewContextValue | null>(
  null
)

export function VendorApprovalReviewProvider({
  userId,
  initialDraft,
  children,
}: {
  userId: string
  initialDraft?: VendorApprovalDraft | null
  children: React.ReactNode
}) {
  const router = useRouter()

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () => initialDraft?.checked_items ?? {}
  )
  const [redFlagFindings, setRedFlagFindings] = useState<Record<string, boolean>>(
    () => initialDraft?.red_flags ?? {}
  )
  const [notes, setNotes] = useState(() => initialDraft?.notes ?? "")
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    () => initialDraft?.updated_at ?? null
  )
  const [lastSavedBy, setLastSavedBy] = useState<string | null>(
    () => initialDraft?.updated_by_name ?? initialDraft?.updated_by ?? null
  )

  const hasRedFlag = useMemo(
    () => computeHasRedFlag(redFlagFindings),
    [redFlagFindings]
  )

  const totalScore = useMemo(() => computeTotalScore(checkedItems), [checkedItems])
  const recommendation = useMemo(
    () => computeRecommendation({ totalScore, hasRedFlag }),
    [totalScore, hasRedFlag]
  )
  const approvalTier = useMemo(
    () => computeApprovalTier({ totalScore, hasRedFlag }),
    [totalScore, hasRedFlag]
  )
  const checklistMetrics = useMemo(
    () => getChecklistMetrics(checkedItems),
    [checkedItems]
  )

  function setCheckedItem(id: string, value: boolean) {
    setCheckedItems((prev) => ({ ...prev, [id]: value }))
  }

  function setRedFlag(id: string, value: boolean) {
    setRedFlagFindings((prev) => ({ ...prev, [id]: value }))
  }

  async function saveDraft() {
    const trimmedNotes = notes.trim()
    setIsSavingDraft(true)
    try {
      const res = await fetch(`/admin/vendors/${userId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          draft: {
            checkedItems,
            redFlagFindings,
            notes: trimmedNotes || null,
          },
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(data?.error || "Gagal menyimpan draft")
        return
      }
      if (data.success) {
        if (data.changed) toast.success("Draft tersimpan")
        else toast.message("Tidak ada perubahan draft")
        if (data.draft?.updated_at) setLastSavedAt(data.draft.updated_at)
        if (data.draft?.updated_by_name || data.draft?.updated_by) {
          setLastSavedBy(data.draft.updated_by_name ?? data.draft.updated_by)
        }
        router.refresh()
      } else {
        toast.error(data.error || "Gagal menyimpan draft")
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsSavingDraft(false)
    }
  }

  async function submitReview(action: ReviewAction) {
    const trimmedNotes = notes.trim()

    if (hasRedFlag && action !== "reject") {
      toast.error("Ada red flag: hasil wajib REJECT")
      return
    }

    if ((action === "reject" || action === "revision_requested") && !trimmedNotes) {
      setIsNotesOpen(true)
      toast.error("Catatan wajib diisi untuk revisi/penolakan")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/admin/vendors/${userId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: trimmedNotes || null,
          reason: trimmedNotes || null,
          draft: {
            checkedItems,
            redFlagFindings,
          },
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(data?.error || "Gagal menyimpan review vendor")
        return
      }
      if (data.success) {
        toast.success("Review vendor tersimpan")
        router.refresh()
      } else {
        toast.error(data.error || "Gagal menyimpan review vendor")
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const value: VendorApprovalReviewContextValue = {
    checkedItems,
    redFlagFindings,
    notes,
    setNotes,
    setRedFlag,
    setCheckedItem,
    hasRedFlag,
    totalScore,
    checklistCheckedCount: checklistMetrics.checkedItemsCount,
    checklistTotalCount: checklistMetrics.totalItems,
    checklistRemainingItems: checklistMetrics.remainingItems,
    checklistCompletionPct: checklistMetrics.completionPct,
    recommendation,
    approvalTier,
    isSavingDraft,
    isSubmitting,
    lastSavedAt,
    lastSavedBy,
    isNotesOpen,
    saveDraft,
    submitReview,
    openNotes: () => setIsNotesOpen(true),
    closeNotes: () => setIsNotesOpen(false),
  }

  return (
    <VendorApprovalReviewContext.Provider value={value}>
      {children}
    </VendorApprovalReviewContext.Provider>
  )
}

export function useVendorApprovalReview() {
  const ctx = useContext(VendorApprovalReviewContext)
  if (!ctx) {
    throw new Error(
      "useVendorApprovalReview must be used within VendorApprovalReviewProvider"
    )
  }
  return ctx
}
