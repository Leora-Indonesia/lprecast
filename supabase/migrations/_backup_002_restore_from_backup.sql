-- ============================================
-- RESTORE: Kembalikan tabel dari backup_ ke nama asli
-- ============================================
-- Jalankan script ini jika ada ERROR di ERP setelah migrasi
-- Ini akan mengembalikan semua tabel LPrecast ke state semula
-- ============================================

-- Master Data Tables
ALTER TABLE backup_master_provinces RENAME TO master_provinces;
ALTER TABLE backup_master_cities RENAME TO master_cities;

-- Vendor Tables
ALTER TABLE backup_vendor_registrations RENAME TO vendor_registrations;
ALTER TABLE backup_vendor_profiles RENAME TO vendor_profiles;
ALTER TABLE backup_vendor_company_info RENAME TO vendor_company_info;
ALTER TABLE backup_vendor_contacts RENAME TO vendor_contacts;
ALTER TABLE backup_vendor_legal_documents RENAME TO vendor_legal_documents;
ALTER TABLE backup_vendor_bank_accounts RENAME TO vendor_bank_accounts;
ALTER TABLE backup_vendor_factory_addresses RENAME TO vendor_factory_addresses;
ALTER TABLE backup_vendor_products RENAME TO vendor_products;
ALTER TABLE backup_vendor_delivery_areas RENAME TO vendor_delivery_areas;
ALTER TABLE backup_vendor_cost_inclusions RENAME TO vendor_cost_inclusions;
ALTER TABLE backup_vendor_additional_costs RENAME TO vendor_additional_costs;
ALTER TABLE backup_vendor_registration_history RENAME TO vendor_registration_history;

-- Project Tables
ALTER TABLE backup_projects RENAME TO projects;
ALTER TABLE backup_project_milestones RENAME TO project_milestones;

-- Tender Tables
ALTER TABLE backup_tenders RENAME TO tenders;
ALTER TABLE backup_tender_items RENAME TO tender_items;
ALTER TABLE backup_tender_submissions RENAME TO tender_submissions;
ALTER TABLE backup_tender_submission_history RENAME TO tender_submission_history;
ALTER TABLE backup_tender_submission_items RENAME TO tender_submission_items;

-- Transaction Tables
ALTER TABLE backup_vendor_spk RENAME TO vendor_spk;
ALTER TABLE backup_vendor_progress RENAME TO vendor_progress;
ALTER TABLE backup_vendor_payment RENAME TO vendor_payment;
ALTER TABLE backup_vendor_kpi_scores RENAME TO vendor_kpi_scores;
ALTER TABLE backup_payment_requests RENAME TO payment_requests;
ALTER TABLE backup_notifications RENAME TO notifications;

-- Recreate view
CREATE OR REPLACE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.customer_name,
    p.contract_value,
    p.status,
    p.project_progress,
    p.total_spk,
    p.vendor_paid,
    p.vendor_outstanding,
    p.customer_paid,
    p.customer_outstanding
FROM projects p;

-- ============================================
-- VERIFIKASI
-- ============================================
-- Jalankan query ini untuk verifikasi:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'backup_%';
