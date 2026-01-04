-- =============================================
-- MIGRATION: Landing, Branding, Login Schema Fixes
-- Run this on your Plesk MySQL database
-- Date: 2026-01-04
-- =============================================

-- ========================================
-- 1. BRANDING_CONFIGS - Add login_hero_image
-- ========================================

-- Add login_hero_image column if not exists
ALTER TABLE `branding_configs` 
ADD COLUMN IF NOT EXISTS `login_hero_image` VARCHAR(500) AFTER `favicon_url`;

-- If "IF NOT EXISTS" fails, use this manual check approach:
-- SET @dbname = DATABASE();
-- SET @tablename = "branding_configs";
-- SET @columnname = "login_hero_image";
-- SET @preparedStatement = (SELECT IF(
--   (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME=@columnname) > 0,
--   "SELECT 'Column exists'",
--   "ALTER TABLE branding_configs ADD COLUMN login_hero_image VARCHAR(500) AFTER favicon_url"
-- ));
-- PREPARE stmt FROM @preparedStatement;
-- EXECUTE stmt;
-- DEALLOCATE PREPARE stmt;

-- ========================================
-- 2. LANDING_CONFIGS - Add missing columns
-- ========================================

-- Add hero_title_line2
ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `hero_title_line2` VARCHAR(500) AFTER `hero_title`;

-- Add hero_cta_text and hero_cta_link
ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `hero_cta_text` VARCHAR(200) DEFAULT 'Başla' AFTER `hero_subtitle`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `hero_cta_link` VARCHAR(500) DEFAULT '#' AFTER `hero_cta_text`;

-- Add gradient colors
ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `hero_bg_gradient_from` VARCHAR(7) DEFAULT '#667eea' AFTER `hero_cta_link`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `hero_bg_gradient_to` VARCHAR(7) DEFAULT '#764ba2' AFTER `hero_bg_gradient_from`;

-- Add features section
ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `features_title` VARCHAR(200) DEFAULT 'Özellikler' AFTER `hero_bg_gradient_to`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `features_json` JSON AFTER `features_title`;

-- Add stats and testimonials
ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `stats_json` JSON AFTER `features_json`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `testimonials_json` JSON AFTER `stats_json`;

-- Add CTA section
ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `cta_title` VARCHAR(500) AFTER `testimonials_json`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `cta_description` TEXT AFTER `cta_title`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `cta_button_text` VARCHAR(200) DEFAULT 'İletişim' AFTER `cta_description`;

ALTER TABLE `landing_configs` 
ADD COLUMN IF NOT EXISTS `cta_button_link` VARCHAR(500) DEFAULT '/contact' AFTER `cta_button_text`;

-- ========================================
-- 3. TENANTS - Add enduser auth flags (if missing)
-- ========================================

ALTER TABLE `tenants` 
ADD COLUMN IF NOT EXISTS `allow_enduser_login` TINYINT(1) DEFAULT 0;

ALTER TABLE `tenants` 
ADD COLUMN IF NOT EXISTS `allow_enduser_signup` TINYINT(1) DEFAULT 0;

-- ========================================
-- 4. ENDUSERS - Add reset token columns (if missing)
-- ========================================

ALTER TABLE `endusers` 
ADD COLUMN IF NOT EXISTS `reset_token` VARCHAR(64) NULL;

ALTER TABLE `endusers` 
ADD COLUMN IF NOT EXISTS `reset_token_expires` TIMESTAMP NULL;

-- ========================================
-- VERIFICATION QUERIES (Run after migration)
-- ========================================

-- Check branding_configs columns:
-- SHOW COLUMNS FROM branding_configs;

-- Check landing_configs columns:
-- SHOW COLUMNS FROM landing_configs;

-- Check tenants columns:
-- SHOW COLUMNS FROM tenants;

-- Check endusers columns:
-- SHOW COLUMNS FROM endusers;

-- ========================================
-- END OF MIGRATION
-- ========================================
