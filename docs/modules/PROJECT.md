# Project Module Documentation

Dokumentasi module project untuk LPrecast Vendor Portal.

## Overview

Module project menangani entity utama pekerjaan yang akan dijalankan di lapangan. Project dibuat lebih dulu sebelum tender dibuka, lalu tetap menjadi wadah operasional utama setelah vendor terpilih.

Di domain ini, `project` adalah source entity untuk lifecycle pekerjaan, sedangkan `tender` adalah proses bidding yang melekat pada project tersebut.

## Domain Role

`project` merepresentasikan pekerjaan nyata yang akan dibangun dan dikelola end-to-end.

Project menyimpan konteks umum pekerjaan, seperti:
- nama project
- lokasi
- periode kerja
- deskripsi umum / spesifikasi teknis umum
- nilai kontrak
- status lifecycle project

Project dipakai terus setelah fase tender untuk tahap berikutnya:
- assignment vendor
- execution
- progress tracking via daily report
- payment per termin
- completion

## Lifecycle

Urutan flow dasar project:
1. Admin membuat project baru
2. Project berada di status internal / draft
3. Admin membuat tender untuk project tersebut saat siap dibuka ke vendor
4. Vendor dipilih melalui tender
5. Vendor di-assign ke project
6. Project masuk execution
7. Project lanjut ke progress, payment, dan closing

## Core Fields

Field umum project yang dibutuhkan untuk MVP tendering:
- `name`
- `location`
- `start_date`
- `end_date`
- `description`
- `status`

Field teknis atau bisnis lain dapat ditambahkan sesuai kebutuhan implementasi, seperti:
- attachment summary
- schedule metadata
- estimasi nilai kontrak
- internal notes

## Status Flow

Status project ideal untuk domain ini:
- `draft` - project baru dibuat dan belum dibuka ke vendor
- `tendering` - project sedang aktif ditenderkan
- `active` / `in_progress` - vendor sudah ditetapkan dan pekerjaan berjalan
- `completed` - pekerjaan selesai
- `cancelled` - project dibatalkan

Enum aktual di database harus mengikuti schema repo yang berlaku.

## Relation to Tender

Hubungan project dan tender:
- `project` = pekerjaan apa yang akan dibangun
- `tender` = mekanisme mencari vendor untuk mengerjakan project itu

Aturan relasi dasar:
- project dibuat lebih dulu
- tender wajib terkait ke satu project
- satu project bisa punya nol atau satu tender aktif
- ke depan project bisa mendukung retender bila diperlukan

## Admin Create Scope

Pada iterasi pertama, admin create project mencakup:
- nama project
- lokasi ringkas
- tanggal mulai dan selesai
- deskripsi umum / spesifikasi teknis umum
- lampiran teknis yang relevan

Setelah project siap, admin dapat membuat dan mempublish tender untuk project tersebut.

## Vendor Visibility

Vendor tidak perlu melihat seluruh data internal project.

Data project yang boleh diturunkan ke tampilan tender vendor:
- nama / judul pekerjaan
- lokasi non-sensitif
- periode kerja
- spesifikasi teknis umum
- item pekerjaan yang ditenderkan
- lampiran relevan

Data sensitif yang tidak boleh diexpose:
- identitas client lengkap
- kontak client
- catatan internal admin

## Database Mapping

Tabel utama:
- `projects`

Field yang sudah ada di schema saat ini:
- `name`
- `location`
- `start_date`
- `end_date`
- `description`
- `status`
- `customer_name`
- `contract_value`

Karena create project untuk tender akan jadi entry point baru, implementasi perlu memastikan field project cukup untuk kebutuhan tender publish dan read model vendor.

## Business Rules

- `project` adalah entity utama pekerjaan
- project dibuat sebelum tender dibuka
- project tetap hidup setelah fase tender selesai
- project menjadi anchor untuk assignment vendor, execution, payment, dan completion
- data client sensitif tidak boleh otomatis ikut terbuka ke vendor

## MVP Scope

Target MVP iterasi pertama untuk domain project:
1. admin create project
2. admin simpan deskripsi umum pekerjaan
3. admin simpan lokasi dan periode kerja
4. admin menyiapkan project untuk dibuka sebagai tender

## Planned Scope

Fitur berikut sedang dalam implementasi atau sudah jadi aturan aktif:

### Kurva S Baseline

Project menyimpan data baseline Kurva S yang dipakai sebagai acuan monitoring progress. Kurva S baseline terdiri dari:

- **Target kumulatif per hari/minggu** (% progress terakumulasi against elapsed time)
- **Bobot per item pekerjaan** ( agar progress per sub-item bisa dilacak terpisah)
- **Start date & end date baseline**
- **Revision history** (kalau baseline direvisi karena scope change)

Kurva S baseline di-entry oleh SPV saat fase pre-con, lalu dipakai oleh system untuk:
- Bandingkan progress aktual vs target harian
- Hitung variance dan flag delay
- Trigger warning ke SPV dan admin

### Daily Report sebagai Base Data Kurva S

Laporan harian vendor adalah primary data source untuk progress aktual yang di-plot ke Kurva S. Report harian minimal memuat:

- Tanggal laporan
- Deskripsi progres hari itu (item pekerjaan yang dikerjakan)
- % progres per item (jika multi-item project)
- Bukti visual (foto/video)
- Catatan: kendala, cuaca, SDM
- Status: draft / submitted

Sistem menghitung **progress kumulatif** per project dengan:
1. Ambil semua daily report yang verified (SPV approve)
2. Agregasi % per item pekerjaan
3. Plot ke Kurva S baseline untuk dapat variance curve

### Termin Payment Contract Field

Project menyimpan skema pembayaran per termin:

- **Default template**: DP 35%, Termin 25% (progress 50%), Termin 25% (progress 75%), Termin 15% (progress 100%)
- **Override per project**: project boleh punya termin custom (jumlah termin, % per termin, dan milestone trigger berbeda)
- **Trigger milestone**: setiap termin punya kondisi release (misal: progress ≥ X% AND SPV approve AND client confirm)
- Detail termin dikelola di `docs/modules/PAYMENT.md`

### Lampiran Invoice

Setiap termin pembayaran disertai lampiran bukti tagihan (invoice / billing document). Lampiran ini:

- Di-upload oleh vendor saat ajukan request payment
- Minimal: invoice number, tanggal, nominal, lampiran file (PDF/foto)
- Disimpan di project terkait, bukan di vendor profile
- Jadi audit trail untuk financeiro project

## Related Documentation

- `/docs/CONTEXT.md`
- `/docs/FLOW.md`
- `/docs/tasks/PROGRESS.md`
- `/docs/modules/TENDER.md`
- `/docs/modules/PAYMENT.md` - termin payment contract, invoice, approval, audit trail
- `/docs/modules/VENDOR.md` - daily report upload oleh vendor
- `/docs/modules/SPV.md` - Kurva S entry & progress verification

## Notes

- `project` bukan sinonim dari `tender`
- create tender selalu berangkat dari project yang sudah dibuat
- implementasi schema dan status harus mengikuti source of truth di repo
- Kurva S baseline bersifat wajib untuk project aktif (entry pre-con, tidak boleh missing)
- daily report vendor = satu-satunya input progress kumulatif yang valid
- termin payment contract ada di `docs/modules/PAYMENT.md`
- invoice attachment per termin wajib sebagai audit trail financeiro
