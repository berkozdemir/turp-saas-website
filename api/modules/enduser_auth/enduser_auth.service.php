<?php
/**
 * End-User Authentication Service
 * Handles signup, login, and session management for end-users (not admin)
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Ensure endusers and enduser_sessions tables exist
 */
function ensure_enduser_tables(): void
{
    $conn = get_db();

    // Create endusers table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS `endusers` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `tenant_id` VARCHAR(50) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `password_hash` VARCHAR(255) NOT NULL,
            `name` VARCHAR(255),
            `phone` VARCHAR(50),
            `status` ENUM('active', 'pending', 'disabled') DEFAULT 'pending',
            `email_verified` BOOLEAN DEFAULT FALSE,
            `verification_token` VARCHAR(64) NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `last_login` TIMESTAMP NULL,
            UNIQUE KEY `unique_email_tenant` (`email`, `tenant_id`),
            INDEX `idx_enduser_tenant` (`tenant_id`),
            INDEX `idx_enduser_email` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Create sessions table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS `enduser_sessions` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `tenant_id` VARCHAR(50) NOT NULL,
            `token` VARCHAR(255) UNIQUE NOT NULL,
            `ip_address` VARCHAR(45),
            `user_agent` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `expires_at` TIMESTAMP NOT NULL,
            INDEX `idx_enduser_session_token` (`token`),
            INDEX `idx_enduser_session_expires` (`expires_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

/**
 * Check if tenant allows end-user signup
 */
function enduser_signup_allowed(string $tenant_id): bool
{
    $conn = get_db();
    $stmt = $conn->prepare("SELECT allow_enduser_signup FROM tenant_configs WHERE tenant_id = ?");
    $stmt->execute([$tenant_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result && $result['allow_enduser_signup'];
}

/**
 * Check if tenant allows end-user login
 */
function enduser_login_allowed(string $tenant_id): bool
{
    $conn = get_db();
    $stmt = $conn->prepare("SELECT allow_enduser_login FROM tenant_configs WHERE tenant_id = ?");
    $stmt->execute([$tenant_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result && $result['allow_enduser_login'];
}

/**
 * Register a new end-user
 */
function enduser_signup(string $tenant_id, array $data): array
{
    ensure_enduser_tables();

    if (!enduser_signup_allowed($tenant_id)) {
        return ['error' => 'Bu site için kullanıcı kaydı aktif değil'];
    }

    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $name = trim($data['name'] ?? '');
    $phone = trim($data['phone'] ?? '');

    // Validation
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['error' => 'Geçerli bir e-posta adresi girin'];
    }
    if (strlen($password) < 6) {
        return ['error' => 'Şifre en az 6 karakter olmalı'];
    }

    $conn = get_db();

    // Check if email already exists for this tenant
    $stmt = $conn->prepare("SELECT id FROM endusers WHERE email = ? AND tenant_id = ?");
    $stmt->execute([$email, $tenant_id]);
    if ($stmt->fetch()) {
        return ['error' => 'Bu e-posta adresi zaten kayıtlı'];
    }

    // Create user
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $verification_token = bin2hex(random_bytes(32));

    $stmt = $conn->prepare("
        INSERT INTO endusers (tenant_id, email, password_hash, name, phone, status, verification_token)
        VALUES (?, ?, ?, ?, ?, 'active', ?)
    ");
    $stmt->execute([$tenant_id, $email, $password_hash, $name, $phone, $verification_token]);
    $user_id = $conn->lastInsertId();

    // Auto-login after signup
    $token = enduser_create_session($user_id, $tenant_id);

    return [
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user_id,
            'email' => $email,
            'name' => $name
        ]
    ];
}

/**
 * Login an end-user
 */
function enduser_login(string $tenant_id, array $data): array
{
    ensure_enduser_tables();

    if (!enduser_login_allowed($tenant_id)) {
        return ['error' => 'Bu site için kullanıcı girişi aktif değil'];
    }

    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        return ['error' => 'E-posta ve şifre gerekli'];
    }

    $conn = get_db();
    $stmt = $conn->prepare("
        SELECT id, email, password_hash, name, status 
        FROM endusers 
        WHERE email = ? AND tenant_id = ?
    ");
    $stmt->execute([$email, $tenant_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return ['error' => 'E-posta veya şifre hatalı'];
    }

    if (!password_verify($password, $user['password_hash'])) {
        return ['error' => 'E-posta veya şifre hatalı'];
    }

    if ($user['status'] !== 'active') {
        return ['error' => 'Hesabınız aktif değil'];
    }

    // Update last login
    $stmt = $conn->prepare("UPDATE endusers SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    // Create session
    $token = enduser_create_session($user['id'], $tenant_id);

    return [
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name']
        ]
    ];
}

/**
 * Create a session for an end-user
 */
function enduser_create_session(int $user_id, string $tenant_id): string
{
    $conn = get_db();
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+30 days'));
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $stmt = $conn->prepare("
        INSERT INTO enduser_sessions (user_id, tenant_id, token, ip_address, user_agent, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$user_id, $tenant_id, $token, $ip, $ua, $expires]);

    return $token;
}

/**
 * Verify a session token and return user data
 */
function enduser_verify_token(string $token, string $tenant_id): ?array
{
    $conn = get_db();
    $stmt = $conn->prepare("
        SELECT u.id, u.email, u.name, u.phone, u.status
        FROM enduser_sessions s
        JOIN endusers u ON s.user_id = u.id
        WHERE s.token = ? AND s.tenant_id = ? AND s.expires_at > NOW() AND u.status = 'active'
    ");
    $stmt->execute([$token, $tenant_id]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

/**
 * Logout (delete session)
 */
function enduser_logout(string $token): bool
{
    $conn = get_db();
    $stmt = $conn->prepare("DELETE FROM enduser_sessions WHERE token = ?");
    $stmt->execute([$token]);
    return $stmt->rowCount() > 0;
}

/**
 * Get tenant auth settings
 */
function get_tenant_auth_settings(string $tenant_id): array
{
    $conn = get_db();

    // Ensure columns exist
    try {
        $conn->exec("ALTER TABLE tenant_configs ADD COLUMN IF NOT EXISTS allow_enduser_login BOOLEAN DEFAULT FALSE");
        $conn->exec("ALTER TABLE tenant_configs ADD COLUMN IF NOT EXISTS allow_enduser_signup BOOLEAN DEFAULT FALSE");
    } catch (Exception $e) {
        // Columns might already exist
    }

    $stmt = $conn->prepare("
        SELECT tenant_id, tenant_name, allow_enduser_login, allow_enduser_signup
        FROM tenant_configs 
        WHERE tenant_id = ?
    ");
    $stmt->execute([$tenant_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result ?: [
        'tenant_id' => $tenant_id,
        'allow_enduser_login' => false,
        'allow_enduser_signup' => false
    ];
}

/**
 * Update tenant auth settings (admin only)
 */
function update_tenant_auth_settings(string $tenant_id, bool $allow_login, bool $allow_signup): bool
{
    $conn = get_db();
    $stmt = $conn->prepare("
        UPDATE tenant_configs 
        SET allow_enduser_login = ?, allow_enduser_signup = ?
        WHERE tenant_id = ?
    ");
    $stmt->execute([$allow_login, $allow_signup, $tenant_id]);
    return $stmt->rowCount() > 0;
}
