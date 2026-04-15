# Task 01: Admin Vendor Actions (Approve/Reject/Revisi)

## Objective

Tambahkan action buttons untuk approve, reject, dan request revision vendor di halaman detail vendor.

## Current State

- `/admin/vendors/[id]/page.tsx` - Detail vendor sudah lengkap dengan tabs
- Status vendor: draft, submitted, under_review, approved, rejected, revision_requested
- Belum ada action buttons untuk mengubah status

## Requirements

### UI Components

Tambahkan di `/admin/vendors/[id]/page.tsx`:

1. **Action Buttons** (hanya muncul jika status = submitted/under_review):
   - ✅ **Approve** - Update status ke "approved", create vendor_profiles
   - ❌ **Reject** - Update status ke "rejected", minta alasan
   - 📝 **Request Revision** - Update status ke "revision_requested", minta catatan

2. **Confirmation Dialog**:
   - Konfirmasi sebelum execute action
   - Textarea untuk alasan/catatan (untuk reject & revision)

3. **Success/Error Feedback**:
   - Toast notification setelah action
   - Redirect ke /admin/vendors setelah approve/reject

### Server Actions

Buat `/actions/vendor.ts`:

```typescript
"use server"

export async function approveVendor(registrationId: string) {
  // 1. Update vendor_registrations.status = "approved"
  // 2. Create vendor_profiles record
  // 3. Send notification ke vendor
  // 4. Revalidate path
}

export async function rejectVendor(registrationId: string, reason: string) {
  // 1. Update vendor_registrations.status = "rejected"
  // 2. Update vendor_registrations.approval_notes = reason
  // 3. Send notification ke vendor
  // 4. Revalidate path
}

export async function requestVendorRevision(
  registrationId: string,
  notes: string
) {
  // 1. Update vendor_registrations.status = "revision_requested"
  // 2. Update vendor_registrations.approval_notes = notes
  // 3. Send notification ke vendor
  // 4. Revalidate path
}
```

### Database Updates

Table: `vendor_registrations`

- Update: status, approval_notes, reviewed_at, reviewed_by

Table: `vendor_profiles` (create new):

- id, user_id (from vendor_id), status, approved_at, created_at

### Notification

Gunakan existing notification system:

- Title: "Vendor Registration Approved/Rejected/Revision Requested"
- Message: Include alasan/catatan jika ada
- Category: "vendor"

## Files to Modify

| File                                       | Action                                 |
| ------------------------------------------ | -------------------------------------- |
| `/actions/vendor.ts`                       | CREATE                                 |
| `/app/(admin)/admin/vendors/[id]/page.tsx` | UPDATE (tambah actions)                |
| `/components/admin/vendor-actions.tsx`     | CREATE (optional - component terpisah) |

## Testing Checklist

- [ ] Buttons muncul hanya untuk status submitted/under_review
- [ ] Approve berhasil update status & create vendor_profiles
- [ ] Reject berhasil update status dengan alasan
- [ ] Request revision berhasil update status dengan catatan
- [ ] Notifikasi terkirim ke vendor
- [ ] Redirect setelah action
- [ ] UI feedback (toast) muncul

## Notes

- Gunakan shadcn AlertDialog untuk konfirmasi
- Gunakan shadcn Textarea untuk input alasan
- Revalidate path `/admin/vendors` setelah action
- Sementara notifikasi via in-app (sudah ada sistem)
