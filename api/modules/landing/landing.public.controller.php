<?php
/**
 * Landing Public Controller
 * 
 * Handles public API requests for landing page configuration.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/landing.service.php';

/**
 * Handle public landing actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_landing_public(string $action): bool
{
    if ($action === 'get_landing_config_public') {
        $conn = get_db_connection();
        $tenant_code = get_current_tenant_code();
        $config = landing_get_config($tenant_code);

        if ($config) {
            // Decode JSON fields
            if (isset($config['features_json']))
                $config['features'] = json_decode($config['features_json'], true);
            if (isset($config['stats_json']))
                $config['stats'] = json_decode($config['stats_json'], true);
            if (isset($config['testimonials_json']))
                $config['testimonials'] = json_decode($config['testimonials_json'], true);

            echo json_encode(['success' => true, 'data' => $config]);
        } else {
            // Return default config if not found to avoid frontend breaking
            echo json_encode(['success' => true, 'data' => null]);
        }
        return true;
    }
    return false;
}
