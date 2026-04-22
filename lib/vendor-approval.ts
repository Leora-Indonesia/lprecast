export type ChecklistSection = {
  id: string
  title: string
  items: { id: string; label: string; isCritical?: boolean }[]
}

// Single source of truth: approval checklist + scoring + red flag findings.

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
      {
        id: "val_fiktif",
        label: "Validasi: Tidak terindikasi fiktif",
        isCritical: true,
      },
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
      {
        id: "val_umur",
        label: "Penilaian: Usia usaha relevan (> 1 tahun dsb)",
      },
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
      {
        id: "val_foto",
        label: "Validasi: Foto asli / bukan ambil internet",
        isCritical: true,
      },
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
      { id: "sop", label: "Bersedia mengikuti SOP LPrecast", isCritical: true },
      { id: "app", label: "Bersedia menggunakan sistem (app)" },
      { id: "bypass", label: "Bersedia tidak kontak langsung client", isCritical: true },
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
      { id: "lokasi_aktif", label: "Lokasi workshop jelas & aktif", isCritical: true },
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
      { id: "retak", label: "Tidak retak", isCritical: true },
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

export const redFlagChecklist = [
  { id: "no_workshop", label: "Tidak punya workshop jelas" },
  { id: "fake_portfolio", label: "Portofolio palsu" },
  { id: "poor_quality", label: "Kualitas produk buruk" },
  { id: "refuse_system", label: "Tidak mau ikut sistem" },
  { id: "bypass_client", label: "Indikasi ingin bypass client" },
] as const

export type RedFlagId = (typeof redFlagChecklist)[number]["id"]

export function hasRedFlag(redFlagFindings: Record<string, boolean> | null | undefined) {
  if (!redFlagFindings) return false
  return Object.values(redFlagFindings).some(Boolean)
}

type ScoringCategory =
  | "legal_admin"
  | "pengalaman"
  | "kapasitas"
  | "workshop_produksi"
  | "attitude_compliance"

const weights: Record<ScoringCategory, number> = {
  legal_admin: 20,
  pengalaman: 20,
  kapasitas: 20,
  workshop_produksi: 30,
  attitude_compliance: 10,
}

const sectionCategoryMap: Record<string, ScoringCategory> = {
  identitas: "legal_admin",
  profil: "legal_admin",
  finance: "legal_admin",

  pengalaman: "pengalaman",
  kapasitas: "kapasitas",

  lokasi: "workshop_produksi",
  fasilitas: "workshop_produksi",
  peralatan: "workshop_produksi",
  tk_lapangan: "workshop_produksi",
  proses: "workshop_produksi",
  kualitas: "workshop_produksi",
  manajemen: "workshop_produksi",
  safety: "workshop_produksi",

  komitmen: "attitude_compliance",
  sikap: "attitude_compliance",
}

export function computeTotalScore(checkedItems: Record<string, boolean> | null | undefined) {
  const checked = checkedItems ?? {}

  const stats: Record<ScoringCategory, { total: number; checked: number }> = {
    legal_admin: { total: 0, checked: 0 },
    pengalaman: { total: 0, checked: 0 },
    kapasitas: { total: 0, checked: 0 },
    workshop_produksi: { total: 0, checked: 0 },
    attitude_compliance: { total: 0, checked: 0 },
  }

  const allSections = [...adminChecklist, ...surveyChecklist]
  for (const section of allSections) {
    const category = sectionCategoryMap[section.id]
    if (!category) continue
    for (const item of section.items) {
      stats[category].total += 1
      if (checked[item.id]) stats[category].checked += 1
    }
  }

  const total = (Object.keys(stats) as ScoringCategory[]).reduce((sum, category) => {
    const s = stats[category]
    const ratio = s.total > 0 ? s.checked / s.total : 0
    return sum + ratio * weights[category]
  }, 0)

  return Math.round(total)
}

export function getChecklistMetrics(checkedItems: Record<string, boolean> | null | undefined) {
  const checked = checkedItems ?? {}
  const allSections = [...adminChecklist, ...surveyChecklist]
  const totalItems = allSections.reduce((sum, section) => sum + section.items.length, 0)
  const checkedItemsCount = allSections.reduce((sum, section) => {
    return sum + section.items.filter((item) => checked[item.id]).length
  }, 0)

  return {
    checkedItemsCount,
    totalItems,
    remainingItems: Math.max(totalItems - checkedItemsCount, 0),
    completionPct: totalItems > 0 ? Math.round((checkedItemsCount / totalItems) * 100) : 0,
  }
}

export function computeRecommendation(params: { totalScore: number; hasRedFlag: boolean }) {
  if (params.hasRedFlag) return "REJECT" as const
  if (params.totalScore >= 85) return "APPROVED" as const
  if (params.totalScore >= 70) return "CONDITIONAL" as const
  return "REJECT" as const
}

export function computeApprovalTier(params: { totalScore: number; hasRedFlag: boolean }) {
  if (params.hasRedFlag) return "Auto Reject"
  if (params.totalScore >= 90) return "Tier A"
  if (params.totalScore >= 85) return "Tier B"
  if (params.totalScore >= 70) return "Tier C"
  return "Not Eligible"
}
