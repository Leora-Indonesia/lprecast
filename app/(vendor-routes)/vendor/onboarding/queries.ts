"use server"

import { createClient } from "@/lib/supabase/server"
import type {
  OnboardingDraftData,
  RegistrationStatus,
  UserRegistrationData,
} from "./types"

export async function getUserRegistrationData(): Promise<UserRegistrationData | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("nama, email, nama_perusahaan, no_hp")
    .eq("id", user.id)
    .single()

  if (error || !userData) {
    console.error("Error fetching user registration data:", error)
    return null
  }

  return {
    nama_perusahaan: userData.nama_perusahaan || "",
    nama_pic: userData.nama || "",
    email: userData.email || "",
    kontak_pic: userData.no_hp || undefined,
  }
}

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: "none", hasDraft: false, hasRegistration: false }
  }

  const [draftResult, profileResult] = await Promise.all([
    supabase
      .from("vendor_onboarding_drafts")
      .select("id")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("vendor_profiles")
      .select(
        "registration_status, status, approval_score, profile_completeness_pct"
      )
      .eq("user_id", user.id)
      .single(),
  ])

  const hasDraft = !draftResult.error && !!draftResult.data
  const hasRegistration = !profileResult.error && !!profileResult.data

  return {
    status: hasRegistration
      ? (profileResult.data!.status as RegistrationStatus["status"])
      : "none",
    registrationStatus: profileResult.data?.registration_status,
    profileStatus: profileResult.data?.status,
    approvalScore: profileResult.data?.approval_score ?? undefined,
    profileCompleteness:
      profileResult.data?.profile_completeness_pct ?? undefined,
    hasDraft,
    hasRegistration,
  }
}

export async function loadDraft(): Promise<{
  success: boolean
  data?: OnboardingDraftData | null
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("vendor_onboarding_drafts")
    .select("draft_data, current_step")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error loading draft:", error)
    return { success: false, error: error.message }
  }

  if (!data) {
    return { success: true, data: null }
  }

  try {
    const draftData = data.draft_data as OnboardingDraftData
    return {
      success: true,
      data: {
        ...draftData,
        currentStep: data.current_step,
      },
    }
  } catch {
    return { success: true, data: null }
  }
}

export async function getInitialOnboardingData() {
  const [status, userData, draft] = await Promise.all([
    getRegistrationStatus(),
    getUserRegistrationData(),
    loadDraft(),
  ])

  return { status, userData, draft }
}
