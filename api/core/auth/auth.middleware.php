<?php
/**
 * Authentication Middleware
 * 
 * Validates Bearer token from Authorization header.
 * Use require_auth() at the start of protected endpoints.
 */

require_once __DIR__ . '/auth.service.php';

/**
 * Get Bearer token from Authorization header
 * 
 * @return string|null Token or null if not present
 */
function get_bearer_token(): ?string
{
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (preg_match('/Bearer\s+(.+)$/i', $auth_header, $matches)) {
        return $matches[1];
    }

    return null;
}

/**
 * Require authentication - returns user ID or sends 401
 * 
 * @return int Authenticated user ID
 */
function require_auth(): int
{
    $token = get_bearer_token();

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit();
    }

    $user_id = auth_verify_token($token);

    if (!$user_id) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit();
    }

    return $user_id;
}

/**
 * Require admin role
 * 
 * @param int $user_id
 * @return bool
 */
function require_admin_role(int $user_id): bool
{
    $user = get_user_by_id($user_id);

    if (!$user || $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit();
    }

    return true;
}

/**
 * Full admin auth + tenant context
 * 
 * @return array ['user_id' => int, 'tenant_id' => int, 'tenant' => array]
 */
function require_admin_context(): array
{
    $user_id = require_auth();

    require_once __DIR__ . '/../tenant/admin_resolver.php';
    $tenant_context = require_admin_tenant($user_id);

    return [
        'user_id' => $user_id,
        'tenant_id' => $tenant_context['tenant_id'],
        'tenant' => $tenant_context['tenant'],
        'tenant_role' => $tenant_context['tenant_role']
    ];
}
