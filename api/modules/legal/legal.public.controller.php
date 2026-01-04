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
            // 1. Resolve Tenant ID (Standardized: INT)
            $tenant_id = get_current_tenant_id();

            // 2. Fetch Documents using ID
            $type = $_GET['type'] ?? 'all';

            if ($type === 'all') {
                $docs = legal_list($tenant_id);
                json_response($docs);
            } else {
                $doc = legal_get_by_type($tenant_id, $type);
                if ($doc) {
                    json_response($doc);
                } else {
                    json_response(['error' => 'Document not found'], 404);
                }
            }
            return true;
        default:
            return false;
    }
}
