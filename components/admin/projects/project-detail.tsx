"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, CalendarRange, MapPin, PencilLine, UserRound } from "lucide-react"

import type { ProjectDetail as ProjectDetailType } from "@/lib/projects/types"
import { formatDate, formatDateTime } from "@/lib/datetime"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"

import { ProjectAttachments } from "./project-attachments"
import { ProjectMilestones } from "./project-milestones"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatBudgetRange(min: number | null, max: number | null) {
  if (min == null && max == null) return "-"
  if (min != null && max != null) return `${formatCurrency(min)} - ${formatCurrency(max)}`
  if (min != null) return `Mulai ${formatCurrency(min)}`
  return `Sampai ${formatCurrency(max ?? 0)}`
}

export function ProjectDetail({ project }: { project: ProjectDetailType }) {
  const [activeAudience, setActiveAudience] = useState<"client" | "admin" | "spv">("client")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke daftar project
          </Link>
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Dibuat {formatDateTime(project.created_at)}</span>
              <span>Diubah {formatDateTime(project.updated_at)}</span>
            </div>
          </div>

          <Button asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <PencilLine /> Edit Project
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={activeAudience === "client" ? "default" : "outline"} onClick={() => setActiveAudience("client")}>Client</Button>
          <Button type="button" variant={activeAudience === "admin" ? "default" : "outline"} onClick={() => setActiveAudience("admin")}>Admin / Internal</Button>
          <Button type="button" variant={activeAudience === "spv" ? "default" : "outline"} onClick={() => setActiveAudience("spv")}>SPV</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Project</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Status saat ini</span>
          <StatusBadge status={project.status} />
          <span>Ubah data hanya lewat tombol Edit Project.</span>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-6">
          {activeAudience === "admin" ? (
            <>
              <Card>
                <CardHeader><CardTitle>Identitas Project</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> Lokasi</div>
                    <p className="font-medium">{project.location || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarRange className="h-4 w-4" /> Periode Kerja</div>
                    <p className="font-medium">{project.start_date ? formatDate(project.start_date) : "-"} - {" "}{project.end_date ? formatDate(project.end_date) : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><UserRound className="h-4 w-4" /> Customer</div>
                    <p className="font-medium">{project.customer_name || "-"}</p>
                    <p className="text-xs text-muted-foreground">Client profile: {project.client_profile_id || "-"} · Client user: {project.client_id || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nilai Kontrak</p>
                    <p className="font-medium">{formatCurrency(project.contract_value)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Timeline & Commercial</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Periode kerja</p>
                    <p className="font-medium">{project.start_date ? formatDate(project.start_date) : "-"} - {" "}{project.end_date ? formatDate(project.end_date) : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Target tanggal selesai</p>
                    <p className="font-medium">{formatDate(project.target_completion_date)}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Budget client</p>
                    <p className="font-medium">{formatBudgetRange(project.budget_min, project.budget_max)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Internal Review</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Status review internal</p><p className="font-medium">{project.qualification_status || "-"}</p></div>
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Catatan review internal</p><p className="font-medium whitespace-pre-wrap">{project.qualification_notes || "-"}</p></div>
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Internal notes</p><p className="font-medium whitespace-pre-wrap">{project.internal_notes || "-"}</p></div>
                </CardContent>
              </Card>

              <ProjectAttachments projectId={project.id} initialAttachments={project.attachments} readOnly />
            </>
          ) : null}

          {activeAudience === "client" ? (
            <>
              <Card>
                <CardHeader><CardTitle>Lokasi Proyek</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Alamat Lengkap Proyek</p><p className="font-medium whitespace-pre-wrap">{project.site_address_full || "-"}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Provinsi ID</p><p className="font-medium">{project.province_id || "-"}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Kota / Kabupaten ID</p><p className="font-medium">{project.city_id || "-"}</p></div>
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Koordinat lokasi</p><p className="font-medium">{project.site_coordinates || "-"}</p></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Scope & Kebutuhan</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Jenis pekerjaan</p><p className="font-medium">{project.job_type || "-"}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Estimasi volume</p><p className="font-medium">{project.estimated_length_or_area ?? "-"} {project.measurement_unit || ""}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Target tanggal selesai</p><p className="font-medium">{formatDate(project.target_completion_date)}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Budget range</p><p className="font-medium">{formatBudgetRange(project.budget_min, project.budget_max)}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Estimasi tinggi</p><p className="font-medium">{project.estimated_height || "-"}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Preferensi pondasi</p><p className="font-medium">{project.foundation_preference || "-"}</p></div>
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Deskripsi kebutuhan awal</p><p className="font-medium whitespace-pre-wrap">{project.initial_description || "-"}</p></div>
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Kebutuhan khusus</p><p className="font-medium whitespace-pre-wrap">{project.special_requirements || "-"}</p></div>
                </CardContent>
              </Card>

              <ProjectAttachments projectId={project.id} initialAttachments={project.attachments} readOnly />
            </>
          ) : null}

          {activeAudience === "spv" ? (
            <>
              <Card>
                <CardHeader><CardTitle>Kondisi Lokasi</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Kondisi lokasi</p><p className="font-medium">{project.site_condition || "-"}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Akses kendaraan</p><p className="font-medium">{project.vehicle_access || "-"}</p></div>
                  <div className="space-y-1 md:col-span-2"><p className="text-sm text-muted-foreground">Preferensi pondasi</p><p className="font-medium">{project.foundation_preference || "-"}</p></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Planning & Readiness</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="rounded-lg border bg-muted/20 p-4">Toggle SPV dipisah dulu untuk menjaga lane operasional tetap jelas. Area ini akan menampung Kurva S baseline, schedule, dan readiness pre-con.</div>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>SPV hanya operasional, tidak melihat payment lane.</li>
                    <li>Data lokasi dan site condition jadi bekal awal verifikasi lapangan.</li>
                    <li>Milestone operasional bisa dipantau dari panel samping.</li>
                  </ul>
                </CardContent>
              </Card>

              <ProjectAttachments projectId={project.id} initialAttachments={project.attachments} readOnly />
            </>
          ) : null}
          <ProjectMilestones projectId={project.id} initialMilestones={project.milestones} readOnly />
        </div>
      </div>
    </div>
  )
}
