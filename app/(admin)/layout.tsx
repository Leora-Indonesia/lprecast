import { getCurrentUser } from "@/lib/auth"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const userData = user?.profile ?? null

  return <AdminLayout user={userData}>{children}</AdminLayout>
}
