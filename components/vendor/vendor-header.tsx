"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VendorHeader() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">LPrecast</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Sudah punya akun?
            </span>
            <Button onClick={() => router.push("/login")}>Login</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
