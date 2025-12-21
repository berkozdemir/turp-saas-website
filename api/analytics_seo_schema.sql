-- Analytics & SEO Settings Schema
-- Add to site_settings table or create if not exists

-- Ensure site_settings table exists with proper structure
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default analytics settings
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('analytics', '{"ga_measurement_id":"","gtm_id":"","extra_head_html":"","extra_body_html":""}'),
('global_seo', '{"site_name":"TURP Clinical Trials","default_title":"TURP - Klinik Araştırma Platformu","default_description":"e-Nabız entegrasyonu ile klinik araştırmalarda veri toplama platformu","default_og_image":"","default_language":"tr"}'),
('page_seo', '[]')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
