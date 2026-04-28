import Link from "next/link"

import { requireRole } from "@/lib/auth"

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole("client")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Portal Client</p>
            <h1 className="text-lg font-semibold">{user.profile?.nama_perusahaan || user.profile?.nama}</h1>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/client/dashboard">Dashboard</Link>
            <Link href="/client/profile">Profil</Link>
            <Link href="/client/projects">Project</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
