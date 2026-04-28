import { NextResponse } from "next/server"

import { upsertClientProfile } from "@/lib/client/repository"
import { clientProfileSchema } from "@/lib/validations/client"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const parsed = clientProfileSchema.safeParse(body)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { success: false, error: firstError?.message || "Data profil client tidak valid" },
      { status: 400 }
    )
  }

  const result = await upsertClientProfile(parsed.data)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
