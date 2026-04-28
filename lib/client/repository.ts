import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { TablesInsert } from "@/types/database.types"
import type {
  ClientProfileInput,
  ClientProjectIntakeInput,
} from "@/lib/validations/client"

import type {
  ClientAccountSummary,
  ClientProfileRecord,
  ClientProfileView,
  ClientProjectListItem,
} from "./types"

function parseNumericString(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseOptionalNumericString(value: string | null | undefined) {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

async function getCurrentClientActor() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("users")
    .select("id, nama, nama_perusahaan, email, no_hp, stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile || profile.stakeholder_type !== "client") return null

  return {
    id: profile.id,
    account: {
      user_id: profile.id,
      nama: profile.nama,
      nama_perusahaan: profile.nama_perusahaan,
      email: profile.email,
      no_hp: profile.no_hp,
    } satisfies ClientAccountSummary,
  }
}

export async function getClientProfileContext() {
  const actor = await getCurrentClientActor()
  if (!actor) return null

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("client_profiles")
    .select("*")
    .eq("user_id", actor.id)
    .maybeSingle()

  let provinceName: string | null = null
  let cityName: string | null = null

  if (profile?.province_id) {
    const { data } = await admin
      .from("master_provinces")
      .select("name")
      .eq("id", profile.province_id)
      .maybeSingle()
    provinceName = data?.name ?? null
  }

  if (profile?.city_id) {
    const { data } = await admin
      .from("master_cities")
      .select("name")
      .eq("id", profile.city_id)
      .maybeSingle()
    cityName = data?.name ?? null
  }

  return {
    account: actor.account,
    profile: profile
      ? ({
          ...(profile as ClientProfileRecord),
          province_name: provinceName,
          city_name: cityName,
        } satisfies ClientProfileView)
      : null,
  }
}

export async function upsertClientProfile(input: ClientProfileInput) {
  const actor = await getCurrentClientActor()
  if (!actor) {
    return { success: false as const, error: "Unauthorized" }
  }

  const admin = createAdminClient()
  const payload: TablesInsert<"client_profiles"> = {
    user_id: actor.id,
    client_type: input.client_type,
    company_name_legal: input.company_name_legal || actor.account.nama_perusahaan || null,
    pic_name: input.pic_name,
    pic_position: input.pic_position || null,
    office_address: input.office_address,
    province_id: input.province_id,
    city_id: input.city_id,
    verification_status: "pending",
  }

  const { error } = await admin.from("client_profiles").upsert(payload, {
    onConflict: "user_id",
  })

  if (error) {
    console.error("Client profile upsert failed:", error)
    return { success: false as const, error: "Gagal menyimpan profil client" }
  }

  return { success: true as const }
}

export async function listClientProjects() {
  const actor = await getCurrentClientActor()
  if (!actor) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("projects")
    .select("id, name, status, location, created_at, updated_at, job_type")
    .eq("client_id", actor.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Gagal memuat daftar project client")
  }

  return {
    account: actor.account,
    projects: (data ?? []) as ClientProjectListItem[],
  }
}

export async function getClientProjectDetail(projectId: string) {
  const actor = await getCurrentClientActor()
  if (!actor) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("client_id", actor.id)
    .maybeSingle()

  if (error) {
    throw new Error("Gagal memuat detail project client")
  }

  return data
}

export async function createClientProject(input: ClientProjectIntakeInput) {
  const actor = await getCurrentClientActor()
  if (!actor) {
    return { success: false as const, error: "Unauthorized" }
  }

  const admin = createAdminClient()

  const [{ data: province }, { data: city }, { data: clientProfile }] = await Promise.all([
    admin.from("master_provinces").select("name").eq("id", input.province_id).maybeSingle(),
    admin.from("master_cities").select("name").eq("id", input.city_id).maybeSingle(),
    admin.from("client_profiles").select("company_name_legal").eq("user_id", actor.id).maybeSingle(),
  ])

  const locationSummary = [city?.name, province?.name].filter(Boolean).join(", ") || input.site_address_full
  const customerName =
    clientProfile?.company_name_legal || actor.account.nama_perusahaan || actor.account.nama

  const payload: TablesInsert<"projects"> = {
    name: input.project_title,
    location: locationSummary,
    site_address_full: input.site_address_full,
    province_id: input.province_id,
    city_id: input.city_id,
    site_coordinates: input.site_coordinates || null,
    job_type: input.job_type,
    estimated_length_or_area: parseNumericString(input.estimated_length_or_area),
    measurement_unit: input.measurement_unit,
    target_completion_date: input.target_completion_date,
    budget_min: parseOptionalNumericString(input.budget_min),
    budget_max: parseOptionalNumericString(input.budget_max),
    initial_description: input.initial_description,
    site_condition: input.site_condition || null,
    vehicle_access: input.vehicle_access || null,
    special_requirements: input.special_requirements || null,
    estimated_height: input.estimated_height || null,
    foundation_preference: input.foundation_preference || null,
    customer_name: customerName,
    client_id: actor.id,
    description: input.initial_description,
    contract_value: 0,
    status: "draft",
  }

  const { data, error } = await admin
    .from("projects")
    .insert(payload)
    .select("id")
    .single()

  if (error) {
    console.error("Client project create failed:", error)
    return { success: false as const, error: "Gagal menyimpan project client" }
  }

  return { success: true as const, projectId: data.id }
}

export { listProvinceOptions, listCityOptions } from "@/lib/projects/repository"

export type { ClientProfileRecord, ClientProfileView, ClientProjectListItem } from "./types"

export async function listClientProvinceOptions() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("master_provinces")
    .select("id, name")
    .order("name")

  if (error) {
    throw new Error("Gagal memuat daftar provinsi")
  }

  return data ?? []
}

export async function listClients({
  search,
  verification_status,
  page = 1,
  limit = 20,
}: {
  search?: string
  verification_status?: string
  page?: number
  limit?: number
} = {}) {
  const admin = createAdminClient()

  let query = admin
    .from("client_profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(
      `client_name.ilike.%${search}%,company_name_legal.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    )
  }

  if (verification_status) {
    query = query.eq("verification_status", verification_status)
  }

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw new Error("Gagal memuat daftar client")
  }

  return {
    clients: (data ?? []) as ClientProfileRecord[],
    total: count ?? 0,
    page,
    limit,
  }
}

export async function getClientById(clientId: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("client_profiles")
    .select("*")
    .eq("id", clientId)
    .maybeSingle()

  if (error) {
    throw new Error("Gagal memuat detail client")
  }

  return data as ClientProfileRecord | null
}

export async function createClient(input: {
  client_name: string
  email: string
  phone: string
  client_type: string
  company_name_legal?: string | null
  pic_name: string
  pic_position?: string | null
  office_address: string
  province_id: string
  city_id: string
  notes?: string | null
}) {
  const admin = createAdminClient()

  const payload: TablesInsert<"client_profiles"> = {
    client_name: input.client_name,
    email: input.email,
    phone: input.phone,
    client_type: input.client_type as "individu" | "developer" | "kontraktor" | "perusahaan",
    company_name_legal: input.company_name_legal || null,
    pic_name: input.pic_name,
    pic_position: input.pic_position || null,
    office_address: input.office_address,
    province_id: input.province_id,
    city_id: input.city_id,
    notes: input.notes || null,
    verification_status: "pending",
  }

  const { data, error } = await admin
    .from("client_profiles")
    .insert(payload)
    .select("id")
    .single()

  if (error) {
    console.error("Client create failed:", error)
    return { success: false as const, error: "Gagal membuat client" }
  }

  return { success: true as const, clientId: data.id }
}

export async function updateClient(
  clientId: string,
  input: {
    client_name?: string
    email?: string
    phone?: string
    client_type?: string
    company_name_legal?: string | null
    pic_name?: string
    pic_position?: string | null
    office_address?: string
    province_id?: string
    city_id?: string
    notes?: string | null
    verification_status?: string
    verification_notes?: string | null
  }
) {
  const admin = createAdminClient()

  const { error } = await admin
    .from("client_profiles")
    .update(input)
    .eq("id", clientId)

  if (error) {
    console.error("Client update failed:", error)
    return { success: false as const, error: "Gagal update client" }
  }

  return { success: true as const }
}
