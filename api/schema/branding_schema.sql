-- Branding Configuration Schema
-- Stores per-tenant branding settings (logo, colors, fonts, social links)

CREATE TABLE IF NOT EXISTS `branding_configs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` INT NOT NULL UNIQUE,
  
  -- Visual Identity
  `logo_light_url` VARCHAR(500),
  `logo_dark_url` VARCHAR(500),
  `favicon_url` VARCHAR(500),
  `primary_color` VARCHAR(7) DEFAULT '#6366f1',
  `secondary_color` VARCHAR(7) DEFAULT '#8b5cf6',
  `accent_color` VARCHAR(7) DEFAULT '#10b981',
  `background_color` VARCHAR(7) DEFAULT '#ffffff',
  `text_color_primary` VARCHAR(7) DEFAULT '#1f2937',
  `text_color_muted` VARCHAR(7) DEFAULT '#6b7280',
  
  -- Typography
  `font_family_base` VARCHAR(100) DEFAULT 'Inter',
  `font_family_heading` VARCHAR(100) DEFAULT 'Inter',
  `border_radius` VARCHAR(20) DEFAULT '0.5rem',
  
  -- Social Links
  `instagram_url` VARCHAR(500),
  `facebook_url` VARCHAR(500),
  `linkedin_url` VARCHAR(500),
  `x_twitter_url` VARCHAR(500),
  `youtube_url` VARCHAR(500),
  `tiktok_url` VARCHAR(500),
  `whatsapp_url` VARCHAR(500),
  
  -- Meta
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT,
  
  INDEX `idx_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
