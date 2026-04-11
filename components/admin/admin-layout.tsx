"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import type { Notification } from "@/lib/types/vendor"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: { id?: string; nama: string; email: string } | null
  notifications?: {
    unreadCount: number
    notifications: Notification[]
  }
}

export function AdminLayout({
  children,
  user,
  notifications,
}: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader user={user} notifications={notifications} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
