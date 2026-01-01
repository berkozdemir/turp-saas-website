-- =============================================
-- End-User Authentication System - Database Schema
-- =============================================

-- 1. End Users Table (Multi-tenant)
CREATE TABLE IF NOT EXISTS `endusers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `phone` VARCHAR(50),
  `status` ENUM('active', 'pending', 'disabled') DEFAULT 'pending',
  `email_verified` BOOLEAN DEFAULT FALSE,
  `verification_token` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL,
  UNIQUE KEY `unique_email_tenant` (`email`, `tenant_id`),
  INDEX `idx_enduser_tenant` (`tenant_id`),
  INDEX `idx_enduser_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. End User Sessions Table
CREATE TABLE IF NOT EXISTS `enduser_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `tenant_id` VARCHAR(50) NOT NULL,
  `token` VARCHAR(255) UNIQUE NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `endusers`(`id`) ON DELETE CASCADE,
  INDEX `idx_enduser_session_token` (`token`),
  INDEX `idx_enduser_session_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Add end-user auth flags to tenant_configs (if not exists)
ALTER TABLE `tenant_configs` 
ADD COLUMN IF NOT EXISTS `allow_enduser_login` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `allow_enduser_signup` BOOLEAN DEFAULT FALSE;
