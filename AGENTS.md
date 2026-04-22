# LPrecast Vendor Portal

## Project Overview

**Nama:** LPrecast Vendor Portal
**URL:** precast.leora.co.id
**Stack:** Next.js 16 App Router + React 19 + TypeScript + Turbopack, Supabase, Tailwind CSS + shadcn/ui + Radix UI, PWA via Serwist

## Key Conventions
- proxy.ts as middleware
- Server components by default, use `"use client"` only when interactivity is needed
- API calls via Supabase client with RLS — no service role bypass on client
- Every protected route must check `stakeholder_type` in middleware
- Theme colors: SINGLE SOURCE OF TRUTH at `lib/theme-config.ts`
- All UI components use shadcn/ui — see `docs/architecture/design-system.md`

## Roles & Access

| Role   | Access                                                    |
| ------ | --------------------------------------------------------- |
| admin  | Full access — vendor management, tender, project          |
| spv    | Verify daily progress, monitoring (read-only vendor data) |
| vendor | Register, tender participation, upload progress           |
| client | View project & progress (scaffold only, post-MVP)         |

## Key Business Rules

- Minimal 2 vendor submit penawaran agar tender valid
- Tender tidak auto-close sampai ada vendor yang sesuai
- Nilai SPK = Tender Price x Quantity (bukan Base Price)
- Upload progress deadline: 09.00 WIB hari berikutnya
- Keterlambatan upload -> KPI negatif + flag sistem
- Payment 2-level approval: Finance Leora -> Client -> Paid

## Database Tables

**Existing (shared):** users, projects, vendor_spk, vendor_progress, vendor_payment
**New:** vendor_profiles, vendor_documents, vendor_products, tenders, tender_submissions, project_milestones, notifications, payment_requests, vendor_kpi_scores

## MVP Scope (target Apr 14)

Epic 1: Vendor registration & onboarding (full)
Epic 2: Admin verification + field visit checklist (full)
Epic 3: Admin input proyek manual — tanpa client portal
Epic 4: Tender minimal — submit penawaran, pilih pemenang, generate SPK
Epic 5: Monitoring harian full — upload progres, verifikasi SPV

## Progress Tracking

**WAJIB** setiap kali bekerja di proyek ini:

1. **Sebelum mulai task** — cek `docs/tasks/PROGRESS.md` untuk melihat status terkini
2. **Saat mulai task** — update status dari `Not started` ke `In progress`
3. **Setelah selesai task** — update status ke `Done` + update `Last updated`
4. **Jika task mengalami isu/blocker** — update status ke `Blocked` + tulis di Notes:
   - Deskripsi isu
   - Sejak kapan
   - Apa yang dibutuhkan untuk lanjut
5. **Jika sebagian selesai** — tetap `In progress` + tulis detail di Notes (apa yang sudah done, apa yang belum)

Status values:

- `Not started` — belum dikerjakan
- `In progress` — sedang dikerjakan (termasuk sebagian selesai, detail di Notes)
- `Done` — selesai
- `Blocked` — terblokir, WAJIB cantumkan: deskripsi isu, sejak kapan, apa yang dibutuhkan untuk lanjut

## On-Demand References

Baca file berikut HANYA saat relevan dengan task yang sedang dikerjakan:

- Task spesifik: `docs/tasks/task-XX-*.md` (e.g. `docs/tasks/task-01-vendor-actions.md`)
- End-to-end business flow: `docs/end-to-end-plan.md`
- Vendor module detail: `docs/modules/vendor.md`
- MVP plan & timeline: `docs/PLAN-MVP.md`

---

# Agent Commands Documentation

## Database Commands

### `pnpm db:pull`

Generate TypeScript types from Supabase database schema.

- **Command**: `npx supabase gen types typescript --project-id mgjtlmuqsgkhiopwzeni --schema public > types/database.types.ts`
- **Purpose**: Pull database types from remote Supabase project and generate TypeScript definitions
- **Output**: `types/database.types.ts` - Complete TypeScript types for all database tables, views, and enums
- **Prerequisites**: Valid Supabase project ID (mgjtlmuqsgkhiopwzeni)
- **Usage**: Run whenever database schema changes to keep types up-to-date

### `pnpm db:push`

Push local database migrations to remote Supabase project.

- **Command**: `supabase db push`
- **Purpose**: Apply local migration files to the remote database
- **Prerequisites**: Project must be linked with `supabase link`
- **Usage**: Run after making schema changes locally that need to be deployed

## Supabase Edge Functions

### Deploy Functions

Deploy Supabase Edge Functions to the cloud.

- **Command**: `supabase functions deploy <function-name>`
- **Example**: `supabase functions deploy send-email`
- **Purpose**: Deploy Edge Functions to Supabase cloud

### Set Secrets

Set environment secrets for Edge Functions.

- **Command**: `supabase secrets set KEY=value`
- **Purpose**: Set secrets for Edge Functions (SMTP, API keys, etc.)

## Testing Commands

### `pnpm test:pwa`

Test PWA functionality.

- **Command**: `bash scripts/test-pwa.sh`
- **Purpose**: Run automated tests for Progressive Web App features
- **Output**: Test results in terminal

## Development Commands

### `pnpm lint`

Run ESLint for code quality checks.

- **Command**: `eslint`
- **Purpose**: Check for code style and potential errors
- **Prerequisites**: ESLint configuration in project

### `pnpm typecheck`

Run TypeScript type checking.

- **Command**: `tsc --noEmit`
- **Purpose**: Verify TypeScript types without emitting files
- **Prerequisites**: TypeScript configuration

### `pnpm format`

Format code with Prettier.

- **Command**: `prettier --write "**/*.{ts,tsx}"`
- **Purpose**: Automatically format TypeScript and TSX files
- **Prerequisites**: Prettier configuration

Terse like caveman. Technical substance exact. Only fluff die.
Drop: articles, filler (just/really/basically), pleasantries, hedging.
Fragments OK. Short synonyms. Code unchanged.
Pattern: [thing] [action] [reason]. [next step].
ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift.
Code/commits/PRs: normal. Off: "stop caveman" / "normal mode".
