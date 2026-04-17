-- ============================================================
-- Fix vendor_delivery_areas column type to support UUID
-- Date: 2026-04-17
-- ============================================================

BEGIN;

-- ============================================================
-- Alter province_id and city_id columns to support UUID (36 chars)
-- Previous: VARCHAR(10)
-- Current: VARCHAR(36) to support UUID from master_provinces/master_cities
-- ============================================================

ALTER TABLE vendor_delivery_areas
  ALTER COLUMN province_id TYPE VARCHAR(36),
  ALTER COLUMN city_id TYPE VARCHAR(36);

-- ============================================================
-- Notify PostgREST to reload schema cache
-- ============================================================

NOTIFY pgrst, 'reload schema';

COMMIT;