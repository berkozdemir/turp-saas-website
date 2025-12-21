-- Landing Builder Schema
-- Run this on your production database

CREATE TABLE IF NOT EXISTS landing_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    language ENUM('tr', 'en', 'zh') NOT NULL DEFAULT 'tr',
    hero_title VARCHAR(500) NOT NULL,
    hero_subtitle TEXT,
    hero_badge VARCHAR(200),
    primary_cta_label VARCHAR(100),
    primary_cta_url VARCHAR(500),
    secondary_cta_label VARCHAR(100),
    secondary_cta_url VARCHAR(500),
    hero_image_url VARCHAR(500),
    background_style ENUM('default', 'light', 'dark', 'gradient') DEFAULT 'default',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    INDEX idx_tenant_lang (tenant_id, language),
    INDEX idx_active (tenant_id, language, is_active)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default config for turp tenant (optional seed data)
INSERT INTO landing_configs (tenant_id, language, hero_title, hero_subtitle, hero_badge, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, is_active)
VALUES 
('turp', 'tr', 'Tahminleri Değil, Gerçekleri Yönetin.', 'Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye''nin ilk ve tek RWE platformu.', 'USBS Onaylı & e-Nabız Entegreli', 'Demo Talep Et', '#contact', 'Maliyet Avantajınızı Görün', '#roi', 1)
ON DUPLICATE KEY UPDATE hero_title = VALUES(hero_title);
