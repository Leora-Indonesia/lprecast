import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Presentasi Internal | LPrecast",
  description: "Showcase internal LPrecast Vendor Portal untuk tim product, ops, dan management.",
}

export default function PresentasiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}