<?php
/**
 * End-User Auth Public Controller
 * Handles public endpoints for end-user signup, login, logout, and profile
 */

require_once __DIR__ . '/../../core/tenant/public_resolver.php';
require_once __DIR__ . '/enduser_auth.service.php';
require_once __DIR__ . '/../../core/utils/rate_limiter.php';

function handle_enduser_auth_public(string $action): bool
{
    header('Content-Type: application/json');

    switch ($action) {
        case 'enduser_signup':
            return enduser_signup_action();
        case 'enduser_login':
            return enduser_login_action();
        case 'enduser_logout':
            return enduser_logout_action();
        case 'enduser_me':
            return enduser_me_action();
        case 'get_tenant_settings':
            return get_tenant_settings_action();
        case 'enduser_verify_email':
            return enduser_verify_email_action();
        case 'enduser_resend_verification':
            return enduser_resend_verification_action();
        case 'enduser_forgot_password':
            return enduser_forgot_password_action();
        case 'enduser_reset_password':
            return enduser_reset_password_action();
        case 'enduser_verify_reset_token':
            return enduser_verify_reset_token_action();
        default:
            return false;
    }
}

/**
 * POST /api?action=enduser_signup
 */
function enduser_signup_action(): bool
{
    $tenant_code = get_current_tenant_code();
    if (!$tenant_code) {
        http_response_code(400);
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $result = enduser_signup($tenant_code, $data);

    if (isset($result['error'])) {
        http_response_code(400);
    }

    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_login
 */
function enduser_login_action(): bool
{
    $tenant_code = get_current_tenant_code();
    if (!$tenant_code) {
        http_response_code(400);
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    // Rate limiting: 10 attempts per 15 minutes per IP
    $ip = get_client_ip();
    $rate_check = check_rate_limit($ip, 'login', 10, 900);
    if (!$rate_check['allowed']) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
            'retry_after' => $rate_check['reset_at'] - time()
        ]);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $result = enduser_login($tenant_code, $data);

    // Record attempt if failed
    if (isset($result['error'])) {
        record_attempt($ip, 'login');

        if (isset($result['email_not_verified'])) {
            http_response_code(403);
        } else {
            http_response_code(401);
        }
    } else {
        // Clear rate limit on successful login
        clear_rate_limit($ip, 'login');
    }

    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_logout
 */
function enduser_logout_action(): bool
{
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $token);

    if (empty($token)) {
        echo json_encode(['success' => true]);
        return true;
    }

    enduser_logout($token);
    echo json_encode(['success' => true]);
    return true;
}

/**
 * GET /api?action=enduser_me
 */
function enduser_me_action(): bool
{
    $tenant_code = get_current_tenant_code();
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $token);

    if (empty($token) || !$tenant_code) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        return true;
    }

    $user = enduser_verify_token($token, $tenant_code);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        return true;
    }

    echo json_encode(['success' => true, 'user' => $user]);
    return true;
}

/**
 * GET /api?action=get_tenant_settings
 * Returns public tenant settings including auth flags
 */
function get_tenant_settings_action(): bool
{
    $tenant_code = get_current_tenant_code();
    if (!$tenant_code) {
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $settings = get_tenant_auth_settings($tenant_code);
    echo json_encode([
        'success' => true,
        'tenant_id' => $settings['tenant_id'],
        'tenant_name' => $settings['tenant_name'] ?? $tenant_code,
        'allow_enduser_login' => (bool) ($settings['allow_enduser_login'] ?? false),
        'allow_enduser_signup' => (bool) ($settings['allow_enduser_signup'] ?? false)
    ]);
    return true;
}

/**
 * GET /api?action=enduser_verify_email&token=xxx
 * Verifies user email with token
 */
function enduser_verify_email_action(): bool
{
    $token = $_GET['token'] ?? '';

    if (empty($token)) {
        echo json_encode(['error' => 'Token gerekli']);
        return true;
    }

    $result = verify_email_token($token);
    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_resend_verification
 * Resends verification email to user
 */
function enduser_resend_verification_action(): bool
{
    $tenant_code = get_current_tenant_code();
    if (!$tenant_code) {
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = $data['email'] ?? '';

    if (empty($email)) {
        echo json_encode(['error' => 'E-posta adresi gerekli']);
        return true;
    }

    $result = resend_verification_email($email, $tenant_code);
    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_forgot_password
 * Request password reset email
 */
function enduser_forgot_password_action(): bool
{
    $tenant_code = get_current_tenant_code();
    if (!$tenant_code) {
        http_response_code(400);
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = trim($data['email'] ?? '');

    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'E-posta adresi gerekli']);
        return true;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Geçerli bir e-posta adresi girin']);
        return true;
    }

    // Rate limiting: 5 attempts per 15 minutes per email
    $rate_check = check_rate_limit($email, 'forgot_password', 5, 900);
    if (!$rate_check['allowed']) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Çok fazla şifre sıfırlama talebi. Lütfen 15 dakika sonra tekrar deneyin.',
            'retry_after' => $rate_check['reset_at'] - time()
        ]);
        return true;
    }

    record_attempt($email, 'forgot_password');
    $result = enduser_request_password_reset($email, $tenant_code);
    echo json_encode($result);
    return true;
}

/**
 * POST /api?action=enduser_reset_password
 * Reset password with token
 */
function enduser_reset_password_action(): bool
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $token = trim($data['token'] ?? '');
    $new_password = $data['new_password'] ?? '';

    if (empty($token)) {
        http_response_code(400);
        echo json_encode(['error' => 'Token gerekli']);
        return true;
    }

    if (empty($new_password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Yeni şifre gerekli']);
        return true;
    }

    $result = enduser_reset_password($token, $new_password);

    if (isset($result['error'])) {
        http_response_code(400);
    }

    echo json_encode($result);
    return true;
}

/**
 * GET /api?action=enduser_verify_reset_token&token=xxx
 * Verify if reset token is valid
 */
function enduser_verify_reset_token_action(): bool
{
    $token = $_GET['token'] ?? '';

    if (empty($token)) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'error' => 'Token gerekli']);
        return true;
    }

    $result = enduser_verify_reset_token($token);

    if (!$result['valid']) {
        http_response_code(400);
    }

    echo json_encode($result);
    return true;
}

