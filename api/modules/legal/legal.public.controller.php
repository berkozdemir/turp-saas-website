<?php
/**
 * Legal Public Controller
 * 
 * Handles public API requests for legal documents.
 */

require_once __DIR__ . '/legal.service.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';

/**
 * Handle public legal actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_legal_public(string $action): bool
{
    global $conn;
    $conn = get_db_connection();

    switch ($action) {
        case 'get_legal_doc_public':
            // 1. Resolve Tenant ID (Standardized: INT)
            $tenant_id = get_current_tenant_id();

            // Support both 'key' and 'type' parameters (frontend uses 'key', legacy uses 'type')
            $type = $_GET['key'] ?? $_GET['type'] ?? 'all';

            if ($type === 'all') {
                $docs = legal_list($tenant_id);
                // Wrap in standard response format
                echo json_encode(['success' => true, 'data' => $docs]);
            } else {
                $doc = legal_get_by_type($tenant_id, $type);
                if ($doc) {
                    // Wrap in standard response format expected by frontend
                    echo json_encode(['success' => true, 'data' => $doc]);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'Document not found', 'data' => null]);
                }
            }
            return true;
        default:
            return false;
    }
}

