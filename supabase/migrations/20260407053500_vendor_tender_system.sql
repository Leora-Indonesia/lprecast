-- ============================================================
-- LPRECAST VENDOR & TENDER SYSTEM MIGRATION
-- Run this in Supabase Dashboard SQL Editor
-- ============================================================

-- ============================================================
-- SECTION 1: Create New Enums
-- ============================================================

-- Registration & Verification Enums
DO $$ BEGIN
  CREATE TYPE vendor_registration_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_requested');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vendor_document_type AS ENUM ('ktp', 'npwp', 'nib', 'siup_sbu', 'company_profile');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Pricing Enums
DO $$ BEGIN
  CREATE TYPE cost_inclusion_type AS ENUM ('mobilisasi_demobilisasi', 'penginapan_tukang', 'biaya_pengiriman', 'biaya_langsir', 'instalasi', 'ppn');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tender Enums
DO $$ BEGIN
  CREATE TYPE tender_status AS ENUM ('open', 'closed', 'cancelled', 'awarded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tender_submission_status AS ENUM ('submitted', 'won', 'lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Project Enums
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE milestone_status AS ENUM ('pending', 'completed', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Payment Enums
DO $$ BEGIN
  CREATE TYPE payment_request_status AS ENUM ('pending', 'finance_verified', 'client_approved', 'paid', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Progress Enums
DO $$ BEGIN
  CREATE TYPE progress_status AS ENUM ('submitted', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Notification Enums
DO $$ BEGIN
  CREATE TYPE notification_category AS ENUM ('vendor', 'tender', 'monitoring', 'payment', 'document', 'rab', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Vendor Profile Status Enum
DO $$ BEGIN
  CREATE TYPE vendor_profile_status AS ENUM ('active', 'suspended', 'blacklisted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- SECTION 2: Alter Existing Tables
-- ============================================================

-- 2.1 vendor_progress - add status, verified_by, verified_at, rejection_notes
ALTER TABLE vendor_progress
ADD COLUMN IF NOT EXISTS status progress_status DEFAULT 'submitted',
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES users(id),
ADD COLUMN IF NOT EXISTS verified_at timestamptz,
ADD COLUMN IF NOT EXISTS rejection_notes text;

-- 2.2 projects - add status, description, start_date, end_date, location
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS status project_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS location varchar(255);

-- 2.3 clients - add user_id
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id);

-- 2.4 vendor_spk - No changes needed, vendor_id is already nullable

-- ============================================================
-- SECTION 3: Create New Tables - Registration & Profile
-- ============================================================

-- 3.1 vendor_registrations
CREATE TABLE IF NOT EXISTS vendor_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES users(id),
  status vendor_registration_status DEFAULT 'draft',
  current_step int DEFAULT 1,
  legal_agreement boolean DEFAULT false,
  submission_date timestamptz,
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  approval_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_registrations_status ON vendor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_vendor_id ON vendor_registrations(vendor_id);

-- 3.2 vendor_company_info
CREATE TABLE IF NOT EXISTS vendor_company_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  nama_perusahaan varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  nama_pic varchar(255) NOT NULL,
  kontak_pic varchar(50) NOT NULL,
  website varchar(255),
  instagram varchar(255),
  facebook varchar(255),
  linkedin varchar(255),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3.3 vendor_contacts
CREATE TABLE IF NOT EXISTS vendor_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  sequence int NOT NULL,
  no_hp varchar(50) NOT NULL,
  nama varchar(255) NOT NULL,
  jabatan varchar(255),
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_max_contacts CHECK (sequence BETWEEN 1 AND 3)
);

-- 3.4 vendor_legal_documents
CREATE TABLE IF NOT EXISTS vendor_legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  document_type vendor_document_type NOT NULL,
  document_number varchar(255),
  file_path text NOT NULL,
  file_name varchar(255) NOT NULL,
  file_size bigint NOT NULL,
  mime_type varchar(100) NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  verification_status document_verification_status DEFAULT 'pending',
  verification_notes text,
  verified_by uuid REFERENCES users(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_legal_documents_verification_status ON vendor_legal_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_vendor_legal_documents_registration_id ON vendor_legal_documents(registration_id);

-- 3.5 vendor_bank_accounts
CREATE TABLE IF NOT EXISTS vendor_bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  bank_name varchar(255) NOT NULL,
  account_number varchar(50) NOT NULL,
  account_holder_name varchar(255) NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 3.6 vendor_factory_addresses
CREATE TABLE IF NOT EXISTS vendor_factory_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  address text NOT NULL,
  province varchar(255),
  kabupaten varchar(255),
  kecamatan varchar(255),
  postal_code varchar(10),
  latitude decimal(10,8),
  longitude decimal(11,8),
  map_url text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 3.7 vendor_products
CREATE TABLE IF NOT EXISTS vendor_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  satuan varchar(50) NOT NULL,
  price decimal(15,2) NOT NULL,
  lead_time_days int,
  moq int,
  dimensions varchar(100),
  material varchar(255),
  finishing varchar(255),
  weight_kg decimal(10,2),
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_products_registration_id ON vendor_products(registration_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_is_active ON vendor_products(is_active);

-- 3.8 vendor_delivery_areas
CREATE TABLE IF NOT EXISTS vendor_delivery_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  provinsi varchar(255),
  kabupaten varchar(255),
  created_at timestamptz DEFAULT now()
);

-- 3.9 vendor_cost_inclusions
CREATE TABLE IF NOT EXISTS vendor_cost_inclusions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  inclusion_type cost_inclusion_type NOT NULL,
  is_included boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 3.10 vendor_additional_costs
CREATE TABLE IF NOT EXISTS vendor_additional_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  description varchar(255) NOT NULL,
  amount decimal(15,2) NOT NULL,
  unit varchar(50),
  created_at timestamptz DEFAULT now()
);

-- 3.11 vendor_registration_history
CREATE TABLE IF NOT EXISTS vendor_registration_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES vendor_registrations(id) ON DELETE CASCADE,
  action vendor_registration_status NOT NULL,
  action_by uuid NOT NULL REFERENCES users(id),
  notes text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now()
);

-- 3.12 vendor_profiles
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  registration_id uuid REFERENCES vendor_registrations(id),
  status vendor_profile_status DEFAULT 'active',
  preferred_vendor boolean DEFAULT false,
  approved_at timestamptz,
  approved_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- SECTION 4: Create New Tables - Tender
-- ============================================================

-- 4.1 tenders
CREATE TABLE IF NOT EXISTS tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  title varchar(255) NOT NULL,
  description text,
  status tender_status DEFAULT 'open',
  min_vendors int DEFAULT 2,
  revision_deadline_hours int DEFAULT 24,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_project_id ON tenders(project_id);

-- 4.2 tender_items
CREATE TABLE IF NOT EXISTS tender_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  quantity decimal(15,2),
  unit varchar(50),
  description text,
  created_at timestamptz DEFAULT now()
);

-- 4.3 tender_submissions
CREATE TABLE IF NOT EXISTS tender_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES tenders(id),
  vendor_id uuid NOT NULL REFERENCES users(id),
  status tender_submission_status DEFAULT 'submitted',
  revision_count int DEFAULT 0,
  last_revised_at timestamptz,
  is_revised boolean DEFAULT false,
  notes text,
  attachments jsonb,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tender_submissions_tender_id ON tender_submissions(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_submissions_vendor_id ON tender_submissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tender_submissions_status ON tender_submissions(status);

-- 4.4 tender_submission_items
CREATE TABLE IF NOT EXISTS tender_submission_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES tender_submissions(id) ON DELETE CASCADE,
  tender_item_id uuid NOT NULL REFERENCES tender_items(id),
  unit_price decimal(15,2) NOT NULL,
  total_price decimal(15,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4.5 tender_submission_history
CREATE TABLE IF NOT EXISTS tender_submission_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES tender_submissions(id) ON DELETE CASCADE,
  revised_by uuid NOT NULL REFERENCES users(id),
  revision_count int NOT NULL,
  snapshot jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- SECTION 5: Create New Tables - Monitoring
-- ============================================================

-- 5.1 project_milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  title varchar(255) NOT NULL,
  description text,
  due_date date NOT NULL,
  completed_at timestamptz,
  status milestone_status DEFAULT 'pending',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- SECTION 6: Create New Tables - Notifications
-- ============================================================

-- 6.1 notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  type varchar(100) NOT NULL,
  category notification_category NOT NULL,
  title varchar(255) NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  reference_id uuid,
  reference_type varchar(100),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);

-- ============================================================
-- SECTION 7: Create New Tables - Post-MVP Scaffold
-- ============================================================

-- 7.1 payment_requests
CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_spk_id uuid NOT NULL REFERENCES vendor_spk(id),
  requested_by uuid NOT NULL REFERENCES users(id),
  amount decimal(15,2) NOT NULL,
  status payment_request_status DEFAULT 'pending',
  finance_verified_by uuid REFERENCES users(id),
  finance_verified_at timestamptz,
  client_approved_by uuid REFERENCES users(id),
  client_approved_at timestamptz,
  notes text,
  attachments jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_vendor_spk_id ON payment_requests(vendor_spk_id);

-- 7.2 vendor_kpi_scores
CREATE TABLE IF NOT EXISTS vendor_kpi_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES users(id),
  project_id uuid NOT NULL REFERENCES projects(id),
  period_month int NOT NULL,
  period_year int NOT NULL,
  score_upload_timeliness decimal(5,2),
  score_report_completeness decimal(5,2),
  score_quality decimal(5,2),
  score_responsiveness decimal(5,2),
  score_client_satisfaction decimal(5,2),
  total_score decimal(5,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(vendor_id, project_id, period_month, period_year)
);

-- ============================================================
-- SECTION 8: Enable RLS on All Tables
-- ============================================================

ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_factory_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_cost_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_additional_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_registration_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_submission_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_submission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_kpi_scores ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECTION 9: Create RLS Policies
-- ============================================================

-- 9.1 vendor_registrations policies
CREATE POLICY "vendors_can_insert_registrations" ON vendor_registrations
  FOR INSERT WITH CHECK (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "vendors_can_view_own_registrations" ON vendor_registrations
  FOR SELECT USING (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "vendors_can_update_own_registrations" ON vendor_registrations
  FOR UPDATE USING (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "internal_full_access_vendor_registrations" ON vendor_registrations
  FOR ALL USING (is_internal_user());

-- 9.2 vendor_company_info policies
CREATE POLICY "vendors_view_company_info" ON vendor_company_info
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_company_info" ON vendor_company_info
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_company_info" ON vendor_company_info
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_company_info" ON vendor_company_info
  FOR ALL USING (is_internal_user());

-- 9.3 vendor_contacts policies
CREATE POLICY "vendors_view_contacts" ON vendor_contacts
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_contacts" ON vendor_contacts
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_contacts" ON vendor_contacts
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_delete_contacts" ON vendor_contacts
  FOR DELETE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_contacts" ON vendor_contacts
  FOR ALL USING (is_internal_user());

-- 9.4 vendor_legal_documents policies
CREATE POLICY "vendors_view_legal_docs" ON vendor_legal_documents
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_legal_docs" ON vendor_legal_documents
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_legal_docs" ON vendor_legal_documents
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_legal_docs" ON vendor_legal_documents
  FOR ALL USING (is_internal_user());

-- 9.5 vendor_bank_accounts policies
CREATE POLICY "vendors_view_bank_accounts" ON vendor_bank_accounts
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_bank_accounts" ON vendor_bank_accounts
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_bank_accounts" ON vendor_bank_accounts
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_delete_bank_accounts" ON vendor_bank_accounts
  FOR DELETE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_bank_accounts" ON vendor_bank_accounts
  FOR ALL USING (is_internal_user());

-- 9.6 vendor_factory_addresses policies
CREATE POLICY "vendors_view_factory_addresses" ON vendor_factory_addresses
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_factory_addresses" ON vendor_factory_addresses
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_factory_addresses" ON vendor_factory_addresses
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_delete_factory_addresses" ON vendor_factory_addresses
  FOR DELETE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_factory_addresses" ON vendor_factory_addresses
  FOR ALL USING (is_internal_user());

-- 9.7 vendor_products policies
CREATE POLICY "vendors_view_products" ON vendor_products
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_products" ON vendor_products
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_products" ON vendor_products
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_delete_products" ON vendor_products
  FOR DELETE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_vendor_products" ON vendor_products
  FOR ALL USING (is_internal_user());

-- 9.8 vendor_delivery_areas policies
CREATE POLICY "vendors_view_delivery_areas" ON vendor_delivery_areas
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_delivery_areas" ON vendor_delivery_areas
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_delete_delivery_areas" ON vendor_delivery_areas
  FOR DELETE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_delivery_areas" ON vendor_delivery_areas
  FOR ALL USING (is_internal_user());

-- 9.9 vendor_cost_inclusions policies
CREATE POLICY "vendors_view_cost_inclusions" ON vendor_cost_inclusions
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_cost_inclusions" ON vendor_cost_inclusions
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_cost_inclusions" ON vendor_cost_inclusions
  FOR UPDATE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_cost_inclusions" ON vendor_cost_inclusions
  FOR ALL USING (is_internal_user());

-- 9.10 vendor_additional_costs policies
CREATE POLICY "vendors_view_additional_costs" ON vendor_additional_costs
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_additional_costs" ON vendor_additional_costs
  FOR INSERT WITH CHECK (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_delete_additional_costs" ON vendor_additional_costs
  FOR DELETE USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_additional_costs" ON vendor_additional_costs
  FOR ALL USING (is_internal_user());

-- 9.11 vendor_registration_history policies
CREATE POLICY "vendors_view_own_history" ON vendor_registration_history
  FOR SELECT USING (
    is_vendor() AND
    registration_id IN (SELECT id FROM vendor_registrations WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_registration_history" ON vendor_registration_history
  FOR ALL USING (is_internal_user());

-- 9.12 vendor_profiles policies
CREATE POLICY "vendors_view_own_profile" ON vendor_profiles
  FOR SELECT USING (is_vendor() AND user_id = current_user_id());

CREATE POLICY "internal_full_access_vendor_profiles" ON vendor_profiles
  FOR ALL USING (is_internal_user());

-- 9.13 tenders policies
CREATE POLICY "authenticated_view_open_tenders" ON tenders
  FOR SELECT USING (auth.role() = 'authenticated' AND status = 'open');

CREATE POLICY "internal_view_all_tenders" ON tenders
  FOR SELECT USING (is_internal_user());

CREATE POLICY "internal_manage_tenders" ON tenders
  FOR INSERT WITH CHECK (is_internal_user());

CREATE POLICY "internal_update_tenders" ON tenders
  FOR UPDATE USING (is_internal_user());

-- 9.14 tender_items policies
CREATE POLICY "authenticated_view_tender_items" ON tender_items
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    tender_id IN (SELECT id FROM tenders WHERE status = 'open')
  );

CREATE POLICY "internal_view_all_tender_items" ON tender_items
  FOR SELECT USING (is_internal_user());

CREATE POLICY "internal_manage_tender_items" ON tender_items
  FOR ALL USING (is_internal_user());

-- 9.15 tender_submissions policies
CREATE POLICY "vendors_view_own_submissions" ON tender_submissions
  FOR SELECT USING (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "vendors_insert_submissions" ON tender_submissions
  FOR INSERT WITH CHECK (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "vendors_update_own_submissions" ON tender_submissions
  FOR UPDATE USING (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "internal_full_access_submissions" ON tender_submissions
  FOR ALL USING (is_internal_user());

-- 9.16 tender_submission_items policies
CREATE POLICY "vendors_view_own_submission_items" ON tender_submission_items
  FOR SELECT USING (
    is_vendor() AND
    submission_id IN (SELECT id FROM tender_submissions WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_insert_submission_items" ON tender_submission_items
  FOR INSERT WITH CHECK (
    is_vendor() AND
    submission_id IN (SELECT id FROM tender_submissions WHERE vendor_id = current_user_id())
  );

CREATE POLICY "vendors_update_submission_items" ON tender_submission_items
  FOR UPDATE USING (
    is_vendor() AND
    submission_id IN (SELECT id FROM tender_submissions WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_submission_items" ON tender_submission_items
  FOR ALL USING (is_internal_user());

-- 9.17 tender_submission_history policies
CREATE POLICY "vendors_view_own_submission_history" ON tender_submission_history
  FOR SELECT USING (
    is_vendor() AND
    submission_id IN (SELECT id FROM tender_submissions WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_submission_history" ON tender_submission_history
  FOR ALL USING (is_internal_user());

-- 9.18 project_milestones policies
CREATE POLICY "internal_full_access_milestones" ON project_milestones
  FOR ALL USING (is_internal_user());

CREATE POLICY "vendors_view_project_milestones" ON project_milestones
  FOR SELECT USING (
    is_vendor() AND
    project_id IN (
      SELECT project_id FROM vendor_spk WHERE vendor_id = current_user_id()
    )
  );

-- 9.19 notifications policies
CREATE POLICY "users_view_own_notifications" ON notifications
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "users_update_own_notifications" ON notifications
  FOR UPDATE USING (user_id = current_user_id());

CREATE POLICY "internal_insert_notifications" ON notifications
  FOR INSERT WITH CHECK (is_internal_user());

-- 9.20 payment_requests policies
CREATE POLICY "vendors_view_own_payment_requests" ON payment_requests
  FOR SELECT USING (
    is_vendor() AND
    vendor_spk_id IN (SELECT id FROM vendor_spk WHERE vendor_id = current_user_id())
  );

CREATE POLICY "internal_full_access_payment_requests" ON payment_requests
  FOR ALL USING (is_internal_user());

-- 9.21 vendor_kpi_scores policies
CREATE POLICY "vendors_view_own_kpi_scores" ON vendor_kpi_scores
  FOR SELECT USING (is_vendor() AND vendor_id = current_user_id());

CREATE POLICY "internal_full_access_kpi_scores" ON vendor_kpi_scores
  FOR ALL USING (is_internal_user());

-- ============================================================
-- SECTION 10: Create Update Timestamp Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to vendor_registrations
DROP TRIGGER IF EXISTS update_vendor_registrations_updated_at ON vendor_registrations;
CREATE TRIGGER update_vendor_registrations_updated_at
  BEFORE UPDATE ON vendor_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to vendor_company_info
DROP TRIGGER IF EXISTS update_vendor_company_info_updated_at ON vendor_company_info;
CREATE TRIGGER update_vendor_company_info_updated_at
  BEFORE UPDATE ON vendor_company_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to vendor_products
DROP TRIGGER IF EXISTS update_vendor_products_updated_at ON vendor_products;
CREATE TRIGGER update_vendor_products_updated_at
  BEFORE UPDATE ON vendor_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to vendor_profiles
DROP TRIGGER IF EXISTS update_vendor_profiles_updated_at ON vendor_profiles;
CREATE TRIGGER update_vendor_profiles_updated_at
  BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to tenders
DROP TRIGGER IF EXISTS update_tenders_updated_at ON tenders;
CREATE TRIGGER update_tenders_updated_at
  BEFORE UPDATE ON tenders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to tender_submissions
DROP TRIGGER IF EXISTS update_tender_submissions_updated_at ON tender_submissions;
CREATE TRIGGER update_tender_submissions_updated_at
  BEFORE UPDATE ON tender_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to project_milestones
DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON project_milestones;
CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to payment_requests
DROP TRIGGER IF EXISTS update_payment_requests_updated_at ON payment_requests;
CREATE TRIGGER update_payment_requests_updated_at
  BEFORE UPDATE ON payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
