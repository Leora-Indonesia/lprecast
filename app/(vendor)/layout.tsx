import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
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
