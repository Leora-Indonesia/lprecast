-- ============================================================
-- Merge vendor_registrations into vendor_profiles
-- Date: 2026-04-17
-- Simplification:
--   - vendor_registrations.status + fields move to vendor_profiles
--   - vendor_profiles.nama_pic/kontak_pic REMOVED (use vendor_contacts where is_primary=true)
--   - vendor_delivery_areas.province_name/city_name REMOVED (denormalized, join instead)
--   - Status transitions enforced via trigger
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Add new columns to vendor_profiles
-- ============================================================

ALTER TABLE vendor_profiles
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- ============================================================
-- STEP 2: Update vendor_profiles CHECK constraint
-- Old: ('active', 'inactive', 'suspended', 'blacklisted')
-- New: Combined lifecycle status
-- ============================================================

ALTER TABLE vendor_profiles
  DROP CONSTRAINT IF EXISTS vendor_profiles_status_check;

ALTER TABLE vendor_profiles
  ADD CONSTRAINT vendor_profiles_status_check
  CHECK (status IN (
    'draft',
    'submitted',
    'under_review',
    'revision_requested',
    'rejected',
    'active',
    'suspended',
    'blacklisted'
  ));

-- ============================================================
-- STEP 3: Migrate data from vendor_registrations to vendor_profiles
-- ============================================================

UPDATE vendor_profiles vp
SET
  submitted_at = vr.submitted_at,
  reviewed_at = vr.reviewed_at,
  reviewed_by = vr.reviewed_by,
  rejection_reason = vr.rejection_reason,
  approval_notes = vr.approval_notes,
  -- If vendor_registrations is 'approved', vendor_profiles should be 'active'
  status = CASE
    WHEN vr.status = 'approved' THEN 'active'
    WHEN vr.status = 'under_review' THEN 'under_review'
    WHEN vr.status = 'rejected' THEN 'rejected'
    ELSE vp.status
  END
FROM vendor_registrations vr
WHERE vr.user_id = vp.user_id;

-- ============================================================
-- STEP 4: Migrate nama_pic/kontak_pic to vendor_contacts as primary
-- For vendors that don't have a primary contact yet
-- ============================================================

-- Insert primary contact from vendor_profiles.nama_pic/kontak_pic
-- Only where no primary contact exists yet
INSERT INTO vendor_contacts (user_id, sequence, nama, no_hp, jabatan, is_primary)
SELECT
  vp.user_id,
  1,
  COALESCE(vp.nama_pic, ''),
  COALESCE(vp.kontak_pic, ''),
  'PIC',
  TRUE
FROM vendor_profiles vp
WHERE
  vp.nama_pic IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM vendor_contacts vc
    WHERE vc.user_id = vp.user_id AND vc.is_primary = TRUE
  );

-- ============================================================
-- STEP 5: Remove denormalized columns from vendor_profiles
-- ============================================================

ALTER TABLE vendor_profiles
  DROP COLUMN IF EXISTS nama_pic,
  DROP COLUMN IF EXISTS kontak_pic,
  DROP COLUMN IF EXISTS approved_at,
  DROP COLUMN IF EXISTS approved_by;

-- ============================================================
-- STEP 6: Remove denormalized columns from vendor_delivery_areas
-- ============================================================

ALTER TABLE vendor_delivery_areas
  DROP COLUMN IF EXISTS province_name,
  DROP COLUMN IF EXISTS city_name;

-- ============================================================
-- STEP 7: Drop vendor_registrations table
-- ============================================================

DROP TABLE IF EXISTS vendor_registrations CASCADE;

-- ============================================================
-- STEP 8: Create status transition validation function
-- Registration phase: draft -> submitted -> under_review
--                                         -> revision_requested -> submitted
--                                         -> rejected
-- Operational phase: under_review -> active -> suspended -> blacklisted
--                              active <-> suspended <-> blacklisted
-- ============================================================

CREATE OR REPLACE FUNCTION validate_vendor_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Initial insert - allow any valid initial status
  IF OLD IS NULL THEN
    IF NEW.status NOT IN ('draft', 'submitted', 'under_review', 'revision_requested', 'rejected', 'active', 'suspended', 'blacklisted') THEN
      RAISE EXCEPTION 'Invalid initial status: %', NEW.status;
    END IF;
    RETURN NEW;
  END IF;

  -- Skip if status not changing
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Registration phase transitions
  IF OLD.status = 'draft' AND NEW.status NOT IN ('submitted') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from draft to %. Only draft -> submitted is allowed.', NEW.status;
  END IF;

  IF OLD.status = 'submitted' AND NEW.status NOT IN ('under_review') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from submitted to %. Only submitted -> under_review is allowed.', NEW.status;
  END IF;

  IF OLD.status = 'under_review' AND NEW.status NOT IN ('active', 'revision_requested', 'rejected') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from under_review to %. Allowed: active, revision_requested, rejected.', NEW.status;
  END IF;

  IF OLD.status = 'revision_requested' AND NEW.status NOT IN ('submitted') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from revision_requested to %. Only revision_requested -> submitted is allowed.', NEW.status;
  END IF;

  IF OLD.status = 'rejected' THEN
    RAISE EXCEPTION 'Vendor status is in final state (rejected). No transitions allowed.';
  END IF;

  -- Operational phase transitions
  IF OLD.status = 'active' AND NEW.status NOT IN ('suspended', 'blacklisted') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from active to %. Allowed: suspended, blacklisted.', NEW.status;
  END IF;

  IF OLD.status = 'suspended' AND NEW.status NOT IN ('active', 'blacklisted') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from suspended to %. Allowed: active, blacklisted.', NEW.status;
  END IF;

  IF OLD.status = 'blacklisted' AND NEW.status NOT IN ('active', 'suspended') THEN
    RAISE EXCEPTION 'Vendor status cannot transition from blacklisted to %. Allowed: active, suspended.', NEW.status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STEP 9: Create trigger for status transition validation
-- ============================================================

DROP TRIGGER IF EXISTS validate_vendor_profile_status_transition ON vendor_profiles;

CREATE TRIGGER validate_vendor_profile_status_transition
  BEFORE UPDATE OF status ON vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_vendor_status_transition();

-- ============================================================
-- STEP 10: Notify PostgREST to reload schema cache
-- ============================================================

NOTIFY pgrst, 'reload schema';

COMMIT;
