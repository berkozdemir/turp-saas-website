-- IWRS Schema
-- Run this SQL to create tables for IWRS features

-- Blog Posts Table (MySQL equivalent of Supabase)
CREATE TABLE IF NOT EXISTS blog_posts (
    id CHAR(36) PRIMARY KEY, -- UUID
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    featured_image VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(255),
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status)
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
