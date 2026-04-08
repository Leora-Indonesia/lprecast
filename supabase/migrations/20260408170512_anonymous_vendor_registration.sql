-- ============================================================
-- Allow Anonymous Users to Register as Vendors (MVP)
-- This enables public access to vendor registration without login
-- ============================================================

-- 1. vendor_registrations - allow anonymous insert
CREATE POLICY "anon_insert_registrations" ON vendor_registrations
  FOR INSERT TO anon
  WITH CHECK (vendor_id IS NULL);

-- 2. vendor_company_info - allow anonymous insert
CREATE POLICY "anon_insert_company_info" ON vendor_company_info
  FOR INSERT TO anon
  WITH CHECK (true);

-- 3. vendor_contacts - allow anonymous insert
CREATE POLICY "anon_insert_contacts" ON vendor_contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- 4. vendor_legal_documents - allow anonymous insert
CREATE POLICY "anon_insert_legal_docs" ON vendor_legal_documents
  FOR INSERT TO anon
  WITH CHECK (true);

-- 5. vendor_bank_accounts - allow anonymous insert
CREATE POLICY "anon_insert_bank_accounts" ON vendor_bank_accounts
  FOR INSERT TO anon
  WITH CHECK (true);

-- 6. vendor_factory_addresses - allow anonymous insert
CREATE POLICY "anon_insert_factory_addresses" ON vendor_factory_addresses
  FOR INSERT TO anon
  WITH CHECK (true);

-- 7. vendor_products - allow anonymous insert
CREATE POLICY "anon_insert_products" ON vendor_products
  FOR INSERT TO anon
  WITH CHECK (true);

-- 8. vendor_delivery_areas - allow anonymous insert
CREATE POLICY "anon_insert_delivery_areas" ON vendor_delivery_areas
  FOR INSERT TO anon
  WITH CHECK (true);

-- 9. vendor_cost_inclusions - allow anonymous insert
CREATE POLICY "anon_insert_cost_inclusions" ON vendor_cost_inclusions
  FOR INSERT TO anon
  WITH CHECK (true);

-- 10. vendor_additional_costs - allow anonymous insert
CREATE POLICY "anon_insert_additional_costs" ON vendor_additional_costs
  FOR INSERT TO anon
  WITH CHECK (true);