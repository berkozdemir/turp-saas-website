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
    if ($tenant_id && is_numeric($tenant_id) && (int) $tenant_id > 0) {
        $access = check_user_tenant_access($user_id, (int) $tenant_id);
        if ($access)
            return $access;
    }

    // Check for tenant code header
    $tenant_code = $_SERVER['HTTP_X_TENANT_CODE'] ?? null;
    if ($tenant_code) {
        $tenant = get_tenant_by_code($tenant_code);
        if ($tenant) {
            return check_user_tenant_access($user_id, $tenant['id']);
        }
    }

    // Fallback: Check POST/GET params (for FormData/multipart uploads)
    $param_tenant_id = $_POST['tenant_id'] ?? $_GET['tenant_id'] ?? null;
    if ($param_tenant_id && is_numeric($param_tenant_id) && (int) $param_tenant_id > 0) {
        $access = check_user_tenant_access($user_id, (int) $param_tenant_id);
        if ($access)
            return $access;
    }

    $param_tenant_code = $_POST['tenant_code'] ?? $_GET['tenant_code'] ?? null;
    if ($param_tenant_code) {
        $tenant = get_tenant_by_code($param_tenant_code);
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
