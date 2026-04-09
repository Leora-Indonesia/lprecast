import { createClient } from "@/lib/supabase/server"

export async function checkVendorData() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vendor_registrations")
    .select("*, vendor_company_info(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error:", error)
    return []
  }

  console.log("Vendor registrations found:", data?.length || 0)
  console.log("Sample data:", data?.[0])

  return data
}
