"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"

export interface VendorProfileWithUser {
  user_id: string
  status: string
  created_at: string | null
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  approval_notes: string | null
  user_email: string | null
  user_nama: string | null
  nama_perusahaan: string | null
  draft_data: {
    company_info?: {
      nama_perusahaan?: string
      nama_pic?: string
      email?: string
    }
  } | null
}

export async function getPendingVendorRegistrations() {
  const supabase = await createAdminClient()

  const { data: profiles, error } = await supabase
    .from("vendor_profiles")
    .select("*")
    .in("status", ["submitted", "under_review"])
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending vendors:", error)
    return []
  }

  if (!profiles || profiles.length === 0) {
    return []
  }

  const userIds = profiles.map((p) => p.user_id).filter(Boolean)

  const [usersResult, draftsResult] = await Promise.all([
    supabase
      .from("users")
      .select("id, email, nama, nama_perusahaan")
      .in("id", userIds),
    supabase
      .from("vendor_onboarding_drafts")
      .select("user_id, draft_data")
      .in("user_id", userIds),
  ])

  const userMap = new Map((usersResult.data || []).map((u) => [u.id, u]))
  const draftMap = new Map(
    (draftsResult.data || []).map((d) => [d.user_id, d.draft_data])
  )

  return (profiles || []).map((profile) => {
    const user = userMap.get(profile.user_id)
    return {
      user_id: profile.user_id,
      status: profile.status,
      created_at: profile.created_at,
      submitted_at: profile.submitted_at,
      reviewed_at: profile.reviewed_at,
      reviewed_by: profile.reviewed_by,
      rejection_reason: profile.rejection_reason,
      approval_notes: profile.approval_notes,
      user_email: user?.email || null,
      user_nama: user?.nama || null,
      nama_perusahaan: profile.nama_perusahaan || null,
      draft_data: draftMap.get(profile.user_id) || null,
    }
  })
}

export async function getVendorProfileByUserId(userId: string) {
  const supabase = await createAdminClient()

  const { data: profile, error } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !profile) {
    console.error("Error fetching profile:", error)
    return null
  }

  const [
    userResult,
    drafts,
    documents,
    contacts,
    bankAccounts,
    factoryAddresses,
    products,
    deliveryAreas,
    costInclusions,
    additionalCosts,
  ] = await Promise.all([
    supabase
      .from("users")
      .select("id, email, nama, nama_perusahaan")
      .eq("id", userId)
      .single(),
    supabase
      .from("vendor_onboarding_drafts")
      .select("draft_data")
      .eq("user_id", userId)
      .single(),
    supabase.from("vendor_documents").select("*").eq("user_id", userId),
    supabase
      .from("vendor_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("sequence"),
    supabase.from("vendor_bank_accounts").select("*").eq("user_id", userId),
    supabase.from("vendor_factory_addresses").select("*").eq("user_id", userId),
    supabase.from("vendor_products").select("*").eq("user_id", userId),
    supabase.from("vendor_delivery_areas").select("*").eq("user_id", userId),
    supabase.from("vendor_cost_inclusions").select("*").eq("user_id", userId),
    supabase.from("vendor_additional_costs").select("*").eq("user_id", userId),
  ])

  return {
    profile: {
      ...profile,
      user_email: userResult.data?.email || null,
      user_nama: userResult.data?.nama || null,
    },
    draft_data: drafts.data as {
      company_info?: Record<string, unknown>
    } | null,
    documents: documents.data || [],
    contacts: contacts.data || [],
    bank_accounts: bankAccounts.data || [],
    factory_addresses: factoryAddresses.data || [],
    products: products.data || [],
    delivery_areas: deliveryAreas.data || [],
    cost_inclusions: costInclusions.data || [],
    additional_costs: additionalCosts.data || [],
  }
}

export async function approveVendor(
  userId: string,
  adminUserId: string,
  notes?: string
) {
  const supabase = await createAdminClient()

  const { error: updateError } = await supabase
    .from("vendor_profiles")
    .update({
      status: "active",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUserId,
      approval_notes: notes || null,
    })
    .eq("user_id", userId)

  if (updateError) {
    console.error("Error approving vendor:", updateError)
    return { success: false, error: "Failed to approve vendor" }
  }

  revalidatePath("/admin/vendors")
  revalidatePath(`/admin/vendors/${userId}`)

  return { success: true }
}

export async function rejectVendor(
  userId: string,
  adminUserId: string,
  reason: string
) {
  const supabase = await createAdminClient()

  const { error: updateError } = await supabase
    .from("vendor_profiles")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUserId,
      rejection_reason: reason,
    })
    .eq("user_id", userId)

  if (updateError) {
    console.error("Error rejecting vendor:", updateError)
    return { success: false, error: "Failed to reject vendor" }
  }

  revalidatePath("/admin/vendors")
  revalidatePath(`/admin/vendors/${userId}`)

  return { success: true }
}

export async function setUnderReview(userId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("vendor_profiles")
    .update({ status: "under_review" })
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating status:", error)
    return { success: false, error: "Failed to update status" }
  }

  revalidatePath("/admin/vendors")
  return { success: true }
}

export async function setRevisionRequested(userId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("vendor_profiles")
    .update({ status: "revision_requested" })
    .eq("user_id", userId)

  if (error) {
    console.error("Error setting revision requested:", error)
    return { success: false, error: "Failed to request revision" }
  }

  revalidatePath("/admin/vendors")
  return { success: true }
}

export async function updateVendorStatus(
  userId: string,
  newStatus: "active" | "suspended" | "blacklisted"
) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("vendor_profiles")
    .update({ status: newStatus })
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating vendor status:", error)
    return { success: false, error: "Failed to update vendor status" }
  }

  revalidatePath("/admin/vendors")
  return { success: true }
}

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
  const supabase = await createAdminClient()

  const { count: tenderSubmissions } = await supabase
    .from("tender_submissions")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", userId)

  const { count: vendorSpk } = await supabase
    .from("vendor_spk")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", userId)

  const { count: vendorKpiScores } = await supabase
    .from("vendor_kpi_scores")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", userId)

  let paymentRequests = 0
  if (vendorSpk && vendorSpk > 0) {
    const { data: spkIds } = await supabase
      .from("vendor_spk")
      .select("id")
      .eq("vendor_id", userId)

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

export async function deleteVendor(userId: string) {
  const supabase = await createAdminClient()

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
