import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import {
  PROJECT_ATTACHMENT_BUCKET,
  type ProjectAttachmentMetadata,
  type ProjectCreateInput,
  type ProjectMilestoneInput,
  type ProjectMilestoneUpdateInput,
  type ProjectStatusInput,
  type ProjectUpdateInput,
} from "@/lib/validations/project"
import type { Database, Json, TablesInsert, TablesUpdate } from "@/types/database.types"

import type {
  ProjectAttachment,
  ProjectDetail,
  ProjectListFilters,
  ProjectListItem,
  ProjectMilestone,
  ProjectStatus,
  ProjectSummary,
} from "./types"

type PostgrestLikeError = {
  code?: string
  message?: string
}

type ProjectDetailBaseRow = {
  id: string
  name: string
  location: string | null
  status: Database["public"]["Enums"]["project_status"] | null
  start_date: string | null
  end_date: string | null
  description: string | null
  customer_name: string | null
  client_id: string | null
  client_profile_id: string | null
  contract_value: number
  site_address_full: string | null
  province_id: string | null
  city_id: string | null
  site_coordinates: string | null
  job_type: string | null
  estimated_length_or_area: number | null
  measurement_unit: string | null
  target_completion_date: string | null
  budget_min: number | null
  budget_max: number | null
  initial_description: string | null
  site_condition: string | null
  vehicle_access: string | null
  special_requirements: string | null
  estimated_height: string | null
  foundation_preference: string | null
  internal_notes: string | null
  qualification_status: string | null
  qualification_notes: string | null
  created_at: string | null
  updated_at: string | null
  attachments?: Json | null
}

const PROJECT_STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ["open", "cancelled"],
  open: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
}

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function normalizeProjectStatus(status: Database["public"]["Enums"]["project_status"] | null) {
  return status ?? "draft"
}

function normalizeMilestoneStatus(
  status: Database["public"]["Enums"]["milestone_status"] | null
) {
  return status ?? "pending"
}

function parseContractValue(value: string | null | undefined) {
  if (!value) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseOptionalNumber(value: string | null | undefined) {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parseAttachments(value: Json | null) {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is ProjectAttachmentMetadata => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false

    return (
      typeof item.bucket === "string" &&
      typeof item.path === "string" &&
      typeof item.file_name === "string" &&
      typeof item.file_size === "number" &&
      typeof item.mime_type === "string" &&
      typeof item.uploaded_at === "string"
    )
  })
}

function isMissingAttachmentsColumn(error: PostgrestLikeError | null | undefined) {
  return (
    error?.code === "PGRST204" &&
    error.message?.includes("'attachments'") &&
    error.message?.includes("'projects'")
  )
}

async function getProjectDetailBaseRow(adminClient: ReturnType<typeof createAdminClient>, id: string) {
  const result = await adminClient.from("projects").select("*").eq("id", id).maybeSingle()

  if (result.error) {
    return { data: null, error: result.error }
  }

  const row = result.data as Record<string, unknown> | null
  if (!row) {
    return { data: null, missingAttachments: true }
  }

  return {
    data: {
      id: String(row.id ?? ""),
      name: String(row.name ?? ""),
      location: typeof row.location === "string" ? row.location : null,
      status:
        typeof row.status === "string"
          ? (row.status as Database["public"]["Enums"]["project_status"])
          : null,
      start_date: typeof row.start_date === "string" ? row.start_date : null,
      end_date: typeof row.end_date === "string" ? row.end_date : null,
      description: typeof row.description === "string" ? row.description : null,
      customer_name:
        typeof row.customer_name === "string" ? row.customer_name : null,
      client_id: typeof row.client_id === "string" ? row.client_id : null,
      client_profile_id:
        typeof row.client_profile_id === "string" ? row.client_profile_id : null,
      contract_value:
        typeof row.contract_value === "number"
          ? row.contract_value
          : Number(row.contract_value ?? 0),
      site_address_full:
        typeof row.site_address_full === "string" ? row.site_address_full : null,
      province_id: typeof row.province_id === "string" ? row.province_id : null,
      city_id: typeof row.city_id === "string" ? row.city_id : null,
      site_coordinates:
        typeof row.site_coordinates === "string" ? row.site_coordinates : null,
      job_type: typeof row.job_type === "string" ? row.job_type : null,
      estimated_length_or_area:
        typeof row.estimated_length_or_area === "number"
          ? row.estimated_length_or_area
          : row.estimated_length_or_area != null
            ? Number(row.estimated_length_or_area)
            : null,
      measurement_unit:
        typeof row.measurement_unit === "string" ? row.measurement_unit : null,
      target_completion_date:
        typeof row.target_completion_date === "string" ? row.target_completion_date : null,
      budget_min:
        typeof row.budget_min === "number"
          ? row.budget_min
          : row.budget_min != null
            ? Number(row.budget_min)
            : null,
      budget_max:
        typeof row.budget_max === "number"
          ? row.budget_max
          : row.budget_max != null
            ? Number(row.budget_max)
            : null,
      initial_description:
        typeof row.initial_description === "string" ? row.initial_description : null,
      site_condition:
        typeof row.site_condition === "string" ? row.site_condition : null,
      vehicle_access:
        typeof row.vehicle_access === "string" ? row.vehicle_access : null,
      special_requirements:
        typeof row.special_requirements === "string" ? row.special_requirements : null,
      estimated_height:
        typeof row.estimated_height === "string" ? row.estimated_height : null,
      foundation_preference:
        typeof row.foundation_preference === "string"
          ? row.foundation_preference
          : null,
      internal_notes:
        typeof row.internal_notes === "string" ? row.internal_notes : null,
      qualification_status:
        typeof row.qualification_status === "string"
          ? row.qualification_status
          : null,
      qualification_notes:
        typeof row.qualification_notes === "string"
          ? row.qualification_notes
          : null,
      created_at: typeof row.created_at === "string" ? row.created_at : null,
      updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
      attachments: (row.attachments as Json | null | undefined) ?? null,
    } satisfies ProjectDetailBaseRow,
    missingAttachments: !("attachments" in row),
  }
}

async function withDownloadUrls(attachments: ProjectAttachmentMetadata[]) {
  const adminClient = createAdminClient()

  const signedUrls = await Promise.all(
    attachments.map(async (attachment) => {
      const { data } = await adminClient.storage
        .from(attachment.bucket)
        .createSignedUrl(attachment.path, 60 * 60)

      return data?.signedUrl ?? null
    })
  )

  return attachments.map<ProjectAttachment>((attachment, index) => ({
    ...attachment,
    download_url: signedUrls[index],
  }))
}

async function getCurrentInternalAdminUserId() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.stakeholder_type !== "internal") return null
  return user.id
}

async function cleanupUploadedFiles(paths: string[]) {
  if (paths.length === 0) return

  const adminClient = createAdminClient()
  const { error } = await adminClient.storage
    .from(PROJECT_ATTACHMENT_BUCKET)
    .remove(paths)

  if (error) {
    console.error("Project attachment cleanup failed:", error)
  }
}

async function getProjectAttachments(projectId: string) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from("projects")
    .select("attachments")
    .eq("id", projectId)
    .maybeSingle()

  if (isMissingAttachmentsColumn(error)) {
    return []
  }

  if (error) {
    throw new Error("Gagal membaca lampiran project")
  }

  return parseAttachments(data?.attachments ?? null)
}

async function ensureProjectExists(projectId: string) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from("projects")
    .select("id, name, status")
    .eq("id", projectId)
    .maybeSingle()

  if (error) {
    throw new Error("Gagal membaca project")
  }

  return data
    ? {
        id: data.id,
        name: data.name,
        status: normalizeProjectStatus(data.status),
      }
    : null
}

export function getAllowedProjectStatusTransitions(status: ProjectStatus) {
  return PROJECT_STATUS_TRANSITIONS[status]
}

export async function getProjectList(filters: ProjectListFilters = {}) {
  const adminClient = createAdminClient()
  let query = adminClient
    .from("projects")
    .select("id, name, location, status, start_date, end_date, created_at, updated_at")
    .order("created_at", { ascending: false })

  const search = filters.search?.trim()
  if (search) {
    const escaped = search.replace(/,/g, " ")
    query = query.or(`name.ilike.%${escaped}%,location.ilike.%${escaped}%`)
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error("Gagal memuat daftar project")
  }

  return (data ?? []).map<ProjectListItem>((project) => ({
    ...project,
    status: normalizeProjectStatus(project.status),
  }))
}

export async function getProjectSummary() {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from("projects").select("status")

  if (error) {
    throw new Error("Gagal memuat ringkasan project")
  }

  return (data ?? []).reduce<ProjectSummary>(
    (summary, item) => {
      const status = normalizeProjectStatus(item.status)
      summary.total += 1
      summary[status] += 1
      return summary
    },
    {
      total: 0,
      draft: 0,
      open: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    }
  )
}

export async function getProjectDetail(id: string): Promise<ProjectDetail | null> {
  const adminClient = createAdminClient()
  const [projectResult, { data: milestones, error: milestoneError }] = await Promise.all([
    getProjectDetailBaseRow(adminClient, id),
    adminClient
      .from("project_milestones")
      .select(
        "id, project_id, title, description, due_date, status, created_at, updated_at, completed_at"
      )
      .eq("project_id", id)
      .order("due_date", { ascending: true }),
  ])

  if (milestoneError) {
    throw new Error("Gagal memuat milestone project")
  }

  if (projectResult.error) {
    throw new Error("Gagal memuat detail project")
  }

  const project = projectResult.data

  if (!project) return null

  const attachments = projectResult.missingAttachments
    ? []
    : await withDownloadUrls(parseAttachments(project.attachments ?? null))

  return {
    ...project,
    status: normalizeProjectStatus(project.status),
    attachments,
    milestones: (milestones ?? []).map<ProjectMilestone>((milestone) => ({
      ...milestone,
      status: normalizeMilestoneStatus(milestone.status),
    })),
  }
}

export async function createProject(input: ProjectCreateInput) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const payload: TablesInsert<"projects"> = {
    name: input.name,
    location: input.location,
    start_date: input.start_date || null,
    end_date: input.end_date || null,
    description: input.description || null,
    customer_name: input.customer_name,
    client_id: null,
    client_profile_id: input.client_profile_id || null,
    contract_value: parseContractValue(input.contract_value),
    site_address_full: input.site_address_full || null,
    province_id: input.province_id || null,
    city_id: input.city_id || null,
    site_coordinates: input.site_coordinates || null,
    job_type: input.job_type || null,
    estimated_length_or_area: parseOptionalNumber(input.estimated_length_or_area),
    measurement_unit: input.measurement_unit || null,
    estimated_height: input.estimated_height || null,
    target_completion_date: input.target_completion_date || null,
    budget_min: parseOptionalNumber(input.budget_min),
    budget_max: parseOptionalNumber(input.budget_max),
    initial_description: input.initial_description || null,
    site_condition: input.site_condition || null,
    vehicle_access: input.vehicle_access || null,
    foundation_preference: input.foundation_preference || null,
    special_requirements: input.special_requirements || null,
    qualification_status: input.qualification_status || null,
    qualification_notes: input.qualification_notes || null,
    internal_notes: input.internal_notes || null,
    status: "draft",
  }

  const adminClient = createAdminClient()
  const { data: project, error } = await adminClient
    .from("projects")
    .insert(payload)
    .select("id")
    .single()

  if (error) {
    console.error("Project insert failed:", error)
    return { success: false as const, error: "Gagal menyimpan project ke database" }
  }

  return { success: true as const, projectId: project.id, adminUserId }
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const payload: TablesUpdate<"projects"> = {}

  if (typeof input.name === "string") payload.name = input.name
  if (typeof input.location === "string") payload.location = input.location
  if (typeof input.start_date === "string") payload.start_date = input.start_date || null
  if (typeof input.end_date === "string") payload.end_date = input.end_date || null
  if (typeof input.description === "string") payload.description = input.description || null
  if (typeof input.customer_name === "string") {
    payload.customer_name = input.customer_name
  }
  if (typeof input.contract_value === "string") {
    payload.contract_value = parseContractValue(input.contract_value)
  }
  if (typeof input.client_profile_id === "string") {
    payload.client_profile_id = input.client_profile_id || null
  }
  if (typeof input.site_address_full === "string") {
    payload.site_address_full = input.site_address_full || null
  }
  if (typeof input.province_id === "string") payload.province_id = input.province_id || null
  if (typeof input.city_id === "string") payload.city_id = input.city_id || null
  if (typeof input.site_coordinates === "string") {
    payload.site_coordinates = input.site_coordinates || null
  }
  if (typeof input.job_type === "string") payload.job_type = input.job_type || null
  if (typeof input.estimated_length_or_area === "string") {
    payload.estimated_length_or_area = parseOptionalNumber(input.estimated_length_or_area)
  }
  if (typeof input.measurement_unit === "string") {
    payload.measurement_unit = input.measurement_unit || null
  }
  if (typeof input.estimated_height === "string") {
    payload.estimated_height = input.estimated_height || null
  }
  if (typeof input.target_completion_date === "string") {
    payload.target_completion_date = input.target_completion_date || null
  }
  if (typeof input.budget_min === "string") {
    payload.budget_min = parseOptionalNumber(input.budget_min)
  }
  if (typeof input.budget_max === "string") {
    payload.budget_max = parseOptionalNumber(input.budget_max)
  }
  if (typeof input.initial_description === "string") {
    payload.initial_description = input.initial_description || null
  }
  if (typeof input.site_condition === "string") payload.site_condition = input.site_condition || null
  if (typeof input.vehicle_access === "string") payload.vehicle_access = input.vehicle_access || null
  if (typeof input.foundation_preference === "string") {
    payload.foundation_preference = input.foundation_preference || null
  }
  if (typeof input.special_requirements === "string") {
    payload.special_requirements = input.special_requirements || null
  }
  if (typeof input.qualification_status === "string") {
    payload.qualification_status = input.qualification_status || null
  }
  if (typeof input.qualification_notes === "string") {
    payload.qualification_notes = input.qualification_notes || null
  }
  if (typeof input.internal_notes === "string") {
    payload.internal_notes = input.internal_notes || null
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient.from("projects").update(payload).eq("id", id)

  if (error) {
    console.error("Project update failed:", error)
    return { success: false as const, error: "Gagal memperbarui project" }
  }

  return { success: true as const }
}

export async function updateProjectStatus(id: string, newStatus: ProjectStatusInput) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const project = await ensureProjectExists(id)
  if (!project) {
    return { success: false as const, error: "Project tidak ditemukan" }
  }

  const allowed = getAllowedProjectStatusTransitions(project.status)
  if (!allowed.includes(newStatus)) {
    return {
      success: false as const,
      error: `Transisi status dari ${project.status} ke ${newStatus} tidak diizinkan`,
    }
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from("projects")
    .update({ status: newStatus })
    .eq("id", id)

  if (error) {
    console.error("Project status update failed:", error)
    return { success: false as const, error: "Gagal memperbarui status project" }
  }

  return { success: true as const }
}

export async function addProjectAttachments(projectId: string, files: File[]) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const project = await ensureProjectExists(projectId)
  if (!project) {
    return { success: false as const, error: "Project tidak ditemukan" }
  }

  const adminClient = createAdminClient()
  const currentAttachments = await getProjectAttachments(projectId)
  const uploadedPaths: string[] = []
  const attachments: ProjectAttachmentMetadata[] = []
  const projectSlug = sanitizeSegment(project.name) || "project"

  for (const file of files) {
    const safeFileName = sanitizeSegment(file.name.replace(/\.[^.]+$/, ""))
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin"
    const filePath = `${adminUserId}/${projectSlug}/${Date.now()}-${crypto.randomUUID()}-${safeFileName || "attachment"}.${extension}`

    const { error } = await adminClient.storage
      .from(PROJECT_ATTACHMENT_BUCKET)
      .upload(filePath, await file.arrayBuffer(), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      })

    if (error) {
      console.error("Project attachment upload failed:", error)
      await cleanupUploadedFiles(uploadedPaths)
      return { success: false as const, error: `Gagal upload file ${file.name}` }
    }

    uploadedPaths.push(filePath)
    attachments.push({
      bucket: PROJECT_ATTACHMENT_BUCKET,
      path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || "application/octet-stream",
      uploaded_at: new Date().toISOString(),
    })
  }

  const nextAttachments = [...currentAttachments, ...attachments]
  const { error } = await adminClient
    .from("projects")
    .update({ attachments: nextAttachments as unknown as Json })
    .eq("id", projectId)

  if (isMissingAttachmentsColumn(error)) {
    await cleanupUploadedFiles(uploadedPaths)
    return {
      success: false as const,
      error: "Kolom lampiran project belum tersedia di database",
    }
  }

  if (error) {
    console.error("Project attachment metadata update failed:", error)
    await cleanupUploadedFiles(uploadedPaths)
    return { success: false as const, error: "Gagal menyimpan metadata lampiran" }
  }

  return {
    success: true as const,
    attachments: await withDownloadUrls(nextAttachments),
  }
}

export async function deleteProjectAttachment(projectId: string, attachmentPath: string) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const adminClient = createAdminClient()
  const currentAttachments = await getProjectAttachments(projectId)
  const target = currentAttachments.find((attachment) => attachment.path === attachmentPath)

  if (!target) {
    return { success: false as const, error: "Lampiran tidak ditemukan" }
  }

  const { error: storageError } = await adminClient.storage
    .from(target.bucket)
    .remove([target.path])

  if (storageError) {
    console.error("Project attachment delete failed:", storageError)
    return { success: false as const, error: "Gagal menghapus file lampiran" }
  }

  const nextAttachments = currentAttachments.filter(
    (attachment) => attachment.path !== attachmentPath
  )
  const { error } = await adminClient
    .from("projects")
    .update({
      attachments:
        nextAttachments.length > 0 ? (nextAttachments as unknown as Json) : null,
    })
    .eq("id", projectId)

  if (isMissingAttachmentsColumn(error)) {
    return {
      success: false as const,
      error: "Kolom lampiran project belum tersedia di database",
    }
  }

  if (error) {
    console.error("Project attachment metadata delete failed:", error)
    return { success: false as const, error: "Gagal memperbarui metadata lampiran" }
  }

  return {
    success: true as const,
    attachments: await withDownloadUrls(nextAttachments),
  }
}

export async function createProjectMilestone(projectId: string, input: ProjectMilestoneInput) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const project = await ensureProjectExists(projectId)
  if (!project) {
    return { success: false as const, error: "Project tidak ditemukan" }
  }

  const payload: TablesInsert<"project_milestones"> = {
    project_id: projectId,
    title: input.title,
    description: input.description || null,
    due_date: input.due_date,
    status: input.status,
    created_by: adminUserId,
    completed_at: input.status === "completed" ? new Date().toISOString() : null,
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from("project_milestones")
    .insert(payload)
    .select(
      "id, project_id, title, description, due_date, status, created_at, updated_at, completed_at"
    )
    .single()

  if (error) {
    console.error("Project milestone create failed:", error)
    return { success: false as const, error: "Gagal menambah milestone" }
  }

  return {
    success: true as const,
    milestone: {
      ...data,
      status: normalizeMilestoneStatus(data.status),
    },
  }
}

export async function updateProjectMilestone(
  milestoneId: string,
  input: ProjectMilestoneUpdateInput
) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const payload: TablesUpdate<"project_milestones"> = {}

  if (typeof input.title === "string") payload.title = input.title
  if (typeof input.description === "string") payload.description = input.description || null
  if (typeof input.due_date === "string") payload.due_date = input.due_date
  if (typeof input.status === "string") {
    payload.status = input.status
    payload.completed_at = input.status === "completed" ? new Date().toISOString() : null
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from("project_milestones")
    .update(payload)
    .eq("id", milestoneId)
    .select(
      "id, project_id, title, description, due_date, status, created_at, updated_at, completed_at"
    )
    .single()

  if (error) {
    console.error("Project milestone update failed:", error)
    return { success: false as const, error: "Gagal memperbarui milestone" }
  }

  return {
    success: true as const,
    milestone: {
      ...data,
      status: normalizeMilestoneStatus(data.status),
    },
  }
}

export async function deleteProjectMilestone(milestoneId: string) {
  const adminUserId = await getCurrentInternalAdminUserId()
  if (!adminUserId) {
    return { success: false as const, error: "Unauthorized" }
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient.from("project_milestones").delete().eq("id", milestoneId)

  if (error) {
    console.error("Project milestone delete failed:", error)
    return { success: false as const, error: "Gagal menghapus milestone" }
  }

  return { success: true as const }
}

export async function listProvinceOptions() {
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

export async function listCityOptions() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("master_cities")
    .select("id, name, province_id")
    .order("name")

  if (error) {
    throw new Error("Gagal memuat daftar kota")
  }

  return data ?? []
}
