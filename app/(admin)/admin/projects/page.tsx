import Link from "next/link"
import { FolderOpen, Plus, Search } from "lucide-react"

import { getProjectList, getProjectSummary } from "@/lib/projects/repository"
import type { ProjectStatus } from "@/lib/projects/types"
import { formatDate } from "@/lib/datetime"
import { ProjectSummaryCards } from "@/components/admin/projects/project-summary-cards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type SearchParams = {
  q?: string
  status?: string
}

const statusOptions: Array<{ value: ProjectStatus | "all"; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "draft", label: "Draft" },
  { value: "open", label: "Tendering" },
  { value: "in_progress", label: "Berjalan" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
]

function formatProjectPeriod(startDate: string | null, endDate: string | null) {
  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  if (startDate) return `Mulai ${formatDate(startDate)}`
  if (endDate) return `Selesai ${formatDate(endDate)}`
  return "-"
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const search = params.q?.trim() ?? ""
  const status = (params.status as ProjectStatus | "all" | undefined) ?? "all"

  const [rows, summary] = await Promise.all([
    getProjectList({ search, status }),
    getProjectSummary(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <FolderOpen className="h-6 w-6 text-primary" /> Project
          </h1>
          <p className="text-muted-foreground">
            Kelola project internal sebelum publish tender, assignment vendor, dan execution lane.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Tambah Project
          </Link>
        </Button>
      </div>

      <ProjectSummaryCards summary={summary} />

      <form className="grid gap-3 rounded-xl border p-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={search} placeholder="Cari nama atau lokasi project" className="pl-9" />
        </div>

        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Button type="submit" variant="outline">
          Terapkan Filter
        </Button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Tidak ada project yang cocok dengan filter saat ini.
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
                  <TableCell>{formatProjectPeriod(project.start_date, project.end_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/projects/${project.id}`}>Lihat</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
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
