-- ============================================
-- CHATBOT DATABASE SETUP SQL
-- Plesk PHPMyAdmin'de çalıştırılacak
-- ============================================

-- 1. chatbot_conversations tablosu
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_phone VARCHAR(50),
    context_type ENUM('podcast_hub', 'podcast_detail') NOT NULL,
    context_id INT NULL COMMENT 'podcast_id if on detail page',
    first_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    message_count INT DEFAULT 0,
    lead_saved TINYINT(1) DEFAULT 0,
    status ENUM('active', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_tenant_session (tenant_id, session_id),
    INDEX idx_tenant_email (tenant_id, user_email),
    INDEX idx_context (context_type, context_id),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. chatbot_messages tablosu
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    metadata JSON COMMENT 'DeepSeek usage stats, RAG sources',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. chatbot_knowledge_index tablosu (RAG için)
CREATE TABLE IF NOT EXISTS chatbot_knowledge_index (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    source_type ENUM('podcast', 'blog', 'faq', 'static') NOT NULL,
    source_id INT NULL COMMENT 'ID in source table',
    title VARCHAR(500),
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'tr',
    metadata JSON COMMENT 'tags, category, publish_date',
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_tenant_source (tenant_id, source_type, source_id),
    INDEX idx_language (language),
    FULLTEXT INDEX ft_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. contact_submissions tablosunu güncelle
ALTER TABLE contact_submissions
ADD COLUMN source VARCHAR(50) DEFAULT 'contact_form' COMMENT 'contact_form, chatbot, nipt_form' AFTER pricing_tier,
ADD COLUMN chatbot_conversation_id INT NULL AFTER source,
ADD INDEX idx_source (source);

-- ============================================
-- Kurulum tamamlandı!
-- ============================================
