<?php
/**
 * Tenant Helper
 * Provides multi-tenant functionality for the API.
 * 
 * Usage:
 *   require_once __DIR__ . '/tenant_helper.php';
 *   $tenant_id = get_current_tenant($conn);
 *   // Then use $tenant_id in your queries
 */

/**
 * Get the current tenant ID based on request context.
 * Priority: 1. X-Tenant-Code header (new), 2. X-Tenant-ID header, 3. Origin domain lookup, 4. Default 'turp'
 * 
 * @param PDO $conn Database connection
 * @return int|string The tenant ID (numeric for new system, string code for legacy)
 */
function get_current_tenant($conn)
{
    // 1. Check for X-Tenant-Code header (from new admin panel)
    $headers = getallheaders();
    $tenant_code = null;
    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'x-tenant-code') {
            $tenant_code = $value;
            break;
        }
    }

    if ($tenant_code) {
        $stmt = $conn->prepare("SELECT id FROM tenants WHERE code = ? AND is_active = 1");
        $stmt->execute([$tenant_code]);
        $tenant = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($tenant) {
            return $tenant['id'];
        }
    }

    // 2. Check for explicit X-Tenant-ID header (legacy)
    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? null;

    if ($tenant_id) {
        // Validate that this tenant exists
        $stmt = $conn->prepare("SELECT id FROM tenants WHERE id = ? AND is_active = 1");
        $stmt->execute([$tenant_id]);
        $tenant = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($tenant) {
            return $tenant_id;
        }
    }

    // 3. Try to determine from Origin or Referer header
    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    if ($origin) {
        $domain = parse_url($origin, PHP_URL_HOST);
        if ($domain) {
            // Check primary_domain column
            $stmt = $conn->prepare("SELECT id FROM tenants WHERE primary_domain = ? AND is_active = 1");
            $stmt->execute([$domain]);
            $tenant = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($tenant) {
                return $tenant['id'];
            }
        }
    }

    // 4. Default fallback - return 'turp' tenant ID
    $stmt = $conn->prepare("SELECT id FROM tenants WHERE code = 'turp' AND is_active = 1");
    $stmt->execute();
    $tenant = $stmt->fetch(PDO::FETCH_ASSOC);
    return $tenant ? $tenant['id'] : 1;
}

/**
 * Get tenant details by ID.
 * 
 * @param PDO $conn Database connection
 * @param string $tenant_id The tenant ID
 * @return array|null Tenant details or null if not found
 */
function get_tenant_info($conn, $tenant_id)
{
    $stmt = $conn->prepare("SELECT * FROM tenants WHERE id = ? AND is_active = 1");
    $stmt->execute([$tenant_id]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

/**
 * Check if the current admin user has access to the given tenant.
 * Super admins (tenant_id = NULL) have access to all tenants.
 * 
 * @param array $admin_user The admin user details (from session)
 * @param string $tenant_id The tenant to check access for
 * @return bool True if access is allowed
 */
function admin_has_tenant_access($admin_user, $tenant_id)
{
    // Super admin (no specific tenant) can access all
    if (empty($admin_user['tenant_id'])) {
        return true;
    }
    // Otherwise, must match
    return $admin_user['tenant_id'] === $tenant_id;
}
