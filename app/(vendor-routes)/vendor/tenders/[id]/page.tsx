import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarRange, ClipboardList, MapPin } from "lucide-react"

import { formatDate } from "@/lib/datetime"
import { getVendorOpenTenderDetail } from "@/lib/tenders/repository"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Detail Tender | LPrecast",
  description: "Lihat detail tender dan ajukan penawaran",
}

export const dynamic = "force-dynamic"

function formatPeriod(startDate: string | null, endDate: string | null) {
  if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`
  if (startDate) return `Mulai ${formatDate(startDate)}`
  if (endDate) return `Selesai ${formatDate(endDate)}`
  return "Periode belum ditentukan"
}

function formatSubmissionDeadline(value: string | null | undefined) {
  if (!value) return "-"
  return formatDate(value)
}

export default async function TenderDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tender = await getVendorOpenTenderDetail(id)

  if (!tender) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vendor/tenders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke daftar tender
          </Link>
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">{tender.tender_title}</h1>
              <Badge>{tender.tender_status ?? "open"}</Badge>
              {tender.has_submitted ? <Badge variant="secondary">Sudah ajukan</Badge> : null}
            </div>
            <p className="text-muted-foreground">{tender.project_name}</p>
          </div>
          <Button disabled>
            Ajukan Penawaran — segera tersedia
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Ringkasan Tender</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {tender.project_location || "Lokasi belum tersedia"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarRange className="h-4 w-4" /> {formatPeriod(tender.project_start_date, tender.project_end_date)}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Deskripsi</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {tender.tender_description || tender.project_description || "Deskripsi tender belum tersedia."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Item Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tender.items.map((item, index) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <p className="font-medium">{index + 1}. {item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} {item.unit || "unit"}</p>
                  {item.description ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{item.description}</p> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Aturan Tender</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Status</span><Badge>{tender.tender_status ?? "open"}</Badge></div>
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Minimal vendor</span><span>{tender.min_vendors ?? 2}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Batas submit</span><span>{formatSubmissionDeadline(tender.submission_deadline_at)}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Deadline revisi</span><span>{tender.revision_deadline_hours ? `${tender.revision_deadline_hours} jam` : "-"}</span></div>
              <div className="rounded-lg border bg-muted/20 p-3 text-muted-foreground">
                Penawaran vendor akan memakai item tender ini. Nilai SPK mengikuti harga tender x quantity setelah vendor dipilih.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
