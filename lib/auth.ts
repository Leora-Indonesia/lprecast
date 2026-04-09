import { createClient } from "./supabase/server"
import { redirect } from "next/navigation"

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return { ...user, profile }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(role: "internal" | "vendor" | "client") {
  const user = await requireAuth()
  if (user.profile?.stakeholder_type !== role) {
    redirect("/unauthorized")
  }
  return user
}
