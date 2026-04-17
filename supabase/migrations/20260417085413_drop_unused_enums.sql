-- Drop enum types that are no longer used by any table
-- These enums were defined in previous migrations but never used

DROP TYPE IF EXISTS vendor_registration_status CASCADE;
DROP TYPE IF EXISTS cost_inclusion_type CASCADE;
DROP TYPE IF EXISTS customer_payment_termin CASCADE;
DROP TYPE IF EXISTS document_verification_status CASCADE;
DROP TYPE IF EXISTS kebutuhan_type CASCADE;
DROP TYPE IF EXISTS letter_action_type CASCADE;
DROP TYPE IF EXISTS letter_status CASCADE;
DROP TYPE IF EXISTS meeting_status_enum CASCADE;
DROP TYPE IF EXISTS meeting_type_enum CASCADE;
DROP TYPE IF EXISTS produk_type CASCADE;
DROP TYPE IF EXISTS sales_stage CASCADE;