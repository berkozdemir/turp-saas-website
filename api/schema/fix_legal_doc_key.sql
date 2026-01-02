-- Fix legal_documents table - add missing doc_key column
ALTER TABLE legal_documents ADD COLUMN IF NOT EXISTS doc_key VARCHAR(100) AFTER tenant_id;

-- For MySQL without IF NOT EXISTS for columns, use this:
-- First check if column exists, then add if not
-- This is a safe migration that won't fail if column already exists

-- Alternative approach (MySQL compatible):
SET @dbname = DATABASE();
SET @tablename = 'legal_documents';
SET @columnname = 'doc_key';

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
   AND TABLE_NAME = @tablename
   AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(100) AFTER tenant_id')
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Simpler version (just run, will error if exists but that's OK):
-- ALTER TABLE legal_documents ADD COLUMN doc_key VARCHAR(100) AFTER tenant_id;
