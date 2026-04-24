import {
  Building2,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { calculateOnboardingCompleteness } from "@/app/(vendor-routes)/vendor/onboarding/completeness"
import type { OnboardingDraftData } from "@/app/(vendor-routes)/vendor/onboarding/types"
import { calculateVendorProfileCompleteness } from "@/lib/vendor/profile-completeness"

export const metadata = {
  title: "Dashboard Vendor | LPrecast",
  description: "Portal vendor untuk mengelola proyek dan tender",
}

type ActionItem = {
  id: string
  type: "upload" | "revision" | "tender"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  href: string
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

function buildActionItems(
  progress: ProgressItem[] | null,
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
          href: "/vendor/projects",
        })
      }
    })
  }

  if (openTenders > 0) {
    items.push({
      id: "new-tenders",
      type: "tender",
      title: `${openTenders} tender baru tersedia`,
      description: "Ada tender yang cocok dengan area Anda",
      priority: "low",
      href: "/vendor/tenders",
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
    { data: onboardingDraft },
    { data: vendorContacts },
    { data: vendorDocuments },
    { data: vendorFactoryAddress },
    { data: vendorBankAccount },
    { count: deliveryAreasCount },
    { count: productsCount },
  ] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select(
        "status, registration_status, nama_perusahaan, email_perusahaan, approval_tier, approval_notes, rejection_reason, profile_completeness_pct"
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
      .from("vendor_onboarding_drafts")
      .select("draft_data")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("vendor_contacts")
      .select("nama, no_hp, jabatan")
      .eq("user_id", user.id)
      .order("sequence", { ascending: true }),
    supabase
      .from("vendor_documents")
      .select("document_type, document_number, file_path")
      .eq("user_id", user.id),
    supabase
      .from("vendor_factory_addresses")
      .select("address, province, kabupaten, kecamatan, postal_code")
      .eq("user_id", user.id)
      .eq("is_primary", true)
      .maybeSingle(),
    supabase
      .from("vendor_bank_accounts")
      .select("bank_name, account_number, account_holder_name")
      .eq("user_id", user.id)
      .eq("is_primary", true)
      .maybeSingle(),
    supabase
      .from("vendor_delivery_areas")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("vendor_products")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ])

  const spkIds = activeSPKs?.map((spk) => spk.id) || []
  const { data: latestProgress } = await supabase
    .from("vendor_progress")
    .select("id, vendor_spk_id, progress_percent, status, tanggal, catatan, rejection_notes")
    .in("vendor_spk_id", spkIds)
    .order("tanggal", { ascending: false })

  const vendorProjects = activeSPKs || []

  const actionItems = buildActionItems(latestProgress, openTendersCount || 0)

  const registrationStatus = vendorProfile?.registration_status ?? null
  const accountStatus = vendorProfile?.status ?? null
  const isVendorActive = accountStatus === "active" && registrationStatus === "approved"

  const completionFromVendorData = calculateVendorProfileCompleteness({
    profile: vendorProfile
      ? {
          nama_perusahaan: vendorProfile.nama_perusahaan,
          email_perusahaan: vendorProfile.email_perusahaan,
        }
      : null,
    contacts: vendorContacts ?? null,
    documents: vendorDocuments ?? null,
    factoryAddress: vendorFactoryAddress ?? null,
    bankAccount: vendorBankAccount ?? null,
    deliveryAreasCount: deliveryAreasCount ?? 0,
    productsCount: productsCount ?? 0,
  })

  const completionFromDraft = calculateOnboardingCompleteness(
    (onboardingDraft?.draft_data as Partial<OnboardingDraftData> | null | undefined) ??
      undefined
  )
  const profileCompletion = Math.max(
    completionFromVendorData,
    completionFromDraft,
    vendorProfile?.profile_completeness_pct ?? 0
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Ringkasan Vendor</h1>
          <p className="text-sm text-muted-foreground">
            Proyek & tender yang perlu perhatian Anda
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Proyek aktif"
          value={vendorProjects.length}
          description="SPK yang sedang berjalan"
          icon={Building2}
        />
        <StatCard
          title="Tender terbuka"
          value={openTendersCount || 0}
          description="Yang bisa diikuti"
          icon={ClipboardList}
        />
        <StatCard
          title="Penawaran saya"
          value={submittedTendersCount || 0}
          description="Sudah dikirim ke sistem"
          icon={ArrowRight}
        />
        <StatCard
          title="Menang tender"
          value={wonTendersCount || 0}
          description="Submission berstatus menang"
          icon={CheckCircle}
        />
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
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Kelengkapan profil</span>
                <span>{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} />
            </div>

            {(registrationStatus === "submitted" ||
              registrationStatus === "under_review") && (
              <div className="mt-4">
                <Button size="sm" asChild>
                  <Link href="/vendor/profile">Lengkapi Profil</Link>
                </Button>
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
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center justify-between py-2.5 transition-colors hover:bg-muted/40"
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
                    </Link>
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
                            </td>
                            <td className="py-2 pr-4">
                              <p className="text-sm">{spk.pekerjaan}</p>
                            </td>
                            <td className="py-2 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full bg-green-600"
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
                                {spkProgress?.status === "approved"
                                  ? "Disetujui"
                                  : spkProgress?.status === "rejected"
                                    ? "Ditolak"
                                    : spkProgress?.status === "submitted"
                                      ? "Menunggu Review"
                                      : "Belum Upload"}
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
                <ArrowRight className="h-4 w-4" />
                Penawaran Terbaru
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/vendor/tenders">
                  Semua <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentSubmissions && recentSubmissions.length > 0 ? (
              <div className="divide-y">
                {recentSubmissions.slice(0, 4).map((submission) => (
                  <div key={submission.id} className="py-2">
                    <p className="text-sm font-medium">
                      {submission.tenders?.[0]?.title || "Tender"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Status: {submission.status || "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Belum ada penawaran terbaru
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
