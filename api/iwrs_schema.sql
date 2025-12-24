-- IWRS Schema
-- Run this SQL to create tables for IWRS features

-- Blog Posts Table (Multilingual - Single Row)
CREATE TABLE IF NOT EXISTS blog_posts (
    id CHAR(36) PRIMARY KEY, -- UUID
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp',
    slug VARCHAR(255) NOT NULL, -- Unique per tenant
    
    -- Turkish (Primary/Source)
    title_tr VARCHAR(255) NOT NULL,
    excerpt_tr TEXT,
    content_tr TEXT NOT NULL,
    
    -- English (AI-translated)
    title_en VARCHAR(255),
    excerpt_en TEXT,
    content_en TEXT,
    
    -- Chinese (AI-translated)
    title_zh VARCHAR(255),
    excerpt_zh TEXT,
    content_zh TEXT,
    
    -- Shared metadata
    status ENUM('draft', 'published') DEFAULT 'draft',
    featured_image VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(255),
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY idx_tenant_slug (tenant_id, slug),
    INDEX idx_status (status),
    INDEX idx_tenant (tenant_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Randomizations Table
CREATE TABLE IF NOT EXISTS iwrs_randomizations (
    id CHAR(36) PRIMARY KEY, -- UUID
    study_name VARCHAR(255) NOT NULL,
    study_type VARCHAR(100) NOT NULL,
    total_participants INT NOT NULL,
    treatment_arms INT NOT NULL,
    randomization_method VARCHAR(50) NOT NULL,
    block_size INT,
    stratification_factors TEXT,
    blinding_type VARCHAR(50),
    reporting_preferences VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Inventory Table (Basic structure for demo)
CREATE TABLE IF NOT EXISTS iwrs_inventory (
    id CHAR(36) PRIMARY KEY, -- UUID
    site_id VARCHAR(50) NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('available', 'quarantined', 'expired') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_site (site_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- View for Blog Posts (Optional, if needed for simpler queries)
CREATE OR REPLACE VIEW view_published_blog_posts AS
SELECT * FROM blog_posts WHERE status = 'published' AND published_at <= NOW();

-- Users Table (Registered users)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY, -- UUID
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- user, admin, monitor
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_type VARCHAR(50), -- notification, reset_password, etc.
    status VARCHAR(50), -- sent, failed
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- API/Bot Logs Table
CREATE TABLE IF NOT EXISTS api_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_data TEXT, -- JSON payload (redacted if sensitive)
    response_code INT,
    ip_address VARCHAR(45),
    user_id CHAR(36) NULL, -- If authenticated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Site Settings Table (Ensure it exists)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
