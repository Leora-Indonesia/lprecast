import { getVendorProfileByUserId } from "../../actions"
import { notFound } from "next/navigation"
import { ArrowLeft, FileText, User, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChecklistWorkspace } from "@/components/admin/checklist-workspace"
import { DocumentViewerDialog } from "@/components/vendor/DocumentViewerDialog"

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

export default async function VendorApprovalWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getVendorProfileByUserId(id)

  if (!data) {
    notFound()
  }

  const { profile, draft_data, documents, factory_addresses } = data

  const companyInfo = draft_data?.company_info as
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

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-6">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/vendors/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            Workspace Penilaian Vendor
            <Badge variant="secondary">{companyName}</Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            Layar split untuk memudahkan auditor memeriksa bukti saat mengisi
            checklist.
          </p>
        </div>
      </div>

      {/* Main Grid: Left (Evidence) | Right (Checklist) */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left Side: Real Vendor Data / Documents */}
        <div className="flex h-full min-h-0 flex-col rounded-lg border bg-background p-4 shadow-sm xl:col-span-5">
          <h3 className="mb-4 flex shrink-0 items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-muted-foreground" />
            Referensi Data
          </h3>

          <ScrollArea className="flex-1 pr-4">
            <Tabs defaultValue="dokumen" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dokumen">
                  Dokumen Legal ({documents.length})
                </TabsTrigger>
                <TabsTrigger value="profil">Profil</TabsTrigger>
              </TabsList>

              <TabsContent value="dokumen" className="mt-4 space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardHeader className="bg-muted/50 py-3">
                        <CardTitle className="flex items-center justify-between text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {documentTypeLabels[doc.document_type] ||
                              doc.document_type}
                          </div>
                          {doc.document_number && (
                            <span className="rounded-md border px-2 py-0.5 text-xs font-normal text-muted-foreground">
                              No: {doc.document_number}
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="flex flex-col gap-3">
                          <p
                            className="truncate text-xs text-muted-foreground"
                            title={doc.file_name}
                          >
                            File: {doc.file_name}
                          </p>
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
                                variant="secondary"
                                className="w-full text-xs"
                                size="sm"
                              >
                                Buka Dokumen (Viewer)
                              </Button>
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="mt-4 rounded-lg border-2 border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Vendor belum mengunggah dokumen.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="profil" className="mt-4 space-y-4 text-sm">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Info Utama</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Nama Perusahaan
                      </p>
                      <p className="font-medium">{companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nama PIC</p>
                      <p className="font-medium">
                        {companyInfo?.nama_pic || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {companyInfo?.email || profile.user_email || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Kontak PIC
                      </p>
                      <p className="font-medium">
                        {companyInfo?.kontak_pic || "-"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      Alamat Workshop
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {factory_addresses.length > 0 ? (
                      factory_addresses.map((factory) => (
                        <div
                          key={factory.id}
                          className="border-b pb-3 last:border-0 last:pb-0"
                        >
                          <p className="text-xs text-muted-foreground">
                            {factory.address}
                          </p>
                          <p className="mt-1 text-xs font-medium">
                            {factory.kecamatan}, {factory.kabupaten},{" "}
                            {factory.province}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Mengecek profil draft...
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>

        {/* Right Side: The Checklist Action Area */}
        <div className="flex h-full min-h-0 flex-col rounded-lg border bg-slate-50/50 p-4 shadow-sm xl:col-span-7">
          <ScrollArea className="flex-1 pr-2">
            <ChecklistWorkspace userId={id} />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
