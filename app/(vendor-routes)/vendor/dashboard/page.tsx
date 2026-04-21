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

export default async function VendorDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: vendorProfile } = await supabase
    .from("vendor_profiles")
    .select(
      "status, registration_status, nama_perusahaan, approval_tier, approval_notes, rejection_reason"
    )
    .eq("user_id", user?.id)
    .single()

  const { count: activeProjects } = await supabase
    .from("vendor_spk")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", user?.id)
    .eq("status", "active")

  const { count: submittedTenders } = await supabase
    .from("tender_submissions")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", user?.id)

  const { count: wonTenders } = await supabase
    .from("tender_submissions")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", user?.id)
    .eq("status", "won")

  const { data: recentSubmissions } = await supabase
    .from("tender_submissions")
    .select("*, tenders(title, project_id)")
    .eq("vendor_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentNotifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Vendor</h1>
          <p className="text-muted-foreground">
            Selamat datang di portal vendor LPrecast
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {registrationStatus && <StatusBadge status={registrationStatus} />}
          <Badge
            variant={
              accountStatus === "blacklisted"
                ? "destructive"
                : accountStatus === "suspended"
                  ? "secondary"
                  : "outline"
            }
          >
            {accountStatus === "blacklisted"
              ? "Diblokir"
              : accountStatus === "suspended"
                ? "Ditangguhkan"
                : "Akun Aktif"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {accountStatus === "blacklisted" && (
            <div className="flex items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium">Akun diblokir</p>
                <p className="text-sm text-muted-foreground">
                  Vendor tidak bisa ikut tender sampai admin membuka blokir.
                </p>
              </div>
            </div>
          )}
          {registrationStatus === "revision_requested" && (
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="font-medium">Perlu revisi</p>
                <p className="text-sm text-muted-foreground">
                  {vendorProfile?.approval_notes ||
                    "Silakan perbaiki data lalu submit ulang."}
                </p>
              </div>
            </div>
          )}
          {registrationStatus === "conditional" && (
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="font-medium">Disetujui bersyarat</p>
                <p className="text-sm text-muted-foreground">
                  {vendorProfile?.approval_notes ||
                    "Vendor dapat ikut tender sesuai kondisi approval."}
                </p>
              </div>
            </div>
          )}
          {registrationStatus === "submitted" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status Pendaftaran</span>
                <span className="font-medium">Menunggu Review</span>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Data telah dikirim dan sedang menunggu verifikasi admin.
              </p>
            </div>
          )}
          {registrationStatus === "under_review" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress Review</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Tim kami sedang mereview data Anda. Biasanya proses ini memakan
                waktu 1-2 hari kerja.
              </p>
            </div>
          )}
          {registrationStatus === "approved" && (
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Selamat! Akun Anda aktif</p>
                <p className="text-sm text-muted-foreground">
                  Anda dapat mengikuti tender dan mengelola proyek
                </p>
              </div>
            </div>
          )}
          {registrationStatus === "rejected" && (
            <div className="flex items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium">Pendaftaran ditolak</p>
                <p className="text-sm text-muted-foreground">
                  {vendorProfile?.rejection_reason ||
                    "Silakan hubungi admin untuk informasi lebih lanjut"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Proyek Aktif"
          value={activeProjects ?? 0}
          description="Proyek berjalan"
          icon={Building2}
        />
        <StatCard
          title="Penawaran Terkirim"
          value={submittedTenders ?? 0}
          description="Total penawaran"
          icon={ClipboardList}
        />
        <StatCard
          title="Penawaran Menang"
          value={wonTenders ?? 0}
          description="Win rate tender"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Tender"
          value={(submittedTenders ?? 0) + 10}
          description="Tender tersedia"
          icon={FileText}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Penawaran Terbaru
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/vendor/submissions">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentSubmissions && recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => {
                  const statusConfig = {
                    submitted: {
                      label: "Submitted",
                      variant: "secondary" as const,
                    },
                    won: { label: "Won", variant: "default" as const },
                    lost: { label: "Lost", variant: "destructive" as const },
                  }

                  const status =
                    statusConfig[
                      submission.status as keyof typeof statusConfig
                    ] || statusConfig.submitted

                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {(submission.tenders as { title?: string })?.title ||
                            "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {formatDateTime(submission.created_at)}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada penawaran
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/vendor/tenders">Lihat Tender</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notifikasi
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/vendor/notifications">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentNotifications && recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-3 ${
                      !notification.is_read ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateTime(notification.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Tidak ada notifikasi
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
