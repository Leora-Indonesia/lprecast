import { getPendingVendorRegistrations } from "./actions"
import { VendorTable } from "@/components/admin/vendor-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/datetime"
import { Building2, Plus } from "lucide-react"

export const metadata = {
  title: "Kelola Vendor | LPrecast",
  description: "Kelola dan verifikasi vendor mitra LPrecast",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Baru",
  under_review: "Ditinjau",
  approved: "Disetujui",
  rejected: "Ditolak",
}

const statusVariants: Record<
  string,
  "secondary" | "default" | "destructive" | "outline"
> = {
  draft: "secondary",
  submitted: "default",
  under_review: "default",
  approved: "outline",
  rejected: "destructive",
}

export default async function AdminVendorsPage() {
  const vendors = await getPendingVendorRegistrations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendor</h1>
          <p className="text-muted-foreground">
            Kelola dan verifikasi vendor mitra
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/vendors/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Vendor Manual
          </Link>
        </Button>
      </div>

      {vendors.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Belum ada vendor</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada vendor yang mengajukan pendaftaran
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perusahaan</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Submit</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => {
                const companyInfo = vendor.draft_data?.company_info as
                  | {
                      nama_perusahaan?: string
                      nama_pic?: string
                      email?: string
                    }
                  | undefined

                return (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/vendors/${vendor.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {companyInfo?.nama_perusahaan ||
                          vendor.user_nama_perusahaan ||
                          "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell>{companyInfo?.nama_pic || "-"}</TableCell>
                    <TableCell>
                      {companyInfo?.email || vendor.user_email || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[vendor.status]}>
                        {statusLabels[vendor.status] || vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vendor.submitted_at
                        ? formatDate(vendor.submitted_at)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/vendors/${vendor.id}`}>
                          Lihat Detail
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
