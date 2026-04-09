"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: { nama: string; email: string } | null
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
