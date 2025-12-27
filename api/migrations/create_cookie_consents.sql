-- Cookie Consent Storage Table
CREATE TABLE IF NOT EXISTS cookie_consents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    user_ip_hash VARCHAR(64) NOT NULL COMMENT 'SHA256 hash of IP for privacy',
    region VARCHAR(10) COMMENT 'Detected region (EU, TR, US, etc.)',
    country VARCHAR(2) COMMENT 'ISO country code',
    browser_language VARCHAR(10) COMMENT 'Browser Accept-Language',
    consent_version VARCHAR(20) DEFAULT '1.0' COMMENT 'Policy version accepted',
    consent_details JSON NOT NULL COMMENT '{"essential": true, "analytics": true, "marketing": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenant_ip (tenant_id, user_ip_hash),
    INDEX idx_tenant_created (tenant_id, created_at),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores user cookie consent preferences for GDPR compliance';
