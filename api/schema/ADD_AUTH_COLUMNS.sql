-- Add end-user authentication columns to tenants table
-- Run this on your production database

ALTER TABLE tenants ADD COLUMN allow_enduser_login BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN allow_enduser_signup BOOLEAN DEFAULT FALSE;

-- Optional: Enable them for IWRS immediately
UPDATE tenants 
SET allow_enduser_login = TRUE, 
    allow_enduser_signup = TRUE 
WHERE code = 'iwrs';
