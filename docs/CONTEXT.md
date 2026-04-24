# LPrecast Vendor Portal - Context

## Quick Reference

- Stack: Next.js 16 App Router (proxy.ts as middleware) + React 19 + TypeScript + Turbopack
- DB: Supabase
- UI: Tailwind CSS + shadcn/ui + Radix UI
- PWA: Serwist
- Theme source of truth: `lib/theme-config.ts`
- DB types: `types/database.types.ts`
- Current task source of truth: `docs/tasks/PROGRESS.md`

## Current Scope

Aplikasi saat ini sudah mencakup fondasi utama untuk:

1. Vendor registration & onboarding
2. Admin vendor management, review, approval, rejection, dan revision
3. Notification flow dasar
4. Vendor dashboard, profile, tenders list, tender detail, projects list, dan project detail
5. PWA setup dan offline support
6. Client scaffold (`dashboard`, `projects`)
7. Tender workflow dasar di sisi route/UI admin dan vendor

Implementasi lanjutan untuk bidding penuh, progress harian, KPI, payment milestone, dan flow SPV masih mengikuti urutan task di `docs/tasks/PROGRESS.md`.

## Roles

| Role   | Access                                                    |
| ------ | --------------------------------------------------------- |
| admin  | Full access - vendor management, tender, dashboard, users |
| spv    | Verify progress, monitoring (planned / not fully active)  |
| vendor | Register, onboarding, lihat tender, lihat project         |
| client | View project & dashboard scaffold                         |

## Business Rules

- Min. 2 vendor submit penawaran agar tender valid
- Tender tidak auto-close sampai ada vendor yang sesuai
- Nilai SPK = Tender Price x Quantity
- Upload progress deadline: 09.00 WIB hari berikutnya
- Keterlambatan upload -> KPI negatif + flag sistem
- Payment 2-level approval: Finance Leora -> Client -> Paid
- Semua akses protected wajib cek `stakeholder_type` via `proxy.ts`

## Current Routes Snapshot

```text
app/
├── (public)/
│   ├── page.tsx
│   ├── progress/page.tsx
│   └── vendor/register/
├── (auth)/
│   └── login/page.tsx
├── (vendor-routes)/
│   └── vendor/
│       ├── onboarding/
│       ├── dashboard/
│       ├── profile/
│       ├── tenders/
│       ├── projects/
│       └── notifications/
├── (admin)/
│   └── admin/
│       ├── dashboard/
│       ├── vendors/
│       ├── tenders/
│       ├── notifications/
│       ├── users/
│       └── clients/
├── (client)/
│   └── client/
│       ├── dashboard/
│       └── projects/
├── api/
│   └── notifications/
├── manifest.ts
├── sw.ts
└── ~offline/
```

## Conventions

- Server components default, use "use client" only when interactivity needed
- API via Supabase client with RLS - no service role bypass on client
- Protected routes must check `stakeholder_type` in middleware / `proxy.ts`
- All UI components use shadcn/ui
- Use `lib/theme-config.ts` as single source of truth for theme values
- Progress kerja wajib update di `docs/tasks/PROGRESS.md`

## Database Notes

Project saat ini memakai kombinasi tabel shared, vendor onboarding, tender, dan progress.

Core/shared:

- `users`
- `projects`
- `vendor_spk`
- `vendor_progress`
- `vendor_payment`

Vendor onboarding / profile:

- `vendor_profiles`
- `vendor_documents`
- `vendor_products`
- `vendor_contacts`
- `vendor_bank_accounts`
- `vendor_factory_addresses`
- `vendor_delivery_areas`
- `vendor_cost_inclusions`

Tender / workflow:

- `tenders`
- `tender_submissions`
- `notifications`

Planned / referenced in business flow:

- `project_milestones`
- `payment_requests`
- `vendor_kpi_scores`

Gunakan `types/database.types.ts` sebagai referensi schema teknis terbaru.

## Delivery Status

Lihat `docs/tasks/PROGRESS.md` untuk:

- task yang sudah selesai
- task aktif / belum mulai
- urutan prioritas implementasi
- timeline terbaru

## On-Demand Docs

- `docs/tasks/PROGRESS.md` - source of truth status task & timeline
- `docs/end-to-end-plan.md` - full business flow detail
- `docs/FLOW-STORY.md` - ringkasan naratif business flow
- `docs/modules/VENDOR.md` - vendor module detail
- `docs/modules/VENDOR APPROVAL CHECKLIST.md` - checklist approval vendor
- `docs/architecture/design-system.md` - UI conventions
- `docs/architecture/pwa.md` - PWA architecture & theme rules
- `docs/references/README.md` - index summary reference
- `docs/reference_file/README.md` - index raw upload reference
