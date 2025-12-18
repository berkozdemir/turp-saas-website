-- Contact Messages Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255),
  `subject` VARCHAR(255) NOT NULL,
  `message_body` TEXT NOT NULL,
  `consent` BOOLEAN DEFAULT FALSE,
  `status` ENUM('new', 'read', 'archived') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `language` ENUM('tr', 'en', 'zh') NOT NULL DEFAULT 'tr',
  `author` VARCHAR(255),
  `excerpt` TEXT,
  `content` LONGTEXT,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `publish_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status`),
  INDEX `idx_language` (`language`),
  INDEX `idx_publish_at` (`publish_at`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
