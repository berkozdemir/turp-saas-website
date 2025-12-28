-- Media Assets Schema
-- Multi-tenant image library for klinikarastirmalar.info

CREATE TABLE IF NOT EXISTS media_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    
    -- File info
    filename_original VARCHAR(255) NOT NULL,
    filename_stored VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    
    -- Metadata
    mime_type VARCHAR(100),
    size_bytes INT,
    width INT,
    height INT,
    
    -- User-editable fields
    alt_text VARCHAR(500) DEFAULT '',
    title VARCHAR(255) DEFAULT '',
    tags JSON,
    category VARCHAR(50) DEFAULT '',
    
    -- Audit
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_tenant (tenant_id),
    INDEX idx_tenant_category (tenant_id, category),
    INDEX idx_tenant_created (tenant_id, created_at DESC),
    INDEX idx_filename (tenant_id, filename_original)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
