# Tasks Docs Guide

Folder `docs/tasks/` menyimpan delivery truth untuk proyek ini.

## Files

- `PROGRESS.md` - tracker global semua task, prioritas, dan status
- `items/` - detail task per task jika sebuah pekerjaan butuh scope, blocker, decision log, atau checklist lebih rinci

## Update Rules

1. Sebelum mulai kerja, cek `PROGRESS.md`.
2. Saat mulai, ubah status task terkait ke `In progress`.
3. Saat selesai, ubah ke `Done` dan update tanggal.
4. Jika task kompleks, buat atau update file di `items/`.
5. Jika AI agent membantu analisa fitur baru, jangan langsung taruh di `tasks/` kecuali sudah jadi pekerjaan yang disepakati.

## AI Notes

- `tasks/` bukan tempat brainstorming umum.
- `tasks/` hanya dipakai setelah sebuah ide berubah menjadi pekerjaan delivery.
- ide mentah atau impact analysis awal lebih aman disimpan dulu di `docs/references/`.
