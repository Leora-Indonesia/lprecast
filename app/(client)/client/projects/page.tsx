import Link from "next/link"

import { listClientProjects } from "@/lib/client/repository"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"

export const metadata = {
  title: "Project Saya | LPrecast",
  description: "Kelola dan pantau proyek konstruksi Anda",
}

export default async function ClientProjects() {
  const data = await listClientProjects()

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Saya</h1>
          <p className="text-muted-foreground">
            Ajukan kebutuhan project baru dan pantau status review internal Leora.
          </p>
        </div>
        <Button asChild>
          <Link href="/client/projects/new">Ajukan Project Baru</Link>
        </Button>
      </div>

      {data.projects.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{project.job_type || "Jenis pekerjaan belum diisi"}</p>
                  </div>
                  <StatusBadge status={project.status || "draft"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{project.location || "Lokasi belum tersedia"}</p>
                <Button variant="outline" asChild>
                  <Link href={`/client/projects/${project.id}`}>Lihat Detail</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Belum ada project diajukan. Mulai dari kebutuhan project pertama Anda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
