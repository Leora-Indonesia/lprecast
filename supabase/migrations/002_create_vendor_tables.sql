-- ============================================================
-- STEP 2: Create new vendor tables with user_id FK
-- Date: 2026-04-16
-- Design: All tables link directly to users.id (user_id)
-- ============================================================

BEGIN;

-- Table: vendor_onboarding_drafts
-- Purpose: Store draft onboarding data for resume later
CREATE TABLE vendor_onboarding_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    draft_data JSONB NOT NULL DEFAULT '{}',
    current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 4),
    last_saved_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

COMMENT ON TABLE vendor_onboarding_drafts IS 'Stores draft onboarding data for vendor registration. Allows users to save progress and resume later.';

-- Table: vendor_registrations
-- Purpose: Main registration record tracking approval status
CREATE TABLE vendor_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    approval_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

COMMENT ON TABLE vendor_registrations IS 'Main registration record. One record per vendor user. Status tracks approval workflow.';

-- Table: vendor_profiles
-- Purpose: Vendor company profile - created after approval
CREATE TABLE vendor_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_perusahaan VARCHAR(255) NOT NULL,
    email_perusahaan VARCHAR(255),
    nama_pic VARCHAR(255) NOT NULL,
    kontak_pic VARCHAR(50),
    website VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    linkedin VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'inactive' 
        CHECK (status IN ('active', 'inactive', 'suspended', 'blacklisted')),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE vendor_profiles IS 'Vendor company profile. Created when admin approves registration.';

-- Table: vendor_documents
-- Purpose: Legal documents uploaded during onboarding
CREATE TABLE vendor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL 
        CHECK (document_type IN ('ktp', 'npwp', 'nib', 'siup_sbu', 'company_profile', 'other')),
    document_number VARCHAR(100),
    file_path TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE vendor_documents IS 'Legal and company documents uploaded by vendor during onboarding.';

-- Table: vendor_contacts
-- Purpose: Company contacts (up to 3)
CREATE TABLE vendor_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL CHECK (sequence BETWEEN 1 AND 3),
    nama VARCHAR(255) NOT NULL,
    no_hp VARCHAR(50),
    jabatan VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, sequence)
);

COMMENT ON TABLE vendor_contacts IS 'Company contacts. Max 3 contacts per vendor.';

-- Table: vendor_bank_accounts
-- Purpose: Bank account information
CREATE TABLE vendor_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE vendor_bank_accounts IS 'Vendor bank account information for payments.';

-- Table: vendor_factory_addresses
-- Purpose: Factory/warehouse location
CREATE TABLE vendor_factory_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT,
    province VARCHAR(100),
    kabupaten VARCHAR(100),
    kecamatan VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    map_url TEXT,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE vendor_factory_addresses IS 'Factory or warehouse location of vendor.';

-- Table: vendor_products
-- Purpose: Products offered by vendor
CREATE TABLE vendor_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    satuan VARCHAR(50) NOT NULL,
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    dimensions VARCHAR(100),
    material VARCHAR(100),
    finishing VARCHAR(100),
    weight_kg DECIMAL(10, 3),
    lead_time_days INTEGER,
    moq INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE vendor_products IS 'Products or services offered by vendor.';

-- Table: vendor_delivery_areas
-- Purpose: Areas where vendor can deliver
CREATE TABLE vendor_delivery_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    province_id VARCHAR(10),
    province_name VARCHAR(100),
    city_id VARCHAR(10),
    city_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, province_id, city_id)
);

COMMENT ON TABLE vendor_delivery_areas IS 'Geographic areas where vendor can deliver products.';

-- Table: vendor_cost_inclusions
-- Purpose: What's included in product pricing
CREATE TABLE vendor_cost_inclusions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    inclusion_type VARCHAR(50) NOT NULL 
        CHECK (inclusion_type IN (
            'mobilisasi_demobilisasi',
            'penginapan_tukang',
            'biaya_pengiriman',
            'biaya_langsir',
            'instalasi',
            'ppn'
        )),
    is_included BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, inclusion_type)
);

COMMENT ON TABLE vendor_cost_inclusions IS 'Cost inclusions in vendor pricing (mobilization, accommodation, delivery, etc).';

-- Table: vendor_additional_costs
-- Purpose: Additional costs that may be charged
CREATE TABLE vendor_additional_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE vendor_additional_costs IS 'Additional costs that vendor may charge beyond base product price.';

COMMIT;
