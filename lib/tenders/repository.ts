import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { Database, TablesInsert } from "@/types/database.types"
import type { TenderPublishInput } from "@/lib/validations/tender"

import type { TenderDetail, TenderItem, VendorOpenTender, VendorTenderDetail } from "./types"

async function getCurrentInternalAdminUserId() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.stakeholder_type !== "internal") return null
  return user.id
}

async function getCurrentVendorUserId() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.stakeholder_type !== "vendor") return null
  return user.id
}

function parseOptionalNumber(value: string | null | undefined, fallback: number | null = null) {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseOptionalDateTime(value: string | null | undefined) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function normalizeTenderStatus(status: Database["public"]["Enums"]["tender_status"] | null) {
  return status ?? "open"
}

function isSubmissionDeadlinePassed(submissionDeadlineAt: string | null | undefined) {
  if (!submissionDeadlineAt) return false
  const deadline = new Date(submissionDeadlineAt)
  if (Number.isNaN(deadline.getTime())) return false
  return Date.now() > deadline.getTime()
}

export async function validateVendorTenderSubmission(tenderId: string) {
  const vendorUserId = await getCurrentVendorUserId()

  if (!vendorUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const adminClient = createAdminClient()
  const [{ data: tender, error: tenderError }, { data: existingSubmission, error: submissionError }] =
    await Promise.all([
      adminClient
        .from("tenders")
        .select("id, project_id, status, submission_deadline_at")
        .eq("id", tenderId)
        .maybeSingle(),
      adminClient
        .from("tender_submissions")
        .select("id")
        .eq("tender_id", tenderId)
        .eq("vendor_id", vendorUserId)
        .maybeSingle(),
    ])

  if (tenderError) {
    return { success: false as const, error: "Gagal membaca tender" }
  }

  if (submissionError) {
    return { success: false as const, error: "Gagal membaca status penawaran vendor" }
  }

  if (!tender) {
    return { success: false as const, error: "Tender tidak ditemukan" }
  }

  if (normalizeTenderStatus(tender.status) !== "open") {
    return { success: false as const, error: "Tender tidak tersedia untuk pengajuan penawaran" }
  }

  if (isSubmissionDeadlinePassed(tender.submission_deadline_at)) {
    return { success: false as const, error: "Batas waktu submit tender sudah lewat" }
  }

  if (existingSubmission) {
    return { success: false as const, error: "Vendor sudah pernah mengajukan penawaran untuk tender ini" }
  }

  return {
    success: true as const,
    tenderId: tender.id,
    projectId: tender.project_id,
    vendorUserId,
  }
}

export async function getActiveTenderForProject(projectId: string) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from("tenders")
    .select("id, status")
    .eq("project_id", projectId)
    .in("status", ["open", "awarded"])
    .maybeSingle()

  if (error) {
    throw new Error("Gagal membaca tender project")
  }

  return data
}

export async function publishTenderFromProject(projectId: string, input: TenderPublishInput) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const adminClient = createAdminClient()
  const { data: project, error: projectError } = await adminClient
    .from("projects")
    .select("id, status, name, location")
    .eq("id", projectId)
    .maybeSingle()

  if (projectError) {
    return { success: false as const, error: "Gagal membaca project" }
  }

  if (!project) {
    return { success: false as const, error: "Project tidak ditemukan" }
  }

  if (project.status !== "draft") {
    return { success: false as const, error: "Hanya project draft yang bisa diajukan ke tender" }
  }

  const existingTender = await getActiveTenderForProject(projectId)
  if (existingTender) {
    return { success: false as const, error: "Project sudah punya tender aktif" }
  }

  const tenderPayload: TablesInsert<"tenders"> = {
    title: input.title,
    description: input.description || null,
    project_id: projectId,
    status: "open",
    min_vendors: parseOptionalNumber(input.min_vendors, 2),
    submission_deadline_at: parseOptionalDateTime(input.submission_deadline_at),
    revision_deadline_hours: parseOptionalNumber(input.revision_deadline_hours),
    created_by: adminUserId,
  }

  const { data: tender, error: tenderError } = await adminClient
    .from("tenders")
    .insert(tenderPayload)
    .select("id")
    .single()

  if (tenderError) {
    console.error("Tender insert failed:", tenderError)
    return { success: false as const, error: "Gagal membuat tender" }
  }

  const itemPayloads: TablesInsert<"tender_items">[] = input.items.map((item) => ({
    tender_id: tender.id,
    name: item.name,
    quantity: Number(item.quantity),
    unit: item.unit,
    description: item.description || null,
  }))

  const { error: itemsError } = await adminClient.from("tender_items").insert(itemPayloads)
  if (itemsError) {
    console.error("Tender items insert failed:", itemsError)
    return { success: false as const, error: "Tender dibuat, tapi item pekerjaan gagal disimpan" }
  }

  const { error: statusError } = await adminClient
    .from("projects")
    .update({ status: "open" })
    .eq("id", projectId)

  if (statusError) {
    console.error("Project tender status update failed:", statusError)
    return { success: false as const, error: "Tender dibuat, tapi status project gagal diubah" }
  }

  return { success: true as const, tenderId: tender.id }
}

export async function getTenderDetail(id: string): Promise<TenderDetail | null> {
  const adminClient = createAdminClient()
  const [{ data: tender, error: tenderError }, { data: items, error: itemsError }] =
    await Promise.all([
      adminClient.from("tenders").select("*").eq("id", id).maybeSingle(),
      adminClient
        .from("tender_items")
        .select("id, tender_id, name, quantity, unit, description, created_at")
        .eq("tender_id", id)
        .order("created_at", { ascending: true }),
    ])

  if (tenderError) {
    throw new Error("Gagal membaca detail tender")
  }

  if (itemsError) {
    throw new Error("Gagal membaca item tender")
  }

  if (!tender) return null

  const { data: project, error: projectError } = await adminClient
    .from("projects")
    .select("id, name, location, status, start_date, end_date, description")
    .eq("id", tender.project_id)
    .maybeSingle()

  if (projectError) {
    throw new Error("Gagal membaca project tender")
  }

  return {
    ...tender,
    status: normalizeTenderStatus(tender.status),
    project,
    items: (items ?? []) as TenderItem[],
  }
}

export async function listVendorOpenTenders(): Promise<VendorOpenTender[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const [{ data: tenders, error: tenderError }, { data: submissions, error: submissionError }] =
    await Promise.all([
      supabase
        .from("vendor_open_tenders")
        .select("*")
        .order("tender_created_at", { ascending: false }),
      supabase
        .from("tender_submissions")
        .select("tender_id, status")
        .eq("vendor_id", user.id),
    ])

  if (tenderError) {
    throw new Error("Gagal memuat daftar tender")
  }

  if (submissionError) {
    throw new Error("Gagal memuat status penawaran")
  }

  const submissionByTender = new Map(
    (submissions ?? []).map((submission) => [submission.tender_id, submission.status])
  )

  return ((tenders ?? []) as VendorOpenTender[]).map((tender) => ({
    ...tender,
    has_submitted: submissionByTender.has(tender.tender_id),
    submission_status: submissionByTender.get(tender.tender_id) ?? null,
  }))
}

export async function getVendorOpenTenderDetail(id: string): Promise<VendorTenderDetail | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [tenderResult, itemsResult, submissionResult, tenderMetaResult] = await Promise.all([
    supabase.from("vendor_open_tenders").select("*").eq("tender_id", id).maybeSingle(),
    supabase
      .from("tender_items")
      .select("id, tender_id, name, quantity, unit, description, created_at")
      .eq("tender_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("tender_submissions")
      .select("status")
      .eq("tender_id", id)
      .eq("vendor_id", user.id)
      .maybeSingle(),
    supabase
      .from("tenders")
      .select("status, submission_deadline_at")
      .eq("id", id)
      .maybeSingle(),
  ])

  if (tenderResult.error) {
    throw new Error("Gagal memuat detail tender")
  }

  if (itemsResult.error) {
    throw new Error("Gagal memuat item tender")
  }

  if (submissionResult.error) {
    throw new Error("Gagal memuat status penawaran")
  }

  if (tenderMetaResult.error) {
    throw new Error("Gagal memuat deadline tender")
  }

  if (!tenderResult.data) return null

  return {
    ...(tenderResult.data as VendorOpenTender),
    tender_status: tenderMetaResult.data?.status ?? tenderResult.data.tender_status,
    submission_deadline_at: tenderMetaResult.data?.submission_deadline_at ?? null,
    has_submitted: Boolean(submissionResult.data),
    submission_status: submissionResult.data?.status ?? null,
    items: (itemsResult.data ?? []) as TenderItem[],
  }
}
