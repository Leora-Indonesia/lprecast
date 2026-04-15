# LPrecast Vendor Portal - Context

## Quick Reference

- Stack: Next.js 16 App Router (proxy.ts as middleware) + React 19 + TypeScript + Turbopack
- DB: Supabase
- UI: Tailwind CSS + shadcn/ui + Radix UI
- PWA: Serwist
- Theme source of truth: lib/theme-config.ts
- DB types: types/database.types.ts

## Roles

| Role   | Access                                  |
| ------ | --------------------------------------- |
| admin  | Full access                             |
| spv    | Verify progress, monitoring (read-only) |
| vendor | Register, tender, upload progress       |
| client | View project (post-MVP)                 |

## Business Rules

- Min. 2 vendor submit penawaran agar tender valid
- Nilai SPK = Tender Price x Quantity
- Upload progress deadline: 09.00 WIB hari berikutnya
- Keterlambatan upload -> KPI negatif
- Payment 2-level approval: Finance Leora -> Client -> Paid

## MVP Epics (target Apr 14)

1. Vendor registration & onboarding
2. Admin verification + field visit checklist
3. Admin input proyek manual
4. Tender minimal - submit, pilih pemenang, generate SPK
5. Monitoring harian - upload progress, verifikasi SPV

## Folder Structure

app/(auth)/login/
app/(vendor)/dashboard, profile, tenders, projects
app/(admin)/dashboard, vendors, tenders
lib/utils.ts, lib/theme-config.ts
docs/architecture/design-system.md (UI conventions)
docs/architecture/pwa.md (PWA + theme guide)

## Conventions

- Server components default, use "use client" only when interactivity needed
- API via Supabase client with RLS - no service role bypass on client
- Protected routes must check stakeholder_type in middleware
- All UI components use shadcn/ui

## Database Tables

Existing: users, projects, vendor_spk, vendor_progress, vendor_payment
New: vendor_profiles, vendor_documents, vendor_products, tenders, tender_submissions, project_milestones, notifications, payment_requests, vendor_kpi_scores

## On-Demand Docs

- docs/tasks/task-XX-\*.md - Task-specific specs
- docs/end-to-end-plan.md - Full business flow
- docs/modules/vendor.md - Vendor module detail
- docs/PLAN-MVP.md - MVP timeline
- docs/tasks/PROGRESS.md - Progress tracker
