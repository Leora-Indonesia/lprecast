# Development Priorities - Vendor & Admin

## Current Focus: Epic 2 - Admin Verification

After completing Epic 1 (Vendor Registration), the next priority is Epic 2 (Admin Verification) which is partially complete.

---

## MVP Scope (Target: April 2026)

### Epic 2: Admin Verification ⚠️ IN PROGRESS

| Priority | Feature                               | Status | Dependencies            |
| -------- | ------------------------------------- | ------ | ----------------------- |
| P0       | Approve/Reject vendor action          | ❌     | None                    |
| P0       | Document verification action          | ❌     | None                    |
| P0       | Verification notes/reason field       | ❌     | None                    |
| P1       | Notification trigger on status change | ❌     | None                    |
| P1       | Audit trail (who did what, when)      | ❌     | None                    |
| P2       | Bank list master data                 | ❌     | For rekening validation |

**Files to modify:**

- `app/(admin)/admin/vendors/[id]/page.tsx` - Add action buttons
- `actions/vendor.ts` - New server actions for approval
- `components/ui/` - Add confirmation dialog

---

### Epic 4: Tender Flow ❌ NOT STARTED

| Priority | Feature                   | Status | Dependencies          |
| -------- | ------------------------- | ------ | --------------------- |
| P0       | Admin create tender       | ❌     | Epic 2 (vendor ready) |
| P0       | Admin list tenders        | 🔒     | None                  |
| P0       | Admin select winner       | ❌     | Submissions exist     |
| P0       | SPK generation            | ❌     | Winner selected       |
| P0       | Vendor list tenders       | 🔒     | None                  |
| P0       | Vendor submit penawaran   | ❌     | Tenders exist         |
| P0       | Vendor detail tender view | 🔒     | None                  |
| P1       | Tender scoring algorithm  | ❌     | Historical data       |
| P1       | Auto-shortlist Top 3      | ❌     | Submissions exist     |

**Files to create:**

- `app/(admin)/admin/tenders/new/page.tsx` - Create tender form
- `app/(admin)/admin/tenders/[id]/page.tsx` - Manage tender
- `app/(vendor)/vendor/tenders/page.tsx` - List available tenders
- `app/(vendor)/vendor/tenders/[id]/page.tsx` - Submit penawaran
- `actions/tender.ts` - Server actions
- `components/tender/` - Tender UI components

---

### Epic 5: Daily Progress ❌ NOT STARTED

| Priority | Feature                       | Status | Dependencies       |
| -------- | ----------------------------- | ------ | ------------------ |
| P0       | Vendor upload progress form   | ❌     | SPK exists         |
| P0       | Vendor - Daily report fields  | ❌     | None               |
| P0       | SPV verify progress           | ❌     | Progress submitted |
| P1       | Progress photos/videos upload | ❌     | None               |
| P1       | Progress timeline view        | ❌     | Progress data      |

**Files to create:**

- `app/(vendor)/vendor/projects/[id]/progress/page.tsx` - Upload form
- `app/(admin)/admin/projects/[id]/progress/page.tsx` - Verify form
- `components/progress/` - Progress UI components

---

## Dependensi Antar Epic

```
Epic 1: Vendor Registration ✅ COMPLETE
        ↓
Epic 2: Admin Verification (P0) ← CURRENT
        ↓
Epic 4: Tender Flow (P0)
        ↓
Epic 5: Daily Progress (P0)
```

**Urutan tidak bisa diubah:** Tidak mungkin ada tender kalau vendor belum diverifikasi. Tidak mungkin ada progress kalau belum ada SPK.

---

## Post-MVP (Excluded)

- Client portal
- Payment via Xendit
- Escrow System
- E-signature
- WhatsApp/Email notifications
- KPI calculation
- Push notification

---

## Quick Reference

### File Paths

**Admin:**

- Dashboard: `app/(admin)/admin/dashboard/`
- Vendors: `app/(admin)/admin/vendors/`
- Tenders: `app/(admin)/admin/tenders/`

**Vendor:**

- Dashboard: `app/(vendor)/vendor/dashboard/`
- Profile: `app/(vendor)/vendor/profile/`
- Tenders: `app/(vendor)/vendor/tenders/`
- Projects: `app/(vendor)/vendor/projects/`

**Actions:**

- Auth: `actions/auth.ts`
- Vendor: `actions/vendor.ts` (need to create)
- Tender: `actions/tender.ts` (need to create)

---

## Notes

- Semua P0 harus selesai sebelum next Epic dimulai
- P1 bisa done parallel dengan P0 di Epic yang sama
- P2 nice-to-have, bisa di-skip jika waktu tidak cukup
