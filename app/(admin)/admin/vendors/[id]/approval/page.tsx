import { createClient } from "@/lib/supabase/server"
import { getVendorProfileByUserId } from "../../actions"
import { notFound } from "next/navigation"
import {
  Building2,
  ClipboardList,
  Contact,
  CreditCard,
  FileText,
  MapPin,
  Package,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChecklistWorkspace } from "@/components/admin/checklist-workspace"
import { DocumentViewerDialog } from "@/components/vendor/DocumentViewerDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorApprovalReviewProvider } from "@/components/admin/vendor-approval-review-context"
import { VendorApprovalHeaderActions } from "@/components/admin/vendor-approval-header-actions"
import { VendorApprovalHeaderCards } from "@/components/admin/vendor-approval-header-summary"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Approval Workspace | LPrecast",
  description: "Workspace penilaian dokumen & lapangan untuk approval vendor",
}

const documentTypeLabels: Record<string, string> = {
  ktp: "KTP",
  npwp: "NPWP",
  nib: "NIB",
  siup_sbu: "SIUP/SBU",
  company_profile: "Company Profile",
}

const accountStatusLabels: Record<string, string> = {
  active: "Aktif",
  suspended: "Ditangguhkan",
  blacklisted: "Diblokir",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function VendorApprovalWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getVendorProfileByUserId(id)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!data) {
    notFound()
  }

  const {
    profile,
    draft_data,
    approval_draft,
    documents,
    contacts,
    bank_accounts,
    factory_addresses,
    products,
  } = data
  const registrationStatus = profile.registration_status ?? "draft"
  const accountStatus = profile.status ?? "active"
  const accountStatusLabel =
    accountStatusLabels[accountStatus] || accountStatus || "Aktif"

  const companyInfo = {
    ...(draft_data?.company_info as Record<string, unknown>),
    ...(profile.nama_perusahaan && {
      nama_perusahaan: profile.nama_perusahaan,
    }),
    ...(profile.email_perusahaan && { email: profile.email_perusahaan }),
    ...(profile.user_nama && { nama_pic: profile.user_nama }),
    ...(profile.user_no_hp && { kontak_pic: profile.user_no_hp }),
  } as
    | {
        nama_perusahaan?: string
        nama_pic?: string
        email?: string
        kontak_pic?: string
        tahun_berdiri?: string
        kapasitas?: string
      }
    | undefined

  const companyName =
    companyInfo?.nama_perusahaan ||
    profile.nama_perusahaan ||
    profile.user_nama ||
    "Vendor"

  const primaryContact = contacts.find((c) => c.is_primary) || contacts[0]

  const availableDocTypes = new Set(documents.map((d) => d.document_type))
  const requiredLegalDocs = ["ktp", "npwp", "nib", "siup_sbu", "company_profile"]
  const missingLegalDocs = requiredLegalDocs.filter((t) => !availableDocTypes.has(t))

  return (
    <VendorApprovalReviewProvider
      userId={id}
      adminUserId={user?.id || ""}
      initialDraft={approval_draft}
    >
      <div className="flex min-h-0 flex-col space-y-4">
        <div className="flex shrink-0 items-start gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-3 text-2xl font-bold">
              Workspace Penilaian Vendor
              <Badge variant="secondary">{companyName}</Badge>
            </h1>
            <p className="text-sm text-muted-foreground">
              Layar split untuk memudahkan auditor memeriksa bukti saat mengisi checklist.
            </p>
          </div>

          <div className="shrink-0">
            <VendorApprovalHeaderActions />
          </div>
        </div>

        <div className="shrink-0 w-full">
          <VendorApprovalHeaderCards
            registrationStatus={registrationStatus}
            accountStatusLabel={accountStatusLabel}
          />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="flex h-fit flex-col rounded-lg border bg-background shadow-sm xl:col-span-6 xl:self-start">
            <div className="flex shrink-0 items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Referensi Data Vendor</h3>
              </div>
            </div>

            <ScrollArea className="p-4">
              <div className="pr-4 pb-8">
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 gap-1 lg:grid-cols-5">
                    <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                    <TabsTrigger value="documents">Dokumen</TabsTrigger>
                    <TabsTrigger value="operational">Operasional</TabsTrigger>
                    <TabsTrigger value="products">Produk</TabsTrigger>
                    <TabsTrigger value="contacts">Kontak & Rekening</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4" /> Informasi Perusahaan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-muted-foreground">Nama Perusahaan</div>
                          <div className="font-medium">{companyName}</div>
                          <div className="text-muted-foreground">Nama PIC</div>
                          <div className="font-medium">
                            {primaryContact?.nama || companyInfo?.nama_pic || "-"}
                          </div>
                          <div className="text-muted-foreground">Kontak PIC</div>
                          <div className="font-medium">
                            {primaryContact?.no_hp || companyInfo?.kontak_pic || "-"}
                          </div>
                          <div className="text-muted-foreground">Email</div>
                          <div className="font-medium">
                            {companyInfo?.email || profile.user_email || "-"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">Snapshot</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-muted-foreground">Dokumen</div>
                          <div className="font-medium">{documents.length}</div>
                          <div className="text-muted-foreground">Produk</div>
                          <div className="font-medium">{products.length}</div>
                          <div className="text-muted-foreground">Kontak</div>
                          <div className="font-medium">{contacts.length}</div>
                          <div className="text-muted-foreground">Rekening</div>
                          <div className="font-medium">{bank_accounts.length}</div>
                        </div>

                        <div className="rounded-md border bg-muted/30 p-3">
                          <div className="font-semibold">
                            Kelengkapan Dokumen Legal
                          </div>
                          {missingLegalDocs.length === 0 ? (
                            <div className="mt-1 text-muted-foreground">
                              Lengkap (minimum)
                            </div>
                          ) : (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {missingLegalDocs.map((t) => (
                                <Badge key={t} variant="outline">
                                  Kurang: {documentTypeLabels[t] || t}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" /> Dokumen Terlampir
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {documents.length > 0 ? (
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Nomor</TableHead>
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
                                  <TableCell>
                                    {doc.document_number || "-"}
                                  </TableCell>
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
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 text-xs"
                                        >
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
                            Vendor belum mengunggah dokumen
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="operational" className="space-y-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" /> Alamat Pabrik
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {factory_addresses.length > 0 ? (
                          <div className="space-y-4 text-xs">
                            {factory_addresses.map((factory) => (
                              <div
                                key={factory.id}
                                className="grid grid-cols-2 gap-4 border-b pb-4 last:border-0 last:pb-0"
                              >
                                <div className="text-muted-foreground">Alamat</div>
                                <div className="font-medium">
                                  {factory.address || "-"}
                                </div>
                                <div className="text-muted-foreground">Provinsi</div>
                                <div className="font-medium">
                                  {factory.province || "-"}
                                </div>
                                <div className="text-muted-foreground">
                                  Kabupaten/Kota
                                </div>
                                <div className="font-medium">
                                  {factory.kabupaten || "-"}
                                </div>
                                <div className="text-muted-foreground">Kecamatan</div>
                                <div className="font-medium">
                                  {factory.kecamatan || "-"}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-muted-foreground">
                            Tidak ada alamat pabrik
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="products" className="space-y-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4" /> Daftar Produk
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {products.length > 0 ? (
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nama Produk</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Satuan</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {products.map((p) => (
                                <TableRow key={p.id}>
                                  <TableCell className="font-medium">
                                    {p.name || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(p.price || 0)}
                                  </TableCell>
                                  <TableCell>{p.satuan || "-"}</TableCell>
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

                  <TabsContent value="contacts" className="space-y-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Contact className="h-4 w-4" /> Daftar Kontak
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {contacts.length > 0 ? (
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jabatan</TableHead>
                                <TableHead>No. HP</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {contacts.map((c) => (
                                <TableRow key={c.id}>
                                  <TableCell>{c.sequence}</TableCell>
                                  <TableCell className="font-medium">
                                    {c.nama}
                                  </TableCell>
                                  <TableCell>{c.jabatan || "-"}</TableCell>
                                  <TableCell>{c.no_hp || "-"}</TableCell>
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
                      <CardHeader className="py-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <CreditCard className="h-4 w-4" /> Rekening Bank
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {bank_accounts.length > 0 ? (
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Bank</TableHead>
                                <TableHead>No. Rekening</TableHead>
                                <TableHead>Nama Rekening</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bank_accounts.map((a) => (
                                <TableRow key={a.id}>
                                  <TableCell className="font-medium">
                                    {a.bank_name || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {a.account_number || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {a.account_holder_name || "-"}
                                  </TableCell>
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
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>

          <div className="flex h-full min-h-0 flex-col rounded-lg border bg-slate-50/50 shadow-sm xl:col-span-6">
            <div className="flex shrink-0 items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Data Checklist</h3>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="p-4">
                <ChecklistWorkspace />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </VendorApprovalReviewProvider>
  )
}
