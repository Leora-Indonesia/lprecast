# SPV Module Documentation

Dokumentasi module SPV untuk LPrecast Vendor Portal.

## Overview

Module SPV menangani role pengawas lapangan yang menjadi control layer antara admin internal, vendor, client, dan system. SPV bukan sekadar approver progress. SPV juga memegang kesiapan pre-con, monitoring kualitas lapangan, dan validasi milestone yang memengaruhi payment dan KPI.

## Core Responsibilities

- masuk talent pool dan lolos screening
- apply atau di-assign ke project yang relevan
- menyiapkan dokumen pre-con sebelum execution
- memimpin alignment PCM
- memonitor progres vendor di lapangan
- memverifikasi laporan harian dan progres aktual
- memberi catatan issue, kualitas, dan risiko
- menjadi approval layer untuk trigger termin tertentu

## Pre-Construction Scope

Sebelum project boleh berjalan, SPV wajib menyiapkan atau melengkapi dokumen berikut:

1. RKS
2. Master Schedule / Kurva S
3. Procurement Plan
4. RK3K
5. Risk Register

Rule kritikal:

- tanpa approval dokumen pre-con, project belum boleh masuk execution

## Execution and Monitoring Scope

Saat project berjalan, SPV bertugas untuk:

- memantau progress vs target
- mengecek kualitas dan kesesuaian SOP
- memverifikasi laporan harian vendor
- mencatat kendala lapangan, cuaca, dan risiko aktual
- memberi approval atau reject pada progress tertentu
- menjaga white-label rule agar vendor tidak bypass client

## Business Rules

- SPV adalah representasi brand Leora di lapangan
- vendor tidak boleh kontak langsung client
- approval SPV memengaruhi monitoring, KPI, dan trigger payment
- disiplin reporting SPV ikut memengaruhi bonus KPI

## Database and Future Data Needs

Saat ini flow SPV masih banyak yang planned. Tabel atau area data yang kemungkinan relevan:

- `projects`
- `vendor_progress`
- `vendor_spk`
- future: planning docs, approval logs, KPI scoring, milestone readiness

Referensi schema teknis tetap mengikuti `types/database.types.ts`.

## Related Documentation

- `/docs/CONTEXT.md`
- `/docs/FLOW.md`
- `/docs/tasks/PROGRESS.md`
- `/docs/modules/PROJECT.md`
- `/docs/modules/VENDOR.md`
- `/docs/references/cerita-nyata-spv-summary.md`
- `/docs/references/end-to-end-scenario-spv-summary.md`

## Notes

- auth dan dashboard SPV masih planned di roadmap saat ini
- module ini sengaja dibuat sekarang sebagai knowledge anchor supaya flow SPV tidak tercecer di reference docs saja
