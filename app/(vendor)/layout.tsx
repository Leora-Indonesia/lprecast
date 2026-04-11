import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { VendorDashboardLayout } from "@/components/vendor/vendor-dashboard-layout"

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
    <VendorDashboardLayout
      user={{
        nama: userData.nama ?? null,
        email: userData.email ?? null,
      }}
    >
      {children}
    </VendorDashboardLayout>
  )
}
