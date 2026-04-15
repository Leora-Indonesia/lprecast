-- ============================================================
-- STEP 1: Drop old vendor tables, triggers, and functions
-- Date: 2026-04-16
-- Purpose: Clean slate for vendor redesign with user_id FK
-- ============================================================

BEGIN;

-- Drop triggers first (depend on functions) - using DO blocks for safety
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_vendor_registration_submitted ON vendor_registrations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_vendor_registration_status_change ON vendor_registrations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_vendor_registrations_updated_at ON vendor_registrations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_vendor_company_info_updated_at ON vendor_company_info;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_vendor_products_updated_at ON vendor_products;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_vendor_profiles_updated_at ON vendor_profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_vendor_registration();
DROP FUNCTION IF EXISTS notify_admins_new_vendor(UUID);
DROP FUNCTION IF EXISTS notify_vendor_status_change(UUID);
DROP FUNCTION IF EXISTS get_admin_emails();
DROP FUNCTION IF EXISTS get_vendor_company_info(UUID);
DROP FUNCTION IF EXISTS update_timestamp();

-- Drop tables (order matters: child tables first) - CASCADE handles dependencies
DROP TABLE IF EXISTS vendor_registration_history CASCADE;
DROP TABLE IF EXISTS vendor_additional_costs CASCADE;
DROP TABLE IF EXISTS vendor_cost_inclusions CASCADE;
DROP TABLE IF EXISTS vendor_delivery_areas CASCADE;
DROP TABLE IF EXISTS vendor_products CASCADE;
DROP TABLE IF EXISTS vendor_factory_addresses CASCADE;
DROP TABLE IF EXISTS vendor_bank_accounts CASCADE;
DROP TABLE IF EXISTS vendor_legal_documents CASCADE;
DROP TABLE IF EXISTS vendor_contacts CASCADE;
DROP TABLE IF EXISTS vendor_company_info CASCADE;
DROP TABLE IF EXISTS vendor_registrations CASCADE;
DROP TABLE IF EXISTS vendor_profiles CASCADE;
DROP TABLE IF EXISTS vendor_onboarding_drafts CASCADE;

-- Drop old RLS policies dynamically
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT tablename, policyname FROM pg_policies 
    WHERE policyname LIKE 'Allow anonymous%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, policy_record.tablename);
  END LOOP;
END $$;

COMMIT;
