"use client"

import { themeConfig } from "@/lib/theme-config"

/**
 * Offline Fallback Page
 * Warna icon otomatis dari theme-config.ts
 *
 * See docs/architecture/pwa.md for theming guide.
 */
export default function OfflinePage() {
  const primaryColor = themeConfig.colors.light.primary

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-6">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: `${primaryColor}1A` }}
        >
          <svg
            className="h-10 w-10"
            style={{ color: primaryColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
      </div>

      <h1 className="mb-4 text-2xl font-bold text-foreground">
        Anda Sedang Offline
      </h1>

      <p className="mb-6 max-w-sm text-muted-foreground">
        Periksa koneksi internet Anda untuk mengakses {themeConfig.app.name}.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="rounded-md bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Coba Lagi
      </button>
    </div>
  )
}
