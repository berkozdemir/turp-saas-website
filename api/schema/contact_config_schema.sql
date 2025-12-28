-- Contact Config Schema
-- Run this on your production database

CREATE TABLE IF NOT EXISTS contact_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    language ENUM('tr', 'en', 'zh') NOT NULL DEFAULT 'tr',
    -- Display content
    contact_title VARCHAR(255),
    contact_subtitle TEXT,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    map_embed_url TEXT,
    working_hours VARCHAR(255),
    -- Form settings
    form_enabled TINYINT(1) DEFAULT 1,
    notification_email VARCHAR(255),
    success_message TEXT,
    error_message TEXT,
    -- Meta
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    INDEX idx_tenant_lang (tenant_id, language),
    INDEX idx_active (tenant_id, language, is_active)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed data for turp tenant
INSERT INTO contact_configs (
    tenant_id, language, contact_title, contact_subtitle, 
    address_line1, city, country, phone, email, 
    notification_email, success_message, error_message, is_active
) VALUES (
    'turp', 'tr', 'Bize Ulaşın', 'Sorularınız ve demo talepleriniz için bizimle iletişime geçin.',
    'Cyberpark Teknokent', 'Ankara', 'Türkiye', '+90 312 XXX XX XX', 'info@turp.health',
    'info@turp.health', 'Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.', 
    'Bir hata oluştu, lütfen daha sonra tekrar deneyin.', 1
) ON DUPLICATE KEY UPDATE contact_title = VALUES(contact_title);
