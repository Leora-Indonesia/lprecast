import Link from "next/link"

import { getClientProfileContext, listClientProjects } from "@/lib/client/repository"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Dashboard Client | LPrecast",
  description: "Portal client untuk mengelola proyek konstruksi",
}

export default async function ClientDashboard() {
  const [context, projectsData] = await Promise.all([
    getClientProfileContext(),
    listClientProjects(),
  ])

  if (!context || !projectsData) {
    return null
  }

  const projects = projectsData.projects

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Client</h1>
        <p className="text-muted-foreground">
          Lengkapi profil client dan ajukan kebutuhan project baru untuk direview tim internal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Profil Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{context.profile ? "Lengkap" : "Belum"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Project Diajukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Status Verifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{context.profile?.verification_status || "Pending"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Step</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            {context.profile
              ? "Profil client sudah ada. Lanjut buat project intake untuk tim internal."
              : "Lengkapi profil client dulu supaya data perusahaan dan PIC tersimpan rapi."}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/client/profile">{context.profile ? "Edit Profil" : "Lengkapi Profil"}</Link>
            </Button>
            <Button asChild>
              <Link href="/client/projects/new">Ajukan Project</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
