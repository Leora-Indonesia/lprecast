import { NextRequest, NextResponse } from "next/server"
import { approveVendor, rejectVendor } from "../../actions"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { action, adminUserId, notes, reason } = body

  if (action === "approve") {
    const result = await approveVendor(id, adminUserId, notes)
    return NextResponse.json(result)
  }

  if (action === "reject") {
    const result = await rejectVendor(id, adminUserId, reason)
    return NextResponse.json(result)
  }

  return NextResponse.json({ success: false, error: "Invalid action" })
}
