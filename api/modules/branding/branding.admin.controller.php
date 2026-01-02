<?php
/**
 * Branding Admin Controller
 * 
 * Admin endpoints for managing per-tenant branding configuration.
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/branding.service.php';

function handle_branding_admin(string $action): bool
{
    $supported_actions = ['get_branding', 'save_branding'];

    if (!in_array($action, $supported_actions)) {
        return false;
    }

    switch ($action) {
        case 'get_branding':
            return branding_admin_get();
        case 'save_branding':
            return branding_admin_save();
        default:
            return false;
    }
}

/**
 * GET ?action=get_branding
 * Returns branding config for current tenant
 */
function branding_admin_get(): bool
{
    header('Content-Type: application/json');

    $ctx = require_admin_context();
    $tenant_id = $ctx['tenant_id'];

    $config = get_branding_config($tenant_id);

    echo json_encode([
        'success' => true,
        'data' => $config
    ]);
    return true;
}

/**
 * POST ?action=save_branding
 * Saves branding config for current tenant
 */
function branding_admin_save(): bool
{
    header('Content-Type: application/json');

    $ctx = require_admin_context();
    $tenant_id = $ctx['tenant_id'];
    $user_id = $ctx['user_id'];

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    if (empty($data)) {
        echo json_encode(['error' => 'No data provided']);
        return true;
    }

    $result = save_branding_config($tenant_id, $data, $user_id);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to save branding config']);
    }
    return true;
}
