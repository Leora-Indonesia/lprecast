# Simulasi Dana Summary

## Purpose

Dokumen simulasi aturan deposit klien dan termin pembayaran vendor berdasarkan milestone progress proyek.

## Example Baseline

- panjang pagar: 500 m
- durasi: 20 hari
- target harian: 25 m/hari

## Client Deposit Scheme

- 35% setelah kontrak, H-7 sebelum kerja
- 25% pada H-3 sebelum kebutuhan pembayaran progress 50%
- 25% saat material sudah di lokasi / untuk tahap progres berikutnya
- 15% pada H-3 sebelum pembayaran progress 100%

## Vendor Payment Scheme

- DP 35% dibayar saat material sudah di lokasi
- Termin 25% dibayar saat progress 50% disetujui SPV dan client
- Termin 25% dibayar saat progress 75% disetujui SPV dan client
- Termin 15% dibayar saat progress 100% dan BAST disetujui SPV dan client

## Important Rules

- pembayaran vendor bersifat milestone-based, bukan flat schedule
- trigger payment bergantung pada approval progress
- escrow / rekening bersama menjadi layer kontrol pembayaran

## Product Impact

- penting untuk future payment module
- relevan ke `vendor_payment`, milestone tracking, notification trigger, dan approval workflow
- membantu mendefinisikan kapan client harus deposit sebelum milestone tercapai

## Recommended KB Destination

- doc future `docs/modules/payment.md`
- `docs/FLOW.md` bagian payment dan termin
