<?php
/**
 * Legal Public Controller
 * 
 * Handles public API requests for legal documents.
 */

require_once __DIR__ . '/legal.service.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';

/**
 * Handle public legal actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_legal_public(string $action): bool
{
    if ($action === 'get_legal_doc_public') {
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
    }
    return false;
}
