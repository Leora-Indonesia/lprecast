import { NextResponse } from "next/server"

import {
  projectCreateSchema,
} from "@/lib/validations/project"
import { addProjectAttachments, createProject } from "@/lib/projects/repository"

function readProjectFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    client_profile_id: String(formData.get("client_profile_id") ?? ""),
    customer_name: String(formData.get("customer_name") ?? ""),
    contract_value: String(formData.get("contract_value") ?? ""),
    description: String(formData.get("description") ?? ""),
    site_address_full: String(formData.get("site_address_full") ?? ""),
    province_id: String(formData.get("province_id") ?? ""),
    city_id: String(formData.get("city_id") ?? ""),
    site_coordinates: String(formData.get("site_coordinates") ?? ""),
    job_type: String(formData.get("job_type") ?? ""),
    estimated_length_or_area: String(formData.get("estimated_length_or_area") ?? ""),
    measurement_unit: String(formData.get("measurement_unit") ?? ""),
    estimated_height: String(formData.get("estimated_height") ?? ""),
    target_completion_date: String(formData.get("target_completion_date") ?? ""),
    budget_min: String(formData.get("budget_min") ?? ""),
    budget_max: String(formData.get("budget_max") ?? ""),
    initial_description: String(formData.get("initial_description") ?? ""),
    site_condition: String(formData.get("site_condition") ?? ""),
    vehicle_access: String(formData.get("vehicle_access") ?? ""),
    foundation_preference: String(formData.get("foundation_preference") ?? ""),
    special_requirements: String(formData.get("special_requirements") ?? ""),
    qualification_status: String(formData.get("qualification_status") ?? ""),
    qualification_notes: String(formData.get("qualification_notes") ?? ""),
    internal_notes: String(formData.get("internal_notes") ?? ""),
  }
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const parsed = projectCreateSchema.safeParse(readProjectFormData(formData))

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

  const createResult = await createProject(parsed.data)
  if (!createResult.success) {
    return NextResponse.json(
      { success: false, error: createResult.error },
      { status: createResult.error === "Unauthorized" ? 401 : 500 }
    )
  }

  const files = formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0)

  if (files.length > 0) {
    const attachmentResult = await addProjectAttachments(createResult.projectId, files)

    if (!attachmentResult.success) {
      return NextResponse.json(
        {
          success: true,
          warning: `${attachmentResult.error}. Project draft tetap dibuat tanpa lampiran lengkap.`,
          projectId: createResult.projectId,
        },
        { status: 200 }
      )
    }
  }

  return NextResponse.json({
    success: true,
    projectId: createResult.projectId,
  })
}
