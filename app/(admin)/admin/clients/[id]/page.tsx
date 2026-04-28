import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { getClientById, listProvinceOptions, listCityOptions } from "@/lib/client/repository"
import { formatDate } from "@/lib/datetime"
import { ClientForm } from "@/components/admin/client-form"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Detail Klien | Admin LPrecast",
  description: "Detail dan edit data klien",
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [client, provinces, cities] = await Promise.all([
    getClientById(id),
    listProvinceOptions(),
    listCityOptions(),
  ])

  if (!client) {
    notFound()
  }

  const provinceMap = new Map(provinces.map((p) => [p.id, p.name]))
  const cityMap = new Map(cities.map((c) => [c.id, c.name]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Klien</h1>
            <p className="text-muted-foreground">Edit data klien</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-muted-foreground">Nama Client</span>
              <span className="font-medium">{client.client_name || "-"}</span>

              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{client.email || "-"}</span>

              <span className="text-muted-foreground">Telepon</span>
              <span className="font-medium">{client.phone || "-"}</span>

              <span className="text-muted-foreground">Tipe</span>
              <span className="font-medium">{client.client_type || "-"}</span>

              <span className="text-muted-foreground">Nama PT (Legal)</span>
              <span className="font-medium">{client.company_name_legal || "-"}</span>

              <span className="text-muted-foreground">Status</span>
              <span>
                <StatusBadge status={client.verification_status ?? "pending"} />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi PIC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-muted-foreground">Nama PIC</span>
              <span className="font-medium">{client.pic_name || "-"}</span>

              <span className="text-muted-foreground">Posisi</span>
              <span className="font-medium">{client.pic_position || "-"}</span>

              <span className="text-muted-foreground">Alamat Kantor</span>
              <span className="font-medium">{client.office_address || "-"}</span>

              <span className="text-muted-foreground">Provinsi</span>
              <span className="font-medium">{provinceMap.get(client.province_id ?? "") || "-"}</span>

              <span className="text-muted-foreground">Kota</span>
              <span className="font-medium">{cityMap.get(client.city_id ?? "") || "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Catatan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{client.notes || "-"}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Verifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.verification_notes && (
              <p className="text-sm whitespace-pre-wrap">
                <span className="font-medium">Catatan:</span> {client.verification_notes}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Dibuat: {formatDate(client.created_at)}
              {client.updated_at && ` | Diupdate: ${formatDate(client.updated_at)}`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <ClientForm
          clientId={client.id}
          defaultValues={{
            client_name: client.client_name ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            client_type: (client.client_type as "individu" | "developer" | "kontraktor" | "perusahaan") ?? undefined,
            company_name_legal: client.company_name_legal,
            pic_name: client.pic_name ?? "",
            pic_position: client.pic_position,
            office_address: client.office_address ?? "",
            province_id: client.province_id ?? "",
            city_id: client.city_id ?? "",
            notes: client.notes,
            verification_status: client.verification_status ?? "",
            verification_notes: client.verification_notes,
          }}
          provinces={provinces}
          cities={cities}
          isDetail
        />
      </div>
    </div>
  )
}