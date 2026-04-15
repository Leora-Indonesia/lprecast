-- Disable the problematic trigger temporarily
-- This is a temporary fix until we optimize the trigger performance

BEGIN;

-- Check if trigger exists and disable it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
    RAISE NOTICE 'Trigger on_auth_user_created disabled';
  ELSE
    RAISE NOTICE 'Trigger on_auth_user_created not found';
  END IF;
END $$;

COMMIT;
