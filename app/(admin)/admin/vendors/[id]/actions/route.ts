import { NextRequest, NextResponse } from "next/server"
import {
  approveConditionalVendor,
  approveVendor,
  rejectVendor,
  requestVendorRevision,
  saveVendorApprovalDraft,
} from "../../actions"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { action } = body

  if (action === "approve") {
    const { adminUserId, notes, score, tier } = body
    const result = await approveVendor(id, adminUserId, notes, score, tier)
    return NextResponse.json(result)
  }

  if (action === "conditional") {
    const { adminUserId, notes, score, tier } = body
    const result = await approveConditionalVendor(
      id,
      adminUserId,
      notes,
      score,
      tier
    )
    return NextResponse.json(result)
  }

  if (action === "revision_requested") {
    const { adminUserId, reason, score, tier } = body
    const result = await requestVendorRevision(
      id,
      adminUserId,
      reason,
      score,
      tier
    )
    return NextResponse.json(result)
  }

  if (action === "reject") {
    const { adminUserId, reason, score, tier } = body
    const result = await rejectVendor(id, adminUserId, reason, score, tier)
    return NextResponse.json(result)
  }

  if (action === "save_draft") {
    const { adminUserId, draft } = body
    if (!adminUserId || !draft) {
      return NextResponse.json({
        success: false,
        error: "Missing adminUserId or draft",
      })
    }

    const result = await saveVendorApprovalDraft(id, adminUserId, {
      checkedItems: draft.checkedItems || {},
      redFlagFindings: draft.redFlagFindings || {},
      notes: typeof draft.notes === "string" ? draft.notes : null,
      score: typeof draft.score === "number" ? draft.score : null,
      tier: typeof draft.tier === "string" ? draft.tier : null,
    })
    return NextResponse.json(result)
  }

  return NextResponse.json({ success: false, error: "Invalid action" })
}
