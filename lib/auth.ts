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

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error && error.code === "PGRST116") {
    console.log(
      `[LazyUserCreate:${Date.now()}] User ${user.id} not in users table, creating...`
    )

    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      nama: user.user_metadata?.nama || user.email?.split("@")[0] || "User",
      nama_perusahaan: user.user_metadata?.nama_perusahaan || null,
      username: user.email?.split("@")[0] || user.id,
      stakeholder_type: user.user_metadata?.stakeholder_type || "vendor",
      is_active: true,
    })

    if (insertError) {
      console.error(
        `[LazyUserCreate:${Date.now()}] Failed to create user:`,
        insertError
      )
      return { ...user, profile: null }
    }

    console.log(`[LazyUserCreate:${Date.now()}] User created successfully`)

    const newProfile = {
      id: user.id,
      email: user.email,
      nama: user.user_metadata?.nama || user.email?.split("@")[0] || "User",
      nama_perusahaan: user.user_metadata?.nama_perusahaan || null,
      username: user.email?.split("@")[0] || user.id,
      stakeholder_type: user.user_metadata?.stakeholder_type || "vendor",
      is_active: true,
    }

    return { ...user, profile: newProfile }
  }

  if (error) {
    console.error(`[LazyUserCreate:${Date.now()}] Error fetching user:`, error)
  }

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
