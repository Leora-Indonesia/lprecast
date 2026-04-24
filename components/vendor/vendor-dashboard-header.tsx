"use client"

import { LogOut, User } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/actions/auth"
import { VendorNotificationBell } from "@/components/vendor/vendor-notification-bell"

interface UserData {
  nama: string | null
  email: string | null
}

interface VendorDashboardHeaderProps {
  user?: UserData | null
}

export function VendorDashboardHeader({ user }: VendorDashboardHeaderProps) {
  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/vendor/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#16a34a]">
              <span className="text-sm font-bold text-white">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">LPrecast</span>
              <span className="text-xs text-muted-foreground">
                Vendor Portal
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <VendorNotificationBell />
          {user?.nama ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                  suppressHydrationWarning
                >
                  <Avatar className="h-8 w-8" suppressHydrationWarning>
                    <AvatarFallback
                      className="bg-[#16a34a] text-white"
                      suppressHydrationWarning
                    >
                      {user.nama.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.nama}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}
        </div>
      </div>
    </header>
  )
}
