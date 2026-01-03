-- Performance Optimization: Add Missing Indexes
-- Run this migration on your MySQL database

-- Blog Posts Indexes
CREATE INDEX IF NOT EXISTS idx_blog_tenant ON blog_posts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blog_tenant_status ON blog_posts(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at DESC);

-- FAQs Indexes  
CREATE INDEX IF NOT EXISTS idx_faq_tenant ON faqs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_faq_tenant_order ON faqs(tenant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_active ON faqs(is_active);

-- Contact Messages Indexes
CREATE INDEX IF NOT EXISTS idx_contact_tenant ON contact_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contact_tenant_date ON contact_messages(tenant_id, created_at DESC);

-- Landing Configs Indexes
CREATE INDEX IF NOT EXISTS idx_landing_tenant_lang ON landing_configs(tenant_id, language);
CREATE INDEX IF NOT EXISTS idx_landing_active ON landing_configs(is_active);

-- Contact Configs Indexes
CREATE INDEX IF NOT EXISTS idx_contact_config_tenant ON contact_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contact_config_lang ON contact_configs(tenant_id, language);

-- Legal Documents Indexes
CREATE INDEX IF NOT EXISTS idx_legal_tenant ON legal_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_legal_key ON legal_documents(tenant_id, `key`);

-- Media Assets Indexes
CREATE INDEX IF NOT EXISTS idx_media_tenant ON media_assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_media_tenant_created ON media_assets(tenant_id, created_at DESC);

-- Admin Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_session_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_session_user ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires ON admin_sessions(expires_at);
