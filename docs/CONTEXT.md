# Identitas Proyek

Nama: LPrecast Vendor Portal

URL: precast.leora.co.id

Repo: terpisah dari sistem internal, DB Supabase sama

# Bisnis

Platform konstruksi model Upwork — Leora sebagai makelar/pihak ketiga

3 role: Admin (Leora internal), Vendor, Client

Flow utama: Registrasi → Verifikasi → Tender → Pelaksanaan → Pembayaran → Evaluasi

# Stack

Next.js 16 App Router + React 19 + TypeScript + Turbopack

Supabase (shared dengan sistem internal) — auth, DB, storage

Tailwind CSS + shadcn/ui + Radix UI

PWA: Serwist — service worker, offline support, installable (manifest + sw)

Payment: Xendit (post-MVP)

# Auth

Shared Supabase auth dengan sistem internal

Middleware cek stakeholder_type: hanya vendor, client, admin yang boleh masuk

internal user di-redirect ke unauthorized

# Role & Akses

admin — full access, manajemen vendor, tender, proyek

vendor — registrasi, ikut tender, upload progres

client — view proyek & progres (scaffold only, post-MVP)

# Database (Supabase — shared) Existing tables yang direuse:

users — profiles + stakeholder_type + RBAC

projects — data proyek

vendor_spk — SPK vendor

vendor_progress — progres harian

vendor_payment — pembayaran vendor

New tables yang akan dibuat:

vendor_profiles — data perusahaan vendor

vendor_documents — dokumen persyaratan

vendor_products — daftar harga produk

tenders — data tender

tender_submissions — penawaran vendor

project_milestones — milestone proyek

notifications — notifikasi sistem

payment_requests — pengajuan pembayaran (scaffold)

vendor_kpi_scores — skor KPI vendor (scaffold)

# MVP Scope (target 14 April)

Epic 1: Vendor registration & onboarding (full)

Epic 2: Admin verification + field visit checklist (full)

Epic 3: Admin input proyek manual — tanpa client portal

Epic 4: Tender minimal — submit penawaran, pilih pemenang, generate SPK

Epic 5: Monitoring harian full — upload progres, verifikasi SPV

Post-MVP:

Payment via Xendit

Client portal

KPI & evaluasi otomatis

Notifikasi WhatsApp/email

Mobile app: PWA with push notification (OneSignal integration)

# Business Rules Penting

Vendor wajib lengkapi 11 data dalam 3×24 jam atau auto-nonaktif

Min. 2 vendor submit penawaran agar tender valid

Tender tidak auto-close sampai ada vendor yang sesuai

Nilai SPK = Tender Price × Quantity (bukan Base Price)

Upload progres deadline 09.00 WIB hari berikutnya

Keterlambatan upload → KPI negatif + flag sistem

Payment 2-level approval: Finance Leora → Client → Paid

Pembayaran hanya ke rekening atas nama PT yang terdaftar

# Struktur Folder

app/
├── sw.ts # Service worker (Serwist)
├── manifest.ts # PWA manifest
├── ~offline/ # Offline fallback page
├── (auth)/login/
├── (vendor)/dashboard, profile, tenders, projects
├── (client)/dashboard, projects
├── (admin)/dashboard, vendors, tenders
└── api/
lib/
├── utils.ts
└── theme-config.ts # Source of truth untuk warna tema
docs/
├── CONTEXT.md
├── PROGRESS.md
├── architecture/
│ ├── design-system.md
│ └── pwa.md # PWA architecture guide
└── modules/vendor.md

# Konvensi Koding

Semua komponen UI pakai shadcn — cek docs/architecture/design-system.md

Server components by default, use client hanya jika perlu interaktivitas

API calls via Supabase client — gunakan RLS, jangan bypass dengan service role di client

Setiap route protected wajib pakai middleware check stakeholder_type

Theme warna: SINGLE SOURCE OF TRUTH di lib/theme-config.ts — cek docs/architecture/pwa.md
