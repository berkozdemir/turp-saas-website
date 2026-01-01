<?php
/**
 * Consent Public Controller
 * 
 * Handles public API requests for cookie consent configuration.
 */

require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/consent.service.php';

/**
 * Handle public consent actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_consent_public(string $action): bool
{
    global $conn;
    if (!isset($conn)) {
        $conn = get_db_connection();
    }

    if ($action === 'get_consent_config' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            $tenant_id = get_current_tenant_id();
            $user_ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

            // Get region from IP
            $geo = get_region_from_ip($user_ip);

            // Get tenant consent settings from site_settings
            $stmt = $conn->prepare("SELECT setting_value FROM site_settings 
                                    WHERE tenant_id = ? AND setting_key = 'consent_config'");
            $stmt->execute([$tenant_id]);
            $config_row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Default configuration if not set
            $config = $config_row ? json_decode($config_row['setting_value'], true) : [
                'show_cookie_banner' => true,
                'geo_targeting_enabled' => false,
                'default_language' => 'tr',
                'legal_links' => [
                    'privacy_policy_key' => 'privacy_policy',
                    'cookie_policy_key' => 'cookie_policy'
                ]
            ];

            // Determine language
            $lang = detect_preferred_language($config['default_language'] ?? 'tr');

            // Check if banner should show for this region
            $show_banner = $config['show_cookie_banner'] ?? true;
            if ($config['geo_targeting_enabled'] ?? false) {
                $allowed_regions = $config['regions'] ?? ['EU'];
                $show_banner = in_array($geo['region'], $allowed_regions);
            }

            // Get legal document URLs for this tenant and language
            $legal_links = [];
            $legal_config = $config['legal_links'] ?? [];

            foreach ($legal_config as $link_type => $doc_key) {
                $stmt = $conn->prepare("SELECT `key` FROM legal_documents 
                                        WHERE tenant_id = ? AND `key` = ? AND is_active = 1 
                                        LIMIT 1");
                $stmt->execute([$tenant_id, $doc_key]);
                $doc = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($doc) {
                    $legal_links[$link_type] = "/{$lang}/legal/{$doc_key}";
                }
            }

            // Get banner text (with overrides or defaults)
            $banner_text = $config['banner_text_overrides'][$lang] ?? null;

            if (!$banner_text) {
                $defaults = [
                    'tr' => [
                        'title' => 'Çerez Kullanımı',
                        'description' => 'Web sitemizde deneyiminizi geliştirmek için çerezler kullanıyoruz. Kabul ederek tüm çerezlere izin verirsiniz.',
                        'accept_button' => 'Kabul Et',
                        'reject_button' => 'Reddet',
                        'manage_button' => 'Tercihleri Yönet'
                    ],
                    'en' => [
                        'title' => 'Cookie Usage',
                        'description' => 'We use cookies to improve your experience on our website. By accepting, you allow all cookies.',
                        'accept_button' => 'Accept',
                        'reject_button' => 'Reject',
                        'manage_button' => 'Manage Preferences'
                    ],
                    'zh' => [
                        'title' => 'Cookie使用',
                        'description' => '我们使用Cookie来改善您在我们网站上的体验。接受即表示您允许所有Cookie。',
                        'accept_button' => '接受',
                        'reject_button' => '拒绝',
                        'manage_button' => '管理偏好'
                    ]
                ];
                $banner_text = $defaults[$lang] ?? $defaults['tr'];
            }

            echo json_encode([
                'success' => true,
                'data' => [
                    'show_banner' => $show_banner,
                    'language' => $lang,
                    'region' => $geo['region'],
                    'country' => $geo['country'],
                    'is_eu' => $geo['is_eu'],
                    'banner_text' => $banner_text,
                    'legal_links' => $legal_links
                ]
            ]);
            return true;
        } catch (Exception $e) {
            error_log("Consent config error: " . $e->getMessage());
            echo json_encode([
                'success' => true,
                'data' => [
                    'show_banner' => false
                ]
            ]);
            return true;
        }
    }

    if ($action === 'save_consent' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $tenant_id = get_current_tenant($conn);
            $user_ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $ip_hash = hash('sha256', $user_ip . '_' . $tenant_id);

            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $consent_details = $data['consent_details'] ?? [
                'essential' => true,
                'analytics' => false,
                'marketing' => false
            ];

            $geo = get_region_from_ip($user_ip);
            $browser_lang = detect_preferred_language();

            $stmt = $conn->prepare("INSERT INTO cookie_consents 
                                    (tenant_id, user_ip_hash, region, country, browser_language, consent_details, consent_version)
                                    VALUES (?, ?, ?, ?, ?, ?, '1.0')");
            $stmt->execute([
                $tenant_id,
                $ip_hash,
                $geo['region'] ?? 'UNKNOWN',
                $geo['country'] ?? 'XX',
                $browser_lang,
                json_encode($consent_details)
            ]);

            echo json_encode([
                'success' => true,
                'message' => 'Consent saved successfully'
            ]);
            return true;
        } catch (Exception $e) {
            error_log("Save consent error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'error' => 'Failed to save consent'
            ]);
            return true;
        }
    }

    return false;
}
