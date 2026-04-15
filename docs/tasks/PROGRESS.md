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

**Last updated:** April 15, 2026

| #   | Task                                                                 | Status      | Due Date     | Notes                                                                                                            |
| --- | -------------------------------------------------------------------- | ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Admin - Buat aksi approve / revisi / tolak vendor                    | Not started | Apr 15, 2026 | -                                                                                                                |
| 2   | Vendor - Refactor registration: signup-first + PKCE flow             | Done        | Apr 15, 2026 | Refactored to signup-first flow with PKCE. Removed dead code, added /auth/callback, simplified Supabase clients. |
| 3   | Admin - Buat form project tender (via admin)                         | Not started | Apr 15, 2026 | -                                                                                                                |
| 4   | Admin - Buat fitur evaluasi & pilih pemenang (comparison table)      | Not started | Apr 15, 2026 | -                                                                                                                |
| 5   | Vendor - Buat halaman daftar tender yang available                   | Not started | Apr 15, 2026 | -                                                                                                                |
| 6   | Vendor - Buat halaman upload progres harian (foto, deskripsi, bobot) | Not started | Apr 16, 2026 | -                                                                                                                |
| 7   | Sistem - Buat notifikasi hasil tender ke pemenang & non-pemenang     | Not started | Apr 16, 2026 | -                                                                                                                |
| 8   | Admin/Sistem - Buat generate dokumen SPK sederhana                   | Not started | Apr 16, 2026 | -                                                                                                                |
| 9   | SPV - Buat autentikasi & layout dashboard khusus SPV                 | Not started | Apr 17, 2026 | -                                                                                                                |
| 10  | Semua Role - Buat dashboard monitoring overview proyek               | Not started | Apr 17, 2026 | -                                                                                                                |
| 11  | SPV - Buat fitur verifikasi progress (approve/reject + catatan)      | Not started | Apr 17, 2026 | -                                                                                                                |
| 12  | Vendor - Buat form submit penawaran (items, pricing, metode kerja)   | Not started | Apr 17, 2026 | -                                                                                                                |
| 13  | Sistem - Buat logic tracking deadline & flag keterlambatan           | Not started | Apr 18, 2026 | -                                                                                                                |
| 14  | Tim Dev - Lakukan testing & bug fixes end-to-end MVP                 | Not started | Apr 21, 2026 | -                                                                                                                |
| 15  | Tim Dev - Lakukan polish final, dokumentasi, & code cleanup          | Not started | Apr 23, 2026 | -                                                                                                                |
