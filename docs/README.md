# Docs Index

Dokumentasi di `docs/` dibagi menjadi beberapa lapis agar mudah dirawat saat code, data, dan business rule berubah.

## Start Here

Urutan baca paling aman:

1. `docs/CONTEXT.md` - ringkasan proyek, scope aktif, business rules inti
2. `docs/tasks/PROGRESS.md` - source of truth status task, prioritas, timeline
3. `docs/modules/VENDOR.md` - modul vendor yang saat ini paling aktif
4. `docs/end-to-end-plan.md` - flow bisnis end-to-end detail
5. `docs/FLOW-STORY.md` - ringkasan naratif flow bisnis

## Folder Guide

- `architecture/` - aturan teknis dan konvensi implementasi
- `modules/` - knowledge base per domain/fitur
- `tasks/` - tracker delivery dan progres kerja
- `references/` - markdown summary dan hasil olahan source material
- `reference_file/` - raw source file hasil upload

## Source of Truth

- `types/database.types.ts` - referensi schema teknis terbaru
- `docs/tasks/PROGRESS.md` - status task dan timeline kerja
- `docs/CONTEXT.md` - ringkasan global project dan source-of-truth map
- code dan route yang ada di repo - bukti implementasi aktual

## Active Docs vs Reference Docs

- `CONTEXT.md`, `modules/*.md`, `architecture/*.md`, `tasks/PROGRESS.md` = active knowledge base
- `references/*.md` = quick reference hasil ekstraksi source mentah
- `reference_file/*.pdf` = raw source material

PDF mentah dipakai sebagai bahan referensi. Rule, flow, atau requirement yang sudah disepakati sebaiknya diserap ke dokumen aktif, bukan dibiarkan hanya hidup di PDF.

## Maintenance Rules

Gunakan aturan sederhana ini saat ada perubahan:

- perubahan behavior user-facing -> update `modules/*.md` atau flow terkait
- perubahan schema / kontrak teknis -> update doc arsitektur atau context bila perlu
- perubahan status task / prioritas -> update `docs/tasks/PROGRESS.md`
- file referensi baru -> simpan raw file di `docs/reference_file/`, lalu buat summary di `docs/references/`
- perubahan global project scope / role / business rule -> update `docs/CONTEXT.md`

Prinsip kerja:

- raw docs inform
- active docs guide
- code proves

## Key References

- `docs/references/README.md` - indeks semua summary reference
- `docs/reference_file/README.md` - indeks raw upload reference
- `docs/modules/VENDOR APPROVAL CHECKLIST.md` - checklist approval vendor
- `docs/architecture/design-system.md` - UI conventions
- `docs/architecture/pwa.md` - PWA architecture dan theme rules
