# LPrecast Database Migration Guide

## Overview

Panduan ini untuk memisahkan database Supabase yang digunakan bersama antara ERP dan LPrecast menjadi 2 project terpisah.

## Prerequisites

1. **Supabase CLI** - untuk backup dan dump database
2. **PostgreSQL client** - untuk export/import CSV
3. **Akses ke Supabase Dashboard** - untuk membuat project baru

## Step-by-Step Migration

### Step 1: Backup Tabel di Database ERP

**File:** `supabase/migrations/001_backup_lprecast_tables.sql`

1. Buka SQL Editor di Supabase Dashboard (project ERP)
2. Copy dan jalankan isi file `001_backup_lprecast_tables.sql`
3. Script ini akan rename semua tabel LPrecast dengan prefix `backup_`

**Penting:**

- ⚠️ JANGAN rename `users` dan `user_profiles` - masih dipakai ERP
- ⚠️ Tabel ERP (clients, departments, dll.) tidak di-rename

**Verifikasi:**

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'backup_%';
```

---

### Step 2: Buat Project Supabase Baru

1. Buka https://supabase.com/dashboard
2. Klik "New Project"
3. Isi detail project:
   - Name: `LPrecast` atau sesuai kebutuhan
   - Database Password: Generate secure password
   - Region: Pilih region terdekat
4. Tunggu project dibuat (~2 menit)
5. Catat credentials:
   - Project URL
   - `anon` public key
   - `service_role` secret key
   - Database connection string (Settings > Database)

---

### Step 3: Jalankan Schema di Project Baru

**File:** `supabase/migrations/003_lprecast_schema.sql`

1. Buka SQL Editor di Supabase Dashboard (project LPrecast baru)
2. Copy dan jalankan isi file `003_lprecast_schema.sql`
3. Script ini akan membuat:
   - Semua enum types
   - Semua tabel LPrecast
   - Indexes
   - Triggers
   - Functions
   - Views (user_profiles, project_summary)

**Verifikasi:**

```sql
-- Cek semua tabel terbuat
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Cek semua enum terbuat
SELECT typname FROM pg_type WHERE typtype = 'e';
```

---

### Step 4: Copy Master Data

**File:** `supabase/migrations/export_import_master_data.sh`

#### Opsi A: Using Script (Recommended for Unix/Mac)

```bash
# Set environment variables
export OLD_DB_URL="postgresql://postgres:[PASSWORD]@db.[ERP-PROJECT-REF].supabase.co:5432/postgres"
export NEW_DB_URL="postgresql://postgres:[PASSWORD]@db.[LPRECAST-PROJECT-REF].supabase.co:5432/postgres"

# Run script
bash supabase/migrations/export_import_master_data.sh
```

#### Opsi B: Manual CSV Export/Import

**Export dari ERP:**

```bash
# Install PostgreSQL client if needed
# brew install postgresql (macOS)

# Export
psql "$OLD_DB_URL" -c "\COPY (SELECT id, code, name, created_at FROM backup_master_provinces) TO STDOUT WITH CSV HEADER" > master_provinces.csv
psql "$OLD_DB_URL" -c "\COPY (SELECT id, code, name, province_id, type, created_at FROM backup_master_cities) TO STDOUT WITH CSV HEADER" > master_cities.csv
```

**Import ke LPrecast:**

```bash
psql "$NEW_DB_URL" -c "\COPY master_provinces(id, code, name, created_at) FROM STDIN WITH CSV HEADER" < master_provinces.csv
psql "$NEW_DB_URL" -c "\COPY master_cities(id, code, name, province_id, type, created_at) FROM STDIN WITH CSV HEADER" < master_cities.csv
```

**Verifikasi:**

```sql
-- Di project LPrecast
SELECT COUNT(*) FROM master_provinces;
SELECT COUNT(*) FROM master_cities;
SELECT p.name, COUNT(c.id) as cities FROM master_provinces p LEFT JOIN master_cities c ON p.id = c.province_id GROUP BY p.name;
```

---

### Step 5: Update Environment Variables

Edit file `.env` di project LPrecast:

```env
# OLD (ERP)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# NEW (LPrecast) - GANTI DENGAN CREDENTIALS PROJECT BARU
NEXT_PUBLIC_SUPABASE_URL=https://yyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJyyy...
SUPABASE_SERVICE_ROLE_KEY=eyJyyy...
```

**Catatan:** Untuk environment variables di hosting:

- Vercel: Settings > Environment Variables
- Netlify: Site Settings > Environment Variables
- Railway: Variables tab
- dll.

---

### Step 6: Setup Authentication

Di project LPrecast baru, configure:

1. **Authentication > Providers**
   - Email: Enable
   - Configure SMTP settings untuk email verification

2. **Authentication > URL Configuration**
   - Site URL: `https://precast.leora.co.id`
   - Redirect URLs:
     - `https://precast.leora.co.id/**`
     - `http://localhost:3000/**` (development)

3. **Authentication > Email Templates**
   - Customize confirmation email
   - Customize reset password email

---

### Step 7: Test Aplikasi

Test flow utama:

1. **Registration:**
   - Buka halaman register
   - Isi form
   - Submit registration
   - Cek di database vendor_registrations

2. **Login:**
   - Buka halaman login
   - Login dengan user test
   - Cek redirect sesuai stakeholder_type

3. **Dashboard:**
   - Cek stats loading dengan benar
   - Cek tidak ada error di console

4. **Project Listing:**
   - Buka halaman project
   - Verifikasi data tampil

---

### Step 8: Deploy

1. Push code ke repository
2. Trigger deployment
3. Monitor build dan deployment logs
4. Cek application logs untuk error

---

### Step 9: Cleanup (Setelah Stabil)

**File:** `supabase/migrations/005_cleanup_backup_tables.sql`

Setelah 1-2 minggu dan tidak ada error:

1. Backup terakhir:

   ```bash
   supabase db dump --db-url "$OLD_DB_URL" -f final_backup.sql
   ```

2. Jalankan cleanup script di SQL Editor ERP:

   ```sql
   -- Paste isi 005_cleanup_backup_tables.sql
   ```

3. Verifikasi:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'backup_%';
   -- Should return 0 rows
   ```

---

## Rollback Instructions

Jika ada error di ERP setelah migrasi:

**File:** `supabase/migrations/002_restore_from_backup.sql`

1. Buka SQL Editor di Supabase Dashboard (project ERP)
2. Copy dan jalankan isi file `002_restore_from_backup.sql`
3. Script ini akan rename semua tabel `backup_*` kembali ke nama asli

**Verifikasi:**

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'backup_%' ORDER BY tablename;
```

---

## File Structure

```
supabase/migrations/
├── 001_backup_lprecast_tables.sql      # Step 1: Backup tables di ERP
├── 002_restore_from_backup.sql         # Rollback: Restore dari backup
├── 003_lprecast_schema.sql             # Step 3: Create schema di project baru
├── 004_export_master_data.sql          # Alternative: SQL export (optional)
├── 005_cleanup_backup_tables.sql       # Step 9: Hapus backup tables
├── export_import_master_data.sh        # Step 4: Script untuk copy master data
└── README_MIGRATION.md                 # This file
```

---

## Troubleshooting

### Error: Foreign Key Constraint

Jika ada error foreign key saat import:

```sql
-- Disable foreign key checks sementara
SET session_replication_role = replica;

-- Import data

-- Enable foreign key checks
SET session_replication_role = DEFAULT;
```

### Error: Duplicate Key

Jika ada error duplicate key:

```sql
-- Hapus data yang sudah ada
TRUNCATE TABLE master_provinces CASCADE;
TRUNCATE TABLE master_cities CASCADE;

-- Import ulang
```

### Error: Connection Refused

- Cek firewall settings
- Pastikan IP allowed di Supabase
- Cek connection string format

---

## Contact

Jika ada pertanyaan atau issue, hubungi tim development.
