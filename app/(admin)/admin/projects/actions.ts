"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { addProjectAttachments, createProject, updateProject } from "@/lib/projects/repository"
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validations/project"
import { revalidatePath } from "next/cache"

async function getAuthenticatedAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false as const, error: "Unauthorized" }
  }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.stakeholder_type !== "internal") {
    return { success: false as const, error: "Forbidden" }
  }

  return { userId: user.id }
}

function readProjectFormData(formData: FormData) {
  return {
    name: formData.get("name") as string,
    location: formData.get("location") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    client_profile_id: formData.get("client_profile_id") as string,
    customer_name: formData.get("customer_name") as string,
    contract_value: formData.get("contract_value") as string,
    description: formData.get("description") as string,
    site_address_full: formData.get("site_address_full") as string,
    province_id: formData.get("province_id") as string,
    city_id: formData.get("city_id") as string,
    site_coordinates: formData.get("site_coordinates") as string,
    job_type: formData.get("job_type") as string,
    estimated_length_or_area: formData.get("estimated_length_or_area") as string,
    measurement_unit: formData.get("measurement_unit") as string,
    estimated_height: formData.get("estimated_height") as string,
    target_completion_date: formData.get("target_completion_date") as string,
    budget_min: formData.get("budget_min") as string,
    budget_max: formData.get("budget_max") as string,
    initial_description: formData.get("initial_description") as string,
    site_condition: formData.get("site_condition") as string,
    vehicle_access: formData.get("vehicle_access") as string,
    foundation_preference: formData.get("foundation_preference") as string,
    special_requirements: formData.get("special_requirements") as string,
    qualification_status: formData.get("qualification_status") as string,
    qualification_notes: formData.get("qualification_notes") as string,
    internal_notes: formData.get("internal_notes") as string,
  }
}

function readAttachmentFiles(formData: FormData) {
  return formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0)
}

export async function createProjectAction(formData: FormData) {
  const auth = await getAuthenticatedAdmin()
  if (!auth || !("userId" in auth)) {
    return { success: false as const, error: auth.error }
  }

  const rawData = readProjectFormData(formData)

  const parsed = projectCreateSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message || "Validasi gagal",
    }
  }

  const result = await createProject(parsed.data)

  if (result.success) {
    const files = readAttachmentFiles(formData)

    if (files.length > 0) {
      const attachmentResult = await addProjectAttachments(result.projectId, files)

      if (!attachmentResult.success) {
        revalidatePath("/admin/projects")
        revalidatePath(`/admin/projects/${result.projectId}`)

        return {
          success: true as const,
          projectId: result.projectId,
          warning: `${attachmentResult.error}. Project draft tetap dibuat tanpa lampiran lengkap.`,
        }
      }
    }
  }

  if (result.success) {
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/projects/${result.projectId}`)
  }

  return result
}

export async function updateProjectAction(
  projectId: string,
  formData: FormData
) {
  const auth = await getAuthenticatedAdmin()
  if (!auth || !("userId" in auth)) {
    return { success: false as const, error: auth.error }
  }

  const rawData = readProjectFormData(formData)

  const parsed = projectUpdateSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message || "Validasi gagal",
    }
  }

  const result = await updateProject(projectId, parsed.data)

  if (result.success) {
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/projects/${projectId}`)
  }

  return result
}
