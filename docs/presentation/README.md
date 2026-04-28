# Presentation Docs

Folder `docs/presentation/` menyimpan guideline untuk halaman presentasi internal LPrecast yang akan digenerate dan diimplementasikan di dalam app.

Current showcase focus:

- vendor onboarding
- admin vendor operations
- notifications and dashboard foundation
- client foundation secukupnya

Current showcase exclusion:

- project pages tidak dimasukkan dulu ke presentasi utama

## Audience

- internal Leora
- stakeholder internal product, ops, dan management

## Files

- `internal-showcase-spec.md` - source of truth tujuan, constraint, scope, dan success criteria
- `internal-showcase-structure.md` - urutan section seperti slide dan isi wajib per section
- `internal-showcase-assets.md` - aturan screenshot, daftar kandidat halaman, dan caption pattern
- `internal-showcase-ai-prompt.md` - prompt contract yang harus diikuti AI saat generate halaman

## How To Use

1. baca `internal-showcase-spec.md` dulu
2. baca `internal-showcase-structure.md` untuk urutan narasi
3. baca `internal-showcase-assets.md` sebelum ambil screenshot atau pilih visual
4. pakai `internal-showcase-ai-prompt.md` sebagai contract generate

## Guardrails

- presentasi ini untuk internal, bukan sales deck eksternal
- tampilkan status fitur dengan jujur: `Done`, `In Progress`, `Planned`
- jangan tampilkan roadmap sebagai fitur live
- prioritaskan screenshot real pages, bukan mockup generik
- hasil akhir harus bisa dipakai di web dan diexport ke PDF via print layout
