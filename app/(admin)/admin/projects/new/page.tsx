import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProjectForm } from "@/components/admin/project-form"
import { Button } from "@/components/ui/button"
import { listClients } from "@/lib/client/repository"
import { listCityOptions, listProvinceOptions } from "@/lib/projects/repository"

export const metadata = {
  title: "Tambah Project | Admin LPrecast",
  description: "Buat project baru dan simpan lampiran pendukung sebelum create tender",
}

export default async function AdminProjectCreatePage() {
  const [{ clients }, provinces, cities] = await Promise.all([
    listClients({ limit: 100 }),
    listProvinceOptions(),
    listCityOptions(),
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke daftar project
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Tambah Project</h1>
          <p className="text-muted-foreground">
            Simpan data project utama lebih dulu. Tender akan dibuat dari project ini saat siap dipublish ke vendor.
          </p>
        </div>
      </div>

      <ProjectForm
        mode="create"
        clientOptions={clients}
        provinceOptions={provinces}
        cityOptions={cities}
      />
    </div>
  )
}
