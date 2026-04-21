import withSerwistInit from "@serwist/next"
import { spawnSync } from "node:child_process"

// Suppress Serwist Turbopack warning
process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING = "1"

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf-8",
  }).stdout?.trim() ?? crypto.randomUUID()

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  disable: process.env.NODE_ENV !== "production",
})

const customDistDir = process.env.NEXT_DIST_DIR
const devDistDir = customDistDir || `.next-dev-${process.pid}`

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir:
    customDistDir || (process.env.NODE_ENV === "development" ? devDistDir : ".next"),
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "mgjtlmuqsgkhiopwzeni.supabase.co",
      },
    ],
  },
}

export default withSerwist(nextConfig)
