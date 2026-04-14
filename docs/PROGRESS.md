# Implementation Progress

Last updated: April 2026

## Legend

- ✅ Complete
- ⚠️ Partial / Needs improvement
- ❌ Not started
- 🔒 Scaffold only

---

## VENDOR MODULE

### Registration (Epic 1) ✅

| Feature                         | Status | Files                                                 |
| ------------------------------- | ------ | ----------------------------------------------------- |
| 4-step wizard                   | ✅     | `app/(vendor)/vendor/register/`                       |
| Step 1: Company Info            | ✅     | `components/vendor/register/company-info-form.tsx`    |
| Step 2: Legal Docs              | ✅     | `components/vendor/register/legal-documents-form.tsx` |
| Step 3: Operational             | ✅     | `components/vendor/register/operational-form.tsx`     |
| Step 4: Review & Submit         | ✅     | `components/vendor/register/review-submit.tsx`        |
| Draft persistence               | ✅     | `lib/` (use-form-persistence hook)                    |
| File upload (KTP/NPWP/NIB/SIUP) | ✅     | Via form actions                                      |
| Success page                    | ✅     | `app/(vendor)/vendor/register/success/`               |
| Database write                  | ✅     | Edge function `process-vendor-registration`           |

### Dashboard (Epic 1)

| Feature                  | Status | Files                                 |
| ------------------------ | ------ | ------------------------------------- |
| Registration status card | ✅     | `app/(vendor)/vendor/dashboard/`      |
| Stats cards              | ⚠️     | Hardcoded `+10` for available tenders |
| Recent submissions       | ✅     | From `tender_submissions`             |
| Recent notifications     | ✅     | From `notifications`                  |

### Tender Flow (Epic 4)

| Feature                   | Status | Files                                           |
| ------------------------- | ------ | ----------------------------------------------- |
| Database schema           | ✅     | `tenders`, `tender_items`, `tender_submissions` |
| Admin - Create tender     | ❌     | -                                               |
| Admin - List tenders      | 🔒     | `app/(admin)/admin/tenders/` (Coming Soon)      |
| Admin - Select winner     | ❌     | -                                               |
| SPK Generation            | ❌     | -                                               |
| Vendor - List tenders     | 🔒     | `app/(vendor)/vendor/tenders/` (Coming Soon)    |
| Vendor - Submit penawaran | ❌     | -                                               |
| Vendor - Detail tender    | 🔒     | `app/(vendor)/vendor/tenders/[id]/`             |

### Project Execution (Epic 5)

| Feature                    | Status | Files                           |
| -------------------------- | ------ | ------------------------------- |
| Database schema            | ✅     | `vendor_progress`, `vendor_spk` |
| Vendor - Upload progress   | ❌     | -                               |
| Vendor - Daily report form | ❌     | -                               |
| SPV - Verify progress      | ❌     | -                               |
| Progress photos/videos     | ❌     | -                               |

---

## ADMIN MODULE

### Dashboard ✅

| Feature             | Status | Files                          |
| ------------------- | ------ | ------------------------------ |
| Stats cards         | ✅     | `app/(admin)/admin/dashboard/` |
| Pending review list | ✅     | `components/admin/`            |
| Notifications list  | ✅     | `components/admin/`            |

### Vendor Management (Epic 2)

| Feature               | Status | Files                                        |
| --------------------- | ------ | -------------------------------------------- |
| List vendors          | ✅     | `app/(admin)/admin/vendors/page.tsx`         |
| Detail view (6 tabs)  | ✅     | `app/(admin)/admin/vendors/[id]/page.tsx`    |
| Document viewer       | ✅     | `components/vendor/DocumentViewerDialog.tsx` |
| Approve/Reject action | ❌     | -                                            |
| Document verification | ❌     | -                                            |
| Verification notes    | ❌     | -                                            |

### Tender Management (Epic 4)

| Feature       | Status | Files                                      |
| ------------- | ------ | ------------------------------------------ |
| List tenders  | 🔒     | `app/(admin)/admin/tenders/` (Coming Soon) |
| Create tender | ❌     | -                                          |
| Edit tender   | ❌     | -                                          |
| Select winner | ❌     | -                                          |

---

## CLIENT MODULE

Post-MVP per `CONTEXT.md` - Scaffold only

| Feature            | Status |
| ------------------ | ------ |
| Registration       | 🔒     |
| Project initiation | 🔒     |
| View progress      | 🔒     |
| Tender viewing     | 🔒     |

---

## AUTH MODULE ✅

| Feature             | Status | Files                    |
| ------------------- | ------ | ------------------------ |
| Login page          | ✅     | `app/(auth)/login/`      |
| Server actions      | ✅     | `actions/auth.ts`        |
| Session management  | ✅     | `lib/supabase/server.ts` |
| Auth helpers        | ✅     | `lib/auth.ts`            |
| Role-based redirect | ✅     | Via middleware           |
| Password reset      | ❌     | Post-MVP                 |

---

## DATABASE

### Tables (All ✅ Ready)

| Table                      | Usage                       |
| -------------------------- | --------------------------- |
| `users`                    | Auth users                  |
| `user_profiles`            | Profiles + stakeholder_type |
| `vendor_registrations`     | Registration main           |
| `vendor_company_info`      | Company details             |
| `vendor_contacts`          | Multiple contacts           |
| `vendor_legal_documents`   | Legal docs                  |
| `vendor_bank_accounts`     | Bank accounts               |
| `vendor_factory_addresses` | Factory locations           |
| `vendor_products`          | Product catalog             |
| `vendor_delivery_areas`    | Service areas               |
| `vendor_cost_inclusions`   | Included costs              |
| `vendor_additional_costs`  | Extra costs                 |
| `vendor_profiles`          | Approved vendor profile     |
| `tenders`                  | Tender postings             |
| `tender_items`             | Tender line items           |
| `tender_submissions`       | Vendor submissions          |
| `vendor_progress`          | Progress reports            |
| `vendor_spk`               | Work orders                 |
| `vendor_payment`           | Payment records             |
| `notifications`            | System notifications        |

---

## UI COMPONENTS

### Vendor Components

- `components/vendor/register/` - Registration forms
- `components/vendor/vendor-sidebar.tsx` - Navigation
- `components/vendor/vendor-header.tsx` - Header
- `components/vendor/vendor-dashboard-header.tsx` - Dashboard header

### Admin Components

- `components/admin/admin-sidebar.tsx`
- `components/admin/admin-header.tsx`
- `components/admin/admin-layout.tsx`
- `components/admin/stat-card.tsx`
- `components/admin/vendor-table.tsx`
- `components/admin/coming-soon.tsx`
- `components/admin/notification-bell.tsx`

### Shared UI

- All shadcn components in `components/ui/`
- DataTable: `components/ui/data-table.tsx`
- StatusBadge: `components/ui/status-badge.tsx`

---

## INFRASTRUCTURE ✅

| Area                  | Status | Notes                          |
| --------------------- | ------ | ------------------------------ |
| Next.js 16 App Router | ✅     |                                |
| Supabase Auth         | ✅     | Shared with internal           |
| PWA (Serwist)         | ✅     | `app/sw.ts`, `app/manifest.ts` |
| Design System         | ✅     | shadcn/ui + Tailwind v4        |
| Theme Config          | ✅     | `lib/theme-config.ts`          |
