# Task 09: SPV Verifikasi Progress

## Objective

Buat halaman untuk SPV memverifikasi (approve/reject) progress harian yang diupload vendor.

## Requirements

### Page

**`/app/(spv)/verifications/page.tsx`** atau **`/app/(admin)/progress/page.tsx`**

- List progress yang menunggu verifikasi
- Filter: by project, by date, by status

**`/app/(spv)/verifications/[id]/page.tsx`** atau **`/app/(admin)/progress/[id]/page.tsx`**

- Detail progress
- Photo gallery
- Form verifikasi (approve/reject)

### Verifikasi List

Table columns:

- Tanggal
- Vendor (nama perusahaan)
- Project
- Progress %
- Status (pending/verified/rejected)
- Actions (Lihat, Approve, Reject)

### Detail View

Menampilkan:

- Info vendor & project
- Tanggal progress
- Deskripsi pekerjaan
- Progress percentage
- Foto-foto (gallery)
- Form verifikasi

### Form Verifikasi

```typescript
interface Verification {
  progress_id: string
  status: "verified" | "rejected"
  notes: string // Catatan/feedback
}
```

- **Approve**: Status → verified, trigger payment (post-MVP)
- **Reject**: Status → rejected, catatan wajib diisi untuk revision

### Server Actions

Tambahkan ke `/actions/progress.ts`:

```typescript
"use server"

export async function verifyProgress(
  progressId: string,
  status: "verified" | "rejected",
  notes: string,
  spvId: string
) {
  // 1. Update vendor_progress
  //    - status
  //    - verified_by
  //    - verified_at
  //    - notes
  // 2. Send notification ke vendor
  // 3. Revalidate paths
}

export async function getPendingVerifications(spvId?: string) {
  // Get all progress dengan status = 'submitted'
  // Filter by SPV assignment jika ada
}
```

### Notification

**Verified:**

```typescript
{
  user_id: vendorId,
  type: "progress_verified",
  title: "Progress Terverifikasi",
  message: `Progress tanggal ${date} telah diverifikasi oleh SPV.`,
  category: "progress",
  reference_type: "vendor_progress",
  reference_id: progressId
}
```

**Rejected:**

```typescript
{
  user_id: vendorId,
  type: "progress_rejected",
  title: "Progress Perlu Revisi",
  message: `Progress tanggal ${date} perlu revisi. Catatan: ${notes}`,
  category: "progress",
  reference_type: "vendor_progress",
  reference_id: progressId
}
```

### UI Components

- **VerificationTable**: List progress pending
- **VerificationDetail**: Detail view dengan foto
- **VerificationForm**: Approve/reject form
- **PhotoGallery**: View foto progress

## Files to Create

| File                                     | Description       |
| ---------------------------------------- | ----------------- |
| `/app/(spv)/verifications/page.tsx`      | List verifikasi   |
| `/app/(spv)/verifications/[id]/page.tsx` | Detail verifikasi |
| `/components/spv/verification-table.tsx` | Table component   |
| `/components/spv/verification-form.tsx`  | Form component    |

## Sidebar

Tambahkan menu "Verifikasi Progress" di sidebar SPV.

## Testing Checklist

- [ ] List progress pending ditampilkan
- [ ] Detail progress bisa dilihat
- [ ] Approve berhasil update status
- [ ] Reject berhasil update status dengan catatan
- [ ] Notifikasi terkirim ke vendor
- [ ] Filter berfungsi (by project, date)

## Notes

- SPV assignment: bisa manual atau auto (task 11)
- Verifikasi deadline: 24 jam? (define later)
- Rejected progress bisa di-reupload oleh vendor
- Verified progress trigger payment request (post-MVP)
