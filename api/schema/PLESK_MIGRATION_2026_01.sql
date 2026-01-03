-- =====================================================
-- PLESK MIGRATION SCRIPT - January 2026
-- Dynamic Multi-Tenant Support + Deploy Optimizations
-- =====================================================
--
-- This script safely adds missing columns and tables needed for:
-- 1. Dynamic tenant resolution (get_tenants API)
-- 2. Tenant feature flags (allow_enduser_login, allow_enduser_signup)
-- 3. Multi-tenant branding support
--
-- SAFE FOR PRODUCTION: Uses IF NOT EXISTS and ADD COLUMN IF NOT EXISTS
-- Run this in Plesk phpMyAdmin MariaDB console
-- =====================================================

-- =====================================================
-- 1. CREATE TENANTS TABLE (if doesn't exist)
-- =====================================================
CREATE TABLE IF NOT EXISTS `tenants` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique tenant code (e.g., turp, iwrs, omega_nipt)',
    `name` VARCHAR(255) NOT NULL COMMENT 'Display name (e.g., Turp CRO, Omega IWRS)',
    `primary_domain` VARCHAR(255) COMMENT 'Primary domain (e.g., ct.turp.health, iwrs.com.tr)',
    `logo_url` VARCHAR(500) COMMENT 'Logo file path',
    `primary_color` VARCHAR(7) DEFAULT '#6366f1' COMMENT 'Brand primary color (hex)',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Tenant activation status',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_code` (`code`),
    INDEX `idx_domain` (`primary_domain`),
    INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Multi-tenant configuration table';

-- =====================================================
-- 2. ADD ENDUSER AUTH FEATURE FLAGS (if don't exist)
-- =====================================================
-- These columns control whether end-users can login/signup per tenant

-- Check if allow_enduser_login column exists, if not add it
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants'
    AND COLUMN_NAME = 'allow_enduser_login');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `tenants` ADD COLUMN `allow_enduser_login` BOOLEAN DEFAULT FALSE COMMENT ''Allow end-user login for this tenant''',
    'SELECT ''Column allow_enduser_login already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if allow_enduser_signup column exists, if not add it
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants'
    AND COLUMN_NAME = 'allow_enduser_signup');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `tenants` ADD COLUMN `allow_enduser_signup` BOOLEAN DEFAULT FALSE COMMENT ''Allow end-user signup for this tenant''',
    'SELECT ''Column allow_enduser_signup already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 3. SEED DEFAULT TENANTS (if not exist)
-- =====================================================
-- Insert default tenants with ON DUPLICATE KEY to avoid errors

INSERT INTO `tenants` (`code`, `name`, `primary_domain`, `primary_color`, `is_active`, `allow_enduser_login`, `allow_enduser_signup`) VALUES
('turp', 'Turp CRO', 'ct.turp.health', '#6366f1', TRUE, FALSE, FALSE),
('iwrs', 'Omega IWRS', 'iwrs.com.tr', '#10b981', TRUE, TRUE, TRUE),
('omega_nipt', 'Omega NIPT', 'nipt.tr', '#2563EB', TRUE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `primary_domain` = VALUES(`primary_domain`),
    `primary_color` = VALUES(`primary_color`),
    `is_active` = VALUES(`is_active`);

-- =====================================================
-- 4. VERIFY MIGRATION SUCCESS
-- =====================================================
-- Run these queries to verify the migration:

SELECT 'Tenants Table Structure' AS check_name;
DESCRIBE `tenants`;

SELECT 'Existing Tenants' AS check_name;
SELECT `id`, `code`, `name`, `primary_domain`, `allow_enduser_login`, `allow_enduser_signup`, `is_active`
FROM `tenants`
ORDER BY `id`;

-- =====================================================
-- 5. POST-MIGRATION NOTES
-- =====================================================
-- After running this script:
--
-- 1. Verify tenant list at: /api/index.php?action=get_tenants
-- 2. Test dynamic tenant resolution in browser console:
--    window.__TENANT_CODE_CACHE__
-- 3. Check tenant settings API: /api/index.php?action=get_tenant_settings
--
-- To enable end-user login/signup for a tenant:
-- UPDATE `tenants` SET `allow_enduser_login` = TRUE, `allow_enduser_signup` = TRUE WHERE `code` = 'iwrs';
-- =====================================================
