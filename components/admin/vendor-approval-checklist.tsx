"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Types based on the Markdown Checklist
type ChecklistSection = {
  id: string
  title: string
  items: { id: string; label: string; isRedFlag?: boolean }[]
}

export const adminChecklist: ChecklistSection[] = [
  {
    id: "identitas",
    title: "1. Identitas & Legalitas (WAJIB)",
    items: [
      { id: "ktp", label: "KTP pemilik / penanggung jawab" },
      { id: "npwp", label: "NPWP (perorangan / perusahaan)" },
      { id: "nib", label: "NIB / SIUP (jika badan usaha)" },
      { id: "akta", label: "Akta perusahaan (jika PT/CV)" },
      { id: "alamat", label: "Alamat usaha jelas & valid" },
      { id: "kontak", label: "Nomor kontak aktif" },
      { id: "val_nama", label: "Validasi: Nama sesuai dokumen" },
      { id: "val_exp", label: "Validasi: Dokumen tidak kadaluarsa" },
      { id: "val_fiktif", label: "Validasi: Tidak terindikasi fiktif", isRedFlag: true }, 
    ],
  },
  {
    id: "profil",
    title: "2. Profil Usaha",
    items: [
      { id: "brand", label: "Nama usaha / brand" },
      { id: "tahun", label: "Tahun berdiri" },
      { id: "tk_tetap", label: "Jumlah tenaga kerja tetap" },
      { id: "area", label: "Area operasional" },
      { id: "val_umur", label: "Penilaian: Usia usaha relevan (> 1 tahun dsb)" },
    ],
  },
  {
    id: "pengalaman",
    title: "3. Pengalaman & Portofolio",
    items: [
      { id: "min_3", label: "Minimal 3 proyek sejenis" },
      { id: "dok_foto", label: "Dokumentasi foto proyek" },
      { id: "det_proyek", label: "Detail proyek (lokasi, volume, tahun)" },
      { id: "ref", label: "Testimoni / referensi (jika ada)" },
      { id: "val_foto", label: "Validasi: Foto asli / bukan ambil internet", isRedFlag: true },
      { id: "val_relevan", label: "Validasi: Proyek relevan (pagar beton / precast)" },
    ],
  },
  {
    id: "kapasitas",
    title: "4. Kapasitas Produksi",
    items: [
      { id: "vol", label: "Volume produksi per hari" },
      { id: "tim_prod", label: "Jumlah tim produksi" },
      { id: "tim_inst", label: "Jumlah tim instalasi" },
      { id: "alat", label: "Ketersediaan alat" },
      { id: "val_cap", label: "Penilaian: Sesuai target minimal" },
    ],
  },
  {
    id: "komitmen",
    title: "5. Komitmen Sistem & SOP",
    items: [
      { id: "sop", label: "Bersedia mengikuti SOP LPrecast", isRedFlag: true },
      { id: "app", label: "Bersedia menggunakan sistem (app)" },
      { id: "bypass", label: "Bersedia tidak kontak langsung client", isRedFlag: true },
      { id: "escrow", label: "Bersedia sistem escrow" },
    ],
  },
  {
    id: "finance",
    title: "6. Financial Basic Check",
    items: [
      { id: "modal", label: "Memiliki modal kerja dasar" },
      { id: "dp", label: "Tidak bergantung full pada DP" },
      { id: "sustain", label: "Mampu sustain minimal 7 hari kerja" },
    ],
  },
]

export const surveyChecklist: ChecklistSection[] = [
  {
    id: "lokasi",
    title: "7. Lokasi & Infrastruktur",
    items: [
      { id: "lokasi_aktif", label: "Lokasi workshop jelas & aktif", isRedFlag: true },
      { id: "akses", label: "Akses kendaraan memadai" },
      { id: "luas", label: "Area kerja cukup luas" },
      { id: "stabil", label: "Tidak berpindah-pindah" },
    ],
  },
  {
    id: "fasilitas",
    title: "8. Fasilitas Produksi",
    items: [
      { id: "cetakan", label: "Cetakan panel tersedia" },
      { id: "kondisi", label: "Kondisi cetakan baik" },
      { id: "curing", label: "Area curing / pengeringan ada" },
      { id: "tata", label: "Sistem produksi tertata" },
    ],
  },
  {
    id: "peralatan",
    title: "9. Peralatan Kerja",
    items: [
      { id: "angkut", label: "Alat angkat / handling" },
      { id: "lapangan", label: "Alat kerja lapangan lengkap" },
      { id: "kendaraan", label: "Kendaraan operasional (pickup/truck)" },
    ],
  },
  {
    id: "tk_lapangan",
    title: "10. Tenaga Kerja",
    items: [
      { id: "jml_tk", label: "Jumlah tenaga kerja sesuai klaim" },
      { id: "aktif", label: "Pekerja terlihat aktif" },
      { id: "mandor", label: "Ada mandor / leader" },
      { id: "disiplin", label: "Observasi: Disiplin kerja" },
      { id: "tugas", label: "Observasi: Pembagian tugas jelas" },
    ],
  },
  {
    id: "proses",
    title: "11. Proses Produksi (KRITIKAL)",
    items: [
      { id: "campuran", label: "Campuran material konsisten" },
      { id: "cetak", label: "Proses cetak standar" },
      { id: "curing_benar", label: "Curing dilakukan dengan benar" },
      { id: "rapi", label: "Hasil panel rapi & presisi" },
    ],
  },
  {
    id: "kualitas",
    title: "12. Kualitas Produk",
    items: [
      { id: "retak", label: "Tidak retak", isRedFlag: true },
      { id: "rata", label: "Permukaan rata" },
      { id: "dimensi", label: "Dimensi presisi" },
      { id: "finishing", label: "Finishing rapi" },
    ],
  },
  {
    id: "manajemen",
    title: "13. Sistem Manajemen Lapangan",
    items: [
      { id: "catat", label: "Ada pencatatan produksi" },
      { id: "sistem", label: "Ada sistem kerja (tidak chaos)" },
      { id: "komunikasi", label: "Ada komunikasi internal" },
    ],
  },
  {
    id: "safety",
    title: "14. Safety (K3)",
    items: [
      { id: "apd", label: "Pekerja menggunakan APD" },
      { id: "aman", label: "Area kerja relatif aman" },
      { id: "fatal", label: "Tidak ada risiko fatal jelas" },
    ],
  },
  {
    id: "sikap",
    title: "15. Sikap & Profesionalisme Vendor",
    items: [
      { id: "kooperatif", label: "Kooperatif" },
      { id: "transparan", label: "Transparan" },
      { id: "defensif", label: "Tidak defensif" },
      { id: "terbuka", label: "Terbuka terhadap SOP LPrecast" },
    ],
  },
]

interface VendorApprovalChecklistProps {
  checkedItems: Record<string, boolean>
  onCheck: (id: string, checked: boolean) => void
}

export function VendorApprovalChecklistPreview({ checkedItems, onCheck }: VendorApprovalChecklistProps) {
  return (
    <div className="w-full min-w-0 max-w-full">
      <Tabs defaultValue="admin">
        <TabsList className="grid w-full max-w-full grid-cols-2">
          <TabsTrigger value="admin">A. Berkas / Administratif</TabsTrigger>
          <TabsTrigger value="survey">B. Survey Workshop</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-6 w-full max-w-full space-y-4">
          {adminChecklist.map((section) => (
            <section
              key={section.id}
              className="box-border w-full min-w-0 max-w-full space-y-3 overflow-hidden rounded-lg border bg-background p-4"
            >
              <div>
                <h3 className="text-base font-semibold">{section.title}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-start space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={(c) => onCheck(item.id, c as boolean)}
                    />
                    <Label
                      htmlFor={item.id}
                      className="min-w-0 cursor-pointer break-words text-sm font-normal leading-snug"
                    >
                      {item.label}
                      {item.isRedFlag && (
                        <Badge
                          variant="outline"
                          className="ml-2 border-red-200 bg-red-50 text-[10px] text-red-500"
                        >
                          Wajib
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>

        <TabsContent value="survey" className="mt-6 w-full max-w-full space-y-4">
          {surveyChecklist.map((section) => (
            <section
              key={section.id}
              className="box-border w-full min-w-0 max-w-full space-y-3 overflow-hidden rounded-lg border bg-background p-4"
            >
              <div>
                <h3 className="text-base font-semibold">{section.title}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-start space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={(c) => onCheck(item.id, c as boolean)}
                    />
                    <Label
                      htmlFor={item.id}
                      className="min-w-0 cursor-pointer break-words text-sm font-normal leading-snug"
                    >
                      {item.label}
                      {item.isRedFlag && (
                        <Badge
                          variant="outline"
                          className="ml-2 border-red-200 bg-red-50 text-[10px] text-red-500"
                        >
                          Kritikal
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
