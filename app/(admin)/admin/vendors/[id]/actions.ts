"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"

export type VendorTransactionStatus = {
  hasTransactions: boolean
  tenderSubmissions: number
  vendorSpk: number
  vendorKpiScores: number
  paymentRequests: number
  details: string[]
}

export async function checkVendorTransactions(
  userId: string
): Promise<VendorTransactionStatus> {
  const supabase = createAdminClient()

  const [{ data: tenderData }, { data: spkData }, { data: kpiData }] =
    await Promise.all([
      supabase.from("tender_submissions").select("id").eq("vendor_id", userId),
      supabase.from("vendor_spk").select("id").eq("vendor_id", userId),
      supabase.from("vendor_kpi_scores").select("id").eq("vendor_id", userId),
    ])

  const tenderSubmissions = tenderData?.length ?? 0
  const vendorSpk = spkData?.length ?? 0
  const vendorKpiScores = kpiData?.length ?? 0

  let paymentRequests = 0
  if (vendorSpk > 0) {
    const { data: prData } = await supabase
      .from("payment_requests")
      .select("id")
      .in("vendor_spk_id", spkData?.map((s) => s.id) || [])
    paymentRequests = prData?.length ?? 0
  }

  const details: string[] = []
  if (tenderSubmissions > 0) {
    details.push(`${tenderSubmissions} pengajuan tender`)
  }
  if (vendorSpk > 0) {
    details.push(`${vendorSpk} kontrak SPK`)
  }
  if (vendorKpiScores > 0) {
    details.push(`${vendorKpiScores} record KPI`)
  }
  if (paymentRequests > 0) {
    details.push(`${paymentRequests} permintaan pembayaran`)
  }

  return {
    hasTransactions:
      tenderSubmissions > 0 ||
      vendorSpk > 0 ||
      vendorKpiScores > 0 ||
      paymentRequests > 0,
    tenderSubmissions,
    vendorSpk,
    vendorKpiScores,
    paymentRequests,
    details,
  }
}

export async function deleteVendor(userId: string) {
  const supabase = createAdminClient()

  const transactionStatus = await checkVendorTransactions(userId)

  if (transactionStatus.hasTransactions) {
    return {
      success: false,
      error: `Vendor tidak dapat dihapus karena memiliki: ${transactionStatus.details.join(", ")}`,
    }
  }

  const tablesToDelete = [
    "vendor_onboarding_drafts",
    "vendor_documents",
    "vendor_contacts",
    "vendor_bank_accounts",
    "vendor_factory_addresses",
    "vendor_products",
    "vendor_delivery_areas",
    "vendor_cost_inclusions",
    "vendor_additional_costs",
    "vendor_profiles",
  ]

  for (const table of tablesToDelete) {
    await supabase.from(table).delete().eq("user_id", userId)
  }

  const { error: authError } = await supabase.auth.admin.deleteUser(userId)
  if (authError) {
    console.error("Error deleting auth user:", authError)
  }

  revalidatePath("/admin/vendors")
  redirect("/admin/vendors")
}
