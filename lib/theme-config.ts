/**
 * ⚠️  AI AGENT: READ BEFORE MODIFYING
 *
 * THEME CONFIGURATION - SINGLE SOURCE OF TRUTH
 *
 * This file is the SINGLE SOURCE OF TRUTH for all colors and theme configuration.
 * Changing colors here will automatically update:
 * - app/manifest.ts (PWA theme color)
 * - app/layout.tsx (viewport meta)
 * - app/~offline/page.tsx (offline page styling)
 *
 * However, you MUST also manually update app/globals.css to sync CSS variables.
 * Search & replace the hex values in globals.css when changing colors here.
 *
 * For complete documentation, see: docs/architecture/pwa.md
 */

export const themeConfig = {
  // ==========================================
  // WARNA UTAMA APLIKASI
  // ==========================================
  colors: {
    light: {
      primary: "#16a34a", // Green-600 (Hijau konstruksi)
      "primary-foreground": "#f0fdf4", // Green-50 (Teks di atas primary)
      background: "#ffffff", // White
      foreground: "#0a0a0a", // Dark (Teks utama)
      card: "#ffffff",
      "card-foreground": "#0a0a0a",
      popover: "#ffffff",
      "popover-foreground": "#0a0a0a",
      secondary: "#f5f5f5", // Gray-100
      "secondary-foreground": "#171717", // Neutral-900
      muted: "#f5f5f5", // Gray-100
      "muted-foreground": "#737373", // Gray-500
      accent: "#f5f5f5", // Gray-100
      "accent-foreground": "#171717",
      destructive: "#ef4444", // Red-500
      border: "#e5e5e5", // Gray-200
      input: "#e5e5e5", // Gray-200
      ring: "#16a34a", // Focus ring
      chart1: "#22c55e", // Green-500
      chart2: "#16a34a", // Green-600
      chart3: "#15803d", // Green-700
      chart4: "#166534", // Green-800
      chart5: "#14532d", // Green-900
      sidebar: "#fafafa", // Neutral-50
      "sidebar-foreground": "#0a0a0a",
      "sidebar-primary": "#16a34a",
      "sidebar-primary-foreground": "#f0fdf4",
      "sidebar-accent": "#f5f5f5",
      "sidebar-accent-foreground": "#171717",
      "sidebar-border": "#e5e5e5",
      "sidebar-ring": "#16a34a",
    },
    dark: {
      primary: "#15803d", // Green-700
      "primary-foreground": "#f0fdf4",
      background: "#171717", // Neutral-900
      foreground: "#fafafa", // Neutral-50
      card: "#262626", // Neutral-800
      "card-foreground": "#fafafa",
      popover: "#262626", // Neutral-800
      "popover-foreground": "#fafafa",
      secondary: "#262626", // Neutral-800
      "secondary-foreground": "#fafafa",
      muted: "#262626", // Neutral-800
      "muted-foreground": "#a3a3a3", // Neutral-400
      accent: "#262626", // Neutral-800
      "accent-foreground": "#fafafa",
      destructive: "#f87171", // Red-400
      border: "#404040", // Neutral-700
      input: "#404040", // Neutral-700
      ring: "#15803d", // Focus ring
      chart1: "#4ade80", // Green-400
      chart2: "#22c55e", // Green-500
      chart3: "#16a34a", // Green-600
      chart4: "#15803d", // Green-700
      chart5: "#166534", // Green-800
      sidebar: "#171717", // Neutral-900
      "sidebar-foreground": "#fafafa",
      "sidebar-primary": "#15803d",
      "sidebar-primary-foreground": "#f0fdf4",
      "sidebar-accent": "#262626",
      "sidebar-accent-foreground": "#fafafa",
      "sidebar-border": "#404040",
      "sidebar-ring": "#15803d",
    },
  },

  // ==========================================
  // KONFIGURASI PWA
  // ==========================================
  pwa: {
    name: "LPrecast",
    shortName: "LPrecast",
    description: "Platform Konstruksi Terpercaya untuk Proyek Anda",
    // Warna PWA - Reference ke colors di atas
    get themeColor() {
      return themeConfig.colors.light.primary
    },
    get themeColorDark() {
      return themeConfig.colors.dark.primary
    },
    get backgroundColor() {
      return themeConfig.colors.light.background
    },
    startUrl: "/",
    display: "standalone" as const,
    orientation: "portrait" as const,
    scope: "/",
  },

  // ==========================================
  // METADATA APP
  // ==========================================
  app: {
    name: "LPrecast",
    title: "LPrecast - Platform Konstruksi",
    description: "Platform Konstruksi Terpercaya untuk Proyek Anda",
  },
} as const

// Type exports untuk type safety
export type ThemeConfig = typeof themeConfig
