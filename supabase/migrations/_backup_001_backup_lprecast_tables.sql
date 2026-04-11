-- ============================================
-- STEP 1: BACKUP TABEL LPRECAST DI DATABASE ERP
-- ============================================
-- Script ini rename tabel LPrecast dengan prefix "backup_"
-- JANGAN jalankan script ini jika ada user/vendor existing yang perlu di-migrate!
--
-- ⚠️  PENTING: users dan user_profiles TIDAK di-rename karena dipakai ERP juga
-- ============================================

-- Master Data Tables (dipakai LPrecast)
ALTER TABLE master_provinces RENAME TO backup_master_provinces;
ALTER TABLE master_cities RENAME TO backup_master_cities;

-- Vendor Tables (semua yang berelasi dengan vendor_registrations)
ALTER TABLE vendor_registrations RENAME TO backup_vendor_registrations;
ALTER TABLE vendor_profiles RENAME TO backup_vendor_profiles;
ALTER TABLE vendor_company_info RENAME TO backup_vendor_company_info;
ALTER TABLE vendor_contacts RENAME TO backup_vendor_contacts;
ALTER TABLE vendor_legal_documents RENAME TO backup_vendor_legal_documents;
ALTER TABLE vendor_bank_accounts RENAME TO backup_vendor_bank_accounts;
ALTER TABLE vendor_factory_addresses RENAME TO backup_vendor_factory_addresses;
ALTER TABLE vendor_products RENAME TO backup_vendor_products;
ALTER TABLE vendor_delivery_areas RENAME TO backup_vendor_delivery_areas;
ALTER TABLE vendor_cost_inclusions RENAME TO backup_vendor_cost_inclusions;
ALTER TABLE vendor_additional_costs RENAME TO backup_vendor_additional_costs;
ALTER TABLE vendor_registration_history RENAME TO backup_vendor_registration_history;

-- Project Tables
ALTER TABLE projects RENAME TO backup_projects;
ALTER TABLE project_milestones RENAME TO backup_project_milestones;
DROP VIEW IF EXISTS project_summary;

-- Tender Tables (Epic 4-5)
ALTER TABLE tenders RENAME TO backup_tenders;
ALTER TABLE tender_items RENAME TO backup_tender_items;
ALTER TABLE tender_submissions RENAME TO backup_tender_submissions;
ALTER TABLE tender_submission_history RENAME TO backup_tender_submission_history;
ALTER TABLE tender_submission_items RENAME TO backup_tender_submission_items;

-- Transaction Tables (Epic 4-5)
ALTER TABLE vendor_spk RENAME TO backup_vendor_spk;
ALTER TABLE vendor_progress RENAME TO backup_vendor_progress;
ALTER TABLE vendor_payment RENAME TO backup_vendor_payment;
ALTER TABLE vendor_kpi_scores RENAME TO backup_vendor_kpi_scores;
ALTER TABLE payment_requests RENAME TO backup_payment_requests;
ALTER TABLE notifications RENAME TO backup_notifications;

-- ============================================
-- TABEL YANG TIDAK DI-RENAME (DIPERTAHANKAN DI ERP)
-- ============================================
-- users              - SHARED, dipakai ERP dan LPrecast
-- user_profiles     - VIEW dari users
-- clients           - ERP saja
-- customer_payment  - ERP saja
-- departments       - ERP saja
-- department_permissions - ERP saja
-- document_types    - ERP saja
-- document_workflow_stages - ERP saja
-- instansi          - ERP saja
-- letter_histories  - ERP saja
-- outgoing_letters  - ERP saja
-- master_ongkir     - ERP saja
-- master_ongkir_backup - ERP saja
-- master_panel      - ERP saja
-- mom_meetings      - ERP saja
-- rab_documents     - ERP saja
-- rab_documents_backup - ERP saja
-- roles             - ERP saja

-- ============================================
-- VERIFIKASI
-- ============================================
-- Jalankan query ini untuk verifikasi:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'backup_%';
