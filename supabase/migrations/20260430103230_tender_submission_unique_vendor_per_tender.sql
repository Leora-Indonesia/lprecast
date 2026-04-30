ALTER TABLE tender_submissions
  ADD CONSTRAINT tender_submissions_tender_vendor_unique
  UNIQUE (tender_id, vendor_id);
