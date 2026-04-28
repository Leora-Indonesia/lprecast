import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { adminClientProfileSchema } from "@/lib/validations/client"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clientId } = await params

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.stakeholder_type !== "internal") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await request.formData()
  const data = {
    client_name: formData.get("client_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    client_type: formData.get("client_type") as string,
    company_name_legal: (formData.get("company_name_legal") as string) || null,
    pic_name: formData.get("pic_name") as string,
    pic_position: (formData.get("pic_position") as string) || null,
    office_address: formData.get("office_address") as string,
    province_id: formData.get("province_id") as string,
    city_id: formData.get("city_id") as string,
    notes: (formData.get("notes") as string) || null,
    verification_status: (formData.get("verification_status") as string) || null,
    verification_notes: (formData.get("verification_notes") as string) || null,
  }

  const parsed = adminClientProfileSchema.safeParse(data)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Validasi gagal" },
      { status: 400 }
    )
  }

  const { error } = await admin
    .from("client_profiles")
    .update({
      client_name: parsed.data.client_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      client_type: parsed.data.client_type,
      company_name_legal: parsed.data.company_name_legal || null,
      pic_name: parsed.data.pic_name,
      pic_position: parsed.data.pic_position || null,
      office_address: parsed.data.office_address,
      province_id: parsed.data.province_id,
      city_id: parsed.data.city_id,
      notes: parsed.data.notes || null,
      verification_status: parsed.data.verification_status || "pending",
      verification_notes: parsed.data.verification_notes || null,
    })
    .eq("id", clientId)

  if (error) {
    console.error("Client update failed:", error)
    return NextResponse.json({ error: "Gagal update client" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}