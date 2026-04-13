"use client"

import { usePathname } from "next/navigation"
import { VendorDashboardLayout } from "@/components/vendor/vendor-dashboard-layout"

interface VendorLayoutWrapperProps {
  children: React.ReactNode
  user: {
    nama: string | null
    email: string | null
  }
}

const PUBLIC_ROUTES = ["/vendor/register", "/vendor/login"]

export function VendorLayoutWrapper({
  children,
  user,
}: VendorLayoutWrapperProps) {
  const pathname = usePathname()
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isPublicRoute) {
    return <>{children}</>
  }

  return <VendorDashboardLayout user={user}>{children}</VendorDashboardLayout>
}
