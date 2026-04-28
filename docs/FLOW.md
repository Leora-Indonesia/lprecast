# LPrecast End-to-End Flow

`FLOW.md` adalah source of truth untuk alur bisnis lintas role di LPrecast. Detail domain tetap hidup di `docs/modules/*.md`, tapi perubahan handoff antar role, approval layer, dan event flow harus tercermin di file ini.

## Actors

- `client` - memesan proyek, menyetor dana termin, lihat progres, approve milestone progress
- `admin` - menyiapkan project, publish tender, mengelola operasional internal
- `vendor` - ikut tender, mengerjakan, upload laporan harian, submit invoice
- `spv` - verifikator operasional lapangan, pre-con owner, monitoring progres harian
- `finance ops` - pegang finance internal, validasi invoice vendor, eksekusi payment ke vendor
- `system` - validasi, scoring, notification, trigger status, milestone tracking, funding reminder

## Phase 1. Client Intake and Qualification

1. Client mengisi identitas, lokasi proyek, dan kebutuhan awal.
2. System memvalidasi akun dasar dan menyimpan konteks awal proyek.
3. Client menerima estimasi biaya / durasi awal.
4. Tim internal melakukan qualification untuk melihat kelayakan proyek.
5. Jika deal lanjut, client masuk ke tahap kontrak dan pembayaran awal.

Output utama:

- project brief awal
- data lokasi dan kebutuhan
- status qualification internal

## Phase 2. Project Initiation

1. Admin membuat `project` sebagai wadah operasional utama.
2. Project disimpan dalam status `draft` atau status internal sejenis.
3. Data project mencakup nama, lokasi, periode kerja, deskripsi umum, dan lampiran teknis.
4. Project menjadi anchor untuk tender, vendor assignment, execution, payment, dan completion.

Output utama:

- `project` siap dipublish ke tender
- data sensitif client tetap tertahan di layer internal

## Phase 3. Tender Publish and Vendor Selection

1. Admin membuat `tender` dari project yang sudah ada.
2. Admin melengkapi metadata tender, attachment, dan satu atau lebih `tender_items`.
3. System mempublish tender dengan status awal `open`.
4. Vendor melihat daftar tender dan detail tender yang boleh diakses.
5. Vendor submit penawaran sesuai rule tender.
6. Admin membandingkan penawaran dan memilih vendor yang sesuai.
7. Vendor pemenang di-assign ke project.

Rules penting:

- tender dibuat dari project yang sudah ada
- minimal dua vendor submit agar tender valid
- tender tidak auto-close sampai ada vendor yang sesuai
- vendor tidak boleh melihat data client sensitif

Output utama:

- vendor assigned
- project siap masuk execution

## Phase 4. SPV Preparation and Pre-Con

1. SPV masuk pool, diseleksi, lalu di-assign ke project.
2. Sebelum execution dimulai, SPV wajib menyiapkan dokumen pre-con.
3. Dokumen minimal mencakup:
   - RKS
   - Master Schedule / Kurva S
   - Procurement Plan
   - RK3K
   - Risk Register
4. PCM dilakukan untuk alignment final scope, timeline, procurement, risk, safety, KPI, dan white-label rule.

Rules penting:

- tanpa approval dokumen pre-con, proyek tidak boleh mulai
- vendor tidak boleh bypass dan kontak langsung client
- SPV adalah control layer, bukan hanya approver progres

Output utama:

- project readiness confirmed
- execution baseline siap dipakai monitoring

## Phase 5. Project Execution and Daily Reporting (Lane 1 - Operasional)

**Lane 1: Daily Reporting**

1. Vendor submit laporan harian via sistem.
2. Laporan harian memuat: tanggal, progres (% per item), deskripsi, kendala, cuaca, tenaga kerja, foto/video.
3. SPV verify laporan vendor (approve/reject dengan catatan).
4. System hitung progres kumulatif dari daily report yang verified SPV.
5. System plot ke Kurva S baseline → variance / delay signal.
6. Client lihat progres via dashboard (VIEW ONLY, tidak perlu approve harian).

Rules:

- Upload deadline: 09.00 WIB hari berikutnya
- Keterlambatan → flag sistem + KPI negatif
- SPV wajib verify sebelum masuk kalkulasi kumulatif
- Vendor tidak bypass ke client, harus lewat SPV

Output:

- daily report trail terverifikasi SPV
- progress kumulatif vs Kurva S baseline
- variance / delay signals
- milestone trigger untuk Lane 2

## Phase 6. Validation, Payment, and Completion (Lane 2 & 3)

**Lane 2: Milestone Progress Approval**

1. System deteksi progress kumulatif sudah mendekat milestone threshold (misal 45%).
2. Client approve milestone progress (misal: "ya, progress 50% tercapai dan disetujui").
3. Approval milestone ini jadi trigger untuk:
   - B (vendor payment eligible) 
   - C (client funding reminder)
4. Sistem catat approval milestone dengan timestamp.

Rules:

- Client wajib approve milestone progress SEBELUM vendor bisa invoice
- SPV tidak masuk lane payment, cuma hasilkan verified progress
- Client tidak perlu approve setiap daily report, cukup milestone besar

---

**Lane 3: Payment dan Funding**

**3A. Vendor Payment (dari internal fund)**

1. Vendor submit invoice dengan lampiran bukti progress.
2. Finance Ops/Internal validasi:
   - Invoice detail vs progress milestone approved
   - Lampiran lengkap
   - Nominal sesuai termin contract
3. Finance Ops approve → system mark "ready to pay".
4. Payment executed dari internal fund ke vendor.

**3B. Client Funding (refill untuk termin berikutnya)**

1. System deteksi progress sudah 45-49% (threshold configurable).
2. System trigger reminder ke client: "silakan_setor termin berikutnya".
3. Client setor dana termin berikutnya ke internal/escrow.
4. System confirm dana masuk → status "funds ready".
5. Baru vendor eligible untuk invoice termin berikutnya.

Rules:

- Invoice wajib punya lampiran sebelum approval
- Vendor payment hanya jalan kalau:
  - milestone approved client
  - funds tersedia di internal/escrow
- SPV TIDAK boleh lihat invoice vendor detail finansial
- SPV TIDAK boleh lihat billing client, margin, atau cash position
- Client wajib setor termin berikutnya SEBELUM progress sentuh milestone

Output:

- Client milestone approval logged
- Vendor payment executed (dari internal fund)
- Client funding confirmed ke escrow
- Audit trail per payment event

## Control Layers

- **Operasional lane**: Vendor → SPV → System (daily report, progress verification)
- **Milestone approval lane**: SPV verified → Client approve milestone
- **Payment lane**: Vendor → Finance Ops → Paid (dari internal fund)
- **Funding lane**: System → Client reminder → Client setor → Internal/Escrow
- Client wajib approve milestone sebelum vendor invoice
- SPV TIDAK boleh akses invoice vendor detail finansial
- SPV TIDAK boleh akses billing client, margin, atau cash position

## Documentation Ownership

- perubahan alur lintas role -> update `docs/FLOW.md`
- perubahan detail project lifecycle -> update `docs/modules/PROJECT.md`
- perubahan detail tender/bid -> update `docs/modules/TENDER.md`
- perubahan vendor reporting atau onboarding -> update `docs/modules/VENDOR.md`
- perubahan SPV selection, pre-con, verification -> update `docs/modules/SPV.md`
- perubahan termin payment, invoice, approval chain -> update `docs/modules/PAYMENT.md`
- perubahan status task delivery -> update `docs/tasks/PROGRESS.md`
