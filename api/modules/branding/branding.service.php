<?php
/**
 * Branding Service
 * 
 * Business logic for per-tenant branding configuration.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Default branding values
 */
function get_default_branding(): array
{
    return [
        'logo_light_url' => null,
        'logo_dark_url' => null,
        'favicon_url' => null,
        'login_hero_image' => null,
        'primary_color' => '#6366f1',
        'secondary_color' => '#8b5cf6',
        'accent_color' => '#10b981',
        'background_color' => '#ffffff',
        'text_color_primary' => '#1f2937',
        'text_color_muted' => '#6b7280',
        'font_family_base' => 'Inter',
        'font_family_heading' => 'Inter',
        'border_radius' => '0.5rem',
        'instagram_url' => null,
        'facebook_url' => null,
        'linkedin_url' => null,
        'x_twitter_url' => null,
        'youtube_url' => null,
        'tiktok_url' => null,
        'whatsapp_url' => null
    ];
}

/**
 * Ensure branding_configs table exists
 */
function ensure_branding_table(): void
{
    $conn = get_db_connection();
    $conn->exec("
        CREATE TABLE IF NOT EXISTS `branding_configs` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `tenant_id` VARCHAR(50) NOT NULL UNIQUE,
            `logo_light_url` VARCHAR(500),
            `logo_dark_url` VARCHAR(500),
            `favicon_url` VARCHAR(500),
            `login_hero_image` VARCHAR(500),
            `primary_color` VARCHAR(7) DEFAULT '#6366f1',
            `secondary_color` VARCHAR(7) DEFAULT '#8b5cf6',
            `accent_color` VARCHAR(7) DEFAULT '#10b981',
            `background_color` VARCHAR(7) DEFAULT '#ffffff',
            `text_color_primary` VARCHAR(7) DEFAULT '#1f2937',
            `text_color_muted` VARCHAR(7) DEFAULT '#6b7280',
            `font_family_base` VARCHAR(100) DEFAULT 'Inter',
            `font_family_heading` VARCHAR(100) DEFAULT 'Inter',
            `border_radius` VARCHAR(20) DEFAULT '0.5rem',
            `instagram_url` VARCHAR(500),
            `facebook_url` VARCHAR(500),
            `linkedin_url` VARCHAR(500),
            `x_twitter_url` VARCHAR(500),
            `youtube_url` VARCHAR(500),
            `tiktok_url` VARCHAR(500),
            `whatsapp_url` VARCHAR(500),
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `updated_by` INT,
            INDEX `idx_tenant` (`tenant_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Add login_hero_image column if it doesn't exist (for existing tables)
    try {
        $stmt = $conn->query("SHOW COLUMNS FROM branding_configs LIKE 'login_hero_image'");
        if ($stmt->rowCount() === 0) {
            $conn->exec("ALTER TABLE branding_configs ADD COLUMN `login_hero_image` VARCHAR(500) AFTER `favicon_url`");
        }
    } catch (Exception $e) {
        // Ignore errors - column might already exist
    }
}

/**
 * Get branding config for a tenant
 * 
 * @param int $tenant_id
 * @return array Branding config with defaults applied
 */
function get_branding_config(string $tenant_id): array
{
    $conn = get_db_connection();
    ensure_branding_table();

    $stmt = $conn->prepare("SELECT * FROM branding_configs WHERE tenant_id = ?");
    $stmt->execute([$tenant_id]);
    $config = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$config) {
        return array_merge(get_default_branding(), ['tenant_id' => $tenant_id]);
    }

    // Merge with defaults to fill any nulls
    $defaults = get_default_branding();
    foreach ($defaults as $key => $default) {
        if (!isset($config[$key]) || $config[$key] === null || $config[$key] === '') {
            $config[$key] = $default;
        }
    }

    return $config;
}

/**
 * Save branding config for a tenant (upsert)
 * 
 * @param int $tenant_id
 * @param array $data Branding data
 * @param int|null $user_id Updated by user ID
 * @return bool Success
 */
function save_branding_config(string $tenant_id, array $data, ?int $user_id = null): bool
{
    $conn = get_db_connection();
    ensure_branding_table();

    // Check if exists
    $stmt = $conn->prepare("SELECT id FROM branding_configs WHERE tenant_id = ?");
    $stmt->execute([$tenant_id]);
    $exists = $stmt->fetch();

    $fields = [
        'logo_light_url',
        'logo_dark_url',
        'favicon_url',
        'login_hero_image',
        'primary_color',
        'secondary_color',
        'accent_color',
        'background_color',
        'text_color_primary',
        'text_color_muted',
        'font_family_base',
        'font_family_heading',
        'border_radius',
        'instagram_url',
        'facebook_url',
        'linkedin_url',
        'x_twitter_url',
        'youtube_url',
        'tiktok_url',
        'whatsapp_url'
    ];

    if ($exists) {
        // Update
        $setParts = [];
        $values = [];
        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $setParts[] = "`$field` = ?";
                $values[] = $data[$field] ?: null;
            }
        }
        $setParts[] = "`updated_by` = ?";
        $values[] = $user_id;
        $values[] = $tenant_id;

        $sql = "UPDATE branding_configs SET " . implode(', ', $setParts) . " WHERE tenant_id = ?";
        $stmt = $conn->prepare($sql);
        return $stmt->execute($values);
    } else {
        // Insert
        $insertFields = ['tenant_id'];
        $placeholders = ['?'];
        $values = [$tenant_id];

        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $insertFields[] = "`$field`";
                $placeholders[] = '?';
                $values[] = $data[$field] ?: null;
            }
        }

        $insertFields[] = '`updated_by`';
        $placeholders[] = '?';
        $values[] = $user_id;

        $sql = "INSERT INTO branding_configs (" . implode(', ', $insertFields) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $conn->prepare($sql);
        return $stmt->execute($values);
    }
}

/**
 * Get branding for public display (simplified structure)
 * 
 * @param int $tenant_id
 * @return array Public branding data
 */
function get_public_branding(string $tenant_id): array
{
    $config = get_branding_config($tenant_id);

    return [
        'logo' => [
            'light' => $config['logo_light_url'],
            'dark' => $config['logo_dark_url']
        ],
        'favicon' => $config['favicon_url'],
        'loginHeroImage' => $config['login_hero_image'],
        'colors' => [
            'primary' => $config['primary_color'],
            'secondary' => $config['secondary_color'],
            'accent' => $config['accent_color'],
            'background' => $config['background_color'],
            'textPrimary' => $config['text_color_primary'],
            'textMuted' => $config['text_color_muted']
        ],
        'typography' => [
            'fontBase' => $config['font_family_base'],
            'fontHeading' => $config['font_family_heading'],
            'borderRadius' => $config['border_radius']
        ],
        'social' => array_filter([
            'instagram' => $config['instagram_url'],
            'facebook' => $config['facebook_url'],
            'linkedin' => $config['linkedin_url'],
            'twitter' => $config['x_twitter_url'],
            'youtube' => $config['youtube_url'],
            'tiktok' => $config['tiktok_url'],
            'whatsapp' => $config['whatsapp_url']
        ])
    ];
}
