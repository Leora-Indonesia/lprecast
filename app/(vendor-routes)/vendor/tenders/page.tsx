import Link from "next/link"
import { CalendarRange, FileText, MapPin } from "lucide-react"

import { formatDate } from "@/lib/datetime"
import { listVendorOpenTenders } from "@/lib/tenders/repository"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Tender Tersedia | LPrecast",
  description: "Lihat dan ajukan tender proyek yang tersedia",
}

export const dynamic = "force-dynamic"

function formatPeriod(startDate: string | null, endDate: string | null) {
  if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`
  if (startDate) return `Mulai ${formatDate(startDate)}`
  if (endDate) return `Selesai ${formatDate(endDate)}`
  return "Periode belum ditentukan"
}

export default async function VendorTenders() {
  const tenders = await listVendorOpenTenders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <FileText className="h-6 w-6 text-primary" /> Tender Tersedia
        </h1>
        <p className="text-muted-foreground">
          Lihat tender open yang bisa diakses vendor. Data client dan catatan internal tidak ditampilkan.
        </p>
      </div>

      {tenders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Belum ada tender open saat ini.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {tenders.map((tender) => (
            <Card key={tender.tender_id}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>{tender.tender_title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tender.project_name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Open</Badge>
                    {tender.has_submitted ? <Badge variant="secondary">Sudah ajukan</Badge> : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {tender.tender_description || tender.project_description || "Deskripsi tender belum tersedia."}
                </p>

                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {tender.project_location || "Lokasi belum tersedia"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarRange className="h-4 w-4" /> {formatPeriod(tender.project_start_date, tender.project_end_date)}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t pt-4 text-sm">
                  <span className="text-muted-foreground">Minimal vendor: {tender.min_vendors ?? 2}</span>
                  <Button asChild>
                    <Link href={`/vendor/tenders/${tender.tender_id}`}>Lihat Detail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
