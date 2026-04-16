-- ============================================================
-- UPDATE: Auto-create vendor registration on signup
-- Date: 2026-04-16
-- Purpose: Update handle_new_user trigger to also insert into vendor_registrations
-- ============================================================

-- Update the trigger function to auto-create vendor registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
DECLARE
  user_stakeholder_type TEXT;
BEGIN
  user_stakeholder_type := COALESCE(NEW.raw_user_meta_data->>'stakeholder_type', 'vendor');

  -- Insert to users table (lightweight operation)
  INSERT INTO public.users (id, email, nama, username, stakeholder_type, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nama', split_part(NEW.email, '@', 1)),
    split_part(NEW.email, '@', 1),
    user_stakeholder_type,
    true
  )
  ON CONFLICT (id) DO NOTHING;

  -- Auto-create vendor registration record for new vendors
  IF user_stakeholder_type = 'vendor' THEN
    INSERT INTO public.vendor_registrations (user_id, status)
    VALUES (NEW.id, 'draft')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth signup
  RAISE WARNING 'handle_new_user error for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comment
COMMENT ON FUNCTION handle_new_user() IS
'Lightweight trigger: Inserts into users table on signup. Also auto-creates vendor registration record for vendor users.';

-- ============================================================
-- MIGRATE EXISTING VENDORS
-- Create vendor_registrations record for existing vendors that don't have one
-- ============================================================

INSERT INTO public.vendor_registrations (user_id, status)
SELECT u.id, 'draft'
FROM public.users u
LEFT JOIN public.vendor_registrations vr ON vr.user_id = u.id
WHERE u.stakeholder_type = 'vendor'
AND vr.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Log migration result
DO $$
DECLARE
  inserted_count INTEGER;
BEGIN
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Created vendor_registrations for % existing vendors', inserted_count;
END $$;
