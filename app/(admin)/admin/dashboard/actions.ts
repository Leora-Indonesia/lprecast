"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const VENDOR_REGISTRATION_SETTING_KEY = "vendor_registration_skip_email_verify"

export interface AppSetting {
  enabled: boolean
  updatedAt: string | null
  updatedBy: string | null
}

export async function getVendorRegistrationSetting(): Promise<AppSetting> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("app_settings")
    .select("value, updated_at, updated_by")
    .eq("key", VENDOR_REGISTRATION_SETTING_KEY)
    .maybeSingle()

  if (error) {
    console.error("Error fetching vendor registration setting:", error)
    return { enabled: false, updatedAt: null, updatedBy: null }
  }

  if (!data) {
    return { enabled: false, updatedAt: null, updatedBy: null }
  }

  return {
    enabled: data?.value?.enabled ?? false,
    updatedAt: data?.updated_at ?? null,
    updatedBy: data?.updated_by ?? null,
  }
}

export async function updateVendorRegistrationSetting(
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .single()

  if (profile?.stakeholder_type !== "internal") {
    return {
      success: false,
      error: "Hanya admin yang bisa mengubah setting ini",
    }
  }

  const admin = createAdminClient()

  const { error } = await admin
    .from("app_settings")
    .update({
      value: { enabled },
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("key", VENDOR_REGISTRATION_SETTING_KEY)

  if (error) {
    console.error("Error updating vendor registration setting:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dashboard")
  return { success: true }
}
