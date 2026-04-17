"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

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

const APP_SETTING_KEY = "vendor_registration_skip_email_verify"

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

async function shouldSkipEmailVerify(): Promise<boolean> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("app_settings")
    .select("value")
    .eq("key", APP_SETTING_KEY)
    .maybeSingle()

  if (error) {
    console.warn("[Signup] Could not fetch app_settings:", error.message)
    return false
  }

  if (!data) {
    return false
  }

  return data?.value?.enabled ?? false
}

function generateUsername(companyName: string): string {
  return (
    companyName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .substring(0, 20) +
    "_" +
    Date.now().toString(36)
  )
}

async function signupWithAutoConfirm(
  values: SignupValues
): Promise<SignupResult> {
  const admin = createAdminClient()
  const supabase = await createClient()

  try {
    console.log(`[Signup:auto-confirm] Creating user for: ${values.email}`)

    const { data: authData, error: authError } =
      await admin.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          stakeholder_type: "vendor",
          nama: values.nama_pic,
          nama_perusahaan: values.nama_perusahaan,
        },
      })

    if (authError || !authData.user) {
      console.error(`[Signup:auto-confirm] Auth error:`, authError)
      return {
        success: false,
        error: formatAuthError(authError || new Error("Gagal membuat user")),
      }
    }

    const userId = authData.user.id
    const username = generateUsername(values.nama_perusahaan)

    console.log(`[Signup:auto-confirm] User created: ${userId}`)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const { error: userUpsertError } = await admin.from("users").upsert(
      {
        id: userId,
        email: values.email,
        nama: values.nama_pic,
        username: username,
        stakeholder_type: "vendor",
        nama_perusahaan: values.nama_perusahaan,
        is_active: true,
      },
      { onConflict: "id" }
    )

    if (userUpsertError) {
      console.error(`[Signup:auto-confirm] User upsert error:`, userUpsertError)
    } else {
      console.log(`[Signup:auto-confirm] User record upserted`)
    }

    const { error: profileError } = await admin.from("vendor_profiles").upsert(
      {
        user_id: userId,
        nama_perusahaan: values.nama_perusahaan,
        email_perusahaan: values.email,
        registration_status: "draft",
        status: "active",
      },
      { onConflict: "user_id" }
    )

    if (profileError) {
      console.error(`[Signup:auto-confirm] Profile upsert error:`, profileError)
    } else {
      console.log(`[Signup:auto-confirm] Vendor profile upserted`)
    }

    console.log(`[Signup:auto-confirm] Auto-login for: ${values.email}`)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (signInError) {
      console.error(`[Signup:auto-confirm] Auto-login error:`, signInError)
      return {
        success: false,
        error: "Akun dibuat tapi gagal login otomatis. Silakan login manual.",
      }
    }

    console.log(`[Signup:auto-confirm] Redirecting to /vendor/onboarding`)
    redirect("/vendor/onboarding")
  } catch (err) {
    const error = err as { message?: string; digest?: string }
    const isRedirect =
      error.message === "NEXT_REDIRECT" ||
      error.digest?.includes("NEXT_REDIRECT")

    if (isRedirect) {
      throw err
    }

    console.error(`[Signup:auto-confirm] Unexpected error:`, err)
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar",
    }
  }
}

async function signupWithEmailVerify(
  values: SignupValues
): Promise<SignupResult> {
  const startTime = Date.now()
  console.log(`[Signup:email-verify] Starting signup for: ${values.email}`)

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
      console.error(`[Signup:email-verify] Auth error:`, authError.message)
      return { success: false, error: formatAuthError(authError) }
    }

    if (!authData.user) {
      console.error(`[Signup:email-verify] No user returned from signup`)
      return { success: false, error: "Gagal membuat akun. Silakan coba lagi." }
    }

    const duration = Date.now() - startTime
    console.log(
      `[Signup:email-verify] Auth success in ${duration}ms, redirecting...`
    )
    console.log(
      `[Signup:email-verify] User will be created by database trigger (users + vendor_profiles)`
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
      `[Signup:email-verify] Unexpected error after ${duration}ms:`,
      err
    )

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar",
    }
  }
}

export async function signupAction(
  values: SignupValues
): Promise<SignupResult> {
  const skipVerify = await shouldSkipEmailVerify()

  console.log(`[Signup] skipVerify=${skipVerify} for: ${values.email}`)

  if (skipVerify) {
    return await signupWithAutoConfirm(values)
  } else {
    return await signupWithEmailVerify(values)
  }
}
