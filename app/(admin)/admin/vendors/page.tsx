import { createAdminClient } from "@/lib/supabase/admin"
import { VendorTable } from "@/components/admin/vendor-table"

export const metadata = {
  title: "Kelola Vendor | LPrecast",
  description: "Kelola dan verifikasi vendor mitra LPrecast",
}

type VendorRegistration = {
  id: string
  status: string | null
  created_at: string | null
  vendor_company_info: {
    nama_perusahaan: string
    nama_pic: string
    email: string
  } | null
}

export default async function AdminVendorsPage() {
  const supabase = await createAdminClient()

  const { data: registrations, error } = await supabase
    .from("vendor_registrations")
    .select("*, vendor_company_info(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching vendors:", error)
  }

  // Handle array return type from Supabase - convert to object
  const vendors: VendorRegistration[] = (registrations ?? []).map((reg) => ({
    id: reg.id,
    status: reg.status,
    created_at: reg.created_at,
    vendor_company_info: Array.isArray(reg.vendor_company_info)
      ? reg.vendor_company_info[0] || null
      : (reg.vendor_company_info as VendorRegistration["vendor_company_info"]),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendor</h1>
      </div>

      <VendorTable data={vendors} />
    </div>
  )
}
