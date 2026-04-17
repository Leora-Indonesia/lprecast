-- Migration: Fix Vendor Registration Enum Structure
-- Purpose: Recreate vendor_registration_status enum and add new columns to vendor_profiles

-- Step 1: Recreate vendor_registration_status enum
DROP TYPE IF EXISTS vendor_registration_status CASCADE;

CREATE TYPE vendor_registration_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'revision_requested',
  'approved',
  'conditional',
  'rejected'
);

-- Step 2: Add registration_status column to vendor_profiles
ALTER TABLE vendor_profiles
ADD COLUMN IF NOT EXISTS registration_status vendor_registration_status;

-- Step 3: Migrate existing data - vendor with 'submitted' status gets registration_status = 'submitted'
UPDATE vendor_profiles
SET registration_status = 'submitted'::vendor_registration_status
WHERE status = 'submitted';

-- Fill remaining with 'draft'
UPDATE vendor_profiles
SET registration_status = 'draft'::vendor_registration_status
WHERE registration_status IS NULL;

-- Step 4: Add scoring columns
ALTER TABLE vendor_profiles
ADD COLUMN IF NOT EXISTS approval_tier VARCHAR(20),
ADD COLUMN IF NOT EXISTS approval_score NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS profile_completeness_pct NUMERIC(5,2);

-- Step 5: Set constraints and defaults
ALTER TABLE vendor_profiles
ALTER COLUMN registration_status SET DEFAULT 'draft',
ALTER COLUMN registration_status SET NOT NULL;

-- Step 6: Fix status column - keep only active/suspended/blacklisted (remove submitted)
UPDATE vendor_profiles
SET status = 'active'::vendor_profile_status
WHERE status NOT IN ('active', 'suspended', 'blacklisted');

-- Step 7: Add comments for documentation
COMMENT ON COLUMN vendor_profiles.registration_status IS 'Approval workflow: draft → submitted → under_review → approved/conditional/rejected';
COMMENT ON COLUMN vendor_profiles.status IS 'Account state: active, suspended, blacklisted';
COMMENT ON COLUMN vendor_profiles.approval_score IS 'Score from vendor approval checklist (0-100)';
COMMENT ON COLUMN vendor_profiles.profile_completeness_pct IS 'Profile completion percentage (0-100)';