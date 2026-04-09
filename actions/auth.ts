"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("stakeholder_type")
    .eq("id", data.user.id)
    .single()

  const stakeholderType = profile?.stakeholder_type

  // Redirect based on role
  if (stakeholderType === "internal") {
    redirect("/admin/dashboard")
  } else if (stakeholderType === "vendor") {
    redirect("/vendor/dashboard")
  } else if (stakeholderType === "client") {
    redirect("/client/dashboard")
  }

  redirect("/")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
