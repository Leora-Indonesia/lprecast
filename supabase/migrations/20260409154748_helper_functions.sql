-- ============================================================
-- Helper Functions for RLS Policies
-- This migration adds the required helper functions for Row Level Security
-- ============================================================

-- Function to get current authenticated user ID
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if current user is an internal user (admin/staff)
CREATE OR REPLACE FUNCTION is_internal_user()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND stakeholder_type = 'internal'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if current user is a vendor
CREATE OR REPLACE FUNCTION is_vendor()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND stakeholder_type = 'vendor'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_internal_user() TO authenticated;
GRANT EXECUTE ON FUNCTION is_vendor() TO authenticated;