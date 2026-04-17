-- ============================================================
-- Fix trigger to use vendor_profiles instead of dropped vendor_registrations
-- Date: 2026-04-17
-- ============================================================

BEGIN;

-- ============================================================
-- Update handle_new_user function:
-- - Insert to public.users (already works)
-- - Insert to vendor_profiles with status 'draft' (instead of vendor_registrations)
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_stakeholder_type TEXT;
  user_nama TEXT;
  user_nama_perusahaan TEXT;
BEGIN
  user_stakeholder_type := COALESCE(NEW.raw_user_meta_data->>'stakeholder_type', 'vendor');
  user_nama := COALESCE(NEW.raw_user_meta_data->>'nama', split_part(NEW.email, '@', 1));
  user_nama_perusahaan := NEW.raw_user_meta_data->>'nama_perusahaan';

  -- Insert to users table
  INSERT INTO public.users (id, email, nama, nama_perusahaan, username, stakeholder_type, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    user_nama,
    user_nama_perusahaan,
    split_part(NEW.email, '@', 1),
    user_stakeholder_type,
    true
  )
  ON CONFLICT (id) DO NOTHING;

  -- Auto-create vendor_profiles record for new vendors (instead of vendor_registrations)
  IF user_stakeholder_type = 'vendor' THEN
    INSERT INTO public.vendor_profiles (user_id, nama_perusahaan, registration_status, status)
    VALUES (NEW.id, user_nama_perusahaan, 'draft', 'draft')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Grant permissions
-- ============================================================

GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

-- ============================================================
-- Notify PostgREST to reload schema cache
-- ============================================================

NOTIFY pgrst, 'reload schema';

COMMIT;