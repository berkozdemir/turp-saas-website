<?php
/**
 * Landing Service
 * 
 * Business logic for landing page configuration.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Get landing config for tenant
 */
function landing_get_config(int $tenant_id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM iwrs_saas_landing_configs WHERE tenant_id = ?");
    $stmt->execute([$tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Save landing config
 */
function landing_save_config(int $tenant_id, array $data): bool
{
    $conn = get_db_connection();

    // Check if exists
    $existing = landing_get_config($tenant_id);

    if ($existing) {
        $stmt = $conn->prepare("
            UPDATE iwrs_saas_landing_configs SET 
                hero_title=?, hero_title_line2=?, hero_subtitle=?, hero_cta_text=?, hero_cta_link=?,
                hero_bg_gradient_from=?, hero_bg_gradient_to=?,
                features_title=?, features_json=?,
                stats_json=?, testimonials_json=?,
                cta_title=?, cta_description=?, cta_button_text=?, cta_button_link=?
            WHERE tenant_id=?
        ");
        return $stmt->execute([
            $data['hero_title'] ?? '',
            $data['hero_title_line2'] ?? '',
            $data['hero_subtitle'] ?? '',
            $data['hero_cta_text'] ?? 'Get Started',
            $data['hero_cta_link'] ?? '#',
            $data['hero_bg_gradient_from'] ?? '#667eea',
            $data['hero_bg_gradient_to'] ?? '#764ba2',
            $data['features_title'] ?? 'Features',
            json_encode($data['features'] ?? []),
            json_encode($data['stats'] ?? []),
            json_encode($data['testimonials'] ?? []),
            $data['cta_title'] ?? '',
            $data['cta_description'] ?? '',
            $data['cta_button_text'] ?? 'Contact Us',
            $data['cta_button_link'] ?? '/contact',
            $tenant_id
        ]);
    } else {
        $stmt = $conn->prepare("
            INSERT INTO iwrs_saas_landing_configs 
            (tenant_id, hero_title, hero_title_line2, hero_subtitle, hero_cta_text, hero_cta_link,
             hero_bg_gradient_from, hero_bg_gradient_to,
             features_title, features_json, stats_json, testimonials_json,
             cta_title, cta_description, cta_button_text, cta_button_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $tenant_id,
            $data['hero_title'] ?? '',
            $data['hero_title_line2'] ?? '',
            $data['hero_subtitle'] ?? '',
            $data['hero_cta_text'] ?? 'Get Started',
            $data['hero_cta_link'] ?? '#',
            $data['hero_bg_gradient_from'] ?? '#667eea',
            $data['hero_bg_gradient_to'] ?? '#764ba2',
            $data['features_title'] ?? 'Features',
            json_encode($data['features'] ?? []),
            json_encode($data['stats'] ?? []),
            json_encode($data['testimonials'] ?? []),
            $data['cta_title'] ?? '',
            $data['cta_description'] ?? '',
            $data['cta_button_text'] ?? 'Contact Us',
            $data['cta_button_link'] ?? '/contact'
        ]);
    }
}
