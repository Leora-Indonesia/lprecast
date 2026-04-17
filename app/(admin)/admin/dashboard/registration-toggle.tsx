"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Settings, AlertTriangle } from "lucide-react"

import { updateVendorRegistrationSetting } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RegistrationToggleProps {
  enabled: boolean
}

export function RegistrationToggle({ enabled }: RegistrationToggleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentEnabled, setCurrentEnabled] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setCurrentEnabled(enabled)
  }, [enabled])

  async function handleToggle() {
    setIsLoading(true)
    setError(null)
    const newValue = !currentEnabled
    const result = await updateVendorRegistrationSetting(newValue)

    if (result.success) {
      setCurrentEnabled(newValue)
      router.refresh()
    } else {
      console.error("Failed to update setting:", result.error)
      setError(result.error || "Gagal mengupdate setting")
    }
    setIsLoading(false)
  }

  return (
    <Card className={currentEnabled ? "border-orange-300 bg-orange-50/30" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Konfigurasi Registrasi Vendor
        </CardTitle>
        <form action={handleToggle}>
          <Button
            type="submit"
            variant={currentEnabled ? "destructive" : "default"}
            size="sm"
            disabled={isLoading}
          >
            {isLoading
              ? "Memproses..."
              : currentEnabled
                ? "NONAKTIFKAN"
                : "AKTIFKAN"}
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                currentEnabled ? "text-orange-700" : "text-green-700"
              }`}
            >
              Status: {currentEnabled ? "NONAKTIF ⚠️" : "AKTIF ✅"}
            </span>
          </div>

          {currentEnabled && (
            <div className="rounded-lg bg-orange-100 p-3 text-sm text-orange-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Email verification dinonaktifkan
                  </p>
                  <p className="mt-1 text-xs">
                    Vendor dapat mendaftar tanpa verifikasi email. Pastikan
                    untuk mengaktifkan kembali setelah selesai import vendor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            ℹ️ Ketika dinonaktifkan, vendor bisa langsung daftar tanpa
            verifikasi email. Gunakan untuk bulk import vendor awal.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
