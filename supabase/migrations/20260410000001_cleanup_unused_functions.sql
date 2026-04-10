-- ============================================================
-- CLEANUP: Remove Unused Functions
-- Date: 2025-04-10
-- Purpose: Remove functions that are not used in LPrecast
-- ============================================================

-- ============================================================
-- SECTION 1: Drop Unused Permission Functions
-- LPrecast uses stakeholder_type (vendor/client/internal) only
-- No role-based permission system needed
-- ============================================================

-- Drop function that returns empty JSONB
DROP FUNCTION IF EXISTS get_user_permissions();

-- Drop function that checks permissions (depends on get_user_permissions)
DROP FUNCTION IF EXISTS user_has_permission(TEXT);

-- ============================================================
-- SECTION 2: Note on update_updated_at_column()
-- 
-- This function EXISTS in 20260407053500_vendor_tender_system.sql
-- and is used by triggers for tables:
--   - vendor_registrations
--   - vendor_company_info
--   - vendor_products
--   - vendor_profiles
--   - tenders
--   - tender_submissions
--   - project_milestones
--   - payment_requests
--
-- It is essentially a DUPLICATE of update_updated_at() from 003_lprecast_schema.sql
-- But we KEEP both because:
--   1. Migration 20260407053500_vendor_tender_system.sql references it
--   2. Dropping it would break existing triggers
--   3. Both functions serve the same purpose, just different names
--
-- For future migrations, use update_updated_at() from 003_lprecast_schema.sql
-- ============================================================

-- ============================================================
-- CLEANUP COMPLETE
-- Remaining functions:
--   - current_user_id() - For RLS policies
--   - is_vendor() - For RLS policies
--   - is_client() - For RLS policies
--   - is_internal_user() - For RLS policies
--   - update_updated_at() - For triggers (from 003_lprecast_schema.sql)
--   - update_updated_at_column() - For triggers (from 20260407053500_vendor_tender_system.sql)
-- ============================================================
