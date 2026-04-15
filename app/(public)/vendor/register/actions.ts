"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface SignupValues {
  email: string
  password: string
  nama_perusahaan: string
  nama_pic: string
}

interface SignupResult {
  success: boolean
  error?: string
  isRetry?: boolean
}

function formatAuthError(
  error: Error | { message?: string; status?: number }
): string {
  const message = error.message || ""

  if (
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain."
  }

  if (message.includes("invalid email")) {
    return "Format email tidak valid."
  }

  if (message.includes("weak password") || message.includes("password")) {
    return "Password terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka."
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return "Terlalu banyak percobaan. Silakan tunggu beberapa saat sebelum mencoba lagi."
  }

  if (message.includes("Email not confirmed")) {
    return "Email belum dikonfirmasi. Silakan cek inbox email Anda."
  }

  return "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
}

export async function signupAction(
  values: SignupValues
): Promise<SignupResult> {
  const supabase = await createClient()

  try {
    console.log("[Signup] Starting signup for:", values.email)

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          stakeholder_type: "vendor",
          nama: values.nama_pic,
          nama_perusahaan: values.nama_perusahaan,
        },
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/auth/callback?next=/login`,
      },
    })

    if (error) {
      console.error("[Signup] Auth error:", error)
      return { success: false, error: formatAuthError(error) }
    }

    if (!data.user) {
      console.error("[Signup] No user returned from signup")
      return { success: false, error: "Gagal membuat akun. Silakan coba lagi." }
    }

    console.log("[Signup] Auth user created:", data.user.id)

    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email: values.email,
      nama: values.nama_pic,
      username: values.email.split("@")[0],
      stakeholder_type: "vendor",
      is_active: true,
    })

    if (insertError) {
      console.error("[Signup] Users insert error:", insertError)
      if (insertError.code === "23505") {
        console.log(
          "[Signup] User already exists in users table, continuing..."
        )
      } else {
        console.warn("[Signup] Non-critical insert error, continuing anyway...")
      }
    } else {
      console.log("[Signup] User inserted to users table successfully")
    }

    console.log("[Signup] Redirecting to success page...")
    redirect("/vendor/register/success")
  } catch (err) {
    const error = err as { message?: string; digest?: string }

    const isRedirect =
      error.message === "NEXT_REDIRECT" ||
      error.digest?.includes("NEXT_REDIRECT")

    if (isRedirect) {
      throw err
    }

    console.error("[Signup] Unexpected error:", err)
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar",
    }
  }
}
