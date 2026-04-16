-- ============================================================
-- ADD: nama_perusahaan column to users table
-- Date: 2026-04-16
-- Purpose: Store company name during vendor registration for auto-fill in onboarding
-- ============================================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS nama_perusahaan VARCHAR(255);

COMMENT ON COLUMN public.users.nama_perusahaan IS 'Company name of vendor (filled during registration)';

-- Backfill existing vendors with their company name if available in vendor_registrations/vendor_profiles
UPDATE public.users u
SET nama_perusahaan = vp.nama_perusahaan
FROM public.vendor_profiles vp
WHERE u.id = vp.user_id
AND u.nama_perusahaan IS NULL;
