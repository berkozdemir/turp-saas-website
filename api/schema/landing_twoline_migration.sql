-- Two-Line Hero Title Migration
-- Run this AFTER landing_gradient_migration.sql

-- Replace single hero_title with two-line fields
ALTER TABLE landing_configs 
ADD COLUMN IF NOT EXISTS hero_title_line1 VARCHAR(500) DEFAULT '',
ADD COLUMN IF NOT EXISTS hero_title_line2 VARCHAR(500) DEFAULT '';

-- Copy existing hero_title to line1 if exists
UPDATE landing_configs SET hero_title_line1 = hero_title WHERE hero_title IS NOT NULL AND hero_title != '';

-- Line 1 styling
ALTER TABLE landing_configs 
ADD COLUMN IF NOT EXISTS hero_line1_use_gradient_text TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS hero_line1_solid_color VARCHAR(20) DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS hero_line1_gradient_from VARCHAR(20) DEFAULT '#4F46E5',
ADD COLUMN IF NOT EXISTS hero_line1_gradient_to VARCHAR(20) DEFAULT '#22C55E',
ADD COLUMN IF NOT EXISTS hero_line1_gradient_angle INT DEFAULT 90;

-- Line 2 styling
ALTER TABLE landing_configs 
ADD COLUMN IF NOT EXISTS hero_line2_use_gradient_text TINYINT(1) DEFAULT 1,
ADD COLUMN IF NOT EXISTS hero_line2_solid_color VARCHAR(20) DEFAULT '#EC4899',
ADD COLUMN IF NOT EXISTS hero_line2_gradient_from VARCHAR(20) DEFAULT '#EC4899',
ADD COLUMN IF NOT EXISTS hero_line2_gradient_to VARCHAR(20) DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS hero_line2_gradient_angle INT DEFAULT 90;
