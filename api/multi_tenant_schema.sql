-- Multi-Tenant Schema Migration
-- Run this on your production database

-- 1. Create Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    primary_color VARCHAR(20) DEFAULT '#e11d48',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tenant (current site)
INSERT INTO tenants (id, name, domain) VALUES ('turp', 'Turp Health', 'ct.turp.health')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 2. Add tenant_id to content tables
-- FAQs
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp';
CREATE INDEX IF NOT EXISTS idx_faqs_tenant ON faqs(tenant_id);

-- Posts (Blog)
ALTER TABLE iwrs_saas_blog_posts ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp';
CREATE INDEX IF NOT EXISTS idx_iwrs_saas_blog_posts_tenant ON iwrs_saas_blog_posts(tenant_id);

-- Contact Messages
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp';
CREATE INDEX IF NOT EXISTS idx_contact_messages_tenant ON contact_messages(tenant_id);

-- Legal Documents
ALTER TABLE legal_documents ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp';
CREATE INDEX IF NOT EXISTS idx_legal_documents_tenant ON legal_documents(tenant_id);

-- Site Settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp';
CREATE INDEX IF NOT EXISTS idx_site_settings_tenant ON site_settings(tenant_id);

-- Admin Users (optional: if you want tenant-specific admins)
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) DEFAULT NULL;
-- NULL means super-admin (can access all tenants)
-- Specific value means tenant-specific admin
