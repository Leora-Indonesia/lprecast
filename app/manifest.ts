import type { MetadataRoute } from "next"
import { themeConfig } from "@/lib/theme-config"

/**
 * PWA Manifest - Dynamic
 *
 * All values are sourced from lib/theme-config.ts
 * Do not hardcode colors here; use themeConfig instead.
 *
 * See docs/architecture/pwa.md for theming guide.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: themeConfig.pwa.name,
    short_name: themeConfig.pwa.shortName,
    description: themeConfig.pwa.description,
    start_url: themeConfig.pwa.startUrl,
    display: themeConfig.pwa.display,
    background_color: themeConfig.pwa.backgroundColor,
    theme_color: themeConfig.pwa.themeColor,
    orientation: themeConfig.pwa.orientation,
    scope: themeConfig.pwa.scope,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
