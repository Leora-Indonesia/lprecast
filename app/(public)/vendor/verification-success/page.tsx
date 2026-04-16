"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, ArrowRight, Building2 } from "lucide-react"

import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerificationSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuthAndRedirect() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: registration } = await supabase
        .from("vendor_registrations")
        .select("status")
        .eq("user_id", user.id)
        .single()

      const needsOnboarding =
        !registration ||
        ["draft", "submitted"].includes(
          (registration as { status?: string }).status ?? ""
        )

      setRedirectTo(
        needsOnboarding ? "/vendor/onboarding" : "/vendor/dashboard"
      )
      setIsLoading(false)
    }

    checkAuthAndRedirect()
  }, [router])

  useEffect(() => {
    if (!redirectTo || isLoading) return

    if (countdown <= 0) {
      router.push(redirectTo)
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, redirectTo, isLoading, router])

  const handleContinueNow = () => {
    if (redirectTo) {
      router.push(redirectTo)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Memverifikasi akun Anda...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Email Diverifikasi!</CardTitle>
          <CardDescription>
            Selamat! Akun vendor Anda telah berhasil diverifikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <Building2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <p className="text-sm text-green-800">
              Sekarang Anda dapat melengkapi data perusahaan untuk mulai
              menggunakan portal vendor LPrecast.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Mengalihkan dalam...
              </span>
              <span className="font-medium text-primary">
                {countdown} detik
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{
                  width: `${((3 - countdown) / 3) * 100}%`,
                }}
              />
            </div>
          </div>

          <Button onClick={handleContinueNow} className="w-full">
            Lanjutkan Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Anda akan diarahkan ke{" "}
            <span className="font-medium">
              {redirectTo === "/vendor/onboarding"
                ? "halaman melengkapi data perusahaan"
                : "dashboard vendor"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
