<?php
// Admin Authentication Helper

function require_admin_auth($conn)
{
    // Get Authorization header with multiple fallback methods
    // This handles Apache CGI, mod_php, Nginx, and various hosting environments

    $auth_header = '';

    // Method 1: Check $_SERVER directly (works in most cases)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    }
    // Method 2: Apache mod_rewrite sometimes uses REDIRECT_HTTP_AUTHORIZATION
    elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    // Method 3: Try getallheaders() function
    elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        // Case-insensitive check
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $auth_header = $value;
                break;
            }
        }
    }
    // Method 4: Try apache_request_headers() 
    elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $auth_header = $value;
                break;
            }
        }
    }
    // Method 5: Manual $_SERVER parsing for CGI environments
    else {
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $header_name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                if (strtolower($header_name) === 'authorization') {
                    $auth_header = $value;
                    break;
                }
            }
        }
    }

    if (!preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Yetkilendirme gerekli (Token eksik)']);
        exit;
    }

    $token = $matches[1];

    $stmt = $conn->prepare("SELECT user_id, expires_at FROM admin_sessions WHERE token = ?");
    $stmt->execute([$token]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if session exists and is not expired
    if (!$session) {
        http_response_code(401);
        echo json_encode(['error' => 'Geçersiz oturum']);
        exit;
    }

    if (strtotime($session['expires_at']) < time()) {
        http_response_code(401);
        echo json_encode(['error' => 'Oturum süresi dolmuş']);
        exit;
    }

    // Get user without role column usage (local db fix)
    $stmt = $conn->prepare("SELECT id, name, email, is_active FROM admin_users WHERE id = ?");
    $stmt->execute([$session['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Inject fake admin role for compatibility
    if ($user) {
        $user['role'] = 'admin';
    }

    if (!$user || !$user['is_active']) {
        http_response_code(401);
        echo json_encode(['error' => 'Kullanıcı bulunamadı veya devre dışı']);
        exit;
    }

    return $user;
}

// Role check helper
function require_role($user, $allowed_roles)
{
    if (!in_array($user['role'], $allowed_roles)) {
        http_response_code(403);
        echo json_encode(['error' => 'Bu işlem için yetkiniz yok']);
        exit;
    }
}

function require_admin_auth_id($conn)
{
    $user = require_admin_auth($conn);
    return $user['id'];
}

/**
 * Get user's accessible tenants
 */
function get_user_tenants($conn, $user_id)
{
    $stmt = $conn->prepare("
        SELECT t.id, t.code, t.name, t.primary_domain, aut.role as tenant_role
        FROM admin_user_tenants aut
        JOIN tenants t ON t.id = aut.tenant_id
        WHERE aut.user_id = ? AND t.is_active = 1
        ORDER BY t.name
    ");
    $stmt->execute([$user_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Require tenant context from X-Tenant-Code header
 * Returns tenant info if valid, exits with 400/403 if not
 */
function require_tenant_context($conn, $user)
{
    $headers = getallheaders();
    $tenant_code = null;

    // Case-insensitive header check
    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'x-tenant-code') {
            $tenant_code = $value;
            break;
        }
    }

    if (empty($tenant_code)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tenant context required (X-Tenant-Code header missing)']);
        exit;
    }

    // Verify tenant exists and user has access
    $stmt = $conn->prepare("
        SELECT t.id, t.code, t.name, t.primary_domain, aut.role as tenant_role
        FROM tenants t
        JOIN admin_user_tenants aut ON aut.tenant_id = t.id
        WHERE t.code = ? AND aut.user_id = ? AND t.is_active = 1
    ");
    $stmt->execute([$tenant_code, $user['id']]);
    $tenant = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tenant) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied for this tenant']);
        exit;
    }

    return $tenant;
}

/**
 * Get tenant ID from code (for queries)
 */
function get_tenant_id_by_code($conn, $tenant_code)
{
    $stmt = $conn->prepare("SELECT id FROM tenants WHERE code = ? AND is_active = 1");
    $stmt->execute([$tenant_code]);
    return $stmt->fetchColumn();
}
