<?php
/**
 * Settings Admin Controller
 * 
 * Handles general settings and password changes.
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';

/**
 * Ensure site_settings table exists with tenant_id column
 */
function ensure_site_settings_table(PDO $conn): void
{
    $conn->exec("
        CREATE TABLE IF NOT EXISTS `site_settings` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `tenant_id` INT NOT NULL DEFAULT 1,
            `setting_key` VARCHAR(100) NOT NULL,
            `setting_value` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY `unique_tenant_key` (`tenant_id`, `setting_key`),
            INDEX `idx_settings_tenant` (`tenant_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

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

    // Ensure site_settings table exists with tenant_id column
    ensure_site_settings_table($conn);

    // 1. Get Settings
    if ($action == 'get_settings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $conn->prepare("SELECT setting_key, setting_value FROM site_settings WHERE tenant_id = ?");
        $stmt->execute([$tenant_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        // Add tenant info as defaults if not set
        if (empty($settings['site_title'])) {
            $settings['site_title'] = $ctx['tenant']['name'] ?? 'Turp SaaS';
        }

        echo json_encode(['success' => true, 'data' => $settings]);
        return true;
    }

    // 2. Update Settings
    if ($action == 'update_settings' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !is_array($data)) {
            echo json_encode(['error' => 'Invalid data']);
            return true;
        }

        // Upsert each setting
        foreach ($data as $key => $value) {
            if (!is_string($key))
                continue;

            // Check if setting exists
            $checkStmt = $conn->prepare("SELECT id FROM site_settings WHERE tenant_id = ? AND setting_key = ?");
            $checkStmt->execute([$tenant_id, $key]);

            if ($checkStmt->fetch()) {
                // Update
                $updateStmt = $conn->prepare("UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE tenant_id = ? AND setting_key = ?");
                $updateStmt->execute([$value, $tenant_id, $key]);
            } else {
                // Insert
                $insertStmt = $conn->prepare("INSERT INTO site_settings (tenant_id, setting_key, setting_value, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
                $insertStmt->execute([$tenant_id, $key, $value]);
            }
        }

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
