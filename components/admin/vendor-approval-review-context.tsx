"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  adminChecklist,
  surveyChecklist,
} from "@/components/admin/vendor-approval-checklist"

type VendorApprovalDraft = {
  vendor_id: string
  checked_items: Record<string, boolean>
  red_flags: Record<string, boolean>
  notes: string | null
  score: number | null
  tier: string | null
  updated_by: string | null
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
  recommendation: "APPROVED" | "CONDITIONAL" | "REJECT"
  approvalTier: string

  isSavingDraft: boolean
  isSubmitting: boolean
  lastSavedAt: string | null

  saveDraft: () => Promise<void>
  submitReview: (action: ReviewAction) => Promise<void>
}

const VendorApprovalReviewContext = createContext<VendorApprovalReviewContextValue | null>(
  null
)

export function VendorApprovalReviewProvider({
  userId,
  adminUserId,
  initialDraft,
  children,
}: {
  userId: string
  adminUserId: string
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
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    () => initialDraft?.updated_at ?? null
  )

  const hasRedFlag = useMemo(
    () => Object.values(redFlagFindings).some(Boolean),
    [redFlagFindings]
  )

  type ScoringCategory =
    | "legal_admin"
    | "pengalaman"
    | "kapasitas"
    | "workshop_produksi"
    | "attitude_compliance"

  const scoring = useMemo(() => {
    // Scoring mengikuti referensi: docs/modules/VENDOR APPROVAL CHECKLIST.md
    const weights: Record<ScoringCategory, number> = {
      legal_admin: 20,
      pengalaman: 20,
      kapasitas: 20,
      workshop_produksi: 30,
      attitude_compliance: 10,
    }

    const sectionCategoryMap: Record<string, ScoringCategory> = {
      identitas: "legal_admin",
      profil: "legal_admin",
      finance: "legal_admin",

      pengalaman: "pengalaman",
      kapasitas: "kapasitas",

      lokasi: "workshop_produksi",
      fasilitas: "workshop_produksi",
      peralatan: "workshop_produksi",
      tk_lapangan: "workshop_produksi",
      proses: "workshop_produksi",
      kualitas: "workshop_produksi",
      manajemen: "workshop_produksi",
      safety: "workshop_produksi",

      komitmen: "attitude_compliance",
      sikap: "attitude_compliance",
    }

    const stats: Record<ScoringCategory, { total: number; checked: number }> = {
      legal_admin: { total: 0, checked: 0 },
      pengalaman: { total: 0, checked: 0 },
      kapasitas: { total: 0, checked: 0 },
      workshop_produksi: { total: 0, checked: 0 },
      attitude_compliance: { total: 0, checked: 0 },
    }

    const allSections = [...adminChecklist, ...surveyChecklist]
    for (const section of allSections) {
      const category = sectionCategoryMap[section.id]
      if (!category) continue

      for (const item of section.items) {
        stats[category].total += 1
        if (checkedItems[item.id]) stats[category].checked += 1
      }
    }

    const scoreByCategory = (Object.keys(stats) as ScoringCategory[]).map(
      (category) => {
        const total = stats[category].total
        const checked = stats[category].checked
        const ratio = total > 0 ? checked / total : 0
        const weighted = ratio * weights[category]
        return { category, total, checked, ratio, weighted }
      }
    )

    const totalScore = Math.round(scoreByCategory.reduce((sum, c) => sum + c.weighted, 0))

    return {
      totalScore,
    }
  }, [checkedItems])

  const totalScore = scoring.totalScore

  const recommendation = hasRedFlag
    ? "REJECT"
    : totalScore >= 85
      ? "APPROVED"
      : totalScore >= 70
        ? "CONDITIONAL"
        : "REJECT"

  const approvalTier = hasRedFlag
    ? "Auto Reject"
    : totalScore >= 90
      ? "Tier A"
      : totalScore >= 85
        ? "Tier B"
        : "Needs Review"

  function setCheckedItem(id: string, value: boolean) {
    setCheckedItems((prev) => ({ ...prev, [id]: value }))
  }

  function setRedFlag(id: string, value: boolean) {
    setRedFlagFindings((prev) => ({ ...prev, [id]: value }))
  }

  async function saveDraft() {
    const trimmedNotes = notes.trim()
    if (!adminUserId) {
      toast.error("Admin user tidak terdeteksi")
      return
    }

    setIsSavingDraft(true)
    try {
      const res = await fetch(`/admin/vendors/${userId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          adminUserId,
          draft: {
            checkedItems,
            redFlagFindings,
            notes: trimmedNotes || null,
            score: totalScore,
            tier: approvalTier,
          },
        }),
      })

      const data = await res.json()
      if (data.success) {
        if (data.changed) toast.success("Draft tersimpan")
        else toast.message("Tidak ada perubahan draft")
        if (data.draft?.updated_at) setLastSavedAt(data.draft.updated_at)
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

    if (!adminUserId) {
      toast.error("Admin user tidak terdeteksi")
      return
    }

    if (hasRedFlag && action !== "reject") {
      toast.error("Ada red flag: hasil wajib REJECT")
      return
    }

    if ((action === "reject" || action === "revision_requested") && !trimmedNotes) {
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
          adminUserId,
          notes: trimmedNotes || null,
          reason: trimmedNotes || null,
          score: totalScore,
          tier: approvalTier,
        }),
      })

      const data = await res.json()
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
    recommendation,
    approvalTier,
    isSavingDraft,
    isSubmitting,
    lastSavedAt,
    saveDraft,
    submitReview,
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
