"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useVendorApprovalReview } from "@/components/admin/vendor-approval-review-context"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardList,
  SquareCheck,
  X,
  XCircle,
} from "lucide-react"

const requiredLegalDocs = [
  { key: "ktp", label: "KTP" },
  { key: "npwp", label: "NPWP" },
  { key: "nib", label: "NIB" },
  { key: "siup_sbu", label: "SIUP/SBU" },
  { key: "company_profile", label: "Company Profile" },
] as const

function formatSavedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatProcessLabel(status: string) {
  if (status === "draft") return "Draft"
  if (status === "submitted") return "Diajukan"
  if (status === "under_review") return "Dalam Review"
  if (status === "revision_requested") return "Perlu Revisi"
  if (status === "approved") return "Disetujui"
  if (status === "conditional") return "Disetujui Bersyarat"
  if (status === "rejected") return "Ditolak"
  return status
}

function getDecisionMeta(status: string, recommendation: "APPROVED" | "CONDITIONAL" | "REJECT") {
  if (status === "approved") {
    return {
      label: "Disetujui",
      icon: CheckCircle2,
      className: "text-emerald-700 dark:text-emerald-300",
    }
  }

  if (status === "conditional" || status === "revision_requested") {
    return {
      label:
        status === "conditional"
          ? "Disetujui Bersyarat (Perlu melengkapi dokumen)"
          : "Perlu Revisi (Lengkapi catatan/perbaikan)",
      icon: AlertTriangle,
      className: "text-amber-700 dark:text-amber-300",
    }
  }

  if (status === "rejected") {
    return {
      label: "Ditolak",
      icon: XCircle,
      className: "text-destructive",
    }
  }

  if (recommendation === "APPROVED") {
    return {
      label: "Rekomendasi Approved",
      icon: CheckCircle2,
      className: "text-emerald-700 dark:text-emerald-300",
    }
  }

  if (recommendation === "CONDITIONAL") {
    return {
      label: "Rekomendasi Bersyarat",
      icon: AlertTriangle,
      className: "text-amber-700 dark:text-amber-300",
    }
  }

  return {
    label: "Rekomendasi Reject",
    icon: XCircle,
    className: "text-destructive",
  }
}

function getScoreTone(totalScore: number, hasRedFlag: boolean) {
  if (hasRedFlag) {
    return {
      label: "Red flag aktif",
      icon: XCircle,
      className: "text-destructive",
      barClassName: "bg-destructive",
    }
  }

  if (totalScore >= 85) {
    return {
      label: "Approved",
      icon: CheckCircle2,
      className: "text-emerald-700 dark:text-emerald-300",
      barClassName: "bg-emerald-600",
    }
  }

  if (totalScore >= 70) {
    return {
      label: "C - Layak Bersyarat",
      icon: AlertTriangle,
      className: "text-amber-700 dark:text-amber-300",
      barClassName: "bg-amber-500",
    }
  }

  return {
    label: "Reject",
    icon: XCircle,
    className: "text-destructive",
    barClassName: "bg-destructive",
  }
}

export function VendorApprovalHeaderCards({
  registrationStatus,
  accountStatusLabel,
  documentCount,
  productCount,
  contactCount,
  bankAccountCount,
  missingLegalDocs,
  submittedAt,
  reviewedAt,
  reviewedByName,
}: {
  registrationStatus: string
  accountStatusLabel: string
  documentCount: number
  productCount: number
  contactCount: number
  bankAccountCount: number
  missingLegalDocs: string[]
  submittedAt: string | null
  reviewedAt: string | null
  reviewedByName: string | null
}) {
  const {
    totalScore,
    checklistCheckedCount,
    checklistTotalCount,
    checklistRemainingItems,
    hasRedFlag,
    lastSavedAt,
    lastSavedBy,
    recommendation,
  } = useVendorApprovalReview()

  const reviewTrail = reviewedAt
    ? `${formatSavedAt(reviewedAt)}${reviewedByName ? ` • ${reviewedByName}` : ""}`
    : submittedAt
      ? `Diajukan ${formatSavedAt(submittedAt)}`
      : "Belum direview"

  const scoreToApproved = Math.max(85 - totalScore, 0)
  const scoreToConditional = Math.max(70 - totalScore, 0)
  const legalDone = requiredLegalDocs.length - missingLegalDocs.length
  const decisionMeta = getDecisionMeta(registrationStatus, recommendation)
  const scoreMeta = getScoreTone(totalScore, hasRedFlag)

  return (
    <Card className="w-full">
      <div className="flex shrink-0 items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Ringkasan Approval</h3>
        </div>
      </div>

      <CardContent className="space-y-6 p-4 text-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 md:border-r md:pr-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <decisionMeta.icon className={`h-5 w-5 ${decisionMeta.className}`} />
                Status
              </div>
              <div className="text-xl font-bold leading-tight">{decisionMeta.label}</div>
              <div className="text-sm text-muted-foreground">Status proses: {formatProcessLabel(registrationStatus)}</div>
              <div className="text-sm text-muted-foreground">Status akun: {accountStatusLabel}</div>
            </div>

            <div className="border-t pt-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legal minimum</div>
                <div className="text-xs text-muted-foreground">{legalDone}/5 lengkap</div>
              </div>
              <div className="space-y-2">
                {requiredLegalDocs.map((doc) => {
                  const missing = missingLegalDocs.includes(doc.key)
                  const Icon = missing ? X : Check

                  return (
                    <div key={doc.key} className="flex items-center gap-2 text-sm">
                      <Icon
                        className={
                          missing
                            ? "h-4 w-4 shrink-0 text-destructive"
                            : "h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300"
                        }
                      />
                      <span className={missing ? "text-muted-foreground line-through" : "text-foreground"}>
                        {doc.label}
                      </span>
                      <span className={missing ? "text-destructive" : "text-emerald-700 dark:text-emerald-300"}>
                        {missing ? "Kurang" : "Ada"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:pl-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <scoreMeta.icon className={`h-5 w-5 ${scoreMeta.className}`} />
                Skor
              </div>
              <div className="text-xl font-bold leading-tight">{totalScore}/100</div>
              <div className={`text-sm font-medium ${scoreMeta.className}`}>{scoreMeta.label}</div>
              <div className="text-sm text-muted-foreground">
                {scoreToApproved === 0
                  ? "Sudah memenuhi ambang Approved."
                  : scoreToConditional === 0
                    ? `Need +${scoreToApproved} untuk Approved.`
                    : `Need +${scoreToConditional} untuk C - Layak Bersyarat, +${scoreToApproved} untuk Approved.`}
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={totalScore} className="h-2" />
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Red flag: Auto Reject.</div>
                <div>Ambang skor: ≥85 Approved • 70–84 Bersyarat • &lt;70 Reject.</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <SquareCheck className="h-4 w-4 text-muted-foreground" />
                Checklist
              </div>
              <div className="text-sm text-muted-foreground">
                {checklistCheckedCount}/{checklistTotalCount} selesai • sisa {checklistRemainingItems} item
              </div>
            </div>

          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ringkasan Data Vendor</div>
            <div className="mt-2 space-y-1.5 text-sm leading-none">
              <div className="flex items-baseline gap-1">
                <span>Dokumen upload</span>
                <span className="text-muted-foreground">: {documentCount}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span>Produk terdaftar</span>
                <span className="text-muted-foreground">: {productCount}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span>Kontak PIC</span>
                <span className="text-muted-foreground">: {contactCount}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span>Rekening bank</span>
                <span className="text-muted-foreground">: {bankAccountCount}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status Draft</div>
            <div className="mt-1 text-sm font-medium">{lastSavedAt ? "Tersimpan" : "Belum"}</div>
            <div className="text-xs text-muted-foreground">
              {lastSavedAt
                ? `${formatSavedAt(lastSavedAt)}${lastSavedBy ? ` • ${lastSavedBy}` : ""}`
                : "Belum ada draft"}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Proses Review</div>
            <div className="mt-1 text-sm font-medium">{reviewTrail}</div>
            <div className="text-xs text-muted-foreground">Keputusan: {decisionMeta.label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
