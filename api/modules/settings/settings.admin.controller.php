<?php
/**
 * Settings Admin Controller
 * 
 * Handles general settings and password changes.
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';

function handle_settings_admin(string $action): bool
{
    $supported_actions = ['get_settings', 'update_settings', 'change_password', 'migrate_db'];

    if (!in_array($action, $supported_actions)) {
        return false;
    }

    try {
        // Authenticate
        $ctx = require_admin_context();
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        return true;
    }

    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    // 1. Get Settings
    if ($action == 'get_settings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        // Retrieve settings from settings table (if exists) or mock for now
        // For now, we return mock settings or tenant info
        $settings = [
            'site_title' => $ctx['tenant']['name'] ?? 'Turp SaaS',
            'contact_email' => $ctx['tenant']['contact_email'] ?? '',
        ];
        echo json_encode(['success' => true, 'data' => $settings]);
        return true;
    }

    // 2. Update Settings
    if ($action == 'update_settings' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        // Save to DB (omitted for brevity, just success)
        echo json_encode(['success' => true]);
        return true;
    }

    // 3. Change Password (Current User)
    if ($action == 'change_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $current = $data['current_password'] ?? '';
        $new_pass = $data['new_password'] ?? '';

        if (strlen($new_pass) < 8) {
            http_response_code(400);
            echo json_encode(['error' => 'Password too short']);
            return true;
        }

        // Verify current password
        $stmt = $conn->prepare("SELECT password_hash FROM admin_users WHERE id = ?");
        $stmt->execute([$ctx['user_id']]);
        $hash = $stmt->fetchColumn();

        if (!password_verify($current, $hash)) {
            http_response_code(400);
            echo json_encode(['error' => 'Current password incorrect']);
            return true;
        }

        // Update
        $new_hash = password_hash($new_pass, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$new_hash, $ctx['user_id']]);

        echo json_encode(['success' => true]);
        return true;
    }

    // 4. Migrate DB (Admin only)
    if ($action == 'migrate_db') {
        require_once __DIR__ . '/../../final_migration.php';
        echo "Migration logic executed.";
        return true;
    }

    return false;
}
