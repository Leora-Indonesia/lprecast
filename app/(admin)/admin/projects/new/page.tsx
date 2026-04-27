import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProjectForm } from "@/components/admin/project-form"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Tambah Project | Admin LPrecast",
  description: "Buat project baru dan simpan lampiran pendukung sebelum create tender",
}

export default function AdminProjectCreatePage() {
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

      <ProjectForm />
    </div>
  )
}
