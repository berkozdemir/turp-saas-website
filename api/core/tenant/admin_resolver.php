<?php
/**
 * Admin Tenant Resolver
 * 
 * Resolves tenant from X-Tenant-Id or X-Tenant-Code header for admin endpoints.
 * Validates that the authenticated user has access to the requested tenant.
 */

require_once __DIR__ . '/tenant.service.php';

/**
 * Resolve admin tenant from headers
 * 
 * @param int $user_id Authenticated admin user ID
 * @return array|null Tenant data with role, or null if unauthorized
 */
function resolve_admin_tenant(int $user_id): ?array
{
    // Check for tenant ID header
    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? null;
    if ($tenant_id) {
        return check_user_tenant_access($user_id, (int) $tenant_id);
    }

    // Check for tenant code header
    $tenant_code = $_SERVER['HTTP_X_TENANT_CODE'] ?? null;
    if ($tenant_code) {
        $tenant = get_tenant_by_code($tenant_code);
        if ($tenant) {
            return check_user_tenant_access($user_id, $tenant['id']);
        }
    }

    return null;
}

/**
 * Require admin tenant - returns context or sends 400/403
 * 
 * @param int $user_id Authenticated user ID
 * @return array ['tenant' => array, 'tenant_id' => int, 'tenant_role' => string]
 */
function require_admin_tenant(int $user_id): array
{
    $tenant = resolve_admin_tenant($user_id);

    if (!$tenant) {
        http_response_code(400);
        echo json_encode(['error' => 'Tenant header required or access denied']);
        exit();
    }

    return [
        'tenant' => $tenant,
        'tenant_id' => (int) $tenant['id'],
        'tenant_role' => $tenant['tenant_role'] ?? 'viewer'
    ];
}

/**
 * Get current tenant ID from various sources (backward compatible)
 * Priority: X-Tenant-Id > X-Tenant-Code > Origin domain
 * 
 * @return int|null Tenant ID
 */
function get_current_tenant_id(): ?int
{
    $conn = get_db_connection();

    // Try X-Tenant-Id header
    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? null;
    if ($tenant_id) {
        return (int) $tenant_id;
    }

    // Try X-Tenant-Code header
    $headers = getallheaders();
    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'x-tenant-code') {
            $tenant = get_tenant_by_code($value);
            if ($tenant) {
                return (int) $tenant['id'];
            }
        }
    }

    // Try Origin/Referer domain
    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    if ($origin) {
        $domain = parse_url($origin, PHP_URL_HOST);
        if ($domain) {
            $tenant = get_tenant_by_domain($domain);
            if ($tenant) {
                return (int) $tenant['id'];
            }
        }
    }

    // Fallback to turp tenant
    $tenant = get_tenant_by_code('turp');
    return $tenant ? (int) $tenant['id'] : 1;
}
