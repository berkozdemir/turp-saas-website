-- Landing Builder Gradient Extension
-- Run this on your production database AFTER landing_schema.sql

-- Add gradient text fields
ALTER TABLE landing_configs 
ADD COLUMN IF NOT EXISTS hero_use_gradient_text TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS hero_gradient_text_from VARCHAR(20) DEFAULT '#4F46E5',
ADD COLUMN IF NOT EXISTS hero_gradient_text_to VARCHAR(20) DEFAULT '#22C55E',
ADD COLUMN IF NOT EXISTS hero_gradient_text_angle INT DEFAULT 90;

-- Add gradient background fields
ALTER TABLE landing_configs 
ADD COLUMN IF NOT EXISTS hero_use_gradient_background TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS hero_gradient_bg_from VARCHAR(20) DEFAULT '#1E293B',
ADD COLUMN IF NOT EXISTS hero_gradient_bg_to VARCHAR(20) DEFAULT '#0F172A',
ADD COLUMN IF NOT EXISTS hero_gradient_bg_angle INT DEFAULT 180;
