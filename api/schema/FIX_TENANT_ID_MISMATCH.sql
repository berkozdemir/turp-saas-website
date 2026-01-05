-- =============================================
-- MIGRATION: Harmonize Tenant IDs in all tables
-- This converts integer tenant IDs to string codes
-- e.g., '1' -> 'turp', '2' -> 'iwrs'
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop known problematic foreign keys
-- Dropping multiple variations to be safe
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v1;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v2;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v3;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v4;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v5;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v6;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v7;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v8;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v9;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS fk_faqs_tenant_id_v10;
ALTER TABLE faqs DROP FOREIGN KEY IF EXISTS faqs_ibfk_1;

ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v1;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v2;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v3;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v4;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v5;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v6;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v7;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v8;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v9;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS fk_blog_posts_tenant_id_v10;
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS blog_posts_ibfk_1;

ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v1;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v2;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v3;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v4;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v5;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v6;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v7;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v8;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v9;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS fk_endusers_tenant_id_v10;
ALTER TABLE endusers DROP FOREIGN KEY IF EXISTS endusers_ibfk_1;

ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v1;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v2;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v3;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v4;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v5;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v6;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v7;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v8;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v9;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS fk_legal_documents_tenant_id_v10;
ALTER TABLE legal_documents DROP FOREIGN KEY IF EXISTS legal_documents_ibfk_1;

ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v1;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v2;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v3;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v4;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v5;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v6;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v7;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v8;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v9;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS fk_podcasts_tenant_id_v10;
ALTER TABLE podcasts DROP FOREIGN KEY IF EXISTS podcasts_ibfk_1;

ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS fk_branding_configs_tenant_id;
ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS fk_branding_configs_tenant_id_v1;
ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS fk_branding_configs_tenant_id_v2;
ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS fk_branding_configs_tenant_id_v3;
ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS fk_branding_configs_tenant_id_v4;
ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS fk_branding_configs_tenant_id_v5;
ALTER TABLE branding_configs DROP FOREIGN KEY IF EXISTS branding_configs_ibfk_1;

ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS fk_contact_configs_tenant_id;
ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS fk_contact_configs_tenant_id_v1;
ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS fk_contact_configs_tenant_id_v2;
ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS fk_contact_configs_tenant_id_v3;
ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS fk_contact_configs_tenant_id_v4;
ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS fk_contact_configs_tenant_id_v5;
ALTER TABLE contact_configs DROP FOREIGN KEY IF EXISTS contact_configs_ibfk_1;

ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS fk_contact_messages_tenant_id;
ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS fk_contact_messages_tenant_id_v1;
ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS fk_contact_messages_tenant_id_v2;
ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS fk_contact_messages_tenant_id_v3;
ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS fk_contact_messages_tenant_id_v4;
ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS fk_contact_messages_tenant_id_v5;
ALTER TABLE contact_messages DROP FOREIGN KEY IF EXISTS contact_messages_ibfk_1;

ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v1;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v2;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v3;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v4;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v5;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v6;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v7;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v8;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v9;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS fk_site_settings_tenant_id_v10;
ALTER TABLE site_settings DROP FOREIGN KEY IF EXISTS site_settings_ibfk_1;

ALTER TABLE chatbot_conversations DROP FOREIGN KEY IF EXISTS fk_chatbot_conversations_tenant_id;
ALTER TABLE chatbot_conversations DROP FOREIGN KEY IF EXISTS fk_chatbot_conversations_tenant_id_v1;
ALTER TABLE chatbot_conversations DROP FOREIGN KEY IF EXISTS fk_chatbot_conversations_tenant_id_v2;
ALTER TABLE chatbot_conversations DROP FOREIGN KEY IF EXISTS fk_chatbot_conversations_tenant_id_v3;
ALTER TABLE chatbot_conversations DROP FOREIGN KEY IF EXISTS chatbot_conversations_ibfk_1;

ALTER TABLE chatbot_knowledge_index DROP FOREIGN KEY IF EXISTS fk_chatbot_knowledge_index_tenant_id;
ALTER TABLE chatbot_knowledge_index DROP FOREIGN KEY IF EXISTS fk_chatbot_knowledge_index_tenant_id_v1;
ALTER TABLE chatbot_knowledge_index DROP FOREIGN KEY IF EXISTS fk_chatbot_knowledge_index_tenant_id_v2;
ALTER TABLE chatbot_knowledge_index DROP FOREIGN KEY IF EXISTS chatbot_knowledge_index_ibfk_1;

ALTER TABLE contact_submissions DROP FOREIGN KEY IF EXISTS fk_contact_submissions_tenant_id;
ALTER TABLE contact_submissions DROP FOREIGN KEY IF EXISTS fk_contact_submissions_tenant_id_v1;
ALTER TABLE contact_submissions DROP FOREIGN KEY IF EXISTS fk_contact_submissions_tenant_id_v2;
ALTER TABLE contact_submissions DROP FOREIGN KEY IF EXISTS contact_submissions_ibfk_1;

ALTER TABLE iwrs_saas_blog_posts DROP FOREIGN KEY IF EXISTS fk_iwrs_saas_blog_posts_tenant_id;
ALTER TABLE iwrs_saas_blog_posts DROP FOREIGN KEY IF EXISTS iwrs_saas_blog_posts_ibfk_1;

ALTER TABLE landing_configs DROP FOREIGN KEY IF EXISTS fk_landing_configs_tenant_id;
ALTER TABLE landing_configs DROP FOREIGN KEY IF EXISTS fk_landing_configs_tenant_id_v1;
ALTER TABLE landing_configs DROP FOREIGN KEY IF EXISTS fk_landing_configs_tenant_id_v2;
ALTER TABLE landing_configs DROP FOREIGN KEY IF EXISTS landing_configs_ibfk_1;

ALTER TABLE media_assets DROP FOREIGN KEY IF EXISTS fk_media_assets_tenant_id;
ALTER TABLE media_assets DROP FOREIGN KEY IF EXISTS fk_media_assets_tenant_id_v1;
ALTER TABLE media_assets DROP FOREIGN KEY IF EXISTS fk_media_assets_tenant_id_v2;
ALTER TABLE media_assets DROP FOREIGN KEY IF EXISTS media_assets_ibfk_1;

-- Ensure all columns are VARCHAR(50) before updating data
ALTER TABLE endusers MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE enduser_sessions MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE blog_posts MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE faqs MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE branding_configs MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE contact_configs MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE contact_messages MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE podcasts MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE legal_documents MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE site_settings MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE chatbot_conversations MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE chatbot_knowledge_index MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE contact_submissions MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE iwrs_saas_blog_posts MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE landing_configs MODIFY COLUMN tenant_id VARCHAR(50);
ALTER TABLE media_assets MODIFY COLUMN tenant_id VARCHAR(50);

-- 1. endusers Table
UPDATE endusers SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE endusers SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE endusers SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE endusers SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE endusers SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 2. enduser_sessions Table
UPDATE enduser_sessions SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE enduser_sessions SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE enduser_sessions SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE enduser_sessions SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE enduser_sessions SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 3. blog_posts Table
UPDATE blog_posts SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE blog_posts SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE blog_posts SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE blog_posts SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE blog_posts SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 4. faqs Table
UPDATE faqs SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE faqs SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE faqs SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE faqs SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE faqs SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 5. branding_configs
UPDATE branding_configs SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE branding_configs SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE branding_configs SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE branding_configs SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE branding_configs SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 6. contact_configs
UPDATE contact_configs SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE contact_configs SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE contact_configs SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE contact_configs SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE contact_configs SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 7. contact_messages
UPDATE contact_messages SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE contact_messages SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE contact_messages SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE contact_messages SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE contact_messages SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 8. podcasts
UPDATE podcasts SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE podcasts SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE podcasts SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE podcasts SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE podcasts SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 9. legal_documents
UPDATE legal_documents SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE legal_documents SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE legal_documents SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE legal_documents SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE legal_documents SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 10. site_settings
UPDATE site_settings SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE site_settings SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE site_settings SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE site_settings SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE site_settings SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 11. chatbot_conversations
UPDATE chatbot_conversations SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE chatbot_conversations SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE chatbot_conversations SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE chatbot_conversations SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE chatbot_conversations SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 12. chatbot_knowledge_index
UPDATE chatbot_knowledge_index SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE chatbot_knowledge_index SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE chatbot_knowledge_index SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE chatbot_knowledge_index SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE chatbot_knowledge_index SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 13. contact_submissions
UPDATE contact_submissions SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE contact_submissions SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE contact_submissions SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE contact_submissions SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE contact_submissions SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 14. iwrs_saas_blog_posts
UPDATE iwrs_saas_blog_posts SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE iwrs_saas_blog_posts SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE iwrs_saas_blog_posts SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE iwrs_saas_blog_posts SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE iwrs_saas_blog_posts SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 15. landing_configs
UPDATE landing_configs SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE landing_configs SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE landing_configs SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE landing_configs SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE landing_configs SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 16. media_assets
UPDATE media_assets SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE media_assets SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE media_assets SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE media_assets SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE media_assets SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 17. admin_user_tenants Table
UPDATE admin_user_tenants SET tenant_id = 'turp' WHERE tenant_id = '1';
UPDATE admin_user_tenants SET tenant_id = 'iwrs' WHERE tenant_id = '2';
UPDATE admin_user_tenants SET tenant_id = 'nipt' WHERE tenant_id = '3';
UPDATE admin_user_tenants SET tenant_id = 'westesti' WHERE tenant_id = '4';
UPDATE admin_user_tenants SET tenant_id = 'trombofili' WHERE tenant_id = '5';

-- 11. Ensure test user has the 'password' password
-- The hash below is for 'password' (bcrypt default)
UPDATE endusers 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    status = 'active',
    email_verified = 1
WHERE email IN ('test@iwrs.com.tr', 'test@omega-cro.com.tr', 'test@turp.health');

-- Ensure test@omega-cro.com.tr exists if it doesn't
INSERT IGNORE INTO endusers (tenant_id, email, password_hash, name, status, email_verified)
VALUES ('turp', 'test@omega-cro.com.tr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test Omega', 'active', 1);

SET FOREIGN_KEY_CHECKS = 1;

-- Final verification
SELECT id, email, tenant_id FROM endusers WHERE email = 'test@iwrs.com.tr';
