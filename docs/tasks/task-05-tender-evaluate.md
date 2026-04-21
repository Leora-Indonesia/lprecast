# Task 05: Admin Evaluasi & Pilih Pemenang Tender

## Objective

Buat halaman admin untuk melihat semua submission dan memilih pemenang tender.

## Requirements

### Page

**`/app/(admin)/admin/tenders/[id]/page.tsx`** (update dari coming soon)

- Detail tender
- List semua submissions dari vendor
- Comparison table
- Form pilih pemenang

### Detail Tender Admin

Menampilkan:

- Info tender & proyek
- Jumlah submissions
- Status tender (open/closed)
- Button "Tutup Tender" & "Pilih Pemenang"

### Comparison Table

Table columns:

- Vendor (nama perusahaan)
- Total Harga (sum semua items)
- Harga per Item (expandable)
- Metode Kerja
- Estimasi Start
- SLA Compliance (✓/✗)
- Actions (Lihat Detail, Pilih)

### Pilih Pemenang Flow

1. **Validasi**: Minimal 2 vendor submit
2. **Confirmation Dialog**: Konfirmasi pemenang
3. **Update Status**:
   - tender_submissions.status = "accepted" (winner)
   - tender_submissions.status = "rejected" (others)
   - tenders.status = "closed"
4. **Generate SPK**: Trigger SPK generation (task 6)
5. **Notifikasi**: Kirim ke pemenang & non-pemenang

### Server Actions

Tambahkan ke `/actions/tenders.ts`:

```typescript
"use server"

export async function selectWinner(
  tenderId: string,
  winnerSubmissionId: string
) {
  // 1. Validate minimal 2 submissions
  // 2. Update winner submission status = "accepted"
  // 3. Update other submissions status = "rejected"
  // 4. Update tender.status = "closed"
  // 5. Generate SPK record
  // 6. Send notifications
  // 7. Revalidate paths
}

export async function closeTender(tenderId: string) {
  // Update tender.status = "closed" (tanpa pemenang)
}
```

### UI Components

- **SubmissionComparison**: Table perbandingan
- **WinnerSelection**: Form pilih pemenang
- **DetailDialog**: Modal lihat detail submission
- **ValidationAlert**: Warning jika < 2 submissions

### Scoring (Opsional - bisa manual dulu)

Jika mau auto-scoring:

- Harga: 30% (lower is better)
- SLA: 20% (all checked = 100%)
- Historical performance: 30% (dari vendor profile)
- Kapasitas: 20% (jumlah tenaga, estimasi start)

## Files to Create/Modify

| File                                          | Action | Description           |
| --------------------------------------------- | ------ | --------------------- |
| `/app/(admin)/admin/tenders/[id]/page.tsx`    | UPDATE | From coming soon      |
| `/actions/tenders.ts`                         | UPDATE | Add selection actions |
| `/components/admin/submission-comparison.tsx` | CREATE | Comparison table      |
| `/components/admin/winner-selection.tsx`      | CREATE | Selection form        |

## Testing Checklist

- [ ] Semua submissions ditampilkan
- [ ] Validasi minimal 2 submissions
- [ ] Pemenang bisa dipilih
- [ ] Status updates correctly
- [ ] SPK generation triggered
- [ ] Notifikasi terkirim
- [ ] Error handling (invalid selection)

## Notes

- Manual selection dulu (auto-scoring post-MVP)
- Minimal 2 vendor requirement wajib
- SPK generation bisa async (background)
- Bisa tutup tender tanpa pemenang (jika tidak ada yang cocok)
# Tue Apr 21 12:40:49 +07 2026
