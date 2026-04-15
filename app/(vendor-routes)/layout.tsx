import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { VendorLayoutWrapper } from "@/components/vendor/vendor-layout-wrapper"

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user?.profile) {
    redirect("/login")
  }

  if (user.profile.stakeholder_type !== "vendor") {
    redirect("/unauthorized")
  }

  const supabase = await createClient()
  const { data: registration } = await supabase
    .from("vendor_registrations")
    .select("status")
    .eq("vendor_id", user.id)
    .in("status", ["draft", "submitted"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const pathname = typeof window !== "undefined" ? window.location.pathname : ""

  if (
    registration?.status === "draft" &&
    !pathname.startsWith("/vendor/onboarding")
  ) {
    redirect("/vendor/onboarding")
  }

  const userData = user.profile

  return (
    <VendorLayoutWrapper
      user={{
        nama: userData.nama ?? null,
        email: userData.email ?? null,
      }}
    >
      {children}
    </VendorLayoutWrapper>
  )
}
