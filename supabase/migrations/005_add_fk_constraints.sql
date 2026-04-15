-- ============================================================
-- Add foreign key constraints for PostgREST relationship detection
-- Date: 2026-04-16
-- Note: Force PostgREST to refresh schema cache by adding constraints
-- ============================================================

BEGIN;

-- Drop existing FK if referencing wrong table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'vendor_registrations_user_id_fkey'
    AND table_name = 'vendor_registrations'
  ) THEN
    ALTER TABLE vendor_registrations DROP CONSTRAINT vendor_registrations_user_id_fkey;
  END IF;
END $$;

-- Add FK constraint to public.users
ALTER TABLE vendor_registrations
ADD CONSTRAINT vendor_registrations_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Force PostgREST schema cache refresh
NOTIFY pgrst, 'reload schema';

COMMIT;
