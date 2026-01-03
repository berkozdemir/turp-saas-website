-- Add missing columns for Legal Documents Admin Panel
-- Required by frontend: key (mapped to type usually, or doc_key), is_active, effective_date, sort_order

ALTER TABLE legal_documents 
ADD COLUMN IF NOT EXISTS is_active TINYINT(1) DEFAULT 1,
ADD COLUMN IF NOT EXISTS effective_date DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- Ensure doc_key exists if not already (safeguard)
-- ALTER TABLE legal_documents ADD COLUMN IF NOT EXISTS doc_key VARCHAR(100) AFTER tenant_id;
