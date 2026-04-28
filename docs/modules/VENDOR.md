# Vendor Module Documentation

Dokumentasi lengkap module vendor untuk LPrecast Vendor Portal.

## Overview

Module vendor menangani alur vendor mulai dari registrasi, onboarding, akses tender, monitoring project, hingga notifikasi. Sebagian flow inti sudah aktif, sementara bidding penuh, progress harian, KPI, dan verification flow masih mengikuti urutan implementasi di `docs/tasks/PROGRESS.md`.

## Features

### 1. Vendor Registration & Onboarding ✅ Implemented

- **Form Registrasi**: Data perusahaan, PIC, kontak, alamat pabrik
- **Upload Dokumen**: KTP, NPWP, NIB, SIUP, Company Profile
- **Data Produk**: Daftar produk/jasa dengan harga
- **Area Pengiriman**: Provinsi & kota yang bisa dilayani
- **Status Tracking**: Draft → Submitted → Under Review → Approved/Rejected

### 2. Tender Access & Browsing ✅ Basic flow available

- **Browse Tenders**: Lihat tender yang tersedia dan terbuka
- **Tender Detail**: Lihat detail tender, spesifikasi, lokasi, dan scope dasar
- **Project List**: Vendor bisa lihat daftar project/tender yang tersedia di area vendor

### 3. Bid Submission & Tender Evaluation 🔄 Planned / partial

- **Submit Penawaran**: Form submit harga, metode kerja, timeline, dan kapasitas masih mengikuti task implementasi berikutnya
- **View Status**: Tracking status penawaran vendor belum menjadi flow penuh end-to-end
- **Winner Notification**: Notifikasi hasil tender masih mengikuti task notifikasi tender

### 4. Project Monitoring (Lane 1 - Daily Reporting)

**Daily Report Upload** — vendor mengisi laporan harian via sistem:
- Tanggal, deskripsi progres (% per item pekerjaan)
- Bukti visual (foto/video)
- Catatan: kendala, cuaca, SDM
- Sistem plot progress ke Kurva S baseline
- **Lane**: `Vendor -> SPV -> System`

**Project Dashboard** — lihat progress aktual vs Kurva S:
- Progress kumulatif per project
- Variance terhadap target harian
- Status milestone termin
- Invoice history (hanya invoice vendor, bukan billing client)

**SPV Verification** — progress perlu diverifikasi SPV sebelum masuk kumulatif:
- Vendor tidak bisa claim progress tanpa SPV approve
- SPV TIDAK akses invoice vendor finansial

**Deadline Tracking** — warning otomatis:
- Upload deadline: 09.00 WIB hari berikutnya
- Keterlambatan → flag sistem + KPI negatif

### 5. Profile Management ✅ Available

- **View Profile**: Lihat data lengkap perusahaan
- **Edit Data**: Update kontak, produk, dokumen (post-MVP)

### 6. Notifications ✅ Basic flow available

- **Vendor Notifications**: Halaman notifikasi vendor sudah tersedia
- **Admin Alert on Registration**: Notifikasi ke admin saat vendor daftar sudah ada
- **Tender / project notifications**: Flow notifikasi lanjutan masih bertahap

## Business Rules

### Registration

- Wajib lengkapi 11 data dalam 3×24 jam atau auto-nonaktif
- Dokumen legal wajib terverifikasi sebelum bisa ikut tender

### Tender Participation

- Minimal 2 vendor submit agar tender valid
- Tender tidak auto-close sampai ada vendor yang sesuai
- Nilai SPK = Tender Price × Quantity

### Progress Reporting

- Upload deadline: 09.00 WIB hari berikutnya
- Keterlambatan upload → KPI negatif + flag sistem
- Multiple foto upload per hari didukung
- Progress hanya valid setelah SPV approve
- Progress kumulatif dari daily report verified → dasar trigger termin payment

### Invoice Submission (Lane 2 - Vendor Payment)

Vendor ajukan tagihan per termin via sistem:

**Persyaratannya:**
- Client harus SUDAH approve milestone progress terlebih dahulu
- Funds harus sudah tersedia di internal/escrow

**Flow:**
- Pilih termin yang akan diinvoice
- Isi invoice number, tanggal, nominal
- Upload lampiran: invoice PDF + bukti progress
- Submit → masuk approval Finance/Internal → Paid
- **SPV TIDAK masuk di lane ini**
- Status invoice bisa dipantau di halaman project vendor

**CATATAN:**
- Vendor TIDAK melihat billing ke client
- Vendor TIDAK tahu margin atau cash position
- Vendor hanya lihat status invoice sendiri

## Database Notes

Module vendor saat ini memakai kombinasi tabel onboarding vendor, tender, dan project progress. `types/database.types.ts` tetap menjadi referensi schema teknis terbaru.

| Table                      | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `vendor_profiles`          | Profil utama vendor                       |
| `vendor_documents`         | Dokumen vendor                            |
| `vendor_products`          | Produk & harga                            |
| `vendor_contacts`          | Daftar kontak vendor                      |
| `vendor_bank_accounts`     | Rekening bank vendor                      |
| `vendor_factory_addresses` | Alamat pabrik/workshop                    |
| `vendor_delivery_areas`    | Area pengiriman yang dilayani             |
| `vendor_cost_inclusions`   | Biaya yang termasuk/tidak dalam penawaran |
| `tenders`                  | Data tender                               |
| `tender_submissions`       | Penawaran vendor untuk tender             |
| `vendor_spk`               | SPK yang ditandatangani vendor            |
| `vendor_progress`          | Progress harian proyek                    |
| `payment_requests`          | Invoice/tagihan vendor per termin        |
| `payment_approvals`         | Approval log payment per layer           |

## Routes

```
/vendor/
├── onboarding          → Onboarding vendor
├── dashboard           → Overview vendor
├── profile             → View profile vendor
├── tenders             → List tender available
├── tenders/[id]        → Detail tender
├── projects            → List projects vendor
├── projects/[id]       → Detail project (progress, Kurva S, termin status)
├── projects/[id]/daily-report → Form upload laporan harian
├── projects/[id]/payment      → Invoice submission & status
└── notifications       → Notifikasi vendor
```

## Related Documentation

- `/docs/CONTEXT.md` - Project context & business rules
- `/docs/FLOW.md` - Source of truth flow lintas role
- `/docs/tasks/PROGRESS.md` - Source of truth status task & timeline
- `/docs/modules/SPV.md` - Flow SPV verification dan monitoring
- `/docs/modules/PAYMENT.md` - Invoice submission, termin contract, approval chain
- `/docs/modules/PROJECT.md` - Kurva S baseline & progress tracking
- `/docs/references/vendor-approval-checklist.md` - Checklist approval vendor
- `/docs/references/sop-vendor-summary.md` - Ringkasan SOP vendor
- `/docs/references/simulasi-dana-summary.md` - Ringkasan skema termin pembayaran vendor

## Notes

- Edit profile sementara hanya bisa dilakukan oleh admin
- Auto-nonaktif 3x24 jam masih dalam pengembangan
- **Lane pemisahan**: 
  - Daily report = Vendor → SPV → System (SPV verifikasi progres, TIDAK payment)
  - Invoice/payment = Vendor → Finance/Internal → Paid (SPV TIDAK di lane ini)
- Vendor TIDAK boleh lihat billing client, margin, atau cash position
- Vendor hanya submit invoice SESUDAH client approve milestone
- Rule onboarding, progress, dan payment vendor juga punya summary reference di `docs/references/`
- Blacklist vendor: post-MVP
