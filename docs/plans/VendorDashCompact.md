---
plan name: VendorDashCompact
plan description: Compact active vendor dashboard
plan status: active
---

## Idea
Rancang ulang dashboard vendor untuk state vendor aktif yang sudah menyelesaikan onboarding, dengan fokus UI compact namun tetap lengkap dan actionable. Tahap awal berupa HTML preview statis untuk validasi layout/IA, lalu implementasi data riil dari vendor_profiles, vendor_spk + projects, vendor_progress, tender_submissions, dan notifications. Fitur yang belum tersedia tetap dimunculkan sebagai placeholder bertanda Soon agar arah produk terlihat utuh tanpa menyamarkan readiness aktual.

## Implementation
- Audit ulang kebutuhan dashboard vendor aktif dan petakan data riil vs placeholder dari schema serta docs task vendor.
- Definisikan information architecture compact yang memprioritaskan status ringkas, action queue, daftar proyek aktif padat, ringkasan tender, dan feed notifikasi.
- Buat HTML preview statis di route dashboard untuk memvalidasi visual, hierarchy, density, dan placeholder Soon tanpa dependensi query data.
- Refactor server-side data fetching dashboard agar menghasilkan snapshot terpadu untuk profil, proyek aktif, progress terbaru, tender, dan notifikasi.
- Implementasikan komponen UI compact final berbasis data riil dan fallback aman untuk section yang belum punya backend penuh.
- Verifikasi responsive behavior, hapus angka dummy, cek route CTA yang valid, lalu update progress tracker sesuai status pekerjaan.

## Required Specs
<!-- SPECS_START -->
<!-- SPECS_END -->