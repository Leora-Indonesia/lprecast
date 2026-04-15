# Task 04: Vendor Submit Penawaran

## Objective

Buat halaman detail tender dan form submit penawaran harga untuk vendor.

## Requirements

### Page

**`/app/(vendor)/tenders/[id]/page.tsx`**

- Detail tender
- Form submit penawaran (jika belum submit)
- View submission status (jika sudah submit)

### Detail Tender View

Menampilkan:

- Judul & deskripsi tender
- Info proyek (jenis, lokasi general, timeline)
- List items yang ditenderkan (nama, quantity, unit)
- Deadline submission

### Form Submit Penawaran

Fields:

```typescript
interface TenderSubmission {
  tender_id: string
  items: {
    tender_item_id: string
    unit_price: number // Harga per unit
    total_price: number // unit_price × quantity
    notes?: string // Catatan khusus item
  }[]
  metode_kerja?: string // Metode instalasi (opsional)
  jumlah_tenaga?: number // Jumlah pekerja (opsional)
  alat?: string // Alat yang digunakan (opsional)
  estimasi_start_date: string // Kapan bisa mulai
  notes?: string // Catatan umum
}
```

### SLA Checklist

Checkbox komitmen:

- [ ] Sanggup sesuai timeline
- [ ] Sanggup sesuai kualitas
- [ ] Sanggup sesuai SOP

### Server Actions

Tambahkan ke `/actions/tenders.ts`:

```typescript
"use server"

export async function submitTender(submission: TenderSubmission) {
  // 1. Validate tender masih open
  // 2. Validate belum submit sebelumnya
  // 3. Insert ke tender_submissions
  // 4. Insert items ke tender_submission_items
  // 5. Update submission_count di tenders
  // 6. Return success/error
}
```

### Database

Tables:

- `tender_submissions` - Data submission utama
- `tender_submission_items` - Detail harga per item

### UI Components

- **TenderDetail**: Display info tender
- **SubmissionForm**: Form input penawaran
- **PriceInput**: Input harga dengan format currency
- **SLAChecklist**: Checkbox komitmen
- **ReviewCard**: Tampilan setelah submit (read-only)

### Validation

- Semua items harus diisi harga
- Total price auto-calculate (unit_price × quantity)
- SLA checklist wajib dicheck semua
- Estimasi start date wajib diisi

## Files to Create/Modify

| File                                     | Action | Description          |
| ---------------------------------------- | ------ | -------------------- |
| `/app/(vendor)/tenders/[id]/page.tsx`    | CREATE | Detail & submit page |
| `/actions/tenders.ts`                    | CREATE | Server actions       |
| `/components/vendor/submission-form.tsx` | CREATE | Form component       |
| `/components/vendor/price-input.tsx`     | CREATE | Currency input       |

## Testing Checklist

- [ ] Detail tender ditampilkan dengan benar
- [ ] Form validation bekerja (harga wajib, SLA wajib)
- [ ] Total price auto-calculate
- [ ] Submit berhasil insert ke DB
- [ ] Tidak bisa submit 2x untuk tender yang sama
- [ ] Error jika tender sudah closed
- [ ] View mode setelah submit (tidak bisa edit)

## Notes

- Vendor hanya bisa submit 1x per tender
- Setelah submit, form jadi read-only
- Edit submission: post-MVP (bisa revisi dengan revision_count)
- Dokumen diambil dari vendor profile (tidak perlu upload ulang)
