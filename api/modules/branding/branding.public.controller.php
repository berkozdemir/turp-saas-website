<?php
/**
 * Branding Public Controller
 * 
 * Public endpoint for fetching tenant branding.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/branding.service.php';

function handle_branding_public(string $action): bool
{
    if ($action !== 'get_public_branding') {
        return false;
    }

    header('Content-Type: application/json');

    // Get tenant from domain/headers
    $tenant_code = get_current_tenant_code();

    if (!$tenant_code) {
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $branding = get_public_branding($tenant_code);

    echo json_encode([
        'success' => true,
        'data' => $branding
    ]);
    return true;
}
