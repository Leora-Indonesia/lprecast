# Vendor Module Documentation

Dokumentasi lengkap module vendor untuk LPrecast Vendor Portal.

## Overview

Module vendor menangani seluruh fungsionalitas vendor mulai dari registrasi, tender, hingga pelaksanaan proyek.

## Features

### 1. Vendor Registration & Onboarding ✅

- **Form Registrasi**: Data perusahaan, PIC, kontak, alamat pabrik
- **Upload Dokumen**: KTP, NPWP, NIB, SIUP, Company Profile
- **Data Produk**: Daftar produk/jasa dengan harga
- **Area Pengiriman**: Provinsi & kota yang bisa dilayani
- **Status Tracking**: Draft → Submitted → Under Review → Approved/Rejected

### 2. Tender Management 🔄

- **Browse Tenders**: Lihat tender yang tersedia dan terbuka
- **Submit Penawaran**: Kirim harga, metode kerja, timeline
- **View Status**: Tracking status penawaran (pending/approved/rejected)
- **Winner Notification**: Notifikasi pemenang tender

### 3. Project Execution 🔄

- **Project Dashboard**: Overview proyek yang sedang dikerjakan
- **Daily Progress Upload**: Upload foto, deskripsi, % progress
- **SPV Verification**: Menunggu approval progress dari SPV
- **Deadline Tracking**: Warning keterlambatan upload

### 4. Profile Management ✅

- **View Profile**: Lihat data lengkap perusahaan
- **Edit Data**: Update kontak, produk, dokumen (post-MVP)

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

## Database Tables

| Table                      | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `vendor_registrations`     | Status registrasi vendor                  |
| `vendor_company_info`      | Data perusahaan & PIC                     |
| `vendor_contacts`          | Daftar kontak vendor                      |
| `vendor_bank_accounts`     | Rekening bank vendor                      |
| `vendor_products`          | Produk & harga                            |
| `vendor_legal_documents`   | Dokumen legal (KTP, NPWP, dll)            |
| `vendor_factory_addresses` | Alamat pabrik/workshop                    |
| `vendor_delivery_areas`    | Area pengiriman yang dilayani             |
| `vendor_cost_inclusions`   | Biaya yang termasuk/tidak dalam penawaran |
| `tender_submissions`       | Penawaran vendor untuk tender             |
| `vendor_spk`               | SPK yang ditandatangani vendor            |
| `vendor_progress`          | Progress harian proyek                    |

## Routes

```
/vendor/
├── dashboard           → Overview vendor
├── profile             → View & edit profile (admin only for now)
├── tenders             → List tender available
├── tenders/[id]        → Detail & submit tender
├── projects            → List assigned projects
└── projects/[id]/progress → Upload daily progress
```

## Related Documentation

- `/docs/CONTEXT.md` - Project context & business rules
- `/docs/tasks/task-01-vendor-actions.md` - Admin approval workflow
- `/docs/tasks/task-03-tender-list.md` - Tender browsing
- `/docs/tasks/task-04-tender-submit.md` - Tender submission
- `/docs/tasks/task-08-upload-progress.md` - Progress reporting

## Notes

- Edit profile sementara hanya bisa dilakukan oleh admin
- Auto-nonaktif 3x24 jam masih dalam pengembangan
- Blacklist vendor: post-MVP
