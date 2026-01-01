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

    // Legal docs are usually static or handled by service without DB sometimes,
    // but better safe than sorry if it extends.
    // Actually legal service might use it.

    switch ($action) {
        case 'get_legal_doc_public':
            $tenant_code = get_current_tenant_code();
            $key = $_GET['key'] ?? '';

            if (empty($key)) {
                echo json_encode(['success' => false, 'error' => 'Key required']);
                return true;
            }

            $doc = legal_get_by_type($tenant_code, $key);

            if ($doc) {
                echo json_encode(['success' => true, 'data' => $doc]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Document not found']);
            }
            return true;
        default:
            return false;
    }
}
