# Progress Tracker

Tracking semua tasks untuk MVP LPrecast.

## Status Values

- `Not started` — belum dikerjakan
- `In progress` — sedang mengerjakan (termasuk sebagian selesai — detail di Notes)
- `Done` — selesai
- `Blocked` — terblokir, WAJIB cantumkan di Notes:
  - Deskripsi isu
  - Sejak kapan
  - Apa yang dibutuhkan untuk lanjut

## How to Update

1. **Sebelum mulai** — cek status terkini di tabel
2. **Saat mulai** — update status ke `In progress`
3. **Saat selesai** — update status ke `Done` + update `Last updated`
4. **Saat ada isu** — update status ke `Blocked` + isi Notes sesuai format di atas
5. **Saat sebagian selesai** — tetap `In progress` + tulis detail di Notes

## Module References

Untuk task yang menyentuh domain project dan tender, gunakan modul berikut sebagai acuan:

- `docs/modules/PROJECT.md` - entity utama pekerjaan, lifecycle project, relasi ke tender
- `docs/modules/TENDER.md` - flow publish project ke vendor, dynamic tender items, attachment, vendor read flow
- `docs/modules/VENDOR.md` - akses vendor ke tender dan project

Mapping cepat:

- task create project, status project, milestone, execution -> baca `docs/modules/PROJECT.md`
- task publish tender, tender item, tender listing -> baca `docs/modules/TENDER.md`
- task vendor browse tender, detail tender, bid, notifikasi tender -> baca `docs/modules/VENDOR.md` dan `docs/modules/TENDER.md`
- task Kurva S baseline entry, monitoring, variance -> baca `docs/modules/PROJECT.md` dan `docs/modules/SPV.md`
- task daily report upload, SPV verification -> baca `docs/modules/VENDOR.md` (Lane 1: Vendor -> SPV -> System)
- task client milestone approval -> baca `docs/modules/PAYMENT.md` (Lane 2: Client approve milestone)
- task vendor invoice, finance verify, payment -> baca `docs/modules/PAYMENT.md` (Lane 3: Vendor -> Finance -> Paid)
- task client funding reminder, refill -> baca `docs/modules/PAYMENT.md` (Client -> Internal/Escrow)

---

**Last updated:** April 30, 2026 | Rapikan urutan task future agar mengikuti dependency bisnis, max 2-3 task per hari
---

## 0. Foundation

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Vendor - Master plan input form vendor | LPrecast | 0. Foundation | Done | April 1, 2026 → April 2, 2026 |
List fitur yg sudah ada di sistem dan disesuaikan | LPrecast | 0. Foundation | Done | April 1, 2026 |
Vendor - Setup project url baru | LPrecast | 0. Foundation | Done | April 4, 2026 |
Vendor - Buat wireframe halaman monitoring proyek | LPrecast | 0. Foundation | Done | April 4, 2026 |
Vendor - Buat wireframe halaman admin vendor management | LPrecast | 0. Foundation | Done | April 4, 2026 |
Vendor - Buat wireframe halaman vendor | LPrecast | 0. Foundation | Done | April 4, 2026 |
Vendor - Pembuatan Plan Userflow → Wireframe | LPrecast | 0. Foundation | Done | April 4, 2026 |
Connect website ke database supabase | LPrecast | 0. Foundation | Done | April 6, 2026 |
Vendor - Revisi halaman register vendor (Keterangan form, persentase, informasi tender) | LPrecast | 0. Foundation | Done | April 6, 2026 |
PWA - Setup PWA mobile | LPrecast | 0. Foundation | Done | April 6, 2026 |
Landing - Landing page LPrecast | LPrecast | 0. Foundation | Done | April 6, 2026 |
Vendor - Perbaikan input lokasi pengiriman | LPrecast | 0. Foundation | Done | April 7, 2026 |
Vendor - Convert wireframe ke hi-fi | LPrecast | 0. Foundation | Done | April 7, 2026 |
Vendor - Buat logika validasi data pendaftaran | LPrecast | 0. Foundation | Done | April 7, 2026 → April 8, 2026 |
Vendor - Buat skema database vendor | LPrecast | 0. Foundation | Done | April 7, 2026 |
Vendor - Membuat integrasi UI dan database/backend registrasi | LPrecast | 0. Foundation | Done | April 8, 2026 |
Vendor - Melengkapi form validasi | LPrecast | 0. Foundation | Done | April 8, 2026 |
Vendor - Buat alur status pendaftaran (pending → review) | LPrecast | 0. Foundation | Done | April 8, 2026 |
Vendor - Perbaikan storage file penyimpanan dokumen | LPrecast | 0. Foundation | Done | April 9, 2026 |
Tambah domain precast.leora.co.id | LPrecast | 0. Foundation | Done | April 9, 2026 |
Admin - Buat halaman dashboard | LPrecast | 0. Foundation | Done | April 9, 2026 |
Admin - Buat halaman detail vendor + review dokumen | LPrecast | 0. Foundation | Done | April 9, 2026 |
Migrasi database LPrecast ke project supabase baru | LPrecast | 0. Foundation | Done | April 10, 2026 |
Admin - fitur preview dokumen di dashboard | LPrecast | 0. Foundation | Done | April 10, 2026 |
Vendor - Buat alur pendaftaran email & pass untuk vendor (SMTP) | LPrecast | 0. Foundation | Done | April 10, 2026 |
Vendor - Fix form register agar tidak ada bug | LPrecast | 0. Foundation | Done | April 10, 2026 |
Admin - Buat halaman daftar vendor + filter status | LPrecast | 0. Foundation | Done | April 11, 2026 |
Vendor - Buat notifikasi ke admin saat vendor daftar (email & web) | LPrecast | 0. Foundation | Done | April 11, 2026 |
Vendor - Perbaikan fungsi submit registration | LPrecast | 0. Foundation | Done | April 13, 2026 |
Vendor - Perbaikan filter area pengiriman | LPrecast | 0. Foundation | Done | April 13, 2026 |
Admin - Detailing informasi vendor | LPrecast | 0. Foundation | Done | April 13, 2026 |
Admin - Perbaikan notifikasi & halaman notifikasi | LPrecast | 0. Foundation | Done | April 13, 2026 |
Analisa End to End Scenario LPrecast | LPrecast | 0. Foundation | Done | April 13, 2026 |
Admin - Aksi untuk remove vendor | LPrecast | 0. Foundation | Done | April 14, 2026 |
Vendor - Perbaikan fungsi email registration | LPrecast | 0. Foundation | Done | April 14, 2026 → April 16, 2026 |
Vendor - Perbaikan SMTP email webmail | LPrecast | 0. Foundation | Done | April 16, 2026 |
Sistem - Perbaikan relasi database untuk vendor | LPrecast | 0. Foundation | Done | April 17, 2026 |
Admin - Buat aksi approve / revisi / tolak vendor | LPrecast | 0. Foundation | Done | April 21, 2026 → April 22, 2026 |
Vendor - Perbaikan dashboard | LPrecast | 0. Foundation | Done | April 23, 2026 → April 24, 2026 |
Docs - Sinkronisasi CONTEXT.md dengan kondisi repo & progress terbaru | LPrecast | 0. Foundation | Done | April 24, 2026 |
Docs - Sinkronisasi VENDOR.md dengan kondisi repo & progress terbaru | LPrecast | 0. Foundation | Done | April 24, 2026 |
Docs - Rapikan knowledge base docs scope menengah (README, reference index, PDF summaries) | LPrecast | 0. Foundation | Done | April 24, 2026 |
Docs - Hapus planning artifacts dari folder docs (plans/specs) | LPrecast | 0. Foundation | Done | April 24, 2026 |
Docs - Pisahkan raw upload vs summary docs (`reference_file` vs `references`) | LPrecast | 0. Foundation | Done | April 24, 2026 |
Docs - Expand project docs scope (Kurva S, daily report, invoice, termin payment) | LPrecast | 0. Foundation | Done | April 27, 2026 |
Docs - Update lane separation (SPV only operasional, Finance/Client payment) | LPrecast | 0. Foundation | Done | April 27, 2026 |
Docs - Scale up docs structure untuk AI collaboration | LPrecast | 0. Foundation | Done | April 27, 2026 |
Docs - Internal showcase presentation guideline untuk AI | LPrecast | 0. Foundation | Done | April 27, 2026 |
Docs - Build internal showcase presentation page | LPrecast | 0. Foundation | Done | April 27, 2026 |
Admin - Fix notification bell hydration | LPrecast | 0. Foundation | Done | April 29, 2026 | Hapus server/client render branch di notification bell agar atribut Radix Popover konsisten saat hydration. Validasi: pnpm typecheck
Vendor - Rapikan indikator wajib dokumen legal | LPrecast | 0. Foundation | Done | April 29, 2026 | Tab 2 onboarding hanya KTP yang menampilkan tanda wajib; NPWP/NIB mengikuti validasi optional format-only. Validasi: pnpm typecheck
Admin - Fix preview dokumen vendor | LPrecast | 0. Foundation | Done | April 29, 2026 | Normalisasi storage path vendor_documents agar preview KTP/NPWP/NIB/SIUP/Company Profile bisa dibuka dari admin detail dan approval. Validasi: pnpm typecheck, pnpm build
Vendor - Fix register redirect onboarding step awal | LPrecast | 0. Foundation | Done | April 29, 2026 | Setelah register auto-login, onboarding draft fallback sekarang mulai dari step 1 bukan langsung tab 3. Validasi: pnpm typecheck, pnpm build

## 1. Initiation

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Admin - Buat add project (input + save + attachment storage + status draft) | LPrecast | 1. Initiation | Done | April 25, 2026 → April 28, 2026 |
Sistem - Set struktur status project & validasi transition dasar | LPrecast | 1. Initiation | Done | April 25, 2026 → April 27, 2026 |
Sistem - Setup target timeline & milestone project | LPrecast | 1. Initiation | Done | April 27, 2026 |
Client - Setup client profile completion foundation | LPrecast | 1. Initiation | Done | April 27, 2026 | Fondasi profile client sudah ada, tetapi untuk MVP project masih bisa diinisiasi dari sisi admin terlebih dulu.
Client - Buat project intake form client | LPrecast | 1. Initiation | Done | April 27, 2026 | Intake client sudah disiapkan sebagai arah flow target, namun belum menjadi pintu masuk utama project pada MVP.
Sistem - Define role & permission matrix (admin,vendor,SPV) | LPrecast | 1. Initiation | Not started | May 4, 2026 | Tetapkan batas akses per role sebelum lane SPV dan payment makin luas.
Sistem - Implement guard akses API berdasarkan role | LPrecast | 1. Initiation | Not started | May 4, 2026 | Pastikan endpoint penting hanya bisa dipakai role yang benar.
Client - Setup register/login client | LPrecast | 1. Initiation | Not started | May 4, 2026 | Siapkan akses client untuk lane approval milestone dan funding pada MVP.
Client - Setup dashboard client dasar | LPrecast | 1. Initiation | Not started | May 5, 2026 | Tampilkan ringkasan project client, status approval, dan next action client yang paling penting.
SPV - Setup register/login SPV | LPrecast | 1. Initiation | Not started | May 5, 2026 | Siapkan akses SPV sebelum role ini dipakai untuk pre-con dan verifikasi progress.
SPV - Setup dashboard SPV dasar | LPrecast | 1. Initiation | Not started | May 6, 2026 | Tampilkan daftar project SPV, task verifikasi, dan akses ke area pre-con.

## 2. Tender

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Admin - Buat & publish tender dari project existing | LPrecast | 2. Tender | Done | April 30, 2026 | Admin sudah bisa publish tender dari detail project draft, generate tender + tender items, lalu update status project ke tendering/open. Validasi audit code: `app/(admin)/admin/projects/[id]/tender/new/page.tsx`, `components/admin/tenders/tender-publish-form.tsx`, `app/(admin)/admin/projects/[id]/tender/actions.ts`, `lib/tenders/repository.ts`
Vendor - Tampilkan daftar project tender (fetch + UI list + empty state) | LPrecast | 2. Tender | Done | April 29, 2026 | Tambah view vendor_open_tenders, list tender open vendor-safe, badge sudah ajukan, empty state. Validasi: pnpm typecheck
Vendor - Tampilkan detail project tender (spesifikasi, lokasi, scope) | LPrecast | 2. Tender | Done | April 29, 2026 | Detail tender vendor-safe menampilkan ringkasan, lokasi publik, periode, item pekerjaan, dan CTA submit disabled. Validasi: pnpm typecheck
Vendor - Submit penawaran ke project (form + save bid ke database) | LPrecast | 2. Tender | Not started | April 30, 2026 | Siapkan form submit penawaran vendor dan simpan ke tabel bid yang sudah ada.
Sistem - Validasi submit bid vendor (relasi ke tender, 1 vendor 1 bid) | LPrecast | 2. Tender | Not started | April 30, 2026 | Pastikan bid terkait ke tender/project yang benar dan satu vendor tidak bisa kirim bid ganda.
Sistem - Validasi deadline tender (tidak bisa apply setelah close) | LPrecast | 2. Tender | Not started | April 30, 2026 | Kunci submit bid jika status tender sudah tidak open atau melewati batas waktu.
Admin - Lihat & bandingkan semua penawaran vendor (table comparison) | LPrecast | 2. Tender | Not started | May 1, 2026 | Buat layar admin untuk membaca semua penawaran vendor dalam satu tempat.
Admin - Pilih pemenang tender & assign vendor ke project | LPrecast | 2. Tender | Not started | May 2, 2026 | Setelah compare selesai, admin pilih vendor pemenang lalu hubungkan vendor ke project.
Sistem - Kirim notifikasi hasil tender ke vendor (menang/kalah) | LPrecast | 2. Tender | Not started | May 4, 2026 | Kirim notifikasi sederhana ke vendor setelah admin menetapkan hasil tender.

## 3. Execution

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Sistem - Generate dokumen SPK sederhana (inject data project & vendor) | LPrecast | 3. Execution | Not started | May 5, 2026 | Setelah vendor dipilih, buat SPK awal dari data project dan vendor terpilih.
Sistem - Entry Kurva S baseline (SPV pre-con, wajib sebelum execution) | LPrecast | 3. Execution | Not started | May 6, 2026 | Siapkan input baseline target progress sebagai syarat sebelum lane execution berjalan.
Sistem - Setup termin contract per project (template 35/25/25/15 + override) | LPrecast | 3. Execution | Not started | May 6, 2026 | Simpan termin default per project dan sediakan opsi override jika dibutuhkan.
Vendor - Upload progres harian (foto + deskripsi + update progress) | LPrecast | 3. Execution | Not started | May 7, 2026 | Vendor kirim laporan harian beserta foto dan catatan pekerjaan.
Sistem - Simpan & hitung total progress project (% kumulatif) | LPrecast | 3. Execution | Not started | May 8, 2026 | Agregasi progress harian yang valid menjadi progress kumulatif project.
Client - Approve milestone progress (sebelum vendor invoice) | LPrecast | 3. Execution | Not started | May 11, 2026 | Client cukup approve milestone besar, bukan approve laporan harian satu per satu.
Sistem - Trigger milestone pembayaran berdasarkan progress | LPrecast | 3. Execution | Not started | May 11, 2026 | Saat progress mencapai batas termin, sistem memunculkan milestone payment yang relevan.
Sistem - Trigger funding reminder ke client (45-49% threshold) | LPrecast | 3. Execution | Not started | May 12, 2026 | Ingatkan client setor dana termin berikutnya sebelum progress menyentuh milestone.
Client - Setor termin berikutnya ke internal/escrow (refill untuk termin berikutnya) | LPrecast | 3. Execution | Not started | May 12, 2026 | Catat bahwa dana termin berikutnya sudah masuk dan siap dipakai untuk payment lane.
Vendor - Submit invoice per termin (form + lampiran PDF + bukti progress) | LPrecast | 3. Execution | Not started | May 12, 2026 | Vendor kirim invoice hanya setelah milestone approved dan dokumen pendukung lengkap.
Finance - Verify invoice vendor (nominal sesuai termin, lampiran lengkap) | LPrecast | 3. Execution | Not started | May 13, 2026 | Finance cek nominal, termin aktif, dan kelengkapan lampiran invoice.
Sistem - Execute payment vendor dari internal fund (escrow) | LPrecast | 3. Execution | Not started | May 13, 2026 | Setelah finance verify dan dana siap, sistem ubah status payment ke paid.
Sistem - Simpan histori status pembayaran (milestone tracking) | LPrecast | 3. Execution | Not started | May 13, 2026 | Simpan jejak status pembayaran agar mudah diaudit per project dan termin.

## 4. Monitoring

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Tim Dev - Testing end-to-end flow (tender → execution → verify) | LPrecast | 4. Monitoring | Done | April 28, 2026 | Scope saat ini baru smoke test foundation dan route utama, belum full flow tender sampai payment.
SPV - Verifikasi progress (approve/reject + catatan) | LPrecast | 4. Monitoring | Not started | May 7, 2026 | SPV approve atau reject laporan harian vendor dengan catatan lapangan.
Sistem - Validasi progress tidak melebihi 100% | LPrecast | 4. Monitoring | Not started | May 8, 2026 | Cegah akumulasi progress project melewati batas logis.
Sistem - Simpan histori perubahan progress (audit trail) | LPrecast | 4. Monitoring | Not started | May 8, 2026 | Simpan jejak perubahan progress agar keputusan SPV dan vendor bisa dilacak.
Sistem - Tampilkan Kurva S baseline di project dashboard (target vs aktual) | LPrecast | 4. Monitoring | Not started | May 9, 2026 | Tampilkan target baseline dan progress aktual dalam satu tampilan.
Sistem - Hitung variance progress vs target Kurva S per hari | LPrecast | 4. Monitoring | Not started | May 9, 2026 | Hitung selisih antara target dan aktual agar deviasi cepat terlihat.
Sistem - Tracking progress vs timeline & flag keterlambatan | LPrecast | 4. Monitoring | Not started | May 9, 2026 | Beri tanda jika progress harian mulai tertinggal dari rencana.
Sistem - Update status project berdasarkan verifikasi progress | LPrecast | 4. Monitoring | Not started | May 11, 2026 | Status project ikut bergerak berdasarkan progress verified, bukan input mentah vendor.
Sistem - Buat activity log untuk semua aksi penting (bid, progress, approval) | LPrecast | 4. Monitoring | Not started | May 12, 2026 | Catat aksi penting lintas role dalam satu log aktivitas project.
Sistem - Trigger notifikasi otomatis berdasarkan event (progress, delay, approval) | LPrecast | 4. Monitoring | Not started | May 12, 2026 | Notifikasi dikirim otomatis saat ada event penting yang perlu ditindaklanjuti.
Admin - Tampilkan halaman riwayat aktivitas project (timeline log) | LPrecast | 4. Monitoring | Not started | May 12, 2026 | Sediakan halaman timeline agar admin mudah baca histori project dari awal sampai akhir.
Sistem - Hitung KPI vendor (on-time, completion rate) | LPrecast | 4. Monitoring | Not started | May 14, 2026 | KPI vendor dihitung dari disiplin upload, progress, dan penyelesaian task lapangan.
Sistem - Hitung KPI SPV (reporting, approval consistency) | LPrecast | 4. Monitoring | Not started | May 14, 2026 | KPI SPV dihitung dari konsistensi verifikasi dan kedisiplinan monitoring.
Admin - Dashboard performa vendor & SPV (berdasarkan KPI) | LPrecast | 4. Monitoring | Not started | May 14, 2026 | Ringkas performa vendor dan SPV agar admin cepat tahu siapa yang perlu perhatian.
Semua Role - Dashboard monitoring overview (progress,status, delay) | LPrecast | 4. Monitoring | Not started | May 15, 2026 | Siapkan dashboard ringkas per role dengan data yang relevan dan aman untuk masing-masing akses.

## 5. Closing

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Admin - Dashboard payment project (termin status, paid, pending) | LPrecast | 5. Closing | Not started | May 15, 2026 | Buat ringkasan status termin dan payment project agar admin mudah follow up.
Admin - Finalisasi project & penutupan (status COMPLETED) | LPrecast | 5. Closing | Not started | May 16, 2026 | Tutup project setelah progress, payment, dan dokumen penutup benar-benar lengkap.

## 6. Enhancement

Task | Project | Phase | Status | Last updated | Notes
--- | --- | --- | --- | --- | ---
Tim Dev - Bug fixing, polish UI & dokumentasi sistem | LPrecast | 6. Enhancement | Not started | May 18, 2026 | Rapikan bug kecil, UI akhir, dan sinkronkan dokumentasi setelah flow inti stabil.
