import {
  Building2,
  FileText,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Bell,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { formatDateTime } from "@/lib/datetime"
import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/ui/status-badge"

export const metadata = {
  title: "Dashboard Vendor | LPrecast",
  description: "Portal vendor untuk mengelola proyek dan tender",
}

type ActionItem = {
  id: string
  type: "upload" | "revision" | "tender" | "notification"
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

type ProgressItem = {
  id: string
  vendor_spk_id: string
  progress_percent: number
  status: string | null
  tanggal: string
  catatan: string | null
  rejection_notes: string | null
}

type NotificationItem = {
  id: string
  title: string
  message: string
  is_read: boolean | null
  created_at: string | null
  category: string
}

function buildActionItems(
  progress: ProgressItem[] | null,
  notifications: NotificationItem[] | null,
  openTenders: number
): ActionItem[] {
  const items: ActionItem[] = []

  if (progress) {
    progress.forEach((p) => {
      if (p.status === "rejected") {
        items.push({
          id: p.id,
          type: "revision",
          title: "Progress ditolak SPV",
          description: p.rejection_notes || "Silakan perbaiki dan upload ulang",
          priority: "high",
        })
      }
    })
  }

  if (notifications) {
    const important = notifications
      .filter((n) => n.is_read === false && n.category === "tender")
      .slice(0, 1)
    important.forEach((n) => {
      items.push({
        id: n.id,
        type: "tender",
        title: n.title,
        description: n.message,
        priority: "medium",
      })
    })
  }

  if (openTenders > 0) {
    items.push({
      id: "new-tenders",
      type: "tender",
      title: `${openTenders} tender baru tersedia`,
      description: "Ada tender yang cocok dengan area Anda",
      priority: "low",
    })
  }

  return items.slice(0, 5)
}

export default async function VendorDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="p-8">
        <p>Silakan login terlebih dahulu.</p>
      </div>
    )
  }

  const [
    { data: vendorProfile },
    { data: activeSPKs },
    { count: openTendersCount },
    { count: submittedTendersCount },
    { count: wonTendersCount },
    { data: recentSubmissions },
    { data: recentNotifications },
  ] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select(
        "status, registration_status, nama_perusahaan, approval_tier, approval_notes, rejection_reason, profile_completeness_pct"
      )
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("vendor_spk")
      .select("id, pekerjaan, project_id, status, nilai_spk, created_at")
      .eq("vendor_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("tenders")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("tender_submissions")
      .select("id", { count: "exact", head: true })
      .eq("vendor_id", user.id),
    supabase
      .from("tender_submissions")
      .select("id", { count: "exact", head: true })
      .eq("vendor_id", user.id)
      .eq("status", "won"),
    supabase
      .from("tender_submissions")
      .select("id, status, created_at, tenders(id, title)")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("notifications")
      .select("id, title, message, is_read, created_at, category")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  const spkIds = activeSPKs?.map((spk) => spk.id) || []
  const { data: latestProgress } = await supabase
    .from("vendor_progress")
    .select("id, vendor_spk_id, progress_percent, status, tanggal, catatan, rejection_notes")
    .in("vendor_spk_id", spkIds)
    .order("tanggal", { ascending: false })

  const vendorProjects = activeSPKs || []
  const notificationCount = recentNotifications?.filter((n) => !n.is_read).length || 0

  const actionItems = buildActionItems(
    latestProgress,
    recentNotifications,
    openTendersCount || 0
  )

  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case "active":
        return {
          label: "Aktif",
          variant: "default" as const,
          icon: CheckCircle,
          description: "Akun vendor Anda telah aktif",
        }
      case "draft":
        return {
          label: "Draft",
          variant: "secondary" as const,
          icon: Clock,
          description: "Belum submisi",
        }
      case "submitted":
        return {
          label: "Menunggu Review",
          variant: "secondary" as const,
          icon: Clock,
          description: "Data telah dikirim, menunggu review dari admin",
        }
      case "under_review":
        return {
          label: "Sedang Direview",
          variant: "default" as const,
          icon: Clock,
          description: "Tim kami sedang mereview data Anda",
        }
      case "revision_requested":
        return {
          label: "Perlu Revisi",
          variant: "secondary" as const,
          icon: AlertCircle,
          description: "Silakan lengkapi data yang diperlukan",
        }
      case "rejected":
        return {
          label: "Ditolak",
          variant: "destructive" as const,
          icon: XCircle,
          description: "Pendaftaran ditolak",
        }
      case "suspended":
        return {
          label: "Ditangguhkan",
          variant: "secondary" as const,
          icon: AlertCircle,
          description: "Akun ditangguhkan sementara",
        }
      case "blacklisted":
        return {
          label: "Diblokir",
          variant: "destructive" as const,
          icon: XCircle,
          description: "Akun diblokir",
        }
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          icon: AlertCircle,
          description: "Status tidak diketahui",
        }
    }
  }

  const _profileStatus = getStatusConfig(vendorProfile?.status ?? null)
  const registrationStatus = vendorProfile?.registration_status ?? null
  const accountStatus = vendorProfile?.status ?? null
  const isVendorActive = accountStatus === "active" && registrationStatus === "approved"

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Ringkasan Vendor</h1>
          <p className="text-sm text-muted-foreground">
            Proyek & tender yang perlu perhatian Anda
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/vendor/projects">Upload Progress</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/vendor/tenders">Lihat Tender</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-full bg-background border px-3 py-1.5 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              accountStatus === "active" ? "bg-green-500" : "bg-amber-500"
            }`}
          />
          <span className="font-medium">
            {accountStatus === "active" ? "Aktif" : accountStatus || "Tidak aktif"}
          </span>
          <span className="text-muted-foreground text-xs">
            {vendorProfile?.approval_tier ? `• Tier ${vendorProfile.approval_tier}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-background border px-3 py-1.5 text-sm">
          <span className="text-muted-foreground">Proyek aktif:</span>
          <span className="font-bold">{vendorProjects.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-background border px-3 py-1.5 text-sm">
          <span className="text-muted-foreground">Tender open:</span>
          <span className="font-bold">{openTendersCount || 0}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-background border px-3 py-1.5 text-sm">
          <span className="text-muted-foreground">Notifikasi:</span>
          <span className="font-bold text-green-600">{notificationCount}</span>
          <span className="text-muted-foreground text-xs">unread</span>
        </div>
      </div>

      {registrationStatus !== "approved" && (
        <Card>
          <CardContent className="py-4">
            {!user ? (
              <p className="text-sm">Silakan login terlebih dahulu.</p>
            ) : accountStatus === "blacklisted" ? (
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Akun diblokir</p>
                  <p className="text-sm text-muted-foreground">
                    Vendor tidak bisa ikut tender.
                  </p>
                </div>
              </div>
            ) : registrationStatus === "revision_requested" ? (
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Perlu revisi data</p>
                  <p className="text-sm text-muted-foreground">
                    {vendorProfile?.approval_notes ||
                      "Silakan perbaiki dan submit ulang."}
                  </p>
                </div>
              </div>
            ) : registrationStatus === "submitted" ||
              registrationStatus === "under_review" ? (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Menunggu review</p>
                  <p className="text-sm text-muted-foreground">
                    Data sedang diverifikasi admin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Akun aktif</p>
                  <p className="text-sm text-muted-foreground">
                    Anda bisa ikut tender dan kelola proyek.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isVendorActive && (
        <>
          {actionItems.length > 0 && (
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    Perlu Aksi
                    <Badge variant="default" className="bg-amber-100 text-amber-700">
                      {actionItems.length}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border">
                  {actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.priority === "high"
                              ? "bg-red-500"
                              : item.priority === "medium"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Proyek Aktif</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/vendor/projects">
                    Semua{" "}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {vendorProjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left py-2 pr-4 font-medium">Proyek</th>
                        <th className="text-left py-2 pr-4 font-medium">Pekerjaan</th>
                        <th className="text-left py-2 pr-4 font-medium">
                          Progress
                        </th>
                        <th className="text-left py-2 pr-4 font-medium">Status</th>
                        <th className="text-right py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {vendorProjects.map((spk: typeof activeSPKs extends (infer T)[] | null ? T : never) => {
                        const spkProgress = latestProgress?.filter(
                          (p) => p.vendor_spk_id === spk.id
                        )[0]
                        return (
                          <tr key={spk.id} className="group">
                            <td className="py-2 pr-4">
                              <p className="text-sm font-medium">
                                Proyek #{spk.project_id?.slice(0, 8)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {spk.pekerjaan}
                              </p>
                            </td>
                            <td className="py-2 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-600 rounded-full"
                                    style={{
                                      width: `${spkProgress?.progress_percent || 0}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs">
                                  {spkProgress?.progress_percent || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="py-2 pr-4">
                              <Badge
                                variant={
                                  spkProgress?.status === "rejected"
                                    ? "destructive"
                                    : spkProgress?.status === "approved"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {spkProgress?.status || "submitted"}
                              </Badge>
                            </td>
                            <td className="py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="opacity-0 group-hover:opacity-100"
                              >
                                <Link href={`/vendor/projects/${spk.id}`}>
                                  Detail{" "}
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Belum ada proyek aktif
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/vendor/tenders">Lihat Tender</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Tender
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/vendor/tenders">
                  Semua <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Open tender</span>
                <span className="font-bold">{openTendersCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sudah submit</span>
                <span className="font-bold">{submittedTendersCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Menang</span>
                <span className="font-bold text-green-600">
                  {wonTendersCount || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifikasi
                {notificationCount > 0 && (
                  <Badge variant="default" className="bg-blue-100 text-blue-700">
                    {notificationCount}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/vendor/notifications">
                  Semua <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentNotifications && recentNotifications.length > 0 ? (
              <div className="divide-y">
                {recentNotifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className={`py-2 ${
                      !notif.is_read ? "bg-primary/5 -mx-4 px-4" : ""
                    }`}
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Tidak ada notifikasi
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium text-muted-foreground">Segera:</span>
            <Badge variant="outline">Pembayaran & Termin</Badge>
            <Badge variant="outline">KPI Vendor</Badge>
            <Badge variant="outline">Dokumen</Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              Coming soon →
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
