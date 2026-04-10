-- ============================================
-- CLEANUP: Hapus tabel backup_ setelah migrasi stabil
-- ============================================
-- Jalankan script ini HANYA setelah:
-- 1. Database LPrecast baru berjalan normal
-- 2. ERP tidak ada error setelah rename tabel
-- 3. Aplikasi LPrecast berfungsi dengan baik
--
-- ⚠️  PERINGATAN: Script ini akan DELETE DATA secara permanen!
-- ============================================

-- ============================================
-- VERIFIKASI SEBELUM CLEANUP
-- ============================================

-- Jalankan query ini dulu untuk verifikasi:
-- SELECT 'Backup Tables:' as info;
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'backup_%';

-- Verifikasi bahwa LPrecast database sudah berjalan:
-- SELECT 'Tables in LPrecast DB:' as info;
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'backup_%' ORDER BY tablename;

-- ============================================
-- DROP BACKUP TABLES
-- ============================================

-- Drop dalam urutan yang benar (child tables dulu)

-- Tender submission tables
DROP TABLE IF EXISTS backup_tender_submission_items;
DROP TABLE IF EXISTS backup_tender_submission_history;
DROP TABLE IF EXISTS backup_tender_submissions;

-- Tender tables
DROP TABLE IF EXISTS backup_tender_items;
DROP TABLE IF EXISTS backup_tenders;

-- Transaction tables
DROP TABLE IF EXISTS backup_payment_requests;
DROP TABLE IF EXISTS backup_vendor_kpi_scores;
DROP TABLE IF EXISTS backup_vendor_payment;
DROP TABLE IF EXISTS backup_vendor_progress;
DROP TABLE IF EXISTS backup_vendor_spk;

-- Project tables
DROP TABLE IF EXISTS backup_project_milestones;
DROP TABLE IF EXISTS backup_projects;

-- Vendor tables (child tables dulu)
DROP TABLE IF EXISTS backup_vendor_additional_costs;
DROP TABLE IF EXISTS backup_vendor_cost_inclusions;
DROP TABLE IF EXISTS backup_vendor_delivery_areas;
DROP TABLE IF EXISTS backup_vendor_products;
DROP TABLE IF EXISTS backup_vendor_factory_addresses;
DROP TABLE IF EXISTS backup_vendor_bank_accounts;
DROP TABLE IF EXISTS backup_vendor_legal_documents;
DROP TABLE IF EXISTS backup_vendor_contacts;
DROP TABLE IF EXISTS backup_vendor_company_info;
DROP TABLE IF EXISTS backup_vendor_registration_history;
DROP TABLE IF EXISTS backup_vendor_profiles;
DROP TABLE IF EXISTS backup_vendor_registrations;

-- Master data tables
DROP TABLE IF EXISTS backup_master_cities;
DROP TABLE IF EXISTS backup_master_provinces;

-- ============================================
-- VERIFIKASI SETELAH CLEANUP
-- ============================================

-- Verifikasi tidak ada backup tables lagi:
SELECT 'Remaining backup tables:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'backup_%';

-- Verifikasi tabel LPrecast masih ada:
SELECT 'LPrecast tables:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- ============================================
-- COMPLETED
-- ============================================

-- ✓ Backup tables have been permanently deleted
-- ✓ LPrecast tables remain intact in ERP database (for reference only)
-- ✓ Data cannot be recovered after this step
