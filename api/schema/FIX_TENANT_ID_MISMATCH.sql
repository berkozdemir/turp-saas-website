-- =============================================
-- MIGRATION: Harmonize Tenant IDs in all tables
-- This converts integer tenant IDs to string codes
-- e.g., '1' -> 'turp', '2' -> 'iwrs'
-- =============================================

-- 1. endusers Table
UPDATE endusers SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE endusers SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE endusers SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE endusers SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE endusers SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 2. enduser_sessions Table
UPDATE enduser_sessions SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE enduser_sessions SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE enduser_sessions SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE enduser_sessions SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE enduser_sessions SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 3. blog_posts Table
UPDATE blog_posts SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE blog_posts SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE blog_posts SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE blog_posts SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE blog_posts SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 4. faqs Table
UPDATE faqs SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE faqs SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE faqs SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE faqs SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE faqs SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 5. branding_configs (Requires column type change if it was INT)
-- Note: Check if column is already VARCHAR or convert it
ALTER TABLE branding_configs MODIFY COLUMN tenant_id VARCHAR(50);
UPDATE branding_configs SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE branding_configs SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE branding_configs SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE branding_configs SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE branding_configs SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 6. Ensure test user has the 'password' password
-- The hash below is for 'password' (bcrypt default)
UPDATE endusers 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'test@iwrs.com.tr';

-- Final verification
SELECT id, email, tenant_id FROM endusers WHERE email = 'test@iwrs.com.tr';
