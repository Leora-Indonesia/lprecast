-- ============================================================
-- Create vendor_approval_drafts (shared admin draft)
-- Date: 2026-04-21
-- Purpose:
--   - Persist checklist workspace draft per vendor (shared across admins)
--   - Allow saving notes/checked items without final decision
-- ============================================================

BEGIN;

-- Ensure update_updated_at_column() exists (used across the project)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.vendor_approval_drafts (
  vendor_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_items JSONB NOT NULL DEFAULT '{}'::jsonb,
  red_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  score INT,
  tier TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep updated_at fresh on updates
DROP TRIGGER IF EXISTS update_vendor_approval_drafts_updated_at ON public.vendor_approval_drafts;
CREATE TRIGGER update_vendor_approval_drafts_updated_at
  BEFORE UPDATE ON public.vendor_approval_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Service-role only access by default.
ALTER TABLE public.vendor_approval_drafts ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.vendor_approval_drafts IS 'Shared admin draft for vendor approval checklist workspace (1 row per vendor).';

NOTIFY pgrst, 'reload schema';

COMMIT;
