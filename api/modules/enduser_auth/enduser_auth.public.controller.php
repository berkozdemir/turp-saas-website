<?php
/**
 * End-User Auth Public Controller
 * Handles public endpoints for end-user signup, login, logout, and profile
 */

require_once __DIR__ . '/../../core/tenant/public_resolver.php';
require_once __DIR__ . '/enduser_auth.service.php';

function handle_enduser_auth_public(string $action): bool
{
    header('Content-Type: application/json');

    switch ($action) {
        case 'enduser_signup':
            return enduser_signup_action();
        case 'enduser_login':
            return enduser_login_action();
        case 'enduser_logout':
            return enduser_logout_action();
        case 'enduser_me':
            return enduser_me_action();
        case 'get_tenant_settings':
            return get_tenant_settings_action();
        default:
            return false;
    }
}

/**
 * POST /api?action=enduser_signup
 */
function enduser_signup_action(): bool
{
    $tenant_id = get_current_tenant_id();
    if (!$tenant_id) {
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $result = enduser_signup($tenant_id, $data);
    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_login
 */
function enduser_login_action(): bool
{
    $tenant_id = get_current_tenant_id();
    if (!$tenant_id) {
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $result = enduser_login($tenant_id, $data);
    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_logout
 */
function enduser_logout_action(): bool
{
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $token);

    if (empty($token)) {
        echo json_encode(['success' => true]);
        return true;
    }

    enduser_logout($token);
    echo json_encode(['success' => true]);
    return true;
}

/**
 * GET /api?action=enduser_me
 */
function enduser_me_action(): bool
{
    $tenant_id = get_current_tenant_id();
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $token);

    if (empty($token) || !$tenant_id) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        return true;
    }

    $user = enduser_verify_token($token, $tenant_id);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        return true;
    }

    echo json_encode(['success' => true, 'user' => $user]);
    return true;
}

/**
 * GET /api?action=get_tenant_settings
 * Returns public tenant settings including auth flags
 */
function get_tenant_settings_action(): bool
{
    $tenant_id = get_current_tenant_id();
    if (!$tenant_id) {
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $settings = get_tenant_auth_settings($tenant_id);
    echo json_encode([
        'success' => true,
        'tenant_id' => $settings['tenant_id'],
        'tenant_name' => $settings['tenant_name'] ?? $tenant_id,
        'allow_enduser_login' => (bool) ($settings['allow_enduser_login'] ?? false),
        'allow_enduser_signup' => (bool) ($settings['allow_enduser_signup'] ?? false)
    ]);
    return true;
}
