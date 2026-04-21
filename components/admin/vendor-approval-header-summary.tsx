"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useVendorApprovalReview } from "@/components/admin/vendor-approval-review-context"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

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

export function VendorApprovalHeaderSummary({
  registrationStatus,
  accountStatusLabel,
}: {
  registrationStatus: string
  accountStatusLabel: string
}) {
  // Legacy component; summary moved into "Total Skor Penilaian" card.
  // Keep export for now in case other page still import.
  void registrationStatus
  void accountStatusLabel
  return null
}

function mapRecommendationToStatusBadge(recommendation: "APPROVED" | "CONDITIONAL" | "REJECT") {
  if (recommendation === "APPROVED") return "Disetujui"
  if (recommendation === "CONDITIONAL") return "Bersyarat"
  return "Ditolak"
}

function formatRegistrationStatusLabel(status: string) {
  if (status === "submitted") return "Diajukan"
  if (status === "under_review") return "Ditinjau"
  if (status === "approved") return "Disetujui"
  if (status === "conditional") return "Bersyarat"
  if (status === "rejected") return "Ditolak"
  if (status === "revision_requested") return "Perlu Revisi"
  if (status === "draft") return "Draft"
  return status
}

function formatTierLabel(approvalTier: string) {
  if (approvalTier === "Needs Review") return "Perlu Review"
  if (approvalTier === "Auto Reject") return "Auto Reject"
  return approvalTier
}

export function VendorApprovalHeaderCards({
  registrationStatus,
  accountStatusLabel,
}: {
  registrationStatus: string
  accountStatusLabel: string
}) {
  const {
    totalScore,
    recommendation,
    approvalTier,
    hasRedFlag,
    lastSavedAt,
    notes,
    setNotes,
  } = useVendorApprovalReview()

  return (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Total Skor Penilaian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Skor Saat Ini</span>
            <span className="text-lg font-bold">{totalScore} / 100</span>
          </div>
          <Progress value={totalScore} className="h-2" />
          <Separator />
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Status Registrasi</div>
              <div className="font-medium">
                {formatRegistrationStatusLabel(registrationStatus)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Status Akun</div>
              <div className="font-medium">{accountStatusLabel}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Status Evaluasi</div>
              <div className="font-medium">{formatTierLabel(approvalTier)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Rekomendasi</div>
              <div
                className={
                  recommendation === "APPROVED"
                    ? "font-semibold text-green-700 dark:text-green-300"
                    : recommendation === "CONDITIONAL"
                      ? "font-semibold text-amber-700 dark:text-amber-300"
                      : "font-semibold text-destructive"
                }
              >
                {mapRecommendationToStatusBadge(recommendation)}
              </div>
            </div>
          </div>
          {hasRedFlag && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              Red flag terdeteksi. Vendor wajib ditolak sampai temuan diselesaikan.
            </div>
          )}
          {!hasRedFlag && totalScore < 70 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Skor di bawah 70. Tombol approve dinonaktifkan sampai penilaian memenuhi minimum approval bersyarat.
            </div>
          )}
          {lastSavedAt && (
            <div className="text-xs text-muted-foreground">
              Draft terakhir: {formatSavedAt(lastSavedAt)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Catatan Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="vendor-review-notes">Catatan</Label>
          <Textarea
            id="vendor-review-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan approval, alasan revisi, atau alasan penolakan..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
}
