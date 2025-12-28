<?php
/**
 * Authentication Service
 * 
 * Handles admin user authentication: login, logout, token management.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../tenant/tenant.service.php';

/**
 * Authenticate user by email and password
 * 
 * @param string $email
 * @param string $password
 * @return array|null User data with token and tenants, or null on failure
 */
function auth_login(string $email, string $password, bool $remember_me = false): ?array
{
    $conn = get_db_connection();

    // Find user
    $stmt = $conn->prepare("SELECT id, email, password_hash, name, role FROM admin_users WHERE email = ? AND is_active = 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        return null;
    }

    // Create session token
    $token = bin2hex(random_bytes(32));
    $expires_days = $remember_me ? 7 : 1;
    $expires_at = date('Y-m-d H:i:s', strtotime("+{$expires_days} days"));
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $stmt = $conn->prepare("INSERT INTO admin_sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user['id'], $token, $ip_address, $user_agent, $expires_at]);

    // Update last login
    $stmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    // Get user's tenants
    $tenants = get_user_tenants($user['id']);

    return [
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role']
        ],
        'tenants' => $tenants
    ];
}

/**
 * Verify session token and return user ID
 * 
 * @param string $token
 * @return int|null User ID or null if invalid
 */
function auth_verify_token(string $token): ?int
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        SELECT s.user_id, s.expires_at, u.is_active
        FROM admin_sessions s
        JOIN admin_users u ON s.user_id = u.id
        WHERE s.token = ?
    ");
    $stmt->execute([$token]);
    $session = $stmt->fetch();

    if (!$session) {
        return null;
    }

    if (!$session['is_active']) {
        return null;
    }

    if (strtotime($session['expires_at']) < time()) {
        // Token expired, clean up
        $stmt = $conn->prepare("DELETE FROM admin_sessions WHERE token = ?");
        $stmt->execute([$token]);
        return null;
    }

    return (int) $session['user_id'];
}

/**
 * Logout - invalidate session token
 * 
 * @param string $token
 * @return bool Success
 */
function auth_logout(string $token): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM admin_sessions WHERE token = ?");
    return $stmt->execute([$token]);
}

/**
 * Get user by ID
 * 
 * @param int $user_id
 * @return array|null User data
 */
function get_user_by_id(int $user_id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT id, email, name, role, last_login FROM admin_users WHERE id = ? AND is_active = 1");
    $stmt->execute([$user_id]);
    return $stmt->fetch() ?: null;
}
