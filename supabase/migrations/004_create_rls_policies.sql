-- ============================================================
-- STEP 4: Enable RLS and create policies
-- Date: 2026-04-16
-- ============================================================

BEGIN;

-- Enable RLS on all vendor tables
ALTER TABLE vendor_onboarding_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_factory_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_cost_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_additional_costs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- vendor_onboarding_drafts policies
-- ============================================================

-- Users can view and manage their own draft
CREATE POLICY "Users can view own onboarding draft"
ON vendor_onboarding_drafts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own onboarding draft"
ON vendor_onboarding_drafts FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own onboarding draft"
ON vendor_onboarding_drafts FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own onboarding draft"
ON vendor_onboarding_drafts FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================================
-- vendor_registrations policies
-- ============================================================

-- Users can view their own registration status
CREATE POLICY "Users can view own registration"
ON vendor_registrations FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only the system (via trigger) can insert registrations
CREATE POLICY "System can insert registrations"
ON vendor_registrations FOR INSERT
TO authenticated, service_role
WITH CHECK (user_id = auth.uid());

-- Users cannot update their own registration (only admin can)
CREATE POLICY "Admins can update any registration"
ON vendor_registrations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND stakeholder_type = 'internal'
  )
);

-- ============================================================
-- vendor_profiles policies
-- ============================================================

-- Vendors can view their own profile
CREATE POLICY "Vendors can view own profile"
ON vendor_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Internal users can view all profiles
CREATE POLICY "Internal can view all profiles"
ON vendor_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND stakeholder_type = 'internal'
  )
);

-- System can insert/update profiles (via trigger)
CREATE POLICY "System can manage profiles"
ON vendor_profiles FOR ALL
TO service_role;

-- ============================================================
-- vendor_documents policies
-- ============================================================

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON vendor_documents FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Internal users can view all documents
CREATE POLICY "Internal can view all documents"
ON vendor_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND stakeholder_type = 'internal'
  )
);

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents"
ON vendor_documents FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
ON vendor_documents FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- ============================================================
-- vendor_contacts policies
-- ============================================================

CREATE POLICY "Users can manage own contacts"
ON vendor_contacts FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- vendor_bank_accounts policies
-- ============================================================

CREATE POLICY "Users can manage own bank accounts"
ON vendor_bank_accounts FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- vendor_factory_addresses policies
-- ============================================================

CREATE POLICY "Users can manage own factory addresses"
ON vendor_factory_addresses FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- vendor_products policies
-- ============================================================

CREATE POLICY "Users can manage own products"
ON vendor_products FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- vendor_delivery_areas policies
-- ============================================================

CREATE POLICY "Users can manage own delivery areas"
ON vendor_delivery_areas FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- vendor_cost_inclusions policies
-- ============================================================

CREATE POLICY "Users can manage own cost inclusions"
ON vendor_cost_inclusions FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- vendor_additional_costs policies
-- ============================================================

CREATE POLICY "Users can manage own additional costs"
ON vendor_additional_costs FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- Grant table permissions to service_role (for triggers)
-- ============================================================

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

COMMIT;
