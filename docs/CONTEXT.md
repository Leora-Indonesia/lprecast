# LPrecast Vendor Portal - Context

## Quick Reference

- Stack: Next.js 16 App Router (proxy.ts as middleware) + React 19 + TypeScript + Turbopack
- DB: Supabase
- UI: Tailwind CSS + shadcn/ui + Radix UI
- PWA: Serwist
- Theme source of truth: `lib/theme-config.ts`
- DB types: `types/database.types.ts`
- Flow source of truth: `docs/FLOW.md`
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

Implementasi lanjutan untuk:
- Kurva S baseline entry (SPV pre-con)
- Laporan harian vendor dan progress kumulatif
- Invoice/tagihan dengan lampiran
- Skema pembayaran per termin (hybrid: default 35/25/25/15, boleh override)
- KPI, payment milestone, dan flow SPV masih mengikuti urutan task di `docs/tasks/PROGRESS.md`.

## Documentation Map

- `docs/README.md` - entry point dan aturan pakai docs
- `docs/FLOW.md` - flow bisnis end-to-end lintas role
- `docs/modules/*.md` - knowledge base per domain
- `docs/architecture/*.md` - aturan teknis dan implementation constraints
- `docs/references/*.md` - summary, checklist, dan hasil analisa pendukung
- `docs/reference_file/*` - raw upload source material
- `docs/tasks/PROGRESS.md` - progress delivery global

## Roles

| Role   | Access                                                    |
| ------ | --------------------------------------------------------- |
| admin  | Full access - vendor management, tender, dashboard, users |
| spv    | Verify progress, monitoring (operasional only, NO payment) |
| vendor | Register, onboarding, lihat tender, lihat project         |
| client | View progress, approve milestone, setor dana termin |
| finance ops | Pegang invoice vendor, payment execution, client billing |

## Business Rules

- Min. 2 vendor submit penawaran agar tender valid
- Tender tidak auto-close sampai ada vendor yang sesuai
- Nilai SPK = Tender Price x Quantity
- Upload progress deadline: 09.00 WIB hari berikutnya
- Keterlambatan upload -> KPI negatif + flag sistem
- **Lane separation (penting):**
  - **Daily report**: Vendor → SPV → System (SPV verifikasi progres, TIDAK payment)
  - **Milestone approval**: SPV verified → Client approve milestone
  - **Vendor payment**: Vendor → Finance/Internal → Paid (dari internal fund)
  - **Client funding**: System → Client → Internal/Escrow (refill termin berikutnya)
- SPV TIDAK masuk payment lane
- SPV TIDAK boleh akses invoice vendor detail finansial
- SPV TIDAK boleh akses billing client, margin, atau cash position
- Client wajib approve milestone progress SEBELUM vendor bisa invoice
- Client wajib setor termin berikutnya SEBELUM progress sentuh milestone (45-49% warning)
- Payment 2-level approval: Finance Internal -> Client -> Paid
- Kurva S baseline wajib di-entry saat pre-con (tidak boleh missing)
- Daily report vendor = satu-satunya input progress kumulatif yang valid
- Invoice attachment mandatory sebelum masuk payment approval chain
- Termin hybrid: default 35/25/25/15, boleh override per project
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
- `payment_contracts`
- `payment_approvals`
- `vendor_kpi_scores`

Gunakan `types/database.types.ts` sebagai referensi schema teknis terbaru.

## Delivery Status

Lihat `docs/tasks/PROGRESS.md` untuk:

- task yang sudah selesai
- task aktif / belum mulai
- urutan prioritas implementasi
- timeline terbaru

## On-Demand Docs

- `docs/FLOW.md` - source of truth flow bisnis lintas role
- `docs/tasks/PROGRESS.md` - source of truth status task & timeline
- `docs/modules/PROJECT.md` - project lifecycle, status, future execution anchor
- `docs/modules/TENDER.md` - tender publish, dynamic items, vendor read flow
- `docs/modules/VENDOR.md` - vendor onboarding, tender access, project reporting
- `docs/modules/SPV.md` - SPV selection, pre-con docs, verification, monitoring
- `docs/modules/PAYMENT.md` - termin payment, invoice, approval, audit trail
- `docs/references/vendor-approval-checklist.md` - checklist approval vendor
- `docs/architecture/design-system.md` - UI conventions
- `docs/architecture/pwa.md` - PWA architecture & theme rules
- `docs/references/README.md` - index summary reference
- `docs/reference_file/README.md` - index raw upload reference
