<?php
/**
 * Admin Authentication API
 * Endpoints: login, forgot-password, verify-reset-token, reset-password
 */

require_once __DIR__ . '/legacy/db_connection.php';
require_once __DIR__ . '/email_service.php';
require_once __DIR__ . '/core/security/rate_limiter.php';

// Get database connection
$conn = get_db_connection();

// Get request data
$request_method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$request_body = json_decode(file_get_contents('php://input'), true) ?? [];

// =====================================================
// 1. LOGIN ENDPOINT
// =====================================================
if ($action === 'login' && $request_method === 'POST') {
    $email = $request_body['email'] ?? '';
    $password = $request_body['password'] ?? '';
    $remember_me = $request_body['remember_me'] ?? false;
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';

    // Validate inputs
    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'E-posta ve şifre gereklidir']);
        exit;
    }

    // Rate limiting check
    $rate_check = check_login_rate_limit($email, $ip_address);
    if (!$rate_check['allowed']) {
        http_response_code(429); // Too Many Requests
        echo json_encode([
            'error' => 'Çok fazla başarısız deneme. Lütfen ' . ceil($rate_check['retry_after'] / 60) . ' dakika sonra tekrar deneyin.',
            'retry_after' => $rate_check['retry_after']
        ]);
        exit;
    }

    try {
        // Find user by email
        $stmt = $conn->prepare("SELECT id, email, password_hash, name FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            record_login_attempt($email, $ip_address);
            echo json_encode(['error' => 'Hatalı e-posta veya şifre']);
            exit;
        }

        // Verify password
        if (!password_verify($password, $user['password_hash'])) {
            record_login_attempt($email, $ip_address);
            echo json_encode(['error' => 'Hatalı e-posta veya şifre']);
            exit;
        }

        // Success - clear rate limit
        clear_login_attempts($email, $ip_address);

        // Generate session token
        $token = bin2hex(random_bytes(32));
        $expires_days = $remember_me ? 7 : 1;
        $expires_at = date('Y-m-d H:i:s', strtotime("+{$expires_days} days"));

        // Store session
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $stmt = $conn->prepare(
            "INSERT INTO admin_sessions (user_id, token, ip_address, user_agent, expires_at) 
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$user['id'], $token, $ip_address, $user_agent, $expires_at]);

        // Update last login
        $stmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);

        // Get user's tenants
        $stmt = $conn->prepare(
            "SELECT t.id, t.code, t.name, t.primary_domain, aut.role as tenant_role
             FROM admin_user_tenants aut
             JOIN tenants t ON aut.tenant_id = t.id
             WHERE aut.user_id = ? AND t.is_active = 1"
        );
        $stmt->execute([$user['id']]);
        $tenants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return success
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
    } catch (Exception $e) {
        echo json_encode(['error' => 'Bir hata oluştu: ' . $e->getMessage()]);
    }
    exit;
}

// =====================================================
// 2. FORGOT PASSWORD ENDPOINT
// =====================================================
if ($action === 'forgot-password' && $request_method === 'POST') {
    $email = $request_body['email'] ?? '';

    // Rate limiting: Check attempts from this IP
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $one_hour_ago = date('Y-m-d H:i:s', strtotime('-1 hour'));

    $stmt = $conn->prepare(
        "SELECT COUNT(*) as count FROM password_reset_tokens 
         WHERE ip_address = ? AND created_at > ?"
    );
    $stmt->execute([$ip_address, $one_hour_ago]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] >= 3) {
        // Generic message even if rate limited (security)
        echo json_encode([
            'message' => 'Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi.'
        ]);
        exit;
    }

    // Validate email format
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'message' => 'Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi.'
        ]);
        exit;
    }

    try {
        // Check if user exists (silently)
        $stmt = $conn->prepare("SELECT id, email, name FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Generate secure token
            $token = bin2hex(random_bytes(32));
            $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Store token
            $stmt = $conn->prepare(
                "INSERT INTO password_reset_tokens (user_id, token, expires_at, ip_address) 
                 VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$user['id'], $token, $expires_at, $ip_address]);

            // Send email
            send_password_reset_email($user['email'], $user['name'], $token);
        }

        // Always return generic success message (prevent email enumeration)
        echo json_encode([
            'message' => 'Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi.'
        ]);
    } catch (Exception $e) {
        // Generic message even on error
        echo json_encode([
            'message' => 'Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi.'
        ]);
    }
    exit;
}

// =====================================================
// 3. VERIFY RESET TOKEN ENDPOINT
// =====================================================
if ($action === 'verify-reset-token' && $request_method === 'GET') {
    $token = $_GET['token'] ?? '';

    if (empty($token)) {
        echo json_encode(['valid' => false, 'error' => 'Token gereklidir']);
        exit;
    }

    try {
        $stmt = $conn->prepare(
            "SELECT id, expires_at, used_at FROM password_reset_tokens WHERE token = ?"
        );
        $stmt->execute([$token]);
        $reset_token = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reset_token) {
            echo json_encode(['valid' => false, 'error' => 'Geçersiz token']);
            exit;
        }

        if ($reset_token['used_at'] !== null) {
            echo json_encode(['valid' => false, 'error' => 'Bu token zaten kullanılmış']);
            exit;
        }

        if (strtotime($reset_token['expires_at']) < time()) {
            echo json_encode(['valid' => false, 'error' => 'Token süresi dolmuş']);
            exit;
        }

        echo json_encode(['valid' => true]);
    } catch (Exception $e) {
        echo json_encode(['valid' => false, 'error' => 'Bir hata oluştu']);
    }
    exit;
}

// =====================================================
// 4. RESET PASSWORD ENDPOINT
// =====================================================
if ($action === 'reset-password' && $request_method === 'POST') {
    $token = $request_body['token'] ?? '';
    $new_password = $request_body['new_password'] ?? '';

    // Validate inputs
    if (empty($token) || empty($new_password)) {
        echo json_encode(['error' => 'Token ve yeni şifre gereklidir']);
        exit;
    }

    if (strlen($new_password) < 8) {
        echo json_encode(['error' => 'Şifre en az 8 karakter olmalıdır']);
        exit;
    }

    try {
        // Find and validate token
        $stmt = $conn->prepare(
            "SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ?"
        );
        $stmt->execute([$token]);
        $reset_token = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reset_token) {
            echo json_encode(['error' => 'Geçersiz token']);
            exit;
        }

        if ($reset_token['used_at'] !== null) {
            echo json_encode(['error' => 'Bu token zaten kullanılmış']);
            exit;
        }

        if (strtotime($reset_token['expires_at']) < time()) {
            echo json_encode(['error' => 'Token süresi dolmuş. Lütfen tekrar şifre sıfırlama isteği gönderin.']);
            exit;
        }

        // Hash new password
        $password_hash = password_hash($new_password, PASSWORD_BCRYPT);

        // Update user password
        $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$password_hash, $reset_token['user_id']]);

        // Mark token as used
        $stmt = $conn->prepare("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?");
        $stmt->execute([$reset_token['id']]);

        echo json_encode(['success' => true, 'message' => 'Şifreniz başarıyla güncellendi']);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Bir hata oluştu: ' . $e->getMessage()]);
    }
    exit;
}

// Invalid action
echo json_encode(['error' => 'Geçersiz işlem']);
