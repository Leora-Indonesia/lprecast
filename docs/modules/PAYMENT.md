# Payment Module Documentation

Dokumentasi module payment untuk LPrecast Vendor Portal.

## Overview

Module payment menangani skema pembayaran per termin, manajemen invoice, approval chain, dan audit trail financeiro project. Payment module berjalan setelah vendor selected dan execution started.

**Batasan kritikal:**

- SPV TIDAK masuk payment lane — SPV hanya hasilkan "progress verified" flag
- Invoice vendor dan billing client adalah lane terpisah
- Client funding disetor dulu ke internal/escrow sebelum vendor dibayar
- Client wajib approve milestone progress SEBELUM vendor bisa invoice

## Termin Contract

### Default Template

Project default menggunakan skema berikut:

| Termin | Persen | Trigger                                      |
|--------|--------|----------------------------------------------|
| DP     | 35%    | Material sudah di lokasi                     |
| 1      | 25%    | Progress kumulatif ≥ 50%, client approved     |
| 2      | 25%    | Progress kumulatif ≥ 75%, client approved     |
| 3      | 15%    | Progress 100%, BAST disetujui                |

**Total = 100%**

### Override per Project

Skema default boleh di-override per project. Override mencakup:

- jumlah termin (bisa 3 termin, 5 termin, dll)
- persen per termin (total wajib 100%)
- milestone trigger (bisa pakai progress %, bisa pakai fase pekerjaan, bisa dual trigger)

Override dilakukan saat project dibuat atau saat assignment vendor (sebelum execution).

### Milestone Trigger

Setiap termin punya kondisi release. Kondisi default:

- progress kumulatif project ≥ threshold (misal 50%)
- **client approved milestone progress**
- tidak ada issue / reject aktif yang belum resolve

System membaca kondisi ini secara otomatis dan trigger notifikasi ke approver yang relevan.

## Invoice / Tagihan

### Submission

Saat vendor ingin ajukan payment, vendor submit invoice via sistem:

- **Invoice number** (nomor urut vendor atau format internal)
- **Tanggal invoice**
- **Nominal** (IDR, sesuai termin yang aktif)
- **Lampiran file**: PDF invoice + bukti pendukung (foto material, progress, dll)
- **Termin ke-n** yang diklaim
- **Project reference**

### Lampiran Requirement

Lampiran invoice minimal:

- Invoice document (PDF)
- Foto/video bukti progress untuk period yang diklaim
- Dokumen pendukung lain sesuai requirement project (COO, surat jalan, dll)

Semua lampiran disimpan di project storage, bukan di vendor profile.

### Invoice Status

| Status         | Keterangan                                       |
|----------------|--------------------------------------------------|
| `draft`        | Vendor sedang draft, belum submit                 |
| `submitted`    | Vendor submit, menunggu Finance Ops verify      |
| `finance_approved` | Finance Ops approve, kesiapan untuk release  |
| `client_approved` | Client approve milestone dan payment release |
| `paid`         | Pembayaran sudah dilakukan                       |
| `rejected`     | Ditolak, boleh resubmit      |

## Approval Chain

**Lane 1: Milestone Progress Approval (sebelum invoice)**

```
Progress kumulatif已达到 threshold (misal 50%)
        ↓
   Client APPROVE milestone progress
   ("ya, progress 50% tercapai")
        ↓
   Milestone approved + trigger ke Lane 2
```

**Lane 2: Vendor Payment (dari internal fund)**

```
Vendor submit invoice + lampiran
        ↓
   Finance Ops verify
   (invoice lengkap, nominal sesuai termin, lampiran OK)
        ↓
   Payment executed (dari internal fund / escrow)
        ↓
   Audit trail logged
```

**CATATAN PENTING:**
- Client approve milestone dulu → baru vendor eligible invoice
- SPV TIDAK masuk di sini — SPV hanya hasilkan "progress verified" untuk system
- Approval chain: `Finance Ops -> Client -> Paid` (tidak ada SPV)

## Client Funding (Refill)

### Funding Reminder

System trigger reminder ke client saat progress mendekat threshold:

- Misal: progress sudah 45-49% → system trigger "silakan setor termin berikutnya"
- Tujuan: dana siap SEBELUM progress sentuh milestone
- Client setor ke internal/escrow → funds ready

### Funding Status

| Status            | Keterangan                                |
|------------------|------------------------------------------|
| `funded`         | Dana termin tersedia di internal/escrow    |
| `pending_fund`   | Menunggu client setor                     |
| `fund_ready`     | Dana confirmed masuk, eligible invoice    |

**Rules:**

- Vendor payment hanya bisa execute kalau `funded` atau `fund_ready`
- SPV TIDAK boleh lihat funding status / cash position
- Client funding obligation terpisah dari vendor payment

## Audit Trail

Setiap payment event dicatat:

- **Timestamp** setiap approval / reject
- **Actor** yang approve/reject
- **Invoice number & nominal**
- **Termin ke-n**
- **Attachment snapshot** (link ke lampiran)
- **Reject reason** (jika ditolak)

Audit trail tidak boleh di-edit setelah recorded. Hanya append-only.

## Business Rules

- Termin contract wajib disusun sebelum execution dimulai
- Setiap termin punya milestone trigger yang jelas
- Invoice wajib ada lampiran sebelum approval
- **Client wajib approve milestone progress SEBELUM vendor bisa invoice**
- **Vendor payment hanya jalan kalau funds tersedia di internal/escrow**
- SPV TIDAK masuk payment lane — SPV hanya hasilkan verified progress
- SPV TIDAK boleh akses invoice vendor detail finansial
- SPV TIDAK boleh akses billing client, margin, atau cash position
- Nilai SPK = Tender Price × Quantity
- Histori pembayaran harus bisa diaudit per project, per vendor, per periode

## Database Mapping

| Table               | Purpose                                 |
|---------------------|-----------------------------------------|
| `projects`          | Header project, termin contract field   |
| `payment_contracts` | Termin detail per project (% & trigger) |
| `payment_requests`  | Invoice vendor per termin             |
| `payment_approvals` | Approval log (Finance/Client)         |
| `vendor_payment`    | Record pembayaranvendor per termin      |
| `vendor_progress`   | Progress harian yang mendasari trigger   |

Referensi schema teknis: `types/database.types.ts`.

## Lane Overview

| Lane | Siapa | Apa |
|------|-------|-----|
| Daily Report | Vendor → SPV → System | Progres fisik, daily report |
| Milestone Approval | System → Client | Client approve milestone progress |
| Vendor Payment | Vendor → Finance Ops → Paid | Dari internal fund |
| Client Funding | System → Client → Internal/Escrow | Client setor termin berikutnya |

## Related Documentation

- `/docs/CONTEXT.md` - business rules, funding obligation
- `/docs/FLOW.md` - lane 1/2/3 breakdown
- `/docs/modules/PROJECT.md` - termin contract field di project entity
- `/docs/modules/VENDOR.md` - invoice submission oleh vendor
- `/docs/modules/SPV.md` - SPV hanya verifikasi progres (TIDAK payment)
- `/docs/tasks/PROGRESS.md` - task implementasi payment module
- `/docs/references/simulasi-dana-summary.md` - raw reference untuk skema termin

## Notes

- Termin contract disimpan di project level, bukan global template
- Invoice attachment adalah mandatory, bukan optional
- Lane pemisahan: SPV TIDAK masuk payment
- Client funding TIDAK boleh tahu SPV — informasi terpisah
- Audit trail bersifat append-only, tidak boleh di-modify