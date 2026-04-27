import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import {
  PROJECT_ATTACHMENT_BUCKET,
  projectCreateSchema,
  type ProjectAttachmentMetadata,
} from "@/lib/validations/project"
import type { Database, Json } from "@/types/database.types"

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

async function getInternalAdminUserId() {
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

async function uploadProjectAttachments(
  adminUserId: string,
  projectName: string,
  files: File[]
) {
  const adminClient = createAdminClient()
  const uploadedPaths: string[] = []
  const attachments: ProjectAttachmentMetadata[] = []
  const projectSlug = sanitizeSegment(projectName) || "project"

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
      return {
        success: false as const,
        error: `Gagal upload file ${file.name}`,
      }
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

  return {
    success: true as const,
    attachments,
    uploadedPaths,
  }
}

export async function POST(request: Request) {
  const adminUserId = await getInternalAdminUserId()

  if (!adminUserId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const formData = await request.formData()
  const parsed = projectCreateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    description: String(formData.get("description") ?? ""),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      {
        success: false,
        error: firstError?.message || "Data project tidak valid",
      },
      { status: 400 }
    )
  }

  const files = formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0)

  const uploadResult = await uploadProjectAttachments(
    adminUserId,
    parsed.data.name,
    files
  )

  if (!uploadResult.success) {
    return NextResponse.json(
      { success: false, error: uploadResult.error },
      { status: 400 }
    )
  }

  const payload: Database["public"]["Tables"]["projects"]["Insert"] = {
    name: parsed.data.name,
    location: parsed.data.location,
    start_date: parsed.data.start_date || null,
    end_date: parsed.data.end_date || null,
    description: parsed.data.description || null,
    customer_name: null,
    client_id: null,
    status: "draft",
    attachments:
      uploadResult.attachments.length > 0
        ? (uploadResult.attachments as unknown as Json)
        : null,
  }

  const adminClient = createAdminClient()
  const { data: project, error } = await adminClient
    .from("projects")
    .insert(payload)
    .select("id")
    .single()

  if (error) {
    console.error("Project insert failed:", error)
    await cleanupUploadedFiles(uploadResult.uploadedPaths)
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan project ke database" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    projectId: project.id,
  })
}
