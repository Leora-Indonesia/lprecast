import { NextResponse } from "next/server"

import { updateProjectStatus } from "@/lib/projects/repository"
import { projectStatusSchema } from "@/lib/validations/project"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = (await request.json().catch(() => null)) as { status?: string } | null
  const parsed = projectStatusSchema.safeParse(body?.status ?? "")

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Status project tidak valid" },
      { status: 400 }
    )
  }

  const result = await updateProjectStatus(id, parsed.data)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
