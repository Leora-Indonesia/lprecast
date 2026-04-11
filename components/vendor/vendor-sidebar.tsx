"use client"

import {
  Building2,
  FileText,
  LayoutDashboard,
  Settings,
  ClipboardList,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  { title: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { title: "Profil", href: "/vendor/profile", icon: Building2, soon: true },
  { title: "Tender", href: "/vendor/tenders", icon: FileText, soon: true },
  {
    title: "Penawaran",
    href: "/vendor/submissions",
    icon: ClipboardList,
    soon: true,
  },
  { title: "Proyek", href: "/vendor/projects", icon: BarChart3, soon: true },
  { title: "Pengaturan", href: "/vendor/settings", icon: Settings, soon: true },
]

export function VendorSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#16a34a]">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">LPrecast</span>
            <span className="text-xs text-muted-foreground">Vendor Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.soon && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Soon
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}
