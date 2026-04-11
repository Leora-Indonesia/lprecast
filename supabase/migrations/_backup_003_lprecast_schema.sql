-- ============================================
-- LPRECAST SCHEMA - Database Baru (Project Baru)
-- ============================================
-- Jalankan script ini di SQL Editor Supabase project BARU
-- setelah project dibuat
--
-- NOTE: Master data (master_provinces, master_cities) akan di-import
-- secara terpisah menggunakan CSV export/import
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE cost_inclusion_type AS ENUM (
    'mobilisasi_demobilisasi',
    'penginapan_tukang',
    'biaya_pengiriman',
    'biaya_langsir',
    'instalasi',
    'ppn'
);

CREATE TYPE customer_payment_termin AS ENUM ('dp', 'term', 'final');

CREATE TYPE document_verification_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TYPE kebutuhan_type AS ENUM (
    'Pagar', 'Gudang', 'Kos/Kontrakan', 'Toko/Ruko', 'Rumah',
    'Villa', 'Hotel', 'Rumah Sakit', 'Panel Saja', 'U-Ditch',
    'Plastik Board', 'Lapangan', 'Sekolah', 'Kantor', 'Tahu Beton'
);

CREATE TYPE letter_action_type AS ENUM (
    'CREATED', 'SUBMITTED', 'APPROVED_REVIEW', 'APPROVED_FINAL',
    'REJECTED', 'REVISION_REQUESTED', 'REVISED', 'CANCELLED'
);

CREATE TYPE letter_status AS ENUM (
    'DRAFT', 'SUBMITTED_TO_REVIEW', 'REVIEWED', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED'
);

CREATE TYPE meeting_status_enum AS ENUM ('draft', 'published');
CREATE TYPE meeting_type_enum AS ENUM ('internal', 'external');

CREATE TYPE milestone_status AS ENUM ('pending', 'completed', 'overdue');

CREATE TYPE notification_category AS ENUM (
    'vendor', 'tender', 'monitoring', 'payment', 'document', 'rab', 'general'
);

CREATE TYPE payment_request_status AS ENUM (
    'pending', 'finance_verified', 'client_approved', 'paid', 'rejected'
);

CREATE TYPE produk_type AS ENUM (
    'Panel Beton', 'Pagar Beton', 'Sandwich Panel', 'Panel Surya',
    'Plastik Board', 'Ponton Terapung', 'Jasa Konstruksi', 'Jasa Renovasi',
    'Jasa RAB/Gambar', 'U-Ditch', 'Tahu Beton'
);

CREATE TYPE progress_status AS ENUM ('submitted', 'approved', 'rejected');

CREATE TYPE project_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');

CREATE TYPE sales_stage AS ENUM (
    'IG_Lead', 'WA_Negotiation', 'Quotation_Sent', 'Follow_Up',
    'Invoice_Deal', 'WIP', 'Finish', 'Cancelled'
);

CREATE TYPE stakeholder_type AS ENUM ('internal', 'vendor', 'client');

CREATE TYPE tender_status AS ENUM ('open', 'closed', 'cancelled', 'awarded');

CREATE TYPE tender_submission_status AS ENUM ('submitted', 'won', 'lost');

CREATE TYPE vendor_document_type AS ENUM ('ktp', 'npwp', 'nib', 'siup_sbu', 'company_profile');

CREATE TYPE vendor_payment_jenis AS ENUM ('dp', 'term', 'pelunasan');

CREATE TYPE vendor_profile_status AS ENUM ('active', 'suspended', 'blacklisted');

CREATE TYPE vendor_registration_status AS ENUM (
    'draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_requested'
);

CREATE TYPE vendor_spk_status AS ENUM ('active', 'completed');

-- ============================================
-- MASTER DATA TABLES
-- Schema only - data akan di-import dari CSV
-- ============================================

CREATE TABLE master_provinces (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE master_cities (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    province_id TEXT NOT NULL REFERENCES master_provinces(id),
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS TABLE (Fresh untuk LPrecast)
-- ============================================

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    signature_image TEXT,
    nik TEXT,
    no_hp TEXT,
    jabatan TEXT,
    stakeholder_type stakeholder_type NOT NULL DEFAULT 'vendor',
    is_active BOOLEAN DEFAULT TRUE,
    is_approver_eligible BOOLEAN DEFAULT FALSE,
    is_reviewer_eligible BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- View user_profiles untuk compatibility (simplified for LPrecast)
CREATE VIEW user_profiles AS
SELECT 
    id,
    email,
    nama,
    username,
    avatar_url,
    signature_image,
    nik,
    no_hp,
    jabatan,
    stakeholder_type,
    is_active,
    is_approver_eligible,
    is_reviewer_eligible,
    last_login_at,
    created_at,
    updated_at
FROM users;

-- ============================================
-- VENDOR REGISTRATION TABLES
-- ============================================

CREATE TABLE vendor_registrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    vendor_id TEXT REFERENCES users(id),
    status vendor_registration_status DEFAULT 'draft',
    current_step INTEGER DEFAULT 1,
    legal_agreement BOOLEAN DEFAULT FALSE,
    submission_date TIMESTAMPTZ,
    reviewed_by TEXT REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    approval_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
    registration_id TEXT REFERENCES vendor_registrations(id),
    status vendor_profile_status DEFAULT 'active',
    preferred_vendor BOOLEAN DEFAULT FALSE,
    approved_by TEXT REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_company_info (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    nama_perusahaan TEXT NOT NULL,
    nama_pic TEXT NOT NULL,
    kontak_pic TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    instagram TEXT,
    facebook TEXT,
    linkedin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    nama TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sequence INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_bank_accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_factory_addresses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    address TEXT NOT NULL,
    kecamatan TEXT,
    kabupaten TEXT,
    province TEXT,
    postal_code TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    map_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_legal_documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    document_type vendor_document_type NOT NULL,
    document_number TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    verification_status document_verification_status DEFAULT 'pending',
    verification_notes TEXT,
    verified_by TEXT REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    name TEXT NOT NULL,
    description TEXT,
    material TEXT,
    finishing TEXT,
    dimensions TEXT,
    weight_kg DOUBLE PRECISION,
    price NUMERIC NOT NULL,
    satuan TEXT NOT NULL,
    moq INTEGER,
    lead_time_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_delivery_areas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    province_id TEXT REFERENCES master_provinces(id),
    city_id TEXT REFERENCES master_cities(id),
    provinsi TEXT,
    kabupaten TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_cost_inclusions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    inclusion_type cost_inclusion_type NOT NULL,
    is_included BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_additional_costs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    unit TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_registration_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    registration_id TEXT NOT NULL REFERENCES vendor_registrations(id),
    action vendor_registration_status NOT NULL,
    action_by TEXT NOT NULL REFERENCES users(id),
    old_values JSONB,
    new_values JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT TABLES
-- ============================================

CREATE TABLE projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    contract_value NUMERIC NOT NULL DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status project_status DEFAULT 'draft',
    client_id TEXT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_milestones (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    project_id TEXT NOT NULL REFERENCES projects(id),
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status milestone_status DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- View project_summary (simplified - no computed columns)
CREATE VIEW project_summary AS
SELECT 
    id,
    name,
    customer_name,
    contract_value,
    status,
    created_at,
    updated_at
FROM projects;

-- ============================================
-- TENDER TABLES (Epic 4-5)
-- ============================================

CREATE TABLE tenders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    project_id TEXT NOT NULL REFERENCES projects(id),
    title TEXT NOT NULL,
    description TEXT,
    min_vendors INTEGER DEFAULT 2,
    revision_deadline_hours INTEGER DEFAULT 48,
    status tender_status DEFAULT 'open',
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tender_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    tender_id TEXT NOT NULL REFERENCES tenders(id),
    name TEXT NOT NULL,
    description TEXT,
    quantity NUMERIC NOT NULL,
    unit TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tender_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    tender_id TEXT NOT NULL REFERENCES tenders(id),
    vendor_id TEXT NOT NULL REFERENCES users(id),
    notes TEXT,
    attachments JSONB,
    status tender_submission_status DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ,
    revision_count INTEGER DEFAULT 0,
    is_revised BOOLEAN DEFAULT FALSE,
    last_revised_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tender_submission_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_id TEXT NOT NULL REFERENCES tender_submissions(id),
    tender_item_id TEXT NOT NULL REFERENCES tender_items(id),
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tender_submission_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_id TEXT NOT NULL REFERENCES tender_submissions(id),
    revision_count INTEGER NOT NULL,
    snapshot JSONB NOT NULL,
    revised_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTION TABLES (Epic 4-5)
-- ============================================

CREATE TABLE vendor_spk (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    project_id TEXT NOT NULL REFERENCES projects(id),
    vendor_id TEXT REFERENCES users(id),
    vendor_name TEXT NOT NULL,
    pekerjaan TEXT NOT NULL,
    nilai_spk NUMERIC NOT NULL DEFAULT 0,
    status vendor_spk_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_progress (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    vendor_spk_id TEXT NOT NULL REFERENCES vendor_spk(id),
    tanggal DATE NOT NULL,
    progress_percent NUMERIC NOT NULL,
    catatan TEXT,
    lampiran JSONB,
    status progress_status DEFAULT 'submitted',
    verified_by TEXT REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_payment (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    vendor_spk_id TEXT NOT NULL REFERENCES vendor_spk(id),
    tanggal_pembayaran DATE NOT NULL,
    jenis_pembayaran vendor_payment_jenis NOT NULL,
    jumlah NUMERIC NOT NULL,
    catatan TEXT,
    lampiran JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_kpi_scores (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    vendor_id TEXT NOT NULL REFERENCES users(id),
    project_id TEXT NOT NULL REFERENCES projects(id),
    period_month INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    score_quality NUMERIC,
    score_responsiveness NUMERIC,
    score_report_completeness NUMERIC,
    score_upload_timeliness NUMERIC,
    score_client_satisfaction NUMERIC,
    total_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    vendor_spk_id TEXT NOT NULL REFERENCES vendor_spk(id),
    requested_by TEXT NOT NULL REFERENCES users(id),
    amount NUMERIC NOT NULL,
    notes TEXT,
    attachments JSONB,
    status payment_request_status DEFAULT 'pending',
    finance_verified_by TEXT REFERENCES users(id),
    finance_verified_at TIMESTAMPTZ,
    client_approved_by TEXT REFERENCES users(id),
    client_approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL,
    category notification_category NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    reference_id TEXT,
    reference_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_vendor_registrations_vendor_id ON vendor_registrations(vendor_id);
CREATE INDEX idx_vendor_registrations_status ON vendor_registrations(status);
CREATE INDEX idx_vendor_profiles_user_id ON vendor_profiles(user_id);
CREATE INDEX idx_vendor_legal_documents_registration_id ON vendor_legal_documents(registration_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_tenders_project_id ON tenders(project_id);
CREATE INDEX idx_tender_submissions_tender_id ON tender_submissions(tender_id);
CREATE INDEX idx_tender_submissions_vendor_id ON tender_submissions(vendor_id);
CREATE INDEX idx_vendor_spk_project_id ON vendor_spk(project_id);
CREATE INDEX idx_vendor_progress_vendor_spk_id ON vendor_progress(vendor_spk_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_master_cities_province_id ON master_cities(province_id);
CREATE INDEX idx_users_stakeholder_type ON users(stakeholder_type);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendor_registrations_updated_at
    BEFORE UPDATE ON vendor_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendor_profiles_updated_at
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendor_company_info_updated_at
    BEFORE UPDATE ON vendor_company_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendor_products_updated_at
    BEFORE UPDATE ON vendor_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_project_milestones_updated_at
    BEFORE UPDATE ON project_milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_tenders_updated_at
    BEFORE UPDATE ON tenders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_tender_submissions_updated_at
    BEFORE UPDATE ON tender_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendor_spk_updated_at
    BEFORE UPDATE ON vendor_spk
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_payment_requests_updated_at
    BEFORE UPDATE ON payment_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CUSTOM FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_permissions()
RETURNS JSONB AS $$
BEGIN
    -- LPrecast doesn't use role-based permissions
    -- Permissions are handled via stakeholder_type (vendor, client, internal)
    RETURN '{}';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_has_permission(p_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    perms JSONB;
BEGIN
    perms := get_user_permissions();
    RETURN perms->>p_permission = 'true';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_vendor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT stakeholder_type FROM users WHERE id = current_user_id()) = 'vendor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_client()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT stakeholder_type FROM users WHERE id = current_user_id()) = 'client';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_internal_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT stakeholder_type FROM users WHERE id = current_user_id()) = 'internal';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMPLETED
-- ============================================
