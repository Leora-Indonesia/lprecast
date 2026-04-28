# SPV Module Documentation

Dokumentasi module SPV untuk LPrecast Vendor Portal.

## Overview

Module SPV menangani role pengawas lapangan (pekerja lepas) untuk validasi operasional harian. SPV bukan bagian dari flow payment — SPV fokus pada verifikasi progres lapangan saja.

**Batasan kritikal:**

- SPV hanya pegang **verifikasi progres fisik** dan **daily report**
- SPV TIDAK boleh akses invoice vendor detail finansial
- SPV TIDAK boleh akses billing/tagihan ke client
- SPV TIDAK boleh akses margin atau cash position internal
- SPV TIDAK masuk approval chain payment

## Core Responsibilities

- masuk talent pool dan lolos screening
- apply atau di-assign ke project yang relevan
- menyiapkan dokumen pre-con sebelum execution
- memimpin alignment PCM
- monitor progres vendor di lapangan (VIEW ONLY untuk financial)
- **verifikasi laporan harian dan progres fisik** — approve/reject dengan catatan
- memberi catatan issue, kualitas, dan risiko lapangan
- **TIDAK masuk payment approval** — SPV hanya hasilkan "progress verified" flag

## Pre-Construction Scope

Sebelum project boleh berjalan, SPV wajib menyiapkan atau melengkapi dokumen berikut:

1. RKS
2. Master Schedule / Kurva S
3. Procurement Plan
4. RK3K
5. Risk Register

Rule kritikal:

- tanpa approval dokumen pre-con, project belum boleh masuk execution

## Execution Scope

Saat project berjalan, SPV bertugas untuk:

- memantau progress vs target (Kurva S baseline) — **VIEW ONLY untuk finansial**
- memverifikasi laporan harian vendor — approve/reject dengan catatan
- mencatat kendala lapangan, cuaca, dan risiko aktual
- menjaga white-label rule agar vendor tidak bypass client
- **menghasilkan flag "progress verified"** untuk trigger milestone

**SPV TIDAK boleh:**
- melihat invoice vendor detail finansial
- melihat billing/tagihan ke client
- melihat margin atau cash position internal
- masuk approval chain payment

### Daily Report Verification

SPV wajib verify setiap daily report yang dikirim vendor:

- Cek kesesuaian deskripsi dengan bukti visual (foto/video)
- Validasi % progres yang diklaim
- Approve atau reject dengan catatan issue jika ada
- **Hanya report yang SPV approve yang masuk kalkulasi kumulatif**

Reject oleh SPV → vendor harus resubmit dengan perbaikan. Sistem menyimpan histori verification untuk audit trail.

### Output untuk Lane Lain

SPV menghasilkan:

- **verified daily report** → masuk Lane 1 (daily reporting)
- **verified progress kumulatif** → trigger untuk Lane 2 (milestone approval)
- **CATATAN: SPV TIDAK hasilkan invoice approval atau payment approval**

## Business Rules

- SPV adalah representasi brand Leora di lapangan (pekerja lepas)
- vendor tidak boleh kontak langsung client
- SPV hanya hasilkan **verified progress flag**, bukan approval payment
- disiplin reporting SPV memengaruhi bonus KPI
- **SPV TIDAK boleh akses finansial project** (invoice, billing, margin, cash position)
- **Client funding dan vendor payment adalah lane terpisah** — SPV tidak masuk di situ

## Database Mapping

Tabel atau area data yang relevan untuk SPV module:

- `projects`
- `vendor_progress` — daily report vendor
- `vendor_spk`
- `project_milestones` — milestone status untuk trigger

**SPV TIDAK perlu akses:**
- `payment_requests` — itu lane finance/internal
- `payment_approvals` — itu lane finance/internal
- invoice detail atau billing

Referensi schema teknis tetap mengikuti `types/database.types.ts`.

## Related Documentation

- `/docs/CONTEXT.md`
- `/docs/FLOW.md` - lane 1 (daily), lane 2 (milestone), lane 3 (payment/funding)
- `/docs/tasks/PROGRESS.md`
- `/docs/modules/PROJECT.md` - Kurva S baseline project
- `/docs/modules/VENDOR.md` - Daily report submission oleh vendor
- `/docs/modules/PAYMENT.md` - SPV TIDAK masuk payment lane
- `/docs/references/cerita-nyata-spv-summary.md`
- `/docs/references/end-to-end-scenario-spv-summary.md`

## Notes

- **SPV hanya operasional lapangan** — bukan bagian dari flow payment
- SPV hasilkan "progress verified" flag untuk trigger milestone
- Client dan Finance Ops yang pegang payment lane
- Lane pemisahan: Lane 1 (daily SPV), Lane 2 (milestone client), Lane 3 (payment finance → paid, funding client → escrow)
