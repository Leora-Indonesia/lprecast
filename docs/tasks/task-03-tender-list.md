# Task 03: Vendor Tender List View

## Objective

Buat halaman untuk vendor melihat daftar tender yang tersedia dan bisa diikuti.

## Requirements

### Page

**`/app/(vendor)/tenders/page.tsx`**

- List tender yang status = "open"
- Filter: lokasi, jenis pekerjaan
- Card view atau table view

### Tender Display Info

Setiap tender card menampilkan:

- Judul tender
- Jenis pekerjaan (dari project)
- Lokasi (kecamatan/kabupaten saja, tanpa detail sensitif)
- Timeline
- Estimasi volume kerja
- Deadline submission
- Status: "Buka" / "Sudah Apply"

### Database Query

```typescript
// Get open tenders
const { data: tenders } = await supabase
  .from("tenders")
  .select(
    `
    *,
    projects(name, location),
    tender_items(*)
  `
  )
  .eq("status", "open")
  .gte("deadline", new Date().toISOString())

// Check if vendor already submitted
const { data: mySubmissions } = await supabase
  .from("tender_submissions")
  .select("tender_id")
  .eq("vendor_id", currentUser.id)
```

### UI Components

- **TenderCard**: Card component untuk display tender
- **FilterBar**: Filter by lokasi, jenis pekerjaan
- **EmptyState**: Jika tidak ada tender tersedia
- **Badge**: "Sudah Apply" jika vendor sudah submit

### Navigation

- Click card → `/vendor/tenders/[id]` (detail & submit)
- Sidebar menu: "Tenders"

## Files to Create

| File                                   | Description           |
| -------------------------------------- | --------------------- |
| `/app/(vendor)/tenders/page.tsx`       | List tender page      |
| `/components/vendor/tender-card.tsx`   | Tender card component |
| `/components/vendor/tender-filter.tsx` | Filter bar            |

## Sidebar Update

Tambahkan menu "Tenders" di sidebar vendor.

## Testing Checklist

- [ ] List tender terbuka ditampilkan
- [ ] Tender yang sudah lewat deadline tidak muncul
- [ ] "Sudah Apply" badge muncul jika sudah submit
- [ ] Filter by lokasi berfungsi
- [ ] Click card navigasi ke detail
- [ ] Empty state muncul jika tidak ada tender

## Notes

- Hanya tender dengan status "open" yang ditampilkan
- Vendor tidak bisa lihat detail client (hanya kecamatan/kabupaten)
- Data sensitif client di-hide (sesuai business rules)
- Tender yang sudah diikuti tetap muncul tapi dengan badge
