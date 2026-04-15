-- ============================================================
-- STEP 3: Create triggers and functions
-- Date: 2026-04-16
-- ============================================================

BEGIN;

-- ============================================================
-- TRIGGER: handle_new_user
-- Purpose: Insert into users table when new user signs up via auth
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO users (id, email, nama, username, stakeholder_type, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'nama',
      split_part(NEW.email, '@', 1)
    ),
    split_part(NEW.email, '@', 1),
    COALESCE(
      NEW.raw_user_meta_data->>'stakeholder_type',
      'vendor'
    ),
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Grant permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

COMMENT ON FUNCTION handle_new_user() IS 
'Trigger function: Inserts into users table when new user signs up via Supabase Auth.';

-- ============================================================
-- FUNCTION: update_timestamp
-- Purpose: Auto-update updated_at column
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_timestamp trigger to all vendor tables
CREATE TRIGGER update_vendor_onboarding_drafts
BEFORE UPDATE ON vendor_onboarding_drafts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_registrations
BEFORE UPDATE ON vendor_registrations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_profiles
BEFORE UPDATE ON vendor_profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_contacts
BEFORE UPDATE ON vendor_contacts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_bank_accounts
BEFORE UPDATE ON vendor_bank_accounts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_factory_addresses
BEFORE UPDATE ON vendor_factory_addresses
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_products
BEFORE UPDATE ON vendor_products
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vendor_additional_costs
BEFORE UPDATE ON vendor_additional_costs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- FUNCTION: notify_admins_new_vendor_registration
-- Purpose: Create notification for admins when vendor submits
-- ============================================================

CREATE OR REPLACE FUNCTION notify_admins_new_vendor_registration()
RETURNS TRIGGER
SET search_path = ''
AS $$
DECLARE
  vendor_email TEXT;
  vendor_name TEXT;
  company_name TEXT;
BEGIN
  -- Only notify when status changes to 'submitted'
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
    -- Get vendor info
    SELECT u.email, u.nama, vd.draft_data->>'company_info'->>'nama_perusahaan'
    INTO vendor_email, vendor_name, company_name
    FROM auth.users u
    LEFT JOIN vendor_onboarding_drafts vd ON vd.user_id = NEW.user_id
    WHERE u.id = NEW.user_id;

    -- Create notification for all admins
    INSERT INTO notifications (user_id, type, category, title, message, reference_id, reference_type, is_read)
    SELECT 
      a.id,
      'vendor_registration_submitted',
      'vendor',
      'Pendaftaran Vendor Baru',
      COALESCE(company_name, 'Vendor') || ' (' || COALESCE(vendor_email, NEW.user_id::TEXT) || ') telah mengajukan pendaftaran vendor dan menunggu review.',
      NEW.id,
      'vendor_registration',
      false
    FROM auth.users a
    WHERE a.stakeholder_type = 'internal'
    AND a.is_active = true;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vendor_registration_submitted
AFTER UPDATE ON vendor_registrations
FOR EACH ROW
EXECUTE FUNCTION notify_admins_new_vendor_registration();

-- ============================================================
-- FUNCTION: notify_vendor_approval
-- Purpose: Notify vendor when their registration is approved/rejected
-- ============================================================

CREATE OR REPLACE FUNCTION notify_vendor_approval()
RETURNS TRIGGER
SET search_path = ''
AS $$
DECLARE
  admin_name TEXT;
BEGIN
  -- Only notify on status change to approved or rejected
  IF NEW.status IN ('approved', 'rejected') AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    
    SELECT u.nama INTO admin_name FROM users u WHERE u.id = NEW.reviewed_by;

    IF NEW.status = 'approved' THEN
      INSERT INTO notifications (user_id, type, category, title, message, reference_id, reference_type, is_read)
      VALUES (
        NEW.user_id,
        'vendor_approved',
        'vendor',
        'Pendaftaran Disetujui',
        'Selamat! Pendaftaran vendor Anda telah disetujui oleh ' || COALESCE(admin_name, 'Admin') || '. Anda sekarang dapat mengakses semua fitur vendor.',
        NEW.id,
        'vendor_registration',
        false
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO notifications (user_id, type, category, title, message, reference_id, reference_type, is_read)
      VALUES (
        NEW.user_id,
        'vendor_rejected',
        'vendor',
        'Pendaftaran Ditolak',
        'Maaf, pendaftaran vendor Anda telah ditolak. Alasan: ' || COALESCE(NEW.rejection_reason, 'Tidak ada'),
        NEW.id,
        'vendor_registration',
        false
      );
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vendor_approval
AFTER UPDATE OF status ON vendor_registrations
FOR EACH ROW
EXECUTE FUNCTION notify_vendor_approval();

-- ============================================================
-- FUNCTION: activate_vendor_profile
-- Purpose: Create/activate vendor profile when approved
-- ============================================================

CREATE OR REPLACE FUNCTION activate_vendor_profile()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    -- Create vendor profile from registration data
    INSERT INTO vendor_profiles (
      user_id,
      nama_perusahaan,
      email_perusahaan,
      nama_pic,
      status,
      approved_at,
      approved_by
    )
    SELECT 
      NEW.user_id,
      vd.draft_data->>'company_info'->>'nama_perusahaan',
      vd.draft_data->>'company_info'->>'email',
      vd.draft_data->>'company_info'->>'nama_pic',
      'active',
      NOW(),
      NEW.reviewed_by
    FROM vendor_onboarding_drafts vd
    WHERE vd.user_id = NEW.user_id
    ON CONFLICT (user_id) DO UPDATE SET
      status = 'active',
      approved_at = NOW(),
      approved_by = NEW.reviewed_by,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vendor_approved_profile
AFTER UPDATE OF status ON vendor_registrations
FOR EACH ROW
EXECUTE FUNCTION activate_vendor_profile();

-- ============================================================
-- Helper functions - Skip if already exist
-- These are optional helpers for RLS policies
-- Using DO blocks with $func$ delimiter to avoid conflicts
-- ============================================================

DO $func$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'current_user_id' AND pronargs = 0) THEN
    CREATE OR REPLACE FUNCTION current_user_id()
    RETURNS UUID AS $inner$
    BEGIN
      RETURN auth.uid();
    END;
    $inner$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $func$;

DO $func$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_internal_user' AND pronargs = 0) THEN
    CREATE OR REPLACE FUNCTION is_internal_user()
    RETURNS BOOLEAN AS $inner$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND stakeholder_type = 'internal'
        AND is_active = true
      );
    END;
    $inner$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $func$;

DO $func$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_vendor' AND pronargs = 0) THEN
    CREATE OR REPLACE FUNCTION is_vendor()
    RETURNS BOOLEAN AS $inner$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND stakeholder_type = 'vendor'
        AND is_active = true
      );
    END;
    $inner$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $func$;

DO $func$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_client' AND pronargs = 0) THEN
    CREATE OR REPLACE FUNCTION is_client()
    RETURNS BOOLEAN AS $inner$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND stakeholder_type = 'client'
        AND is_active = true
      );
    END;
    $inner$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $func$;

COMMIT;
