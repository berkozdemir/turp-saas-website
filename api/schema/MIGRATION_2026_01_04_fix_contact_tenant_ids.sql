-- Standardize tenant_id in contact_submissions to use integer IDs instead of codes
-- Fixes visibility issue in admin panel which queries by ID

-- Update 'nipt' code to ID 3
UPDATE contact_submissions 
SET tenant_id = '3' 
WHERE tenant_id = 'nipt';

-- Update 'turp' code to ID 1 (if exists)
UPDATE contact_submissions 
SET tenant_id = '1' 
WHERE tenant_id = 'turp';

-- Safety: Verify column type is large enough (it is varchar(50), fine for '3')
-- We are not changing column type to INT yet to avoid breaking other potential legacy reads, 
-- but data is now consistent with IDs.

-- Also ensure admin panel can see all messages by ID.
