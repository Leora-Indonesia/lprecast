import { NextResponse } from "next/server"

import { updateProject } from "@/lib/projects/repository"
import { projectUpdateSchema } from "@/lib/validations/project"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await request.formData()

  const parsed = projectUpdateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    customer_name: String(formData.get("customer_name") ?? ""),
    contract_value: String(formData.get("contract_value") ?? ""),
    description: String(formData.get("description") ?? ""),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { success: false, error: firstError?.message || "Data project tidak valid" },
      { status: 400 }
    )
  }

  const result = await updateProject(id, parsed.data)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
