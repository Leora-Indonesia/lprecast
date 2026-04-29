"use server"

import { createClient } from "@/lib/supabase/server"
import type {
  OnboardingDraftData,
  RegistrationStatus,
  UserRegistrationData,
} from "./types"

type Province = {
  id: string
  name: string
}

type City = {
  id: string
  name: string
}

export async function getUserRegistrationData(): Promise<UserRegistrationData | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("nama, email, nama_perusahaan, no_hp")
    .eq("id", user.id)
    .single()

  if (error || !userData) {
    console.error("Error fetching user registration data:", error)
    return null
  }

  return {
    nama_perusahaan: userData.nama_perusahaan || "",
    nama_pic: userData.nama || "",
    email: userData.email || "",
    kontak_pic: userData.no_hp || undefined,
  }
}

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: "none", hasDraft: false, hasRegistration: false }
  }

  const [draftResult, profileResult] = await Promise.all([
    supabase
      .from("vendor_onboarding_drafts")
      .select("id")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("vendor_profiles")
      .select(
        "registration_status, status, approval_score, profile_completeness_pct"
      )
      .eq("user_id", user.id)
      .single(),
  ])

  const hasDraft = !draftResult.error && !!draftResult.data
  const hasRegistration = !profileResult.error && !!profileResult.data

  return {
    status: hasRegistration
      ? (profileResult.data!.status as RegistrationStatus["status"])
      : "none",
    registrationStatus: profileResult.data?.registration_status,
    profileStatus: profileResult.data?.status,
    approvalScore: profileResult.data?.approval_score ?? undefined,
    profileCompleteness:
      profileResult.data?.profile_completeness_pct ?? undefined,
    hasDraft,
    hasRegistration,
  }
}

export async function loadDraft(): Promise<{
  success: boolean
  data?: OnboardingDraftData | null
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("vendor_onboarding_drafts")
    .select("draft_data, current_step")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error loading draft:", error)
    return { success: false, error: error.message }
  }

  if (!data) {
    return { success: true, data: null }
  }

  try {
    const draftData = data.draft_data as OnboardingDraftData
    return {
      success: true,
      data: {
        ...draftData,
        currentStep: data.current_step,
      },
    }
  } catch {
    return { success: true, data: null }
  }
}

async function buildDraftFromVendorData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  userData: UserRegistrationData | null
): Promise<OnboardingDraftData | null> {
  const [
    { data: profile },
    { data: contacts },
    { data: documents },
    { data: factoryAddress },
    { data: bankAccount },
    { data: deliveryAreas },
    { data: products },
    { data: costInclusions },
    { data: additionalCosts },
  ] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select(
        "nama_perusahaan, email_perusahaan, website, instagram, facebook, linkedin"
      )
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("vendor_contacts")
      .select("sequence, nama, no_hp, jabatan")
      .eq("user_id", userId)
      .order("sequence", { ascending: true }),
    supabase
      .from("vendor_documents")
      .select("document_type, document_number, file_path")
      .eq("user_id", userId),
    supabase
      .from("vendor_factory_addresses")
      .select("address, province, kabupaten, kecamatan, postal_code")
      .eq("user_id", userId)
      .eq("is_primary", true)
      .maybeSingle(),
    supabase
      .from("vendor_bank_accounts")
      .select("bank_name, account_number, account_holder_name")
      .eq("user_id", userId)
      .eq("is_primary", true)
      .maybeSingle(),
    supabase
      .from("vendor_delivery_areas")
      .select("province_id, city_id")
      .eq("user_id", userId),
    supabase
      .from("vendor_products")
      .select(
        "name, satuan, price, dimensions, material, finishing, weight_kg, lead_time_days, moq"
      )
      .eq("user_id", userId),
    supabase
      .from("vendor_cost_inclusions")
      .select("inclusion_type, is_included")
      .eq("user_id", userId),
    supabase
      .from("vendor_additional_costs")
      .select("description, amount, unit")
      .eq("user_id", userId),
  ])

  const docByType = new Map<string, { file_path: string; document_number: string | null }>()
  ;(documents ?? []).forEach((d) => {
    if (d?.document_type && d.file_path) {
      docByType.set(d.document_type, {
        file_path: d.file_path,
        document_number: d.document_number ?? null,
      })
    }
  })

  const areaProvinceIds = Array.from(
    new Set((deliveryAreas ?? []).map((a) => a.province_id).filter(Boolean))
  ) as string[]
  const areaCityIds = Array.from(
    new Set((deliveryAreas ?? []).map((a) => a.city_id).filter(Boolean))
  ) as string[]

  const [{ data: provinces }, { data: cities }] = await Promise.all([
    areaProvinceIds.length
      ? supabase
          .from("master_provinces")
          .select("id, name")
          .in("id", areaProvinceIds)
      : Promise.resolve({ data: [] as Province[] }),
    areaCityIds.length
      ? supabase.from("master_cities").select("id, name").in("id", areaCityIds)
      : Promise.resolve({ data: [] as City[] }),
  ])

  const provinceById = new Map((provinces ?? []).map((p) => [p.id, p.name]))
  const cityById = new Map((cities ?? []).map((c) => [c.id, c.name]))

  const primaryContact = (contacts ?? []).find((c) => c.sequence === 1)

  const companyInfo = {
    nama_perusahaan: profile?.nama_perusahaan || userData?.nama_perusahaan || "",
    email: profile?.email_perusahaan || userData?.email || "",
    nama_pic: primaryContact?.nama || userData?.nama_pic || "",
    kontak_pic: primaryContact?.no_hp || userData?.kontak_pic || "",
    website: profile?.website || "",
    instagram: profile?.instagram || "",
    facebook: profile?.facebook || "",
    linkedin: profile?.linkedin || "",
    contacts: (contacts ?? [])
      .filter((c) => c.sequence >= 1 && c.sequence <= 3)
      .map((c) => ({
        sequence: c.sequence,
        nama: c.nama,
        no_hp: c.no_hp || "",
        jabatan: c.jabatan || "",
      })),
  }

  const costMap = new Map<string, boolean>()
  ;(costInclusions ?? []).forEach((c) => {
    if (c?.inclusion_type) {
      costMap.set(c.inclusion_type, !!c.is_included)
    }
  })

  return {
    currentStep: 1,
    company_info: companyInfo,
    documents: {
      ktp_path: docByType.get("ktp")?.file_path ?? null,
      ktp_number: docByType.get("ktp")?.document_number ?? null,
      npwp_path: docByType.get("npwp")?.file_path ?? null,
      npwp_number: docByType.get("npwp")?.document_number ?? null,
      nib_path: docByType.get("nib")?.file_path ?? null,
      nib_number: docByType.get("nib")?.document_number ?? null,
      siup_sbu_path: docByType.get("siup_sbu")?.file_path ?? null,
      company_profile_path: docByType.get("company_profile")?.file_path ?? null,
    },
    operational: {
      factory_address: {
        address: factoryAddress?.address || "",
        province: factoryAddress?.province || "",
        kabupaten: factoryAddress?.kabupaten || "",
        kecamatan: factoryAddress?.kecamatan || "",
        postal_code: factoryAddress?.postal_code || "",
      },
      delivery_areas: (deliveryAreas ?? [])
        .filter((a) => a.province_id && a.city_id)
        .map((a) => ({
          province_id: a.province_id as string,
          province_name: provinceById.get(a.province_id as string) || "",
          city_id: a.city_id as string,
          city_name: cityById.get(a.city_id as string) || "",
        })),
      products: (products ?? []).map((p) => ({
        name: p.name,
        satuan: p.satuan,
        price: p.price,
        dimensions: p.dimensions || "",
        material: p.material || "",
        finishing: p.finishing || "",
        weight_kg: p.weight_kg || 0,
        lead_time_days: p.lead_time_days || 0,
        moq: p.moq || 0,
      })),
      bank_account: {
        bank_name: bankAccount?.bank_name || "",
        account_number: bankAccount?.account_number || "",
        account_holder_name: bankAccount?.account_holder_name || "",
      },
      cost_inclusions: {
        mobilisasi_demobilisasi: costMap.get("mobilisasi_demobilisasi") || false,
        penginapan_tukang: costMap.get("penginapan_tukang") || false,
        biaya_pengiriman: costMap.get("biaya_pengiriman") || false,
        biaya_langsir: costMap.get("biaya_langsir") || false,
        instalasi: costMap.get("instalasi") || false,
        ppn: costMap.get("ppn") || false,
      },
      additional_costs: (additionalCosts ?? []).map((c) => ({
        description: c.description,
        amount: c.amount,
        unit: c.unit,
      })),
    },
  }
}

export async function loadDraftOrBuildFromVendorData(): Promise<{
  success: boolean
  data?: OnboardingDraftData | null
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const userData = await getUserRegistrationData()
  const draft = await loadDraft()
  if (draft.success && draft.data) {
    return draft
  }

  const built = await buildDraftFromVendorData(supabase, user.id, userData)
  return { success: true, data: built }
}

export async function getInitialOnboardingData() {
  const [status, userData, draft] = await Promise.all([
    getRegistrationStatus(),
    getUserRegistrationData(),
    loadDraftOrBuildFromVendorData(),
  ])

  return { status, userData, draft }
}
