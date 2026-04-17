"use client"

import { useState } from "react"
import { VendorApprovalChecklistPreview, adminChecklist, surveyChecklist } from "@/components/admin/vendor-approval-checklist"
import { ArrowLeft, Building2, Contact, CreditCard, Package, MapPin, FileText, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export default function ChecklistPreviewPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }))
  }

  // Calculate scores
  const allAdminItems = adminChecklist.flatMap((s) => s.items)
  const allSurveyItems = surveyChecklist.flatMap((s) => s.items)
  
  const adminCheckedCount = allAdminItems.filter((item) => checkedItems[item.id]).length
  const surveyCheckedCount = allSurveyItems.filter((item) => checkedItems[item.id]).length

  const adminScore = (adminCheckedCount / allAdminItems.length) * 40
  const surveyScore = (surveyCheckedCount / allSurveyItems.length) * 60
  const totalScore = Math.round(adminScore + surveyScore)

  let tier = "REJECT"
  let tierColor = "destructive"
  if (totalScore >= 85) {
    tier = "APPROVED (Tier B/A)"
    tierColor = "default"
  } else if (totalScore >= 70) {
    tier = "CONDITIONAL"
    tierColor = "secondary"
  }

  return (
    <div className="space-y-4 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Workspace Penilaian Vendor
              <Badge variant="secondary">PT. Jaya Precast Abadi (Mockup)</Badge>
            </h1>
            <p className="text-muted-foreground text-sm">
              Layar split untuk memudahkan surveyor memeriksa bukti saat mengisi checklist.
            </p>
          </div>
        </div>
        
        {/* Right side global actions */}
        <div className="flex items-center gap-2">
           <Button variant="outline">Simpan Draft</Button>
           <Button>Submit Checklist</Button>
        </div>
      </div>

      {/* Relocated Scoring Header */}
      <Card className="bg-slate-50 border-slate-200 shrink-0">
        <CardContent className="p-4 flex items-center justify-between gap-8">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Total Skor Penilaian</span>
              <span className="font-bold">{totalScore} / 100</span>
            </div>
            <Progress value={totalScore} className="h-2 bg-slate-200" />
          </div>
          <Separator orientation="vertical" className="h-10 hidden md:block" />
          <div className="flex flex-col items-start gap-1 w-48">
             <span className="text-xs text-muted-foreground">Rekomendasi Output:</span>
             <Badge variant={tierColor as any} className="text-sm px-3 py-1">
               {tier}
             </Badge>
          </div>
          <Separator orientation="vertical" className="h-10 hidden lg:block" />
          <div className="hidden lg:flex text-[10px] text-muted-foreground gap-3">
            <p className="flex flex-col"><strong className="text-slate-700">≥ 85</strong> APPROVED</p>
            <p className="flex flex-col"><strong className="text-slate-700">70-84</strong> CONDITIONAL</p>
            <p className="flex flex-col"><strong className="text-slate-700">&lt; 70</strong> REJECT</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Left (Evidence) | Right (Checklist) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Side: Mock Vendor Data (Scrollable Version) */}
        <div className="xl:col-span-6 h-full flex flex-col min-h-0 border rounded-lg bg-background shadow-sm">
          <div className="p-4 border-b shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Referensi Data Vendor</h3>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-8 pr-4 pb-8">
              
              <div id="overview" className="space-y-4">
                <h4 className="font-semibold px-1 text-sm text-muted-foreground uppercase tracking-wider">1. Overview</h4>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Informasi Perusahaan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-muted-foreground">Nama Perusahaan</div>
                      <div className="font-medium">PT. Jaya Precast Abadi</div>
                      <div className="text-muted-foreground">Nama PIC</div>
                      <div className="font-medium">Budi Santoso</div>
                      <div className="text-muted-foreground">Kontak PIC</div>
                      <div className="font-medium">081234567890</div>
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium">budi@jayaprecast.com</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="documents" className="space-y-4">
                <h4 className="font-semibold px-1 text-sm text-muted-foreground uppercase tracking-wider">2. Dokumen Legal</h4>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Dokumen Terlampir
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Nomor</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">KTP</TableCell>
                          <TableCell>3216061234560001</TableCell>
                          <TableCell><Button variant="ghost" size="sm" className="h-6 text-xs">Lihat</Button></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">NPWP</TableCell>
                          <TableCell>01.234.567.8-432.000</TableCell>
                          <TableCell><Button variant="ghost" size="sm" className="h-6 text-xs">Lihat</Button></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">NIB</TableCell>
                          <TableCell>1234000185934</TableCell>
                          <TableCell><Button variant="ghost" size="sm" className="h-6 text-xs">Lihat</Button></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div id="operational" className="space-y-4">
                <h4 className="font-semibold px-1 text-sm text-muted-foreground uppercase tracking-wider">3. Operasional</h4>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Alamat Pabrik
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="text-muted-foreground">Alamat</div>
                      <div className="font-medium">Jl. Industri Raya Blok C12</div>
                      <div className="text-muted-foreground">Provinsi</div>
                      <div className="font-medium">Jawa Barat</div>
                      <div className="text-muted-foreground">Kabupaten/Kota</div>
                      <div className="font-medium">Kab. Bekasi</div>
                      <div className="text-muted-foreground">Kecamatan</div>
                      <div className="font-medium">Cikarang Utara</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="products" className="space-y-4">
                <h4 className="font-semibold px-1 text-sm text-muted-foreground uppercase tracking-wider">4. Produk</h4>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Package className="h-4 w-4" /> Daftar Produk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Produk</TableHead>
                          <TableHead>Harga</TableHead>
                          <TableHead>Satuan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Panel Beton 240x40x5 cm</TableCell>
                          <TableCell>Rp 120.000</TableCell>
                          <TableCell>Lembar</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Tiang Beton 320x17x17 cm</TableCell>
                          <TableCell>Rp 250.000</TableCell>
                          <TableCell>Batang</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div id="contacts" className="space-y-4">
                <h4 className="font-semibold px-1 text-sm text-muted-foreground uppercase tracking-wider">5. Kontak</h4>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Contact className="h-4 w-4" /> Daftar Kontak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Jabatan</TableHead>
                          <TableHead>No. HP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Budi Santoso</TableCell>
                          <TableCell>Direktur</TableCell>
                          <TableCell>081234567890</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div id="accounts" className="space-y-4">
                <h4 className="font-semibold px-1 text-sm text-muted-foreground uppercase tracking-wider">6. Rekening</h4>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Rekening Bank
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bank</TableHead>
                          <TableHead>No. Rekening</TableHead>
                          <TableHead>Nama Rekening</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">BCA</TableCell>
                          <TableCell>1234567890</TableCell>
                          <TableCell>PT Jaya Precast Abadi</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

            </div>
          </ScrollArea>
        </div>

        {/* Right Side: The Checklist Action Area */}
        <div className="xl:col-span-6 h-full flex flex-col min-h-0 border rounded-lg bg-slate-50/50 p-4 shadow-sm">
          <ScrollArea className="flex-1 pr-2">
            <VendorApprovalChecklistPreview 
               checkedItems={checkedItems} 
               onCheck={handleCheck} 
            />
          </ScrollArea>
        </div>

      </div>
    </div>
  )
}
