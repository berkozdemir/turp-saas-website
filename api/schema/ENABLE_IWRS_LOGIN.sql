-- Enable enduser login for IWRS tenant
-- Run this on the production database

UPDATE tenants 
SET allow_enduser_login = TRUE, 
    allow_enduser_signup = FALSE
WHERE code = 'iwrs';

-- Verify the update
SELECT code, name, allow_enduser_login, allow_enduser_signup 
FROM tenants 
WHERE code = 'iwrs';
