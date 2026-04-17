-- Fix RLS policy to allow anon (unauthenticated) users to read vendor_registration_skip_email_verify setting
-- This enables the registration page to check if skip email verification is enabled

-- Drop old policy
DROP POLICY IF EXISTS "Authenticated users can read app_settings" ON app_settings;

-- Create new policy: Allow both anon and authenticated to read the vendor registration setting
CREATE POLICY "Allow public read app_settings for vendor registration"
  ON app_settings
  FOR SELECT
  TO anon, authenticated
  USING (key = 'vendor_registration_skip_email_verify');