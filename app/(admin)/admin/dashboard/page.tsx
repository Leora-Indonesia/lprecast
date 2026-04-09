import { Building2, Clock, FileText, Users } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/admin/stat-card"

export const metadata = {
  title: "Dashboard Admin | LPrecast",
  description:
    "Kelola dan pantau seluruh aktivitas proyek konstruksi di platform LPrecast",
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ data: vendorsData }, { count: pendingCount }] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("vendor_registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "submitted"),
  ])

  const { count: clientCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("stakeholder_type", "client")

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

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
    </div>
  )
}
