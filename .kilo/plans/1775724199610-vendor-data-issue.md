# Debug Plan: Vendor Company Info Tidak Muncul

## Current Status

**Fakta dari User:**

1. ✅ "Daftar Kontak" muncul di halaman detail vendor (`/admin/vendors/[id]`)
2. ❌ Info perusahaan (`nama_perusahaan`, `nama_pic`, `email`) tidak muncul di list vendor
3. ⚠️ Error login: "Terjadi kesalahan. Silakan coba lagi." tapi redirect ke dashboard
4. ❓ Belum cek console browser untuk error detail

**Fakta dari Code Analysis:**

1. **List Page** (`/admin/vendors/page.tsx`):
   - Uses `createAdminClient()` ✓
   - Query: `.select("*, vendor_company_info(*)")` ✓
2. **Detail Page** (`/admin/vendors/[id]/page.tsx`):
   - Uses `createClient()` ✓ (different from list!)
   - Query: Multi-line select dengan backticks ✓
   - Menampilkan "Daftar Kontak" dari `vendor_contacts` ✓

**Kesimpulan Awal:**

- Authentication working (bisa akses halaman)
- Data `vendor_contacts` muncul ✅
- Data `vendor_company_info` TIDAK muncul ❌

## Hypothesis

### Hypothesis 1: Data vendor_company_info NULL diDatabase

**Evidence:**

- Query SQL di Supabase dashboard menunjukkan data ADA
- Tapi di aplikasi tidak muncul
- Kontak (vendor_contacts) muncul, tapi company_info tidak

**Possible Cause:**

- `vendor_company_info` mungkin ada tapi dengan nilai `null` untuk beberapa field
- Atau ada row dengan `registration_id` yang tidak match

### Hypothesis 2: Query Structure Issue

**Evidence:**

- List page: `.select("*, vendor_company_info(*)")` - single line
- Detail page: Multi-line dengan backticks
- Berhasil untuk `vendor_contacts`, gagal untuk `vendor_company_info`

### Hypothesis 3: Client Authentication State

**Evidence:**

- List page uses `createAdminClient()`
- Detail page uses `createClient()` (regular client)
- Maybe `createClient()` juga perlu update?

## Investigation Steps

### Step 1: Add Debug Logging to Detail Page

**File:** `app/(admin)/admin/vendors/[id]/page.tsx`

Add console.log untuk melihat:

1. Apakah query berhasil?
2. Apakah error ada?
3. Apakah data vendor_company_info ada tapi null?

```typescript
const { data: registration, error } = await supabase
  .from("vendor_registrations")
  .select(
    `
    *,
    vendor_company_info (*),
    vendor_contacts (*),
    vendor_bank_accounts (*)
  `
  )
  .eq("id", id)
  .single()

console.log("=== Vendor Detail Debug ===")
console.log("Registration ID:", id)
console.log("Error:", error)
console.log("Data:", registration)
console.log("Company Info:", registration?.vendor_company_info)
console.log("Company Info Type:", typeof registration?.vendor_company_info)
```

### Step 2: Check Data in Database

Run these queries in Supabase Dashboard:

```sql
-- Check if vendor_company_info exists for registrations
SELECT
  vr.id as registration_id,
  vr.status,
  vci.id as company_info_id,
  vci.nama_perusahaan,
  vci.nama_pic,
  vci.email
FROM vendor_registrations vr
LEFT JOIN vendor_company_info vci ON vci.registration_id = vr.id
LIMIT 5;

-- Check vendor_contacts exists
SELECT
  vr.id as registration_id,
  vc.id as contact_id,
  vc.nama,
  vc.jabatan
FROM vendor_registrations vr
LEFT JOIN vendor_contacts vc ON vc.registration_id = vr.id
LIMIT 5;
```

### Step 3: Check Browser Console

User needs to open browser console (F12) and check:

1. Network tab: Apakah ada failed requests?
2. Console tab: Apakah ada JavaScript errors?
3. React tab: Apakah component rendered dengan props yang benar?

### Step 4: Test Direct Query in Detail Page

Change the query temporarily to simpler structure:

```typescript
// Test 1: Simple select
const { data, error } = await supabase
  .from("vendor_registrations")
  .select("*")
  .eq("id", id)
  .single()

// Test 2: Select with explicit join
const { data, error } = await supabase
  .from("vendor_registrations")
  .select("id, status, vendor_company_info(id, nama_perusahaan, email)")
  .eq("id", id)
  .single()
```

## Possible Solutions

### Solution A: Fix Query Syntax

If query structure is the issue, change to:

```typescript
const { data: registration, error } = await supabase
  .from("vendor_registrations")
  .select(
    `
    id,
    status,
    created_at,
    submission_date,
    approval_notes,
    reviewed_at,
    vendor_id,
    vendor_company_info (
      id,
      nama_perusahaan,
      nama_pic,
      kontak_pic,
      email,
      instagram,
      facebook,
      linkedin,
      website
    ),
    vendor_contacts (
      id,
      nama,
      jabatan,
      no_hp,
      is_primary,
      sequence
    ),
    vendor_bank_accounts (
      id,
      bank_name,
      account_number,
      account_holder_name,
      is_primary
    )
  `
  )
  .eq("id", id)
  .single()
```

### Solution B: Handle NULL Data

If `vendor_company_info` is null, add null checks:

```typescript
// In component
const companyInfo = vendor.vendor_company_info?.[0] ?? null

// Or if it's single object
const companyInfo = vendor.vendor_company_info ?? null
```

**Note:** Perlu di-check apakah `vendor_company_info` return array atau single object.

### Solution C: Fix Client Type

If `createClient()` is not working properly, change detail page to use `createAdminClient()`:

```typescript
// Change from:
const supabase = await createClient()

// To:
const supabase = await createAdminClient()
```

### Solution D: Check RLS for vendor_company_info

Verify RLS policies for vendor_company_info are working for internal users:

```sql
-- Test as current user
SELECT * FROM vendor_company_info LIMIT 5;

-- Check if is_internal_user() returns true
SELECT is_internal_user();
```

## Next Actions

**User needs to:**

1. ✅ Open browser console (F12)
2. ✅ Navigate to `/admin/vendors`
3. ✅ Check for errors in Console and Network tabs
4. ✅ Click "Lihat" to go to detail page
5. ✅ Check console for "Daftar Kontak" and "Informasi Perusahaan" data

**Developer needs to:**

1. Add debug logging to both pages
2. Run SQL queries to verify data
3. Test different query structures
4. Fix based on findings

## Questions for User

1. Di halaman detail vendor `/admin/vendors/[id]`, apakah "Informasi Perusahaan" card juga kosong? Atau hanya nama perusahaan saja yang kosong?
2. Apakah bisa screenshot halaman detail vendor untuk melihat layout dan mana yang kosong?
3. Di tab Network browser, apakah ada request yang gagal (merah)?
