"use client"

import { Eye } from "lucide-react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"

type VendorRegistration = {
  id: string
  status: string | null
  created_at: string | null
  vendor_company_info: {
    nama_perusahaan: string
    nama_pic: string
    email: string
  } | null
}

const columns: ColumnDef<VendorRegistration>[] = [
  {
    id: "nama_perusahaan",
    accessorKey: "vendor_company_info.nama_perusahaan",
    header: "Perusahaan",
    cell: ({ row }) => {
      const company = row.original.vendor_company_info
      return company?.nama_perusahaan ?? "-"
    },
  },
  {
    id: "nama_pic",
    accessorKey: "vendor_company_info.nama_pic",
    header: "PIC",
    cell: ({ row }) => {
      const company = row.original.vendor_company_info
      return company?.nama_pic ?? "-"
    },
  },
  {
    id: "email",
    accessorKey: "vendor_company_info.email",
    header: "Email",
    cell: ({ row }) => {
      const company = row.original.vendor_company_info
      return company?.email ?? "-"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "revision_requested"
        | null
      if (!status) return "-"
      return <StatusBadge status={status} />
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/vendors/${row.original.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Lihat
          </Link>
        </Button>
      )
    },
  },
]

interface VendorTableProps {
  data: VendorRegistration[]
}

export function VendorTable({ data }: VendorTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="nama_perusahaan"
      searchPlaceholder="Cari vendor..."
    />
  )
}
