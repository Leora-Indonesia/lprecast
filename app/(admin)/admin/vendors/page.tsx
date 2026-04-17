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
  revision_requested: "Revisi",
  rejected: "Ditolak",
  active: "Aktif",
  suspended: "Ditangguhkan",
  blacklisted: "Diblokir",
}

const statusVariants: Record<
  string,
  "secondary" | "default" | "destructive" | "outline"
> = {
  draft: "secondary",
  submitted: "default",
  under_review: "default",
  revision_requested: "outline",
  rejected: "destructive",
  active: "outline",
  suspended: "secondary",
  blacklisted: "destructive",
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
                const companyInfo = {
                  ...(vendor.draft_data?.company_info as Record<
                    string,
                    unknown
                  >),
                  ...(vendor.nama_perusahaan && {
                    nama_perusahaan: vendor.nama_perusahaan,
                  }),
                  ...(vendor.email_perusahaan && {
                    email: vendor.email_perusahaan,
                  }),
                  ...(vendor.user_nama && { nama_pic: vendor.user_nama }),
                }

                return (
                  <TableRow key={vendor.user_id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/vendors/${vendor.user_id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {companyInfo.nama_perusahaan || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell>{companyInfo.nama_pic || "-"}</TableCell>
                    <TableCell>
                      {companyInfo.email || vendor.user_email || "-"}
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
                        <Link href={`/admin/vendors/${vendor.user_id}`}>
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
