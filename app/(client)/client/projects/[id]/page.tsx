import Link from "next/link"
import { notFound } from "next/navigation"

import { getClientProjectDetail } from "@/lib/client/repository"
import { formatDate, formatDateTime } from "@/lib/datetime"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"

export const metadata = {
  title: "Detail Proyek | LPrecast",
  description: "Lihat detail dan progres proyek konstruksi",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatBudgetRange(min: unknown, max: unknown) {
  const minValue = typeof min === "number" ? min : min != null ? Number(min) : null
  const maxValue = typeof max === "number" ? max : max != null ? Number(max) : null

  if (!Number.isFinite(minValue as number) && !Number.isFinite(maxValue as number)) return "-"
  if (Number.isFinite(minValue as number) && Number.isFinite(maxValue as number)) {
    return `${formatCurrency(minValue as number)} - ${formatCurrency(maxValue as number)}`
  }
  if (Number.isFinite(minValue as number)) return `Mulai ${formatCurrency(minValue as number)}`
  return `Sampai ${formatCurrency(maxValue as number)}`
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getClientProjectDetail(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <StatusBadge status={project.status || "draft"} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Diajukan {formatDateTime(project.created_at)}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/client/projects">Kembali ke daftar</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Proyek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Jenis pekerjaan</p>
              <p className="font-medium">{String(project.job_type || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Lokasi ringkas</p>
              <p className="font-medium">{String(project.location || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Alamat lengkap</p>
              <p className="font-medium whitespace-pre-wrap">{String(project.site_address_full || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Target tanggal selesai</p>
              <p className="font-medium">{formatDate(project.target_completion_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimasi volume</p>
              <p className="font-medium">
                {String(project.estimated_length_or_area || "-")} {String(project.measurement_unit || "")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Budget range</p>
              <p className="font-medium">{formatBudgetRange(project.budget_min, project.budget_max)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kondisi dan Kebutuhan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Deskripsi awal</p>
              <p className="font-medium whitespace-pre-wrap">{String(project.initial_description || project.description || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kondisi lokasi</p>
              <p className="font-medium">{String(project.site_condition || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Akses kendaraan</p>
              <p className="font-medium">{String(project.vehicle_access || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimasi tinggi</p>
              <p className="font-medium">{String(project.estimated_height || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Preferensi pondasi</p>
              <p className="font-medium">{String(project.foundation_preference || "-")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kebutuhan khusus</p>
              <p className="font-medium whitespace-pre-wrap">{String(project.special_requirements || "-")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
