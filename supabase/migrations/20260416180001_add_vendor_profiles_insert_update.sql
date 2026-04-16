-- ============================================================
-- Add INSERT/UPDATE policies for vendor_profiles
-- Date: 2026-04-16
-- Purpose: Allow vendors to insert/update their own profile during onboarding
-- ============================================================

BEGIN;

-- Vendors can insert their own profile during onboarding
CREATE POLICY "Vendors can insert own profile"
ON vendor_profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Vendors can update their own profile
CREATE POLICY "Vendors can update own profile"
ON vendor_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

COMMIT;
