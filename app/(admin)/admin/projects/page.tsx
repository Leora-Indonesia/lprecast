import Link from "next/link"
import { Building2, FolderOpen, Plus } from "lucide-react"

import { createAdminClient } from "@/lib/supabase/admin"
import { formatDate } from "@/lib/datetime"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Project | Admin LPrecast",
  description: "Kelola project utama sebelum publish tender ke vendor",
}

export const dynamic = "force-dynamic"

function formatProjectPeriod(startDate: string | null, endDate: string | null) {
  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  if (startDate) return `Mulai ${formatDate(startDate)}`
  if (endDate) return `Selesai ${formatDate(endDate)}`
  return "-"
}

export default async function AdminProjectsPage() {
  const supabase = createAdminClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, location, status, start_date, end_date, created_at")
    .order("created_at", { ascending: false })

  const rows = projects ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <FolderOpen className="h-6 w-6 text-primary" /> Project
          </h1>
          <p className="text-muted-foreground">
            Buat project dulu sebagai entity utama. Tender dibuat belakangan dari project yang sudah siap.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Project
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-medium">Belum ada project</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tambah project baru untuk menyiapkan parent entity sebelum create tender.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Project Pertama
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.location || "-"}</TableCell>
                  <TableCell>
                    {formatProjectPeriod(project.start_date, project.end_date)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status || "draft"} />
                  </TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/projects/new">Tambah Lagi</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
