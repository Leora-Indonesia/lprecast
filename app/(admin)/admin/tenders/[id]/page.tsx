import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ClipboardList } from "lucide-react"

import { formatDate } from "@/lib/datetime"
import { getTenderDetail } from "@/lib/tenders/repository"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Detail Tender | LPrecast",
  description: "Lihat detail tender proyek konstruksi",
}

function formatPeriod(startDate: string | null | undefined, endDate: string | null | undefined) {
  if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`
  if (startDate) return `Mulai ${formatDate(startDate)}`
  if (endDate) return `Selesai ${formatDate(endDate)}`
  return "-"
}

export default async function TenderDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tender = await getTenderDetail(id)

  if (!tender) {
    notFound()
  }

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
              <h1 className="text-2xl font-bold">{tender.title}</h1>
              <Badge>{tender.status}</Badge>
            </div>
            <p className="text-muted-foreground">Tender sudah dipublish ke vendor. Menunggu minimal {tender.min_vendors ?? 2} penawaran.</p>
          </div>
          {tender.project ? (
            <Button variant="outline" asChild>
              <Link href={`/admin/projects/${tender.project.id}`}>Lihat Project</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Ringkasan Vendor-Facing</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-medium">{tender.project?.name ?? "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lokasi publik</p>
                <p className="font-medium">{tender.project?.location ?? "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Periode</p>
                <p className="font-medium">{formatPeriod(tender.project?.start_date, tender.project?.end_date)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Deadline revisi</p>
                <p className="font-medium">{tender.revision_deadline_hours ? `${tender.revision_deadline_hours} jam` : "-"}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Deskripsi tender</p>
                <p className="whitespace-pre-wrap font-medium">{tender.description || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Item Pekerjaan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {tender.items.map((item, index) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{index + 1}. {item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} {item.unit || "unit"}</p>
                    </div>
                  </div>
                  {item.description ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{item.description}</p> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status Tender</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Status</span><Badge>{tender.status}</Badge></div>
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Minimal vendor</span><span>{tender.min_vendors ?? 2}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Dibuat</span><span>{formatDate(tender.created_at)}</span></div>
              <div className="rounded-lg border bg-muted/20 p-3 text-muted-foreground">
                Tender tidak auto-close sampai admin memilih vendor yang sesuai.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
