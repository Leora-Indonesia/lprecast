-- Migration: Update vendor_contacts.jabatan to NOT NULL
-- This ensures data consistency where contact_1 and contact_2 must have all fields filled
-- Date: 2026-04-08

-- First, update any existing NULL values to empty string as a safe default
-- (This should be adjusted based on actual business requirements)
UPDATE vendor_contacts 
SET jabatan = 'Staff' -- Default value for existing NULL records
WHERE jabatan IS NULL;

-- Now alter the column to NOT NULL
ALTER TABLE vendor_contacts 
ALTER COLUMN jabatan SET NOT NULL;

-- Add comment to document this change
COMMENT ON COLUMN vendor_contacts.jabatan IS 'Jabatan kontak vendor - wajib diisi untuk memastikan data lengkap';