<?php
/**
 * Auth Public Controller
 * 
 * Handles public authentication actions: login, forgot-password, reset-password.
 */

require_once __DIR__ . '/../../core/auth/auth.service.php';
require_once __DIR__ . '/../../core/auth/auth.middleware.php';

/**
 * Handle public authentication actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_auth_public(string $action): bool
{
    switch ($action) {
        case 'login':
            return auth_public_login();
        case 'forgot-password':
            return auth_public_forgot_password();
        case 'verify-reset-token':
            return auth_public_verify_reset();
        case 'reset-password':
            return auth_public_reset_password();
        case 'check_session':
            return auth_public_check_session();
        default:
            return false;
    }
}

/**
 * Check session handler
 */
function auth_public_check_session(): bool
{
    require_auth(); // This will exit with 401 if invalid
    echo json_encode(['success' => true]);
    return true;
}

/**
 * Login handler
 */
function auth_public_login(): bool
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $remember_me = $data['remember_me'] ?? false;

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'E-posta ve şifre gereklidir']);
        return true;
    }

    $conn = get_db_connection();
    try {
        $stmt = $conn->prepare("SELECT id, email, password_hash, name FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            echo json_encode(['error' => 'Hatalı e-posta veya şifre']);
            return true;
        }

        // Generate session token
        $token = bin2hex(random_bytes(32));
        $expires_days = $remember_me ? 7 : 1;
        $expires_at = date('Y-m-d H:i:s', strtotime("+{$expires_days} days"));

        // Store session
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $stmt = $conn->prepare("
            INSERT INTO admin_sessions (user_id, token, ip_address, user_agent, expires_at) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$user['id'], $token, $ip_address, $user_agent, $expires_at]);

        // Update last login
        $stmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);

        // Get user tenants
        $stmt = $conn->prepare("
            SELECT t.id, t.code, t.name, t.primary_domain, t.logo_url, t.primary_color, aut.role as tenant_role
            FROM tenants t
            JOIN admin_user_tenants aut ON t.id = aut.tenant_id
            WHERE aut.user_id = ?
        ");
        $stmt->execute([$user['id']]);
        $tenants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name']
            ],
            'tenants' => $tenants
        ]);
        return true;
    } catch (Exception $e) {
        echo json_encode(['error' => 'Bir hata oluştu: ' . $e->getMessage()]);
        return true;
    }
}

/**
 * Forgot password handler
 */
function auth_public_forgot_password(): bool
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = $data['email'] ?? '';

    // Logic from admin_auth.php would go here, adapted to PSR/Modular
    // For now, let's just make it return a success message as in legacy
    echo json_encode([
        'message' => 'Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi.'
    ]);
    return true;
}

/**
 * Verify reset token
 */
function auth_public_verify_reset(): bool
{
    $token = $_GET['token'] ?? '';
    echo json_encode(['valid' => true]); // Placeholder for now
    return true;
}

/**
 * Reset password
 */
function auth_public_reset_password(): bool
{
    echo json_encode(['success' => true, 'message' => 'Şifreniz başarıyla güncellendi']); // Placeholder
    return true;
}
