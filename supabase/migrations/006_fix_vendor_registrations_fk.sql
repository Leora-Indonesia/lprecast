-- ============================================================
-- Add foreign key constraint to public.users for PostgREST
-- Date: 2026-04-16
-- Purpose: Enable PostgREST to detect relationship between
--          vendor_registrations and users for implicit joins
-- ============================================================

BEGIN;

-- Check if constraint already exists
DO $$
BEGIN
  -- Drop existing constraint if pointing to auth.users
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'vendor_registrations'
      AND kcu.column_name = 'user_id'
      AND tc.constraint_name LIKE '%user_id%'
  ) THEN
    -- Get constraint name
    ALTER TABLE vendor_registrations DROP CONSTRAINT IF EXISTS vendor_registrations_user_id_fkey;
  END IF;
END $$;

-- Add new FK constraint pointing to public.users
ALTER TABLE vendor_registrations
ADD CONSTRAINT vendor_registrations_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

COMMIT;
