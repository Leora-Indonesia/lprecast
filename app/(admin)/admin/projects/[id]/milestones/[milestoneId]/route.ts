import { NextResponse } from "next/server"

import {
  deleteProjectMilestone,
  updateProjectMilestone,
} from "@/lib/projects/repository"
import { projectMilestoneUpdateSchema } from "@/lib/validations/project"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  const { milestoneId } = await params
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const parsed = projectMilestoneUpdateSchema.safeParse(body)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { success: false, error: firstError?.message || "Data milestone tidak valid" },
      { status: 400 }
    )
  }

  const result = await updateProjectMilestone(milestoneId, parsed.data)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  const { milestoneId } = await params
  const result = await deleteProjectMilestone(milestoneId)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
