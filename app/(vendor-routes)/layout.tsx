import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"
import { VendorLayoutWrapper } from "@/components/vendor/vendor-layout-wrapper"

export const metadata: Metadata = {
  title: {
    default: "Vendor Portal | LPrecast",
    template: "%s | LPrecast Vendor Portal",
  },
  description:
    "Portal vendor untuk LPrecast - Kelola tender, proyek, dan progres",
}

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

  // Registration check is now handled in proxy.ts middleware
  // Layout hanya handle auth + role check

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
