import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import {
  getUnreadNotificationCount,
  getNotifications,
} from "@/lib/notifications"
import type { Notification } from "@/lib/types/vendor"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user?.profile) {
    redirect("/login")
  }

  const userData = user.profile
  const userId = user.id

  let notifications: {
    unreadCount: number
    notifications: Notification[]
  } = {
    unreadCount: 0,
    notifications: [],
  }

  if (userId) {
    const [unreadCount, notificationList] = await Promise.all([
      getUnreadNotificationCount(userId),
      getNotifications(userId, 10),
    ])
    notifications = {
      unreadCount,
      notifications: notificationList,
    }
  }

  return (
    <AdminLayout
      user={{
        id: userId,
        nama: userData.nama ?? null,
        email: userData.email ?? null,
      }}
      notifications={notifications}
    >
      {children}
    </AdminLayout>
  )
}
