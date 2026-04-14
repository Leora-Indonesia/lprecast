"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function setVendorPassword(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = createAdminClient()

    const { data: users, error: listError } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .eq("email_confirmed_at", null)
      .limit(1)

    if (listError) {
      console.error("Error finding user:", listError)
      return {
        success: false,
        error:
          "Tidak dapat menemukan pengguna. Pastikan Anda menggunakan email yang benar.",
      }
    }

    if (!users || users.length === 0) {
      return {
        success: false,
        error:
          "Tidak dapat menemukan pengguna yang belum aktif. Silakan daftar terlebih dahulu.",
      }
    }

    const userId = users[0].id

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, { password })

    if (updateError) {
      console.error("Error setting password:", updateError)
      return {
        success: false,
        error: "Gagal mengatur password. Silakan coba lagi.",
      }
    }

    const { error: confirmError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        email_confirm: true,
      })

    if (confirmError) {
      console.error("Error confirming email:", confirmError)
    }

    await supabaseAdmin
      .from("vendor_registrations")
      .update({ status: "active" })
      .eq("vendor_id", userId)

    await supabaseAdmin
      .from("vendor_profiles")
      .update({ status: "active" })
      .eq("user_id", userId)

    return { success: true }
  } catch (error) {
    console.error("Error in setVendorPassword:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi.",
    }
  }
}

export async function resendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = createAdminClient()

    const { error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          resend: true,
        },
      })

    if (inviteError) {
      console.error("Error resending magic link:", inviteError)
      return {
        success: false,
        error: "Gagal mengirim ulang link. Silakan coba lagi.",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in resendMagicLink:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi.",
    }
  }
}
