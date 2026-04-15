# Task 06: Generate SPK (Simple)

## Objective

Generate dokumen SPK (Surat Perjanjian Kerja) setelah pemenang tender dipilih.

## Requirements

### SPK Content

Dokumen SPK berisi:

```
SURAT PERJANJIAN KERJA (SPK)
No: SPK/[YEAR]/[SEQUENCE]

Pihak Pertama: PT Leora Nusantara Inspirasi (Leora)
Pihak Kedua: [Nama Vendor]

Isi:
1. Project: [Nama Proyek]
2. Pekerjaan: [Deskripsi]
3. Lokasi: [Lokasi]
4. Nilai SPK: Rp [Total Harga]
5. Timeline: [Start] s/d [End]
6. Termin Pembayaran:
   - 30%: Material & tukang diterima
   - 30%: 50% progress
   - 30%: 100% progress
   - 10%: After QC

Tanda tangan:
- Pihak Pertama: _______________
- Pihak Kedua: _______________

Tanggal: [Date]
```

### Implementation

Option 1: Simple HTML/PDF (MVP)

- Generate HTML view
- Browser print to PDF
- Simpan URL/link SPK

Option 2: PDF Library (jika ada waktu)

- Use @react-pdf/renderer atau jsPDF
- Generate PDF file
- Upload ke Supabase Storage

### Database

Table: `vendor_spk` (sudah exists)

```typescript
{
  id: string
  vendor_id: string
  project_id: string
  tender_submission_id: string
  spk_number: string
  contract_value: number
  start_date: string
  end_date: string
  status: "draft" | "signed" | "active" | "completed"
  document_url: string | null
  created_at: string
  updated_at: string
}
```

### Server Actions

Tambahkan ke `/actions/spk.ts`:

```typescript
"use server"

export async function generateSPK(tenderId: string, winnerId: string) {
  // 1. Get tender & submission data
  // 2. Generate SPK number (SPK/2024/001)
  // 3. Insert ke vendor_spk
  // 4. Generate document (HTML/PDF)
  // 5. Return SPK data
}
```

### UI Components

- **SPKView**: Display SPK content (HTML)
- **SPKDownload**: Button download/print PDF
- **SPKStatus**: Badge status SPK

### Pages

**`/app/(admin)/admin/spk/[id]/page.tsx`**

- View SPK detail
- Print/Download PDF
- Update status (signed, active)

**`/app/(vendor)/spk/page.tsx`**

- List SPK vendor
- View & download

## Files to Create

| File                                   | Description           |
| -------------------------------------- | --------------------- |
| `/actions/spk.ts`                      | SPK server actions    |
| `/app/(admin)/admin/spk/[id]/page.tsx` | Admin view SPK        |
| `/app/(vendor)/spk/page.tsx`           | Vendor list SPK       |
| `/components/spk/spk-template.tsx`     | SPK document template |

## Testing Checklist

- [ ] SPK generated after winner selected
- [ ] SPK number auto-generated correctly
- [ ] Content accurate (data vendor, project, harga)
- [ ] Vendor bisa view SPK
- [ ] Print/Download works
- [ ] Status updates correctly

## Notes

- Format simple dulu (HTML table-based)
- Formal template bisa di-refine later
- Tanda tangan digital: post-MVP (manual dulu)
- SPK bisa di-download sebagai PDF via browser print
