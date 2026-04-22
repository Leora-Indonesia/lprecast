import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  approveConditionalVendor,
  approveVendor,
  rejectVendor,
  requestVendorRevision,
  saveVendorApprovalDraft,
} from "../../actions"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  computeApprovalTier,
  computeTotalScore,
  hasRedFlag,
} from "@/lib/vendor-approval"

const recordBooleanSchema = z.record(z.string(), z.boolean()).catch({})

const draftSchema = z
  .object({
    checkedItems: recordBooleanSchema,
    redFlagFindings: recordBooleanSchema,
    notes: z.string().trim().nullable().catch(null),
  })
  .strict()

const actionSchema = z.enum([
  "approve",
  "conditional",
  "revision_requested",
  "reject",
  "save_draft",
])

function parseActionBody(input: unknown) {
  if (!input || typeof input !== "object") return null
  const raw = input as Record<string, unknown>
  const action = actionSchema.safeParse(raw.action)
  if (!action.success) return null
  return { ...raw, action: action.data } as {
    action: z.infer<typeof actionSchema>
    draft?: unknown
    notes?: unknown
    reason?: unknown
  }
}

async function getInternalAdminUserId() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  // Defense-in-depth: verify stakeholder type server-side.
  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.stakeholder_type !== "internal") return null
  return user.id
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const adminUserId = await getInternalAdminUserId()
  if (!adminUserId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = parseActionBody(body)
  if (!parsed) {
    return NextResponse.json(
      { success: false, error: "Invalid body" },
      { status: 400 }
    )
  }
  const { action } = parsed

  const draftPayload = draftSchema.safeParse(parsed.draft)
  const checkedItems = draftPayload.success ? draftPayload.data.checkedItems : {}
  const redFlagFindings = draftPayload.success ? draftPayload.data.redFlagFindings : {}
  const totalScore = computeTotalScore(checkedItems)
  const hasAnyRedFlag = hasRedFlag(redFlagFindings)
  const tier = computeApprovalTier({ totalScore, hasRedFlag: hasAnyRedFlag })

  if (action === "approve") {
    if (hasAnyRedFlag) {
      return NextResponse.json(
        { success: false, error: "Ada red flag: hasil wajib REJECT" },
        { status: 400 }
      )
    }
    if (totalScore < 85) {
      return NextResponse.json(
        { success: false, error: "Skor minimum approve: 85" },
        { status: 400 }
      )
    }

    const notes = typeof parsed.notes === "string" ? parsed.notes : undefined
    const result = await approveVendor(id, adminUserId, notes, totalScore, tier)
    return NextResponse.json(result)
  }

  if (action === "conditional") {
    if (hasAnyRedFlag) {
      return NextResponse.json(
        { success: false, error: "Ada red flag: hasil wajib REJECT" },
        { status: 400 }
      )
    }
    if (totalScore < 70) {
      return NextResponse.json(
        { success: false, error: "Skor minimum approve bersyarat: 70" },
        { status: 400 }
      )
    }

    const notes = typeof parsed.notes === "string" ? parsed.notes : undefined
    const result = await approveConditionalVendor(id, adminUserId, notes, totalScore, tier)
    return NextResponse.json(result)
  }

  if (action === "revision_requested") {
    const reason = typeof parsed.reason === "string" ? parsed.reason : ""
    if (!reason.trim()) {
      return NextResponse.json(
        { success: false, error: "Catatan wajib diisi untuk revisi" },
        { status: 400 }
      )
    }

    // Persist snapshot draft on submit so server uses same data.
    await saveVendorApprovalDraft(id, adminUserId, {
      checkedItems,
      redFlagFindings,
      notes: null,
    })

    const result = await requestVendorRevision(id, adminUserId, reason, totalScore, tier)
    return NextResponse.json(result)
  }

  if (action === "reject") {
    const reason = typeof parsed.reason === "string" ? parsed.reason : ""
    if (!reason.trim()) {
      return NextResponse.json(
        { success: false, error: "Catatan wajib diisi untuk penolakan" },
        { status: 400 }
      )
    }

    await saveVendorApprovalDraft(id, adminUserId, {
      checkedItems,
      redFlagFindings,
      notes: null,
    })

    const result = await rejectVendor(id, adminUserId, reason, totalScore, tier)
    return NextResponse.json(result)
  }

  if (action === "save_draft") {
    const draft = draftSchema.safeParse(parsed.draft)
    if (!draft.success) {
      return NextResponse.json({
        success: false,
        error: "Invalid draft",
      }, { status: 400 })
    }

    const result = await saveVendorApprovalDraft(id, adminUserId, {
      checkedItems: draft.data.checkedItems,
      redFlagFindings: draft.data.redFlagFindings,
      notes: draft.data.notes,
    })
    return NextResponse.json(result)
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
}
