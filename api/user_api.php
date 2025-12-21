<?php
// Admin User Management API
// Requires: $conn, $action

// ========================================
// ADMIN USER MANAGEMENT (Admin role only)
// ========================================

// 1. List admin users
if ($action == 'get_admin_users' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    // Only admin role can manage users
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Bu işlem için admin yetkisi gereklidir']);
        exit;
    }

    $role = $_GET['role'] ?? 'all';
    $status = $_GET['status'] ?? 'all';
    $search = $_GET['search'] ?? '';

    $query = "SELECT id, name, email, is_active, last_login_at, created_at FROM admin_users WHERE 1=1";
    $params = [];

    /* Role column missing from DB
    if ($role !== 'all') {
        $query .= " AND role = ?";
        $params[] = $role;
    }
    */

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
        // Inject fake role
        foreach ($users as &$u) {
            $u['role'] = 'admin';
        }
        echo json_encode(['success' => true, 'data' => $users]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Veritabanı hatası']);
    }
    exit;
}

// 2. Get single user
if ($action == 'get_admin_user' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

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
            echo json_encode(['error' => 'Kullanıcı bulunamadı']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Veritabanı hatası']);
    }
    exit;
}

// 3. Create admin user
if ($action == 'create_admin_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? 'editor';
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['error' => 'Ad, e-posta ve şifre zorunludur']);
        exit;
    }

    if (strlen($password) < 8) {
        echo json_encode(['error' => 'Şifre en az 8 karakter olmalıdır']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Geçersiz e-posta adresi']);
        exit;
    }

    if (!in_array($role, ['admin', 'editor', 'viewer'])) {
        $role = 'editor';
    }

    try {
        // Check if email exists
        $stmt = $conn->prepare("SELECT id FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Bu e-posta adresi zaten kayıtlı']);
            exit;
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO admin_users (name, email, password_hash, is_active) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $password_hash, $is_active]);

        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Kullanıcı oluşturulamadı']);
    }
    exit;
}

// 4. Update admin user
if ($action == 'update_admin_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = $data['id'] ?? 0;
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $role = $data['role'] ?? 'editor';
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

    if (empty($id) || empty($name) || empty($email)) {
        echo json_encode(['error' => 'ID, ad ve e-posta zorunludur']);
        exit;
    }

    if (!in_array($role, ['admin', 'editor', 'viewer'])) {
        $role = 'editor';
    }

    try {
        // Check if email exists for another user
        $stmt = $conn->prepare("SELECT id FROM admin_users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $id]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Bu e-posta başka bir kullanıcıya ait']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE admin_users SET name=?, email=?, is_active=? WHERE id=?");
        $stmt->execute([$name, $email, $is_active, $id]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Güncelleme başarısız']);
    }
    exit;
}

// 5. Delete admin user
if ($action == 'delete_admin_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    // Prevent self-deletion
    if ($id == $user['id']) {
        echo json_encode(['error' => 'Kendinizi silemezsiniz']);
        exit;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM admin_users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Silme işlemi başarısız']);
    }
    exit;
}

// 6. Reset user password (admin sends reset)
if ($action == 'reset_user_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;
    $new_password = $data['new_password'] ?? '';

    if (strlen($new_password) < 8) {
        echo json_encode(['error' => 'Şifre en az 8 karakter olmalıdır']);
        exit;
    }

    try {
        $password_hash = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$password_hash, $id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Şifre güncellenemedi']);
    }
    exit;
}
