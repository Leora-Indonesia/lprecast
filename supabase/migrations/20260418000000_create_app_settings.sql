-- Create app_settings table for system configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default setting for vendor registration skip email verify
INSERT INTO app_settings (key, value, description) VALUES
  ('vendor_registration_skip_email_verify', '{"enabled": false}'::jsonb, 'Skip email verification for vendor registration. Enable for bulk import vendor by admin.')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read (including anon/unauthenticated) for vendor registration setting
-- This is needed so that the registration page can check if skip email verify is enabled
CREATE POLICY "Allow public read app_settings"
  ON app_settings
  FOR SELECT
  TO anon, authenticated
  USING (key = 'vendor_registration_skip_email_verify');

-- RLS Policy: Only admin (internal) can update app_settings
CREATE POLICY "Admin can update app_settings"
  ON app_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.stakeholder_type = 'internal'
    )
  );

-- RLS Policy: Admin can insert app_settings
CREATE POLICY "Admin can insert app_settings"
  ON app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.stakeholder_type = 'internal'
    )
  );