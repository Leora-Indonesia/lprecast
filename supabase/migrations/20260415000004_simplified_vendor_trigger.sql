-- ============================================================
-- SIMPLIFIED: Only insert to users table on vendor signup
-- Previous complex trigger caused 504 errors
-- Date: 2026-04-15
-- ============================================================

-- 1. Drop the complex trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_vendor_registration();

-- 2. Create simplified trigger - ONLY insert to users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert to users table (lightweight operation)
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
  -- Log error but don't fail the auth signup
  RAISE WARNING 'handle_new_user error for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO anon;

COMMENT ON FUNCTION handle_new_user() IS
'Lightweight trigger: Only inserts into users table on signup. Vendor profile creation handled separately during onboarding.';
