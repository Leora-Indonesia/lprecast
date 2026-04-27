# End-to-End Scenario SPV Summary

## Purpose

Dokumen requirement detail untuk flow SPV dari registrasi sampai completion proyek, termasuk seleksi, kontrak, planning, monitoring, payment, dan KPI.

## Main Sections

### Registration and Screening

- Form SPV mencakup identitas, pengalaman kerja, self-rating skill, availability, expected salary, dan upload dokumen
- Verifikasi awal: OTP WA, validasi email, screening HR + PM
- Output screening: `APPROVED POOL`, `REJECT`, atau `HOLD`

### Project Tender and Selection

- Proyek dibuka ke vendor dan SPV pool
- SPV apply dengan availability, pengalaman relevan, strategi pengawasan, komitmen KPI, dan expected fee
- Seleksi pakai scoring, shortlist, lalu interview oleh PM

### Contract and Assignment

- Kontrak PKWT digenerate otomatis
- Base fee mengikuti prorate UMR wilayah proyek
- Bonus KPI dihitung terpisah
- Setelah sign digital, status jadi `SPV ASSIGNED`

### Pre-Construction Planning

SPV wajib submit 5 dokumen:

1. RKS
2. Master Schedule / Kurva S
3. Procurement Plan
4. RK3K
5. Risk Register

Rule kritikal:

- tanpa approval dokumen, proyek tidak boleh dimulai

### PCM and Execution

- PCM wajib membahas scope, schedule, procurement, risk, safety, KPI, dan white-label rule
- Output PCM: MoM, attendance list, final confirmation
- Execution mewajibkan daily report, upload foto/video, dan dashboard monitoring

### Payment, KPI, and Closing

- SPV approve progress vendor untuk trigger termin
- Pembayaran SPV berjalan per termin, sejalan dengan progress proyek
- Bonus KPI terkait on-time, no complaint, quality, reporting discipline
- Closing mencakup final QC, BAST, final report, dan performance update

## Important Rules

- SPV adalah control layer dan representasi brand Leora
- White-label rule: vendor tidak kontak langsung client
- Approval layer ada di PM, SPV, dan client sesuai tahap
- KPI SPV harus tercatat sebagai basis tiering dan project priority selanjutnya

## Product Impact

- Menjadi referensi utama untuk future module `SPV`
- Menambah requirement untuk planning docs, PCM workflow, dan KPI bonus engine
- Relevan ke payment, milestone, progress verification, dan project readiness status

## Recommended KB Destination

- `docs/modules/SPV.md`
- `docs/FLOW.md`
- doc future untuk payment / milestones / KPI
