"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { VendorSidebar } from "@/components/vendor/vendor-sidebar"
import { VendorDashboardHeader } from "@/components/vendor/vendor-dashboard-header"

interface VendorDashboardLayoutProps {
  children: React.ReactNode
  user?: { nama: string; email: string } | null
}

export function VendorDashboardLayout({
  children,
  user,
}: VendorDashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <VendorSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <VendorDashboardHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
