# Docs Index

Dokumentasi `docs/` dipisah per lapis supaya AI agent dan manusia cepat tahu file mana yang berisi keputusan final, mana yang cuma bahan analisa, dan mana yang cuma raw source.

## Start Here

Urutan baca paling aman:

0. `AGENTS.md` - agent operating rules, recommended macro skill stack, progress workflow, command references
1. `docs/CONTEXT.md` - snapshot proyek, scope aktif, role, business rules inti
2. `docs/FLOW.md` - source of truth flow bisnis end-to-end
3. `docs/tasks/PROGRESS.md` - status task, prioritas, timeline delivery
4. `docs/modules/PROJECT.md` - project sebagai entity operasional utama
5. `docs/modules/TENDER.md` - tender sebagai procurement/bidding container
6. `docs/modules/VENDOR.md` - onboarding vendor, akses tender, project, reporting
7. `docs/modules/SPV.md` - role SPV, pre-con, monitoring, verification
8. `docs/architecture/design-system.md` dan `docs/architecture/pwa.md` - rule teknis on-demand

## Folder Guide

- `architecture/` - aturan teknis dan konvensi implementasi
- `modules/` - knowledge base domain per role/fitur
- `presentation/` - guideline presentasi internal, structure section, asset rule, dan AI prompt contract
- `tasks/` - tracker delivery global dan detail task
- `references/` - hasil olahan, summary, checklist, dan analisa yang belum otomatis jadi source of truth
- `reference_file/` - raw upload source material

## Source of Truth Map

- `docs/CONTEXT.md` - global truth: scope, role, business rules, map dokumen
- `docs/FLOW.md` - end-to-end business flow lintas role
- `docs/modules/*.md` - domain truth per modul
- `docs/architecture/*.md` - technical truth / implementation rules
- `docs/tasks/PROGRESS.md` - delivery truth / roadmap kerja
- `types/database.types.ts` - schema teknis terbaru
- code dan route di repo - bukti implementasi aktual

## AI Collaboration Rules

- untuk task level makro, baca `AGENTS.md` dulu agar agent load skill stack yang tepat: `improve-codebase-architecture`, `supabase`, `next-best-practices`, `architecture-blueprint-generator`
- ide fitur baru atau hasil brainstorm agent -> simpan dulu di `docs/references/`
- keputusan final yang sudah disetujui -> promote ke `CONTEXT.md`, `FLOW.md`, `modules/*.md`, atau `tasks/*.md`
- raw upload seperti PDF, deck, atau dokumen eksternal -> simpan di `docs/reference_file/`
- jangan campur bahan analisa dengan source-of-truth docs

## Maintenance Rules

Gunakan aturan sederhana ini saat ada perubahan:

- perubahan flow lintas role -> update `docs/FLOW.md`
- perubahan behavior atau rule domain -> update `docs/modules/*.md`
- perubahan schema, auth/access, atau technical contract -> update `docs/architecture/*.md` atau `docs/CONTEXT.md` bila perlu
- perubahan guideline halaman presentasi internal -> update `docs/presentation/*.md`
- perubahan status task / prioritas -> update `docs/tasks/PROGRESS.md`
- task kompleks atau perlu decision log -> tambah file di `docs/tasks/items/`
- file referensi baru -> simpan raw file di `docs/reference_file/`, lalu buat summary atau analisa di `docs/references/`
- perubahan global scope / role / business rule -> update `docs/CONTEXT.md`

Prinsip kerja:

- raw docs inform
- reference docs synthesize
- active docs guide
- code proves

## Key References

- `AGENTS.md` - agent rules, macro skill stack, progress workflow, command references
- `docs/references/README.md` - indeks summary reference dan hasil analisa
- `docs/reference_file/README.md` - indeks raw upload reference
- `docs/modules/PROJECT.md` - lifecycle project dan execution container
- `docs/modules/TENDER.md` - flow publish project ke vendor
- `docs/modules/VENDOR.md` - onboarding, tender access, project reporting vendor
- `docs/modules/SPV.md` - approval layer, pre-con docs, monitoring
- `docs/references/vendor-approval-checklist.md` - checklist approval vendor
- `docs/architecture/design-system.md` - UI conventions
- `docs/architecture/pwa.md` - PWA architecture dan theme rules
- `docs/presentation/README.md` - entry point docs presentasi internal
