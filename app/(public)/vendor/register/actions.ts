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
}

function formatAuthError(
  error: Error | { message?: string; status?: number }
): string {
  const message = error.message || ""

  if (
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("23505")
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

  return "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
}

export async function signupAction(
  values: SignupValues
): Promise<SignupResult> {
  const startTime = Date.now()
  console.log(`[Signup:${startTime}] Starting signup for: ${values.email}`)

  try {
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          stakeholder_type: "vendor",
          nama: values.nama_pic,
          nama_perusahaan: values.nama_perusahaan,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback?next=/vendor/verification-success`,
      },
    })

    if (authError) {
      console.error(`[Signup:${Date.now()}] Auth error:`, authError.message)
      return { success: false, error: formatAuthError(authError) }
    }

    if (!authData.user) {
      console.error(`[Signup:${Date.now()}] No user returned from signup`)
      return { success: false, error: "Gagal membuat akun. Silakan coba lagi." }
    }

    const duration = Date.now() - startTime
    console.log(
      `[Signup:${Date.now()}] Auth success in ${duration}ms, redirecting...`
    )
    console.log(
      `[Signup:${Date.now()}] User will be created by database trigger (users + vendor_profiles)`
    )

    redirect("/vendor/register/success")
  } catch (err) {
    const error = err as { message?: string; digest?: string }
    const isRedirect =
      error.message === "NEXT_REDIRECT" ||
      error.digest?.includes("NEXT_REDIRECT")

    if (isRedirect) {
      throw err
    }

    const duration = Date.now() - startTime
    console.error(
      `[Signup:${Date.now()}] Unexpected error after ${duration}ms:`,
      err
    )

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar",
    }
  }
}
