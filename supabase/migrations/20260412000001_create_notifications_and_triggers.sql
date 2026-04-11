-- Migration: Create notifications table and vendor email notification system
-- Created: 2026-04-11

-- Create notification_category enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_category') THEN
    CREATE TYPE notification_category AS ENUM (
      'vendor',
      'tender',
      'monitoring',
      'payment',
      'document',
      'rab',
      'general'
    );
  END IF;
END $$;

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  category notification_category NOT NULL DEFAULT 'general',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_reference ON notifications(reference_type, reference_id);

-- Create function to get admin emails
CREATE OR REPLACE FUNCTION get_admin_emails()
RETURNS TABLE(user_id UUID, email TEXT, nama TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, COALESCE(u.nama::TEXT, '') as nama
  FROM users u
  WHERE u.stakeholder_type = 'internal' AND u.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get vendor company info
CREATE OR REPLACE FUNCTION get_vendor_company_info(p_registration_id UUID)
RETURNS TABLE(
  nama_perusahaan TEXT,
  email TEXT,
  nama_pic TEXT,
  kontak_pic TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT vci.nama_perusahaan, vci.email, COALESCE(vci.nama_pic::TEXT, ''), COALESCE(vci.kontak_pic::TEXT, '')
  FROM vendor_company_info vci
  WHERE vci.registration_id = p_registration_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to notify admins of new vendor
CREATE OR REPLACE FUNCTION notify_admins_new_vendor(p_registration_id UUID)
RETURNS VOID AS $$
DECLARE
  v_company_info RECORD;
  v_admin RECORD;
BEGIN
  SELECT * INTO v_company_info FROM get_vendor_company_info(p_registration_id);
  
  IF v_company_info.nama_perusahaan IS NULL THEN
    RAISE NOTICE 'No company info found for registration: %', p_registration_id;
    RETURN;
  END IF;
  
  FOR v_admin IN SELECT * FROM get_admin_emails() LOOP
    INSERT INTO notifications (
      user_id,
      type,
      category,
      title,
      message,
      reference_id,
      reference_type,
      is_read
    ) VALUES (
      v_admin.user_id,
      'vendor_registration',
      'vendor',
      'Pendaftaran Vendor Baru',
      COALESCE(v_company_info.nama_perusahaan, 'Unknown') || ' telah mendaftar sebagai vendor dan menunggu review Anda. PIC: ' || COALESCE(v_company_info.nama_pic, 'N/A'),
      p_registration_id,
      'vendor_registration',
      false
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for new vendor registration
CREATE OR REPLACE FUNCTION trigger_notify_admins_on_vendor_register()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS DISTINCT FROM NEW.status OR OLD.status IS NULL) THEN
    PERFORM notify_admins_new_vendor(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for vendor registration (check if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_registrations') THEN
    DROP TRIGGER IF EXISTS on_vendor_registration_submitted ON vendor_registrations;
    CREATE TRIGGER on_vendor_registration_submitted
      AFTER UPDATE OF status ON vendor_registrations
      FOR EACH ROW
      EXECUTE FUNCTION trigger_notify_admins_on_vendor_register();
    RAISE NOTICE 'Trigger on_vendor_registration_submitted created';
  ELSE
    RAISE NOTICE 'Table vendor_registrations does not exist, skipping trigger creation';
  END IF;
END $$;

-- Create trigger function for vendor status notification
CREATE OR REPLACE FUNCTION notify_vendor_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_company_name TEXT;
  v_status_title TEXT;
  v_status_message TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND OLD.status IS NOT NULL AND NEW.vendor_id IS NOT NULL THEN
    SELECT vci.nama_perusahaan INTO v_company_name
    FROM vendor_company_info vci
    WHERE vci.registration_id = NEW.id
    LIMIT 1;
    
    CASE NEW.status
      WHEN 'approved' THEN
        v_status_title := 'Pendaftaran Vendor Disetujui';
        v_status_message := 'Selamat! Pendaftaran vendor Anda telah disetujui. Akun Anda sekarang aktif dan dapat digunakan.';
      WHEN 'rejected' THEN
        v_status_title := 'Pendaftaran Vendor Ditolak';
        v_status_message := 'Mohon maaf, pendaftaran vendor Anda telah ditolak. Silakan hubungi admin untuk informasi lebih lanjut.';
      WHEN 'revision_requested' THEN
        v_status_title := 'Revisi Diperlukan';
        v_status_message := 'Pendaftaran vendor Anda memerlukan revisi. Silakan perbarui data Anda.';
      ELSE
        v_status_title := NULL;
        v_status_message := NULL;
    END CASE;
    
    IF v_status_title IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        type,
        category,
        title,
        message,
        reference_id,
        reference_type,
        is_read
      ) VALUES (
        NEW.vendor_id,
        CASE NEW.status
          WHEN 'approved' THEN 'vendor_approved'
          WHEN 'rejected' THEN 'vendor_rejected'
          ELSE 'general'
        END,
        'vendor',
        v_status_title,
        COALESCE(v_status_message, ''),
        NEW.id,
        'vendor_registration',
        false
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for vendor status change
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_registrations') THEN
    DROP TRIGGER IF EXISTS on_vendor_registration_status_change ON vendor_registrations;
    CREATE TRIGGER on_vendor_registration_status_change
      AFTER UPDATE OF status ON vendor_registrations
      FOR EACH ROW
      EXECUTE FUNCTION notify_vendor_status_change();
    RAISE NOTICE 'Trigger on_vendor_registration_status_change created';
  ELSE
    RAISE NOTICE 'Table vendor_registrations does not exist, skipping trigger creation';
  END IF;
END $$;

-- Comments
COMMENT ON TABLE notifications IS 'Stores user notifications for various events';
COMMENT ON FUNCTION get_admin_emails IS 'Get all admin user emails for notifications';
COMMENT ON FUNCTION get_vendor_company_info IS 'Get vendor company info by registration ID';
COMMENT ON FUNCTION notify_admins_new_vendor IS 'Notify all admins when a new vendor registers';
COMMENT ON FUNCTION notify_vendor_status_change IS 'Notify vendor when their registration status changes';
