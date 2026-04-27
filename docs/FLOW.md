# LPrecast End-to-End Flow

`FLOW.md` adalah source of truth untuk alur bisnis lintas role di LPrecast. Detail domain tetap hidup di `docs/modules/*.md`, tapi perubahan handoff antar role, approval layer, dan event flow harus tercermin di file ini.

## Actors

- `client` - meminta proyek, approve milestone tertentu, melihat progres
- `admin` - menyiapkan project, publish tender, memilih vendor, mengelola operasional internal
- `vendor` - ikut tender, menjalankan pekerjaan, upload laporan lapangan
- `spv` - control layer, pre-con owner, monitoring, verifikasi progres
- `system` - menjalankan validasi, scoring, notification, dan trigger status/payment

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

## Phase 5. Project Execution and Daily Reporting

1. Vendor mulai pekerjaan lapangan.
2. Vendor atau lapisan operasional lapangan mengirim laporan harian dan bukti progres.
3. Laporan harian minimal memuat tanggal, progres, kendala, cuaca, tenaga kerja, dan foto/video.
4. SPV memonitor progres aktual terhadap target dan baseline schedule.
5. System menghitung progres kumulatif, warning keterlambatan, dan KPI terkait bila rule sudah aktif.

Rules penting:

- upload progres harian maksimal jam 09.00 WIB hari berikutnya
- keterlambatan upload memberi flag sistem dan KPI negatif
- progres harus terdokumentasi dengan bukti visual dan catatan lapangan

Output utama:

- daily report trail
- progress vs target dashboard
- delay / issue signals

## Phase 6. Validation, Payment, and Completion

1. SPV memverifikasi progres vendor.
2. System mengecek approval layer dan trigger milestone atau termin pembayaran.
3. Payment berjalan sesuai skema approval internal dan client.
4. Final QC dilakukan saat pekerjaan selesai.
5. BAST dan final approval menutup proyek.
6. System update status `completed`, histori performa vendor/SPV, dan data closing lain.

Rules penting:

- nilai SPK = tender price x quantity
- payment approval berjalan bertahap, tidak langsung auto-paid tanpa approval layer yang relevan
- histori progres, pembayaran, dan performa harus bisa diaudit

## Control Layers

- Approval layer: admin/internal, SPV, client, dan system sesuai tahap
- Transparency layer: client bisa lihat progres, vendor tidak bisa lihat data client sensitif
- Control layer: semua aksi penting harus lewat sistem, bukan bypass manual
- Event-based workflow: tiap status atau approval penting harus bisa memicu step berikutnya

## Documentation Ownership

- perubahan alur lintas role -> update `docs/FLOW.md`
- perubahan detail project lifecycle -> update `docs/modules/PROJECT.md`
- perubahan detail tender/bid -> update `docs/modules/TENDER.md`
- perubahan vendor reporting atau onboarding -> update `docs/modules/VENDOR.md`
- perubahan SPV selection, pre-con, verification -> update `docs/modules/SPV.md`
- perubahan status task delivery -> update `docs/tasks/PROGRESS.md`
