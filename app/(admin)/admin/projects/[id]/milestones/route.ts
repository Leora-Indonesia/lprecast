import { NextResponse } from "next/server"

import { createProjectMilestone } from "@/lib/projects/repository"
import { projectMilestoneSchema } from "@/lib/validations/project"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const parsed = projectMilestoneSchema.safeParse(body)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { success: false, error: firstError?.message || "Data milestone tidak valid" },
      { status: 400 }
    )
  }

  const result = await createProjectMilestone(id, parsed.data)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
