import {
  Building2,
  Clock,
  FileText,
  Users,
  Bell,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Dashboard Admin | LPrecast",
  description:
    "Kelola dan pantau seluruh aktivitas proyek konstruksi di platform LPrecast",
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { data: vendorsData },
    { count: pendingCount },
    { data: recentNotifications },
  ] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("vendor_registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "submitted"),
    supabase
      .from("notifications")
      .select("*, users(nama)")
      .eq("category", "vendor")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const { count: clientCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("stakeholder_type", "client")

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })

  const { data: recentVendors } = await supabase
    .from("vendor_registrations")
    .select("*, vendor_company_info(*)")
    .eq("status", "submitted")
    .order("created_at", { ascending: false })
    .limit(5)

  const unreadNotificationCount =
    recentNotifications?.filter((n) => !n.is_read).length ?? 0

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vendor":
        return "bg-green-100 text-green-800"
      case "tender":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vendor"
          value={vendorsData?.length ?? 0}
          description="Vendor aktif"
          icon={Building2}
        />
        <StatCard
          title="Pending Approval"
          value={pendingCount ?? 0}
          description="Menunggu verifikasi"
          icon={Clock}
        />
        <StatCard
          title="Total Klien"
          value={clientCount ?? 0}
          description="Total klien"
          icon={Users}
        />
        <StatCard
          title="Proyek Aktif"
          value={projectCount ?? 0}
          description="Proyek berjalan"
          icon={FileText}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </div>
              Notifikasi Terbaru
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/notifications">
                Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentNotifications && recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={
                      notification.reference_type === "vendor_registration"
                        ? `/admin/vendors/${notification.reference_id}`
                        : "/admin/notifications"
                    }
                    className={`block rounded-lg border p-3 transition hover:bg-muted/50 ${
                      !notification.is_read ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{notification.title}</p>
                          {!notification.is_read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getCategoryColor(notification.category)}`}
                          >
                            {notification.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {notification.created_at
                              ? formatDistanceToNow(
                                  new Date(notification.created_at),
                                  {
                                    addSuffix: true,
                                    locale: id,
                                  }
                                )
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Tidak ada notifikasi baru
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Vendor Pending Review
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/vendors">
                Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentVendors && recentVendors.length > 0 ? (
              <div className="space-y-4">
                {recentVendors.map((vendor) => {
                  const companyInfo = Array.isArray(vendor.vendor_company_info)
                    ? vendor.vendor_company_info[0]
                    : vendor.vendor_company_info

                  return (
                    <Link
                      key={vendor.id}
                      href={`/admin/vendors/${vendor.id}`}
                      className="block rounded-lg border p-3 transition hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {companyInfo?.nama_perusahaan || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PIC: {companyInfo?.nama_pic || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {vendor.created_at
                              ? formatDistanceToNow(
                                  new Date(vendor.created_at),
                                  {
                                    addSuffix: true,
                                    locale: id,
                                  }
                                )
                              : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Tidak ada vendor pending
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
