import { createAdminClient } from "@/lib/supabase/admin"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  User,
  FileText,
  Package,
  CreditCard,
  Contact,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Detail Vendor | LPrecast",
  description: "Lihat detail profil dan performa vendor",
}

type VendorRegistration = {
  id: string
  status: string | null
  created_at: string | null
  submission_date: string | null
  approval_notes: string | null
  reviewed_at: string | null
  vendor_id: string | null
  vendor_company_info: {
    nama_perusahaan: string
    nama_pic: string
    kontak_pic: string
    email: string
    instagram: string | null
    facebook: string | null
    linkedin: string | null
    website: string | null
  } | null
  vendor_contacts: {
    id: string
    nama: string
    jabatan: string
    no_hp: string
    is_primary: boolean | null
    sequence: number
  }[]
  vendor_bank_accounts: {
    id: string
    bank_name: string
    account_number: string
    account_holder_name: string
    is_primary: boolean | null
  }[]
  vendor_products: {
    id: string
    name: string
    description: string | null
    price: number
    satuan: string
    material: string | null
    dimensions: string | null
    is_active: boolean | null
  }[]
  vendor_legal_documents: {
    id: string
    document_type: string
    file_name: string
    document_number: string | null
    verification_status: string | null
    verified_at: string | null
    uploaded_at: string | null
  }[]
  vendor_profiles: {
    id: string
    status: string | null
    approved_at: string | null
    user_id: string
  }[]
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Diajukan",
  under_review: "Ditinjau",
  approved: "Disetujui",
  rejected: "Ditolak",
  revision_requested: "Revisi Diminta",
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
  revision_requested: "outline",
}

const documentTypeLabels: Record<string, string> = {
  ktp: "KTP",
  npwp: "NPWP",
  nib: "NIB",
  siup_sbu: "SIUP/SBU",
  company_profile: "Company Profile",
}

function VerificationBadge({ status }: { status: string | null }) {
  if (!status) {
    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Menunggu
      </Badge>
    )
  }

  if (status === "verified") {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="mr-1 h-3 w-3" />
        Terverifikasi
      </Badge>
    )
  }

  if (status === "rejected") {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Ditolak
      </Badge>
    )
  }

  return (
    <Badge variant="secondary">
      <Clock className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: registration, error } = await supabase
    .from("vendor_registrations")
    .select(
      `
      *,
      vendor_company_info (*),
      vendor_contacts (*),
      vendor_bank_accounts (*),
      vendor_products (*),
      vendor_legal_documents (*),
      vendor_profiles (*)
    `
    )
    .eq("id", id)
    .single()

  if (error || !registration) {
    console.error("Error fetching vendor:", error)
    notFound()
  }

  const vendor: VendorRegistration = registration as VendorRegistration

  let companyInfo = vendor.vendor_company_info
  if (Array.isArray(companyInfo)) {
    companyInfo = companyInfo[0] || null
  }
  const profile = vendor.vendor_profiles?.[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/vendors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {companyInfo?.nama_perusahaan ?? "Vendor"}
          </h1>
          <p className="text-muted-foreground">Detail informasi vendor</p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusVariants[vendor.status ?? "draft"]}>
            {statusLabels[vendor.status ?? "draft"]}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Kontak</TabsTrigger>
          <TabsTrigger value="accounts">Rekening</TabsTrigger>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="documents">Dokumen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informasi Perusahaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-muted-foreground">Nama Perusahaan</div>
                  <div className="font-medium">
                    {companyInfo?.nama_perusahaan ?? "-"}
                  </div>

                  <div className="text-muted-foreground">Nama PIC</div>
                  <div className="font-medium">
                    {companyInfo?.nama_pic ?? "-"}
                  </div>

                  <div className="text-muted-foreground">Kontak PIC</div>
                  <div className="font-medium">
                    {companyInfo?.kontak_pic ?? "-"}
                  </div>

                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{companyInfo?.email ?? "-"}</div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Media Sosial</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {companyInfo?.instagram && (
                      <>
                        <div className="text-muted-foreground">Instagram</div>
                        <div className="font-medium">
                          {companyInfo.instagram}
                        </div>
                      </>
                    )}
                    {companyInfo?.facebook && (
                      <>
                        <div className="text-muted-foreground">Facebook</div>
                        <div className="font-medium">
                          {companyInfo.facebook}
                        </div>
                      </>
                    )}
                    {companyInfo?.linkedin && (
                      <>
                        <div className="text-muted-foreground">LinkedIn</div>
                        <div className="font-medium">
                          {companyInfo.linkedin}
                        </div>
                      </>
                    )}
                    {companyInfo?.website && (
                      <>
                        <div className="text-muted-foreground">Website</div>
                        <div className="font-medium">{companyInfo.website}</div>
                      </>
                    )}
                    {!companyInfo?.instagram &&
                      !companyInfo?.facebook &&
                      !companyInfo?.linkedin &&
                      !companyInfo?.website && (
                        <div className="col-span-2 text-muted-foreground italic">
                          Tidak ada media sosial
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Status Pendaftaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium">
                    <Badge variant={statusVariants[vendor.status ?? "draft"]}>
                      {statusLabels[vendor.status ?? "draft"]}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground">Tanggal Dibuat</div>
                  <div className="font-medium">
                    {formatDate(vendor.created_at)}
                  </div>

                  <div className="text-muted-foreground">Tanggal Submit</div>
                  <div className="font-medium">
                    {formatDate(vendor.submission_date)}
                  </div>

                  <div className="text-muted-foreground">Tanggal Review</div>
                  <div className="font-medium">
                    {formatDate(vendor.reviewed_at)}
                  </div>
                </div>

                {vendor.approval_notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Catatan Approval
                      </div>
                      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        {vendor.approval_notes}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {profile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Vendor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <div className="text-muted-foreground">Status Profil</div>
                    <div className="mt-1 font-medium">
                      <Badge
                        variant={
                          profile.status === "active" ? "default" : "secondary"
                        }
                      >
                        {profile.status ?? "غير نشط"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Approved</div>
                    <div className="mt-1 font-medium">
                      {profile.approved_at
                        ? formatDate(profile.approved_at)
                        : "Belum"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Jumlah Kontak</div>
                    <div className="mt-1 font-medium">
                      {vendor.vendor_contacts?.length ?? 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Jumlah Produk</div>
                    <div className="mt-1 font-medium">
                      {vendor.vendor_products?.length ?? 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="h-5 w-5" />
                Daftar Kontak
              </CardTitle>
              <CardDescription>
                Semua kontak yang terdaftar untuk vendor ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.vendor_contacts && vendor.vendor_contacts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>No. HP</TableHead>
                      <TableHead>Utama</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.vendor_contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.nama}
                        </TableCell>
                        <TableCell>{contact.jabatan}</TableCell>
                        <TableCell>
                          <a
                            href={`tel:${contact.no_hp}`}
                            className="text-primary hover:underline"
                          >
                            {contact.no_hp}
                          </a>
                        </TableCell>
                        <TableCell>
                          {contact.is_primary && (
                            <Badge variant="default">Utama</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada kontak yang terdaftar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Rekening Bank
              </CardTitle>
              <CardDescription>Informasi rekening bank vendor</CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.vendor_bank_accounts &&
              vendor.vendor_bank_accounts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank</TableHead>
                      <TableHead>No. Rekening</TableHead>
                      <TableHead>Nama Rekening</TableHead>
                      <TableHead>Utama</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.vendor_bank_accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.bank_name}
                        </TableCell>
                        <TableCell>{account.account_number}</TableCell>
                        <TableCell>{account.account_holder_name}</TableCell>
                        <TableCell>
                          {account.is_primary && (
                            <Badge variant="default">Utama</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada rekening bank yang terdaftar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produk
              </CardTitle>
              <CardDescription>
                Daftar produk yang ditawarkan vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.vendor_products && vendor.vendor_products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Dimensi</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.vendor_products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.material ?? "-"}</TableCell>
                        <TableCell>{product.dimensions ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>{product.satuan}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.is_active ? "default" : "secondary"
                            }
                          >
                            {product.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada produk yang terdaftar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dokumen Legal
              </CardTitle>
              <CardDescription>
                Dokumen legal yang telah diupload dan diverifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.vendor_legal_documents &&
              vendor.vendor_legal_documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Dokumen</TableHead>
                      <TableHead>Nama File</TableHead>
                      <TableHead>Nomor Dokumen</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.vendor_legal_documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {documentTypeLabels[doc.document_type] ??
                            doc.document_type}
                        </TableCell>
                        <TableCell>{doc.file_name}</TableCell>
                        <TableCell>{doc.document_number ?? "-"}</TableCell>
                        <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                        <TableCell>
                          <VerificationBadge status={doc.verification_status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada dokumen legal yang diupload
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
