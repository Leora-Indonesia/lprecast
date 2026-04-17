import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/datetime"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Building2,
  User,
  FileText,
  Package,
  CreditCard,
  Contact,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Truck,
  DollarSign,
  PlusCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  getVendorProfileByUserId,
  checkVendorTransactions,
  type VendorProductDetail,
} from "../actions"
import { DocumentViewerDialog } from "@/components/vendor/DocumentViewerDialog"
import { ProductDetailDialog } from "@/components/admin/product-detail-dialog"

export const metadata = {
  title: "Detail Vendor | LPrecast",
  description: "Lihat detail profil dan performa vendor",
}

const costInclusionLabels: Record<string, string> = {
  mobilisasi_demobilisasi: "Mobilisasi & Demobilisasi",
  penginapan_tukang: "Penginapan Tukang",
  biaya_pengiriman: "Biaya Pengiriman",
  biaya_langsir: "Biaya Langsir",
  instalasi: "Instalasi",
  ppn: "PPN",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Diajukan",
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

const documentTypeLabels: Record<string, string> = {
  ktp: "KTP",
  npwp: "NPWP",
  nib: "NIB",
  siup_sbu: "SIUP/SBU",
  company_profile: "Company Profile",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const _adminUserId = (await supabase.auth.getUser()).data.user?.id

  const data = await getVendorProfileByUserId(id)

  if (!data) {
    notFound()
  }

  const {
    profile,
    draft_data,
    documents,
    contacts,
    bank_accounts,
    factory_addresses,
    products,
    delivery_areas,
    cost_inclusions,
    additional_costs,
  } = data

  const companyInfo = {
    ...(draft_data?.company_info as Record<string, unknown>),
    ...(profile.nama_perusahaan && {
      nama_perusahaan: profile.nama_perusahaan,
    }),
    ...(profile.email_perusahaan && { email: profile.email_perusahaan }),
    ...(profile.website && { website: profile.website }),
    ...(profile.instagram && { instagram: profile.instagram }),
    ...(profile.facebook && { facebook: profile.facebook }),
    ...(profile.linkedin && { linkedin: profile.linkedin }),
    ...(profile.user_nama && { nama_pic: profile.user_nama }),
    ...(profile.user_no_hp && { kontak_pic: profile.user_no_hp }),
  } as {
    nama_perusahaan?: string
    nama_pic?: string
    email?: string
    kontak_pic?: string
    website?: string
    instagram?: string
    facebook?: string
    linkedin?: string
  }

  const primaryContact = contacts.find((c) => c.is_primary) || contacts[0]

  const transactionStatus = await checkVendorTransactions(profile.user_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {companyInfo?.nama_perusahaan ||
              profile.nama_perusahaan ||
              profile.user_nama ||
              "Vendor"}
          </h1>
          <p className="text-muted-foreground">Detail informasi vendor</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={statusVariants[profile.status]}>
            {statusLabels[profile.status] || profile.status}
          </Badge>
          <Button variant="destructive" asChild>
            <Link href={`/admin/vendors/${profile.user_id}/delete`}>Hapus</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="operational">Operasional</TabsTrigger>
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
                    {primaryContact?.nama || companyInfo.nama_pic || "-"}
                  </div>

                  <div className="text-muted-foreground">Kontak PIC</div>
                  <div className="font-medium">
                    {primaryContact?.no_hp || companyInfo.kontak_pic || "-"}
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
                    <Badge variant={statusVariants[profile.status]}>
                      {statusLabels[profile.status]}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground">Tanggal Dibuat</div>
                  <div className="font-medium">
                    {formatDate(profile.created_at)}
                  </div>

                  <div className="text-muted-foreground">Tanggal Submit</div>
                  <div className="font-medium">
                    {formatDate(profile.submitted_at)}
                  </div>

                  <div className="text-muted-foreground">Tanggal Review</div>
                  <div className="font-medium">
                    {formatDate(profile.reviewed_at)}
                  </div>
                </div>

                {profile.approval_notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Catatan Approval
                      </div>
                      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        {profile.approval_notes}
                      </div>
                    </div>
                  </>
                )}

                {profile.rejection_reason && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Alasan Penolakan
                      </div>
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {profile.rejection_reason}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {profile && (
            <>
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
                            profile.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {profile.status || "Tidak Aktif"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Approved</div>
                      <div className="mt-1 font-medium">
                        {profile.reviewed_at
                          ? formatDate(profile.reviewed_at)
                          : "Belum"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Jumlah Kontak</div>
                      <div className="mt-1 font-medium">{contacts.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Jumlah Produk</div>
                      <div className="mt-1 font-medium">{products.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tender Submit</div>
                      <div className="mt-1 font-medium">
                        {transactionStatus.tenderSubmissions}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Kontrak SPK</div>
                      <div className="mt-1 font-medium">
                        {transactionStatus.vendorSpk}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Pembayaran</div>
                      <div className="mt-1 font-medium">
                        {transactionStatus.paymentRequests}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">KPI Scores</div>
                      <div className="mt-1 font-medium">
                        {transactionStatus.vendorKpiScores}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Contact className="h-5 w-5" />
                    Daftar Kontak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contacts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Jabatan</TableHead>
                          <TableHead>No. HP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>{contact.sequence}</TableCell>
                            <TableCell className="font-medium">
                              {contact.nama}
                            </TableCell>
                            <TableCell>{contact.jabatan}</TableCell>
                            <TableCell>{contact.no_hp}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      Tidak ada kontak
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Rekening Bank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bank_accounts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bank</TableHead>
                          <TableHead>No. Rekening</TableHead>
                          <TableHead>Nama Rekening</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bank_accounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell className="font-medium">
                              {account.bank_name}
                            </TableCell>
                            <TableCell>{account.account_number}</TableCell>
                            <TableCell>{account.account_holder_name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      Tidak ada rekening
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Dimensi</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.material || "-"}</TableCell>
                        <TableCell>{product.dimensions || "-"}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>{product.satuan}</TableCell>
                        <TableCell className="text-right">
                          <ProductDetailDialog
                            product={
                              {
                                ...product,
                                vendor: {
                                  user_id: profile.user_id,
                                  nama_perusahaan:
                                    profile.nama_perusahaan || null,
                                  email_perusahaan:
                                    profile.email_perusahaan || null,
                                  status: profile.status,
                                  user_nama: profile.user_nama,
                                  user_no_hp: profile.user_no_hp,
                                  user_email: profile.user_email,
                                },
                              } as VendorProductDetail
                            }
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-1 h-4 w-4" />
                                Detail
                              </Button>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada produk
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Alamat Pabrik
              </CardTitle>
            </CardHeader>
            <CardContent>
              {factory_addresses.length > 0 ? (
                factory_addresses.map((factory) => (
                  <div
                    key={factory.id}
                    className="grid grid-cols-2 gap-4 text-sm"
                  >
                    <div className="text-muted-foreground">Alamat</div>
                    <div className="font-medium">{factory.address || "-"}</div>
                    <div className="text-muted-foreground">Provinsi</div>
                    <div className="font-medium">{factory.province || "-"}</div>
                    <div className="text-muted-foreground">Kabupaten/Kota</div>
                    <div className="font-medium">
                      {factory.kabupaten || "-"}
                    </div>
                    <div className="text-muted-foreground">Kecamatan</div>
                    <div className="font-medium">
                      {factory.kecamatan || "-"}
                    </div>
                    <div className="text-muted-foreground">Kode Pos</div>
                    <div className="font-medium">
                      {factory.postal_code || "-"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada alamat
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Area Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent>
              {delivery_areas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {delivery_areas.map((area) => (
                    <Badge key={area.id} variant="outline">
                      {area.province_name || "Unknown"}{" "}
                      {area.city_name ? `- ${area.city_name}` : ""}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada area pengiriman
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Biaya Termasuk
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cost_inclusions.length > 0 ? (
                <div className="space-y-3">
                  {cost_inclusions.map((cost) => (
                    <div key={cost.id} className="flex items-center gap-3">
                      {cost.is_included ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <div className="font-medium">
                        {costInclusionLabels[cost.inclusion_type] ||
                          cost.inclusion_type}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada informasi
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Biaya Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {additional_costs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead>Satuan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {additional_costs.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell className="font-medium">
                          {cost.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cost.amount)}
                        </TableCell>
                        <TableCell>{cost.unit || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada biaya tambahan
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
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Dokumen</TableHead>
                      <TableHead>Nomor Dokumen</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {documentTypeLabels[doc.document_type] ||
                            doc.document_type}
                        </TableCell>
                        <TableCell>{doc.document_number || "-"}</TableCell>
                        <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                        <TableCell>
                          <DocumentViewerDialog
                            document={{
                              id: doc.id,
                              document_type: doc.document_type,
                              document_number: doc.document_number,
                              file_name: doc.file_name,
                              file_path: doc.file_path,
                              file_size: doc.file_size,
                              mime_type: doc.mime_type,
                              verification_status: null,
                              verified_at: null,
                              uploaded_at: doc.uploaded_at,
                            }}
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-1 h-4 w-4" />
                                Lihat
                              </Button>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada dokumen
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
