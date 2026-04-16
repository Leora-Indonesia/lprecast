"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export function MagicLinkCallback() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [hasAccessToken, setHasAccessToken] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setHasAccessToken(window.location.hash.includes("access_token"))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mounted || !hasAccessToken) {
      return
    }

    async function getUserRole(userId: string) {
      const { data: profile } = await supabase
        .from("users")
        .select("stakeholder_type")
        .eq("id", userId)
        .single()

      return (
        profile && (profile as { stakeholder_type?: string }).stakeholder_type
      )
    }

    async function handleAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const role = await getUserRole(session.user.id)

        if (role === "vendor") {
          router.push("/vendor/dashboard")
        } else if (role === "internal") {
          router.push("/admin/dashboard")
        } else if (role === "client") {
          router.push("/client/dashboard")
        } else {
          router.push("/login")
        }
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const role = await getUserRole(user.id)
          if (role === "vendor") {
            router.push("/vendor/dashboard")
          } else if (role === "internal") {
            router.push("/admin/dashboard")
          } else if (role === "client") {
            router.push("/client/dashboard")
          } else {
            router.push("/login")
          }
        }
      }
    }

    const timeout = setTimeout(handleAuth, 500)
    return () => clearTimeout(timeout)
  }, [mounted, hasAccessToken, router])

  if (!mounted || !hasAccessToken) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Memproses login...</p>
      </div>
    </div>
  )
}
