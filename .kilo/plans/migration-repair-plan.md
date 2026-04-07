# Plan: Repair Supabase Migration History & Deploy New Tables

## Current Situation

1. **Local**: Hanya ada 1 file baru (`001_vendor_tender_system.sql`) yang tidak mengikuti format Supabase
2. **Remote**: Memiliki 29 migrations (002-030, kecuali 001 dan 020)
3. **Issue**: Migration history tidak sinkron antara local dan remote

## Root Cause

Project ini menggunakan Supabase Cloud langsung via Dashboard atau `db:pull`, bukan dengansetup local development environment yang proper. File migration yang dibuat tidak mengikuti naming convention Supabase (harusnya pakai timestamp).

## Solution Steps

### Step1: Repair Migration History

Tandai remote migrations sebagai "reverted" supaya Supabase tidak memprotes:

```bash
supabase migration repair --status reverted 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 021 022 023 024 025 026 027 028 029 030
```

### Step 2: Pull Remote Schema

Sync local dengan remote schema:

```bash
supabase db pull
```

Ini akan generate migration files lokal yang merefleksikan schema remote saat ini.

### Step 3: Rename Migration File

Rename file `001_vendor_tender_system.sql` ke format timestamp yang benar:

```bash
mv supabase/migrations/001_vendor_tender_system.sql supabase/migrations/$(date +%Y%m%d%H%M%S)_vendor_tender_system.sql
```

Contoh: `20260407053500_vendor_tender_system.sql`

### Step 4: Push New Migration

Setelah steps 1-3 selesai, push migration baru:

```bash
supabase db push
```

### Step 5: Regenerate Types

Update TypeScript types:

```bash
pnpm db:pull
```

## Alternative: Direct Execution (Simpler)

Jikarepair terlalu kompleks atau berisiko, alternatif yang lebih aman:

**Jalankan SQL langsung di Supabase Dashboard:**

1. Buka Supabase Dashboard > SQL Editor
2. Copy-paste isi dari `supabase/migrations/001_vendor_tender_system.sql`
3. Execute

Setelah itu:

1. Pull schema untuk sync: `supabase db pull`
2. Regenerate types: `pnpm db:pull`

## Recommendation

**Recommended: Alternatif Direct Execution**

Alasan:

1. Lebih aman karena tidak perlu modifikasi migration history
2. Tidak ada risiko conflict dengan existing migrations
3. Metadata migrations di `.temp` akan otomatis ter-update setelah`db pull`
4. Hasil akhirnya sama - schema terupdate dan types ter-generate

## Decision Needed

Pilih salah satu:

**A. Repair & Push** (lebih complex, "proper" Supabase workflow)

- Pro: Migration history bersih di version control
- Con: Risk of conflicts, butuh understanding migration repair

**B. Direct Execution + Pull** (simpler, recommended)

- Pro: Simpler, less risk, sama hasilnya
- Con: Tidak ada migration file history untuk vendor_tender_system

**Saya recommend: Option B (Direct Execution)**
