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

---

**Last updated:** April 22, 2026

| #   | Task                                                                 | Status      | Due Date     | Notes |
| --- | -------------------------------------------------------------------- | ----------- | ------------ | ----- |
| 1   | Vendor - Perbaikan fungsi email registration                         | In progress | Apr 16, 2026 | -     |
| 2   | Vendor - Perbaikan SMTP email webmail                                | In progress | Apr 16, 2026 | -     |
| 3   | Admin - Buat aksi approve / revisi / tolak vendor                    | Done        | Apr 16, 2026 | Approval flow + status badge normalization |
| 4   | Admin - Buat form project tender (via admin)                         | Not started | Apr 17, 2026 | -     |
| 5   | Vendor - Buat halaman daftar tender yang available                   | Not started | Apr 17, 2026 | -     |
| 6   | Admin - Buat fitur evaluasi & pilih pemenang (comparison table)      | Not started | Apr 18, 2026 | -     |
| 7   | Admin/Sistem - Buat generate dokumen SPK sederhana                   | Not started | Apr 18, 2026 | -     |
| 8   | Semua Role - Buat dashboard monitoring overview proyek               | Not started | Apr 18, 2026 | -     |
| 9   | Vendor - Buat form submit penawaran (items, pricing, metode kerja)   | Not started | Apr 18, 2026 | -     |
| 10  | Sistem - Buat logic tracking deadline & flag keterlambatan           | Not started | Apr 18, 2026 | -     |
| 11  | Vendor - Buat halaman upload progres harian (foto, deskripsi, bobot) | Not started | Apr 20, 2026 | -     |
| 12  | Sistem - Buat notifikasi hasil tender ke pemenang & non-pemenang     | Not started | Apr 21, 2026 | -     |
| 13  | SPV - Buat autentikasi & layout dashboard khusus SPV                 | Not started | Apr 21, 2026 | -     |
| 14  | SPV - Buat fitur verifikasi progress (approve/reject + catatan)      | Not started | Apr 21, 2026 | -     |
| 15  | Tim Dev - Lakukan testing & bug fixes end-to-end MVP                 | Done        | Apr 21, 2026 | `vendor_approval_drafts` remote schema sudah beres. Approval workspace dipolish: tombol approve jadi 1 tombol dinamis (`Approve` jika skor >= 85, `Approve (Bersyarat)` jika 70-84, disabled jika < 70), types database sudah dipull ulang, dan typecheck lulus. |
| 16  | Tim Dev - Lakukan polish final, dokumentasi, & code cleanup          | Done        | Apr 23, 2026 | Threshold score dibuat lebih readable pada ringkasan approval |
| 17  | Admin - Tambah tombol approval checklist di detail vendor            | Done        | Apr 21, 2026 | Button menuju `/admin/vendors/[id]/approval` untuk review ulang |
| 18  | Admin - Samakan approval workspace + scoring checklist              | Done        | Apr 21, 2026 | Samakan layout dengan `vendors/checklist-preview` + scoring berbobot + red flag auto reject. Polish: header cards pindah ke baris bawah + mobile stack |
| 19  | Admin - Hardening approval (server-side enforcement)               | Done        | Apr 22, 2026 | Enforce rule skor/red flag di server + jangan trust payload client (`adminUserId/score/tier`). |
| 20  | Admin - Single source checklist + red flag                         | Done        | Apr 22, 2026 | Hapus duplikasi red flag/list checklist. Pakai satu module config + reuse di UI + scoring. |
| 21  | Admin - Perkuat typing boundary approval draft                      | Done        | Apr 22, 2026 | Validasi payload approval pakai schema + coercion, response path lebih ketat. |
| 22  | Admin - Optimasi data fetch approval workspace                       | Done        | Apr 22, 2026 | Page approval pakai fetch khusus workspace, tidak lagi overfetch field detail vendor. |
| 23  | Admin - Pisah catatan review ke drawer                               | Done        | Apr 22, 2026 | Catatan dipindah ke drawer + inline callout saat revisi/ditolak, tombol action bisa buka drawer. |
| 24  | Admin - Padatkan card Status & Skor                                  | Done        | Apr 22, 2026 | Status card isi legal minimum, snapshot, review trail, draft; Skor card isi eligibility, checklist progress, level. |

(End of file - total 30 lines)
