"use client"

import {
  Construction,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Users,
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
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Vendors", href: "/admin/vendors", icon: Users },
  { title: "Projects", href: "/admin/projects", icon: FolderOpen },
  { title: "Clients", href: "/admin/clients", icon: Users, soon: true },
  { title: "Tenders", href: "/admin/tenders", icon: FileText, soon: true },
  { title: "Users", href: "/admin/users", icon: Construction, soon: true },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#16a34a]">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">LPrecast</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
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
                          Phase 2
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
