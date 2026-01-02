<?php
/**
 * End-User Auth Admin Controller
 * Admin endpoints for managing end-user auth settings per tenant
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/enduser_auth.service.php';

function handle_enduser_auth_admin(string $action): bool
{
    switch ($action) {
        case 'get_tenant_auth_settings':
            return get_tenant_auth_settings_admin();
        case 'update_tenant_auth_settings':
            return update_tenant_auth_settings_admin();
        case 'list_endusers':
            return list_endusers_admin();
        default:
            return false;
    }
}

/**
 * GET /api?action=get_tenant_auth_settings
 */
function get_tenant_auth_settings_admin(): bool
{
    header('Content-Type: application/json');

    $tenant_id = get_current_tenant_id();
    if (!$tenant_id) {
        echo json_encode(['error' => 'Tenant not resolved']);
        return true;
    }

    $settings = get_tenant_auth_settings($tenant_id);
    echo json_encode([
        'success' => true,
        'allow_login' => (bool) ($settings['allow_enduser_login'] ?? false),
        'allow_signup' => (bool) ($settings['allow_enduser_signup'] ?? false)
    ]);
    return true;
}

/**
 * POST /api?action=update_tenant_auth_settings
 */
function update_tenant_auth_settings_admin(): bool
{
    header('Content-Type: application/json');

    $ctx = require_admin_context();
    if (!$ctx) {
        echo json_encode(['error' => 'Unauthorized']);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $tenant_id = $data['tenant_id'] ?? $ctx['tenant_id'];
    $allow_login = (bool) ($data['allow_login'] ?? false);
    $allow_signup = (bool) ($data['allow_signup'] ?? false);

    $result = update_tenant_auth_settings($tenant_id, $allow_login, $allow_signup);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Ayarlar kaydedilemedi']);
    }
    return true;
}

/**
 * GET /api?action=list_endusers
 */
function list_endusers_admin(): bool
{
    header('Content-Type: application/json');

    $ctx = require_admin_context();
    if (!$ctx) {
        echo json_encode(['error' => 'Unauthorized']);
        return true;
    }

    $tenant_id = $_GET['tenant_id'] ?? $ctx['tenant_id'];

    require_once __DIR__ . '/../../config/db.php';
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        SELECT id, email, name, phone, status, email_verified, created_at, last_login
        FROM endusers 
        WHERE tenant_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$tenant_id]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'users' => $users]);
    return true;
}
