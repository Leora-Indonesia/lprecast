---
plan name: ProjectDocsUpgrade
plan description: Expand docs project scope
plan status: active
---

## Idea
Perlu memperluas dokumentasi domain project agar mencakup baseline Kurva S, laporan harian vendor sebagai basis progress aktual, lampiran tagihan/invoice, dan skema pembayaran per termin. Struktur docs perlu menjaga source-of-truth tetap jelas: flow lintas role di FLOW.md, detail lifecycle dan data contract di PROJECT.md, detail operasional vendor di VENDOR.md, detail control/approval SPV di SPV.md, serta modul payment baru untuk rule termin, invoice, approval, dan audit trail. Skema pembayaran dipilih hybrid: ada template default 35/25/25/15 dari referensi existing, tetapi project tetap bisa override termin dan trigger milestone per proyek.

## Implementation
- Review seluruh source-of-truth docs yang terdampak dan petakan gap terhadap empat fitur baru: Kurva S, laporan harian, invoice attachment, dan termin payment.
- Definisikan batas ownership dokumen agar payment dipisah ke modul baru `docs/modules/PAYMENT.md`, sementara `FLOW.md`, `PROJECT.md`, `VENDOR.md`, `SPV.md`, dan `CONTEXT.md` hanya menyimpan bagian yang relevan.
- Rumuskan perubahan domain project: baseline Kurva S sebagai execution baseline, relasi laporan harian ke progress aktual, dan relasi project ke termin payment serta invoice evidence.
- Rumuskan perubahan flow lintas role untuk vendor, SPV, admin, client, dan system termasuk approval chain daily report, progress verification, milestone trigger, invoice submission, dan payment release.
- Update roadmap docs di `docs/tasks/PROGRESS.md` dengan task-task baru atau refined task untuk implementasi Kurva S, daily report, invoice attachment, payment term configuration, verification, dan audit trail.
- Setelah plan disetujui, lakukan edit dokumentasi source-of-truth dan validasi konsistensi antar file agar tidak ada rule yang konflik.

## Required Specs
<!-- SPECS_START -->
<!-- SPECS_END -->