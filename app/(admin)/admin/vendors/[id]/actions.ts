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
  registrationId: string
): Promise<VendorTransactionStatus> {
  const supabase = createAdminClient()

  // Get vendor_id from registration
  const { data: registration } = await supabase
    .from("vendor_registrations")
    .select("vendor_id")
    .eq("id", registrationId)
    .single()

  if (!registration?.vendor_id) {
    return {
      hasTransactions: false,
      tenderSubmissions: 0,
      vendorSpk: 0,
      vendorKpiScores: 0,
      paymentRequests: 0,
      details: [],
    }
  }

  const vendorId = registration.vendor_id

  // Check tender submissions
  const { count: tenderSubmissions } = await supabase
    .from("tender_submissions")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendorId)

  // Check vendor SPK
  const { count: vendorSpk } = await supabase
    .from("vendor_spk")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendorId)

  // Check vendor KPI scores
  const { count: vendorKpiScores } = await supabase
    .from("vendor_kpi_scores")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendorId)

  // Check payment requests (via vendor_spk)
  let paymentRequests = 0
  if (vendorSpk && vendorSpk > 0) {
    const { data: spkIds } = await supabase
      .from("vendor_spk")
      .select("id")
      .eq("vendor_id", vendorId)

    if (spkIds && spkIds.length > 0) {
      const { count: prCount } = await supabase
        .from("payment_requests")
        .select("*", { count: "exact", head: true })
        .in(
          "vendor_spk_id",
          spkIds.map((s) => s.id)
        )
      paymentRequests = prCount ?? 0
    }
  }

  const details: string[] = []
  if ((tenderSubmissions ?? 0) > 0) {
    details.push(`${tenderSubmissions} pengajuan tender`)
  }
  if ((vendorSpk ?? 0) > 0) {
    details.push(`${vendorSpk} kontrak SPK`)
  }
  if ((vendorKpiScores ?? 0) > 0) {
    details.push(`${vendorKpiScores} record KPI`)
  }
  if (paymentRequests > 0) {
    details.push(`${paymentRequests} permintaan pembayaran`)
  }

  return {
    hasTransactions:
      (tenderSubmissions ?? 0) > 0 ||
      (vendorSpk ?? 0) > 0 ||
      (vendorKpiScores ?? 0) > 0 ||
      paymentRequests > 0,
    tenderSubmissions: tenderSubmissions ?? 0,
    vendorSpk: vendorSpk ?? 0,
    vendorKpiScores: vendorKpiScores ?? 0,
    paymentRequests,
    details,
  }
}

export async function deleteVendor(registrationId: string) {
  const supabase = createAdminClient()

  // Check if vendor has transactions
  const transactionStatus = await checkVendorTransactions(registrationId)

  if (transactionStatus.hasTransactions) {
    return {
      success: false,
      error: `Vendor tidak dapat dihapus karena memiliki: ${transactionStatus.details.join(", ")}`,
    }
  }

  // Get vendor_id to delete user later
  const { data: registration } = await supabase
    .from("vendor_registrations")
    .select("vendor_id")
    .eq("id", registrationId)
    .single()

  const vendorId = registration?.vendor_id

  // Delete vendor_profiles first (no ON DELETE CASCADE on registration_id FK)
  if (vendorId) {
    const { error: profileDeleteError } = await supabase
      .from("vendor_profiles")
      .delete()
      .eq("user_id", vendorId)
    if (profileDeleteError) {
      console.error("Error deleting vendor_profiles:", profileDeleteError)
      return { success: false, error: "Gagal menghapus profil vendor." }
    }
  }

  // Delete vendor registration (ON DELETE CASCADE will handle related tables)
  const { error: deleteError } = await supabase
    .from("vendor_registrations")
    .delete()
    .eq("id", registrationId)

  if (deleteError) {
    console.error("Error deleting vendor_registrations:", deleteError)
    return {
      success: false,
      error: "Gagal menghapus vendor. Silakan coba lagi.",
    }
  }

  // Delete auth user if exists
  if (vendorId) {
    const { error: authError } = await supabase.auth.admin.deleteUser(vendorId)
    if (authError) {
      console.error("Error deleting auth user:", authError)
      // Continue even if auth deletion fails - registration is already deleted
    }
  }

  revalidatePath("/admin/vendors")
  redirect("/admin/vendors")
}
