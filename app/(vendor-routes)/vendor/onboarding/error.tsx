"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Onboarding error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-foreground">
          Terjadi Kesalahan
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Maaf, terjadi kesalahan saat memuat halaman onboarding. Silakan coba
          lagi.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
          <Button
            onClick={() => (window.location.href = "/vendor/dashboard")}
            variant="outline"
          >
            Kembali ke Dashboard
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-6 rounded-lg bg-muted p-4 text-left">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Error Details:
            </p>
            <code className="text-xs text-destructive">{error.message}</code>
          </div>
        )}
      </div>
    </div>
  )
}
