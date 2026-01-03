<?php
/**
 * End-User Authentication Service
 * Handles signup, login, and session management for end-users (not admin)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../services/email.service.php';

/**
 * Ensure endusers and enduser_sessions tables exist
 */
function ensure_enduser_tables(): void
{
    $conn = get_db_connection();

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
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT allow_enduser_signup FROM tenants WHERE code = ?");
    $stmt->execute([$tenant_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result && $result['allow_enduser_signup'];
}

/**
 * Check if tenant allows end-user login
 */
function enduser_login_allowed(string $tenant_id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT allow_enduser_login FROM tenants WHERE code = ?");
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

    $conn = get_db_connection();

    // Check if email already exists for this tenant
    $stmt = $conn->prepare("SELECT id FROM endusers WHERE email = ? AND tenant_id = ?");
    $stmt->execute([$email, $tenant_id]);
    if ($stmt->fetch()) {
        return ['error' => 'Bu e-posta adresi zaten kayıtlı'];
    }

    // Create user with pending status
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $verification_token = bin2hex(random_bytes(32));

    $stmt = $conn->prepare("
        INSERT INTO endusers (tenant_id, email, password_hash, name, phone, status, email_verified, verification_token)
        VALUES (?, ?, ?, ?, ?, 'pending', FALSE, ?)
    ");
    $stmt->execute([$tenant_id, $email, $password_hash, $name, $phone, $verification_token]);
    $user_id = $conn->lastInsertId();

    // Send verification email
    $email_result = send_verification_email($email, $name, $verification_token, $tenant_id);

    if (!$email_result['success']) {
        error_log("[enduser_signup] Failed to send verification email: " . $email_result['error']);
        // Don't fail signup if email fails, user can resend
    }

    // Return success without auto-login (user must verify email first)
    return [
        'success' => true,
        'message' => 'Kayıt başarılı! Lütfen e-postanızı kontrol edin ve hesabınızı doğrulayın.',
        'email_sent' => $email_result['success'],
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

    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT id, email, password_hash, name, status, email_verified
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

    // Check email verification
    if (!$user['email_verified']) {
        return [
            'error' => 'E-posta adresiniz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.',
            'email_not_verified' => true,
            'email' => $user['email']
        ];
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
    $conn = get_db_connection();
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
    $conn = get_db_connection();
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
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM enduser_sessions WHERE token = ?");
    $stmt->execute([$token]);
    return $stmt->rowCount() > 0;
}

/**
 * Get tenant auth settings
 */
function get_tenant_auth_settings(string $tenant_id): array
{
    $conn = get_db_connection();

    // Ensure columns exist
    try {
        $conn->exec("ALTER TABLE tenants ADD COLUMN IF NOT EXISTS allow_enduser_login BOOLEAN DEFAULT FALSE");
        $conn->exec("ALTER TABLE tenants ADD COLUMN IF NOT EXISTS allow_enduser_signup BOOLEAN DEFAULT FALSE");
    } catch (Exception $e) {
        // Columns might already exist
    }

    $stmt = $conn->prepare("
        SELECT code as tenant_id, name as tenant_name, allow_enduser_login, allow_enduser_signup
        FROM tenants 
        WHERE code = ?
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
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        UPDATE tenants
        SET allow_enduser_login = ?, allow_enduser_signup = ?
        WHERE code = ?
    ");
    $stmt->execute([$allow_login, $allow_signup, $tenant_id]);
    return $stmt->rowCount() > 0;
}

/**
 * Verify email with token
 */
function verify_email_token(string $token): array
{
    $conn = get_db_connection();

    // Find user with this token
    $stmt = $conn->prepare("
        SELECT id, email, name, tenant_id, created_at
        FROM endusers
        WHERE verification_token = ? AND email_verified = FALSE
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return ['error' => 'Geçersiz veya süresi dolmuş doğrulama linki'];
    }

    // Check if token is expired (24 hours)
    $created = strtotime($user['created_at']);
    $now = time();
    $hours_passed = ($now - $created) / 3600;

    if ($hours_passed > 24) {
        return [
            'error' => 'Doğrulama linki süresi doldu. Lütfen yeni bir doğrulama e-postası isteyin.',
            'expired' => true,
            'email' => $user['email']
        ];
    }

    // Verify email and activate account
    $stmt = $conn->prepare("
        UPDATE endusers
        SET email_verified = TRUE, status = 'active', verification_token = NULL
        WHERE id = ?
    ");
    $stmt->execute([$user['id']]);

    return [
        'success' => true,
        'message' => 'E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.',
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name']
        ]
    ];
}

/**
 * Resend verification email
 */
function resend_verification_email(string $email, string $tenant_id): array
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        SELECT id, name, email_verified, status
        FROM endusers
        WHERE email = ? AND tenant_id = ?
    ");
    $stmt->execute([$email, $tenant_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return ['error' => 'Kullanıcı bulunamadı'];
    }

    if ($user['email_verified']) {
        return ['error' => 'E-posta adresi zaten doğrulanmış'];
    }

    // Generate new token
    $new_token = bin2hex(random_bytes(32));

    $stmt = $conn->prepare("
        UPDATE endusers
        SET verification_token = ?
        WHERE id = ?
    ");
    $stmt->execute([$new_token, $user['id']]);

    // Send verification email
    $email_result = send_verification_email($email, $user['name'], $new_token, $tenant_id);

    if (!$email_result['success']) {
        error_log("[resend_verification] Failed to send email: " . $email_result['error']);
        return [
            'error' => 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.',
            'email_error' => $email_result['error']
        ];
    }

    return [
        'success' => true,
        'message' => 'Doğrulama e-postası tekrar gönderildi. Lütfen gelen kutunuzu kontrol edin.'
    ];
}
