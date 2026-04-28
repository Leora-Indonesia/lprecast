import { NextResponse } from "next/server"

import { createClientProject } from "@/lib/client/repository"
import { clientProjectIntakeSchema } from "@/lib/validations/client"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const parsed = clientProjectIntakeSchema.safeParse(body)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { success: false, error: firstError?.message || "Data project client tidak valid" },
      { status: 400 }
    )
  }

  const result = await createClientProject(parsed.data)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
