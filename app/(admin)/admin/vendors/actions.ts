"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Json } from "@/types/database.types"

type DraftData = {
  currentStep?: number
  company_info?: {
    nama_perusahaan?: string
    nama_pic?: string
    email?: string
    kontak_pic?: string
    website?: string
    instagram?: string
    facebook?: string
    linkedin?: string
    contacts?: {
      sequence: number
      nama: string
      no_hp: string
      jabatan: string
    }[]
  }
  operational?: {
    factory_address?: {
      address?: string
      province?: string
      kabupaten?: string
      kecamatan?: string
      postal_code?: string
    }
    delivery_areas?: {
      province_id?: string
      province_name?: string
      city_id?: string
      city_name?: string
    }[]
    products?: {
      name?: string
      satuan?: string
      price?: number
      dimensions?: string
      material?: string
      finishing?: string
      weight_kg?: number
      lead_time_days?: number
      moq?: number
    }[]
    bank_account?: {
      bank_name?: string
      account_number?: string
      account_holder_name?: string
    }
    cost_inclusions?: {
      mobilisasi_demobilisasi?: boolean
      penginapan_tukang?: boolean
      biaya_pengiriman?: boolean
      biaya_langsir?: boolean
      instalasi?: boolean
      ppn?: boolean
    }
    additional_costs?: {
      description?: string
      amount?: number
      unit?: string
    }[]
  }
}

function extractDraftData(raw: { draft_data: Json } | null): DraftData | null {
  if (!raw?.draft_data || typeof raw.draft_data !== "object") return null
  return raw.draft_data as unknown as DraftData
}

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
  user_no_hp: string | null
  nama_perusahaan: string | null
  email_perusahaan: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  linkedin: string | null
  draft_data: DraftData | null
}

export async function getPendingVendorRegistrations() {
  const supabase = await createAdminClient()

  const { data: profiles, error } = await supabase
    .from("vendor_profiles")
    .select("*")
    .in("registration_status", ["submitted", "under_review"])
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
      .select("id, email, nama, nama_perusahaan, no_hp")
      .in("id", userIds),
    supabase
      .from("vendor_onboarding_drafts")
      .select("user_id, draft_data")
      .in("user_id", userIds),
  ])

  const userMap = new Map((usersResult.data || []).map((u) => [u.id, u]))
  const draftMap = new Map(
    (draftsResult.data || []).map((d) => [d.user_id, extractDraftData(d)])
  )

  return (profiles || []).map((profile) => {
    const user = userMap.get(profile.user_id)
    const draftData = draftMap.get(profile.user_id) || null
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
      user_no_hp: user?.no_hp || null,
      nama_perusahaan: profile.nama_perusahaan || null,
      email_perusahaan: profile.email_perusahaan || null,
      website: profile.website || null,
      instagram: profile.instagram || null,
      facebook: profile.facebook || null,
      linkedin: profile.linkedin || null,
      draft_data: draftData,
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
      .select("id, email, nama, nama_perusahaan, no_hp")
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

  const draftData = drafts.data ? extractDraftData(drafts.data) : null

  const areas = deliveryAreas.data || []
  const provinceIds = [
    ...new Set(areas.map((a) => a.province_id).filter(Boolean)),
  ]
  const cityIds = [...new Set(areas.map((a) => a.city_id).filter(Boolean))]

  const [{ data: provinces }, { data: cities }] = await Promise.all([
    provinceIds.length > 0
      ? supabase
          .from("master_provinces")
          .select("id, name")
          .in("id", provinceIds)
      : Promise.resolve({ data: [] }),
    cityIds.length > 0
      ? supabase
          .from("master_cities")
          .select("id, name, province_id")
          .in("id", cityIds)
      : Promise.resolve({ data: [] }),
  ])

  const provinceMap = new Map((provinces || []).map((p) => [p.id, p.name]))
  const cityMap = new Map((cities || []).map((c) => [c.id, c.name]))

  const enrichedDeliveryAreas = areas.map((area) => ({
    ...area,
    province_name: area.province_id
      ? provinceMap.get(area.province_id) || null
      : null,
    city_name: area.city_id ? cityMap.get(area.city_id) || null : null,
  }))

  const dbContacts = contacts.data || []
  const dbBankAccounts = bankAccounts.data || []
  const dbFactoryAddresses = factoryAddresses.data || []
  const dbProducts = products.data || []
  const dbCostInclusions = costInclusions.data || []
  const dbAdditionalCosts = additionalCosts.data || []

  const contactsFallback =
    dbContacts.length > 0
      ? dbContacts
      : (draftData?.company_info?.contacts || []).map((c, i) => ({
          id: `draft-contact-${i}`,
          user_id: userId,
          sequence: c.sequence,
          nama: c.nama,
          no_hp: c.no_hp,
          jabatan: c.jabatan,
          is_primary: c.sequence === 1 ? true : null,
          created_at: null,
          updated_at: null,
        }))

  const bankAccountsFallback =
    dbBankAccounts.length > 0
      ? dbBankAccounts
      : draftData?.operational?.bank_account
        ? [
            {
              id: "draft-bank",
              user_id: userId,
              bank_name: draftData.operational.bank_account.bank_name || "",
              account_number:
                draftData.operational.bank_account.account_number || "",
              account_holder_name:
                draftData.operational.bank_account.account_holder_name || "",
              is_primary: true,
              created_at: null,
              updated_at: null,
            },
          ]
        : []

  const factoryAddressesFallback =
    dbFactoryAddresses.length > 0
      ? dbFactoryAddresses
      : draftData?.operational?.factory_address
        ? [
            {
              id: "draft-factory",
              user_id: userId,
              address: draftData.operational.factory_address.address || "",
              province: draftData.operational.factory_address.province || "",
              kabupaten: draftData.operational.factory_address.kabupaten || "",
              kecamatan: draftData.operational.factory_address.kecamatan || "",
              postal_code:
                draftData.operational.factory_address.postal_code || "",
              is_primary: true,
              latitude: null,
              longitude: null,
              map_url: null,
              created_at: null,
              updated_at: null,
            },
          ]
        : []

  const productsFallback =
    dbProducts.length > 0
      ? dbProducts
      : (draftData?.operational?.products || []).map((p, i) => ({
          id: `draft-product-${i}`,
          user_id: userId,
          name: p.name || "",
          satuan: p.satuan || "",
          price: p.price || 0,
          dimensions: p.dimensions || "",
          material: p.material || "",
          finishing: p.finishing || "",
          weight_kg: p.weight_kg || null,
          lead_time_days: p.lead_time_days || null,
          moq: p.moq || null,
          description: null,
          is_active: null,
          created_at: null,
          updated_at: null,
        }))

  const deliveryAreasFallback =
    enrichedDeliveryAreas.length > 0
      ? enrichedDeliveryAreas
      : (draftData?.operational?.delivery_areas || []).map((a, i) => ({
          id: `draft-area-${i}`,
          user_id: userId,
          province_id: a.province_id || "",
          city_id: a.city_id || "",
          province_name: a.province_name || null,
          city_name: a.city_name || null,
          created_at: null,
        }))

  const costInclusionsFallback =
    dbCostInclusions.length > 0
      ? dbCostInclusions
      : Object.entries(draftData?.operational?.cost_inclusions || {})
          .filter(([, value]) => value === true)
          .map(([key], i) => ({
            id: `draft-cost-${i}`,
            user_id: userId,
            inclusion_type: key,
            is_included: true,
            notes: null,
            created_at: null,
          }))

  const additionalCostsFallback =
    dbAdditionalCosts.length > 0
      ? dbAdditionalCosts
      : (draftData?.operational?.additional_costs || []).map((c, i) => ({
          id: `draft-addcost-${i}`,
          user_id: userId,
          description: c.description || "",
          amount: c.amount || 0,
          unit: c.unit || "",
          created_at: null,
          updated_at: null,
        }))

  return {
    profile: {
      ...profile,
      user_email: userResult.data?.email || null,
      user_nama: userResult.data?.nama || null,
      user_no_hp: userResult.data?.no_hp || null,
    },
    draft_data: draftData,
    documents: documents.data || [],
    contacts: contactsFallback,
    bank_accounts: bankAccountsFallback,
    factory_addresses: factoryAddressesFallback,
    products: productsFallback,
    delivery_areas: deliveryAreasFallback,
    cost_inclusions: costInclusionsFallback,
    additional_costs: additionalCostsFallback,
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

export type VendorProductDetail = {
  id: string
  user_id: string
  name: string
  material: string | null
  dimensions: string | null
  finishing: string | null
  weight_kg: number | null
  moq: number | null
  lead_time_days: number | null
  description: string | null
  price: number
  satuan: string
  is_active: boolean | null
  kategori: string | null
  created_at: string | null
  updated_at: string | null
  vendor: {
    user_id: string
    nama_perusahaan: string | null
    email_perusahaan: string | null
    status: string | null
    user_nama: string | null
    user_no_hp: string | null
    user_email: string | null
  } | null
}

export async function getProductById(productId: string) {
  const supabase = await createAdminClient()

  const { data: product, error } = await supabase
    .from("vendor_products")
    .select("*")
    .eq("id", productId)
    .single()

  if (error || !product) {
    console.error("Error fetching product:", error)
    return null
  }

  return product
}

export async function getProductWithVendor(productId: string) {
  const supabase = await createAdminClient()

  const product = await getProductById(productId)
  if (!product) return null

  const { data: profile, error: profileError } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("user_id", product.user_id)
    .single()

  if (profileError || !profile) {
    return {
      ...product,
      vendor: null,
    }
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, nama, no_hp")
    .eq("id", product.user_id)
    .single()

  return {
    ...product,
    vendor:
      userError || !user
        ? {
            user_id: profile.user_id,
            nama_perusahaan: profile.nama_perusahaan,
            email_perusahaan: profile.email_perusahaan,
            status: profile.status,
            user_nama: null,
            user_no_hp: null,
            user_email: null,
          }
        : {
            user_id: profile.user_id,
            nama_perusahaan: profile.nama_perusahaan,
            email_perusahaan: profile.email_perusahaan,
            status: profile.status,
            user_nama: user.nama,
            user_no_hp: user.no_hp,
            user_email: user.email,
          },
  }
}

export async function getVendorProducts(userId: string) {
  const supabase = await createAdminClient()

  const { data: products, error } = await supabase
    .from("vendor_products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching vendor products:", error)
    return []
  }

  return products || []
}
