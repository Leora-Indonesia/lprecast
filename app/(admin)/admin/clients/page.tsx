import Link from "next/link"
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
import { listClients, listProvinceOptions, listCityOptions } from "@/lib/client/repository"
import { formatDate } from "@/lib/datetime"
import { Users, Plus } from "lucide-react"

export const metadata = {
  title: "Clients | Admin LPrecast",
  description: "Manajemen klien LPrecast",
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.q
  const verificationStatus = params.status

  const [{ clients, total }, provinces, cities] = await Promise.all([
    listClients({ search, verification_status: verificationStatus }),
    listProvinceOptions(),
    listCityOptions(),
  ])

  const provinceMap = new Map(provinces.map((p) => [p.id, p.name]))
  const cityMap = new Map(cities.map((c) => [c.id, c.name]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Klien</h1>
          <p className="text-muted-foreground">Kelola data klien bisnis</p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Klien
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant={!verificationStatus ? "default" : "outline"} size="sm" asChild>
          <Link href="/admin/clients">Semua</Link>
        </Button>
        <Button
          variant={verificationStatus === "pending" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/clients?status=pending">Pending</Link>
        </Button>
        <Button
          variant={verificationStatus === "verified" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/clients?status=verified">Verified</Link>
        </Button>
        <Button
          variant={verificationStatus === "rejected" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/clients?status=rejected">Rejected</Link>
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Belum ada klien</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tambahkan klien baru untuk memulai
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Client</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {client.client_name || client.company_name_legal || "-"}
                    </Link>
                  </TableCell>
                  <TableCell>{client.pic_name || "-"}</TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell>
                    {[
                      cityMap.get(client.city_id ?? ""),
                      provinceMap.get(client.province_id ?? ""),
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={client.verification_status ?? "pending"} />
                  </TableCell>
                  <TableCell>{formatDate(client.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/clients/${client.id}`}>Lihat Detail</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Total: {total} klien
      </div>
    </div>
  )
}