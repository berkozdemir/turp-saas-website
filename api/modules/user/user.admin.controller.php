<?php
/**
 * User Admin Controller
 * 
 * Handles admin user management: list, create, update, delete, reset password.
 */

// Add missing dependencies if not loaded
require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';

function handle_user_admin(string $action): bool
{
    // Define supported actions
    $supported_actions = [
        'get_admin_users',
        'get_admin_user',
        'create_admin_user',
        'update_admin_user',
        'delete_admin_user',
        'reset_user_password'
    ];

    if (!in_array($action, $supported_actions)) {
        return false;
    }

    // Require Admin Context
    try {
        $ctx = require_admin_context();
        // Additional check: Only 'admin' role in the system can manage users
        // Although require_admin_context ensures they are an admin of the tenant,
        // user management might be restricted to super admins or specific roles.
        // For now, we assume any admin can manage users.
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: ' . $e->getMessage()]);
        return true;
    }

    $conn = get_db_connection();

    // 1. List admin users
    if ($action == 'get_admin_users' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? 'all';

        $query = "SELECT id, name, email, is_active, last_login_at, created_at FROM admin_users WHERE 1=1";
        $params = [];

        if ($status !== 'all') {
            $query .= " AND is_active = ?";
            $params[] = $status === 'active' ? 1 : 0;
        }

        if (!empty($search)) {
            $query .= " AND (name LIKE ? OR email LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $query .= " ORDER BY created_at DESC";

        try {
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Inject fake role for UI compatibility if needed, or fetch from tenant table
            // For now, simpler list
            foreach ($users as &$u) {
                $u['role'] = 'admin';
            }
            echo json_encode(['success' => true, 'data' => $users]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        return true;
    }

    // 2. Get single user
    if ($action == 'get_admin_user' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $id = $_GET['id'] ?? 0;
        try {
            $stmt = $conn->prepare("SELECT id, name, email, is_active, last_login_at, created_at FROM admin_users WHERE id = ?");
            $stmt->execute([$id]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($userData)
                $userData['role'] = 'admin';

            if ($userData) {
                echo json_encode(['success' => true, 'data' => $userData]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
        return true;
    }

    // 3. Create admin user
    if ($action == 'create_admin_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $role = $data['role'] ?? 'editor';
        $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

        if (empty($name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return true;
        }

        try {
            // Check email
            $stmt = $conn->prepare("SELECT id FROM admin_users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'Email already exists']);
                return true;
            }

            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO admin_users (name, email, password_hash, is_active) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $email, $password_hash, $is_active]);
            $new_user_id = $conn->lastInsertId();

            // Assign to current tenant
            $stmt = $conn->prepare("INSERT INTO admin_user_tenants (user_id, tenant_id, role) VALUES (?, ?, ?)");
            $stmt->execute([$new_user_id, $ctx['tenant_id'], $role]);

            echo json_encode(['success' => true, 'id' => $new_user_id]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Creation failed: ' . $e->getMessage()]);
        }
        return true;
    }

    // 4. Update admin user
    if ($action == 'update_admin_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $data['id'] ?? 0;
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID']);
            return true;
        }

        try {
            $stmt = $conn->prepare("UPDATE admin_users SET name=?, email=?, is_active=? WHERE id=?");
            $stmt->execute([$name, $email, $is_active, $id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Update failed: ' . $e->getMessage()]);
        }
        return true;
    }

    // 5. Delete admin user
    if ($action == 'delete_admin_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $data['id'] ?? 0;

        if ($id == $ctx['user_id']) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot delete yourself']);
            return true;
        }

        try {
            $stmt = $conn->prepare("DELETE FROM admin_users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Deletion failed']);
        }
        return true;
    }

    // 6. Reset password
    if ($action == 'reset_user_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $data['id'] ?? 0;
        $new_password = $data['new_password'] ?? '';

        if (strlen($new_password) < 8) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 8 chars']);
            return true;
        }

        try {
            $hash = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$hash, $id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Reset failed']);
        }
        return true;
    }

    return false;
}
