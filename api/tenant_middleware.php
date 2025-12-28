<?php
/**
 * Multi-Tenant Middleware
 * 
 * Provides tenant resolution functions for both public and admin contexts.
 * 
 * Usage:
 * - Public routes: $tenant = resolve_public_tenant($conn);
 * - Admin routes: $tenant = resolve_admin_tenant($conn, $user_id);
 */

/**
 * Resolve tenant from Host header (for public visitors)
 * 
 * @param PDO $conn Database connection
 * @return array|null Tenant data or null if not found
 */
function resolve_public_tenant($conn)
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $host = explode(':', $host)[0]; // Remove port if present

    try {
        $stmt = $conn->prepare("SELECT * FROM tenants WHERE primary_domain = ? AND is_active = 1");
        $stmt->execute([$host]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Resolve tenant from X-Tenant-Id header (for admin users)
 * Also verifies that the user has access to this tenant.
 * 
 * @param PDO $conn Database connection
 * @param int $user_id Authenticated admin user ID
 * @return array|null Tenant data with user's role, or null if unauthorized
 */
function resolve_admin_tenant($conn, $user_id)
{
    // Check both header formats: X-Tenant-Id and X-Tenant-Code
    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? null;
    $tenant_code = $_SERVER['HTTP_X_TENANT_CODE'] ?? null;

    if (!$tenant_id && !$tenant_code) {
        return null;
    }

    try {
        if ($tenant_id) {
            // Verify user has access to this tenant by ID
            $stmt = $conn->prepare("
                SELECT t.*, aut.role as tenant_role 
                FROM tenants t
                JOIN admin_user_tenants aut ON t.id = aut.tenant_id
                WHERE t.id = ? AND aut.user_id = ? AND t.is_active = 1
            ");
            $stmt->execute([$tenant_id, $user_id]);
        } else {
            // Verify user has access to this tenant by code
            $stmt = $conn->prepare("
                SELECT t.*, aut.role as tenant_role 
                FROM tenants t
                JOIN admin_user_tenants aut ON t.id = aut.tenant_id
                WHERE t.code = ? AND aut.user_id = ? AND t.is_active = 1
            ");
            $stmt->execute([$tenant_code, $user_id]);
        }

        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Require admin tenant - throws exception if not authenticated or no tenant access
 * 
 * @param PDO $conn Database connection
 * @return array ['user_id' => int, 'tenant' => array] 
 * @throws Exception if authentication or tenant resolution fails
 */
function require_admin_tenant($conn)
{
    // First, authenticate the user
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    // Then resolve the tenant
    $tenant = resolve_admin_tenant($conn, $user_id);

    if (!$tenant) {
        http_response_code(400);
        throw new Exception('Tenant ID/Code header required or unauthorized access');
    }

    return [
        'user_id' => $user_id,
        'tenant' => $tenant,
        'tenant_id' => $tenant['id']
    ];
}

/**
 * Get current tenant ID from various sources (for backward compatibility)
 * Priority: X-Tenant-Id header > X-Tenant-Code header > Session > Host
 * 
 * @param PDO $conn Database connection
 * @return int|null Tenant ID or null
 */
function get_current_tenant_id($conn)
{
    // Try admin header first
    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? null;
    if ($tenant_id) {
        return (int) $tenant_id;
    }

    // Try tenant code header
    $tenant_code = $_SERVER['HTTP_X_TENANT_CODE'] ?? null;
    if ($tenant_code) {
        $stmt = $conn->prepare("SELECT id FROM tenants WHERE code = ? AND is_active = 1");
        $stmt->execute([$tenant_code]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            return (int) $result['id'];
        }
    }

    // Fall back to host-based resolution
    $public_tenant = resolve_public_tenant($conn);
    if ($public_tenant) {
        return (int) $public_tenant['id'];
    }

    return null;
}
?>