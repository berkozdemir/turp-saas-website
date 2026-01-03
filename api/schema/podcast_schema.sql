-- Podcast Module Schema
--
-- Table structure for table `podcasts`
--

CREATE TABLE IF NOT EXISTS `podcasts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenant_id` int(11) NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `full_description` mediumtext COLLATE utf8mb4_unicode_ci,
  `audio_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Cloudflare R2 or External URL',
  `external_links` json DEFAULT NULL COMMENT 'JSON: spotify, apple, google, etc.',
  `duration_seconds` int(11) DEFAULT 0,
  `publish_date` datetime DEFAULT NULL,
  `status` enum('draft','scheduled','published','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `cover_image_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'tr',
  `extra_images` json DEFAULT NULL,
  `extra_videos` json DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tenant_slug_lang` (`tenant_id`,`slug`,`language`),
  KEY `idx_tenant_status_date` (`tenant_id`,`status`,`publish_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
