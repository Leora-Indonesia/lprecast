import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { themeConfig } from "@/lib/theme-config"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/**
 * PWA Metadata - Colors sourced from lib/theme-config.ts
 * See docs/architecture/pwa.md for theming guide.
 */
export const metadata: Metadata = {
  applicationName: themeConfig.app.name,
  title: {
    default: themeConfig.app.title,
    template: `%s - ${themeConfig.app.name}`,
  },
  description: themeConfig.app.description,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: themeConfig.app.title,
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: themeConfig.pwa.themeColor,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: themeConfig.pwa.themeColorDark,
    },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      dir="ltr"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-right" richColors closeButton duration={5000} />
      </body>
    </html>
  )
}
