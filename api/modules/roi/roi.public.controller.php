<?php
/**
 * ROI Settings Public Controller
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/blog.service.php';

function handle_roi_public($action)
{
    if ($action === 'get_roi_settings') {
        try {
            $conn = get_db_connection();
            $tenant_id = get_current_tenant_id() ?: 1;

            // Log for debug
            error_log("ROI Fetch started for tenant: " . $tenant_id);

            $stmt = $conn->prepare("SELECT * FROM roi_settings ORDER BY id DESC LIMIT 1");
            $stmt->execute();
            $settings = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($settings) {
                // Convert numeric types
                foreach ($settings as $key => $value) {
                    if (is_numeric($value)) {
                        $settings[$key] = (float) $value;
                    }
                }
                echo json_encode(['success' => true, 'data' => $settings]);
            } else {
                echo json_encode(['success' => false, 'error' => 'ROI settings not found']);
            }
            return true;
        } catch (Exception $e) {
            error_log("ROI ERROR: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to fetch ROI settings: ' . $e->getMessage()]);
            return true;
        }
    }
    return false;
}