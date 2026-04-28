# Internal Showcase Assets

## Goal

Dokumen ini mengatur asset visual untuk halaman presentasi internal, terutama screenshot real pages dari app.

## Asset Priority

Prioritas visual:

1. screenshot real pages dari app
2. simple diagrams atau status cards yang digenerate dari konten factual
3. placeholders bertanda jelas bila screenshot belum tersedia

Jangan gunakan stock illustration generik jika tidak membantu pemahaman produk.

## Screenshot Rules

- utamakan desktop screenshot dulu
- gunakan data yang rapi, representatif, dan tidak membingungkan
- hindari state rusak, toast error, atau debug markers
- crop secukupnya untuk menjaga fokus area penting
- pertahankan style app asli, jangan ditimpa dengan frame device berlebihan
- jika halaman kosong, beri caption bahwa ini scaffold/foundation atau empty state intentional

## Screenshot Candidate List

### Public

- `/`
- `/vendor/register`
- `/login`

### Vendor

- `/vendor/dashboard`
- `/vendor/onboarding`
- `/vendor/profile`
- `/vendor/tenders`
- `/vendor/tenders/[id]`
- `/vendor/notifications`

### Admin

- `/admin/dashboard`
- `/admin/vendors`
- `/admin/vendors/[id]`
- `/admin/vendors/[id]/approval`
- `/admin/tenders`
- `/admin/tenders/[id]`
- `/admin/notifications`
- `/admin/clients`

### Client

- `/client/dashboard`

## Suggested Screenshot Mapping

- cover / current scope: optional collage from admin + vendor
- vendor experience: `/vendor/register`, `/vendor/dashboard`, `/vendor/profile`, `/vendor/tenders`, `/vendor/notifications`
- admin experience: `/admin/dashboard`, `/admin/vendors`, `/admin/vendors/[id]`, `/admin/vendors/[id]/approval`, `/admin/notifications`
- client experience: `/client/dashboard`

## Showcase Exclusions For Current Phase

Jangan jadikan asset berikut sebagai bagian utama presentasi saat ini:

- `/vendor/projects`
- `/vendor/projects/[id]`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`
- `/client/projects`
- `/client/projects/[id]`

## Caption Pattern

Gunakan caption pendek dengan format ini:

- `[Role] - [Page Name]`
- `fungsi utama halaman`
- `status: Done | In Progress | Planned`

Contoh:

- `Vendor - Dashboard`
- `Ringkasan proyek aktif, tender, dan action items vendor`
- `status: Done`

## Asset Naming Convention

Jika screenshot disimpan ke repo, gunakan pola:

- `public/presentation/vendor-dashboard-desktop.png`
- `public/presentation/admin-vendor-detail-desktop.png`
- `public/presentation/client-dashboard-desktop.png`

Rules:

- lowercase kebab-case
- role prefix wajib
- suffix `desktop` atau `mobile` bila dua varian disimpan

## Authentication Notes

Banyak halaman kandidat ada di protected routes. Saat mengambil screenshot:

- gunakan akun demo/internal yang stabil
- gunakan data yang tidak sensitif
- hindari data personal atau nomor rekening nyata
- jika screenshot butuh seeded data, siapkan dulu dataset yang konsisten

## Fallback Rules

Jika screenshot belum bisa diambil:

- gunakan placeholder card bertuliskan `Screenshot pending`
- tampilkan daftar capability atau screenshot silhouette sederhana
- jangan pakai mockup UI palsu yang tidak ada di app

## Print / PDF Notes

- jangan gunakan screenshot terlalu tinggi sampai mendorong section pecah ke halaman berikutnya
- prioritaskan 1 hero screenshot besar atau 2 screenshot medium per section
- kompres asset secukupnya agar PDF tidak terlalu berat
