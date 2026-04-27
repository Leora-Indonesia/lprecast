# Tender Module Documentation

Dokumentasi module tender untuk LPrecast Vendor Portal.

## Overview

Module tender menangani proses admin mempublish project yang sudah dibuat menjadi open tender untuk vendor. Tender menyimpan konteks bidding, item pekerjaan yang ditawarkan, dan data publik yang boleh dilihat vendor.

Di domain ini, `tender` bukan entity operasional utama. `tender` adalah proses procurement atau bidding yang melekat pada sebuah `project`.

## Domain Role

`tender` dipakai saat admin ingin membuka project ke vendor.

Tender menyimpan metadata proses bidding, seperti:
- title
- description
- project reference
- status tender
- minimum vendor
- revision deadline
- breakdown item pekerjaan
- lampiran relevan untuk vendor

## Relation to Project

Hubungan sederhana:
- `project` = pekerjaan apa yang akan dibangun
- `tender` = cara project itu dibuka dan ditawarkan ke vendor

Aturan relasi dasar:
- tender dibuat setelah project ada
- tender wajib terkait ke satu project
- satu project bisa punya nol atau satu tender aktif
- retender bisa didukung di masa depan bila project perlu dipublish ulang

## Tender Lifecycle

Flow dasar tender:
1. Admin memilih atau baru membuat project
2. Admin melengkapi data publik tender
3. Admin upload lampiran ke Supabase Storage
4. Admin menambahkan satu atau lebih `tender_items`
5. Admin publish tender dengan status awal `open`
6. Vendor melihat list tender
7. Vendor melihat detail tender
8. Iterasi berikutnya: vendor submit bid, admin compare, admin pilih winner

## Admin Create and Publish Flow

### Step 1. Prepare Project

Project dibuat lebih dulu sebagai wadah pekerjaan utama.

### Step 2. Fill Tender Metadata

Admin mengisi data dasar tender, seperti:
- title
- deskripsi umum
- minimum vendor
- revision deadline jika dipakai

Status awal publish:
- `open`

### Step 3. Upload Attachments

Admin upload file pendukung ke Supabase Storage.

Contoh attachment:
- foto lokasi
- gambar kerja
- lampiran teknis

Prinsip penyimpanan:
- file binary disimpan di Storage
- metadata file, path, atau URL disimpan di database

### Step 4. Add Dynamic Tender Items

Admin menambahkan item pekerjaan secara dinamis.

Form item tidak boleh hardcode ke pagar beton karena tender dapat mencakup item lain di masa sekarang maupun berikutnya.

Contoh item:
- pagar beton 7 susun, 120 m, tanah padat, pondasi setapak
- pagar beton 7 susun, 300 m, tanah rawa, pondasi lajur

## Dynamic Tender Items

`tender_items` dipakai untuk breakdown pekerjaan yang fleksibel.

Field minimum item:
- `name`
- `quantity`
- `unit`
- `description`

Field tambahan yang direkomendasikan bila perlu struktur lebih kaya:
- kondisi tanah
- jenis pondasi
- spesifikasi singkat
- catatan item

Pendekatan ini memungkinkan satu tender memiliki kombinasi item berbeda tanpa mengubah struktur form utama.

## Vendor Read Flow

Vendor hanya melihat tender yang sudah dipublish dan boleh diakses.

Data yang boleh dilihat vendor:
- judul tender
- deskripsi umum pekerjaan
- lokasi ringkas
- timeline / periode kerja
- breakdown item pekerjaan
- quantity dan unit
- attachment yang relevan

Data yang tidak boleh diexpose:
- data client lengkap
- kontak client
- catatan internal admin

## Attachments

Attachment tender disimpan di Supabase Storage.

Jenis attachment:
- foto lokasi
- gambar teknis
- lampiran pendukung lain

Prinsip akses:
- upload dilakukan saat create tender
- referensi file disimpan di database
- akses file mengikuti role dan policy yang relevan

## Database Mapping

Tabel utama domain tender:
- `tenders`
- `tender_items`
- `tender_submissions`

Field `tenders` yang sudah ada di schema saat ini:
- `title`
- `description`
- `project_id`
- `status`
- `min_vendors`
- `revision_deadline_hours`
- `created_by`

Field `tender_items` yang sudah ada di schema saat ini:
- `tender_id`
- `name`
- `quantity`
- `unit`
- `description`

Jika metadata item seperti tanah, pondasi, atau attachment reference belum punya kolom yang cukup, implementasi perlu menyesuaikan schema.

## Business Rules

- tender dibuat dari project yang sudah ada
- tender status awal publish adalah `open`
- minimal satu tender item wajib ada
- tender tidak boleh expose data client sensitif ke vendor
- tender tidak auto-close sampai ada vendor yang sesuai
- minimal dua vendor submit penawaran agar tender valid
- nilai SPK = tender price x quantity

## Validation Rules

- tender wajib terkait ke satu project
- title tender wajib diisi
- minimal satu item pekerjaan wajib ada
- quantity item harus lebih dari 0
- unit item wajib jelas
- attachment optional, tetapi jika ada harus upload sukses sebelum publish
- vendor hanya boleh melihat tender berstatus `open`

## MVP Scope

Target MVP iterasi pertama untuk domain tender:
1. admin create tender dari project baru
2. admin upload attachment
3. admin create dynamic tender items
4. admin publish tender dengan status `open`
5. vendor melihat list tender
6. vendor melihat detail tender

## Future Scope

Iterasi berikutnya:
- vendor submit bid
- validasi satu vendor satu bid
- compare tender submissions
- pilih pemenang
- assign vendor ke project
- notifikasi tender menang / kalah
- retender flow

## Related Documentation

- `/docs/CONTEXT.md`
- `/docs/FLOW.md`
- `/docs/tasks/PROGRESS.md`
- `/docs/modules/PROJECT.md`
- `/docs/modules/VENDOR.md`

## Notes

- focus utama module ini adalah publish dan konsumsi tender
- `project` tetap menjadi source entity utama lifecycle operasional
- `tender_items` harus fleksibel karena pekerjaan tidak selalu pagar beton
