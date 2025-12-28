<?php
/**
 * Tenant Service
 * 
 * Business logic for tenant operations.
 * All functions take explicit parameters, no direct request access.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Get tenant by ID
 * 
 * @param int $tenant_id
 * @return array|null Tenant data or null if not found
 */
function get_tenant_by_id(int $tenant_id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM tenants WHERE id = ? AND is_active = 1");
    $stmt->execute([$tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Get tenant by code
 * 
 * @param string $code Tenant code (e.g., 'nipt', 'iwrs')
 * @return array|null Tenant data or null if not found
 */
function get_tenant_by_code(string $code): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM tenants WHERE code = ? AND is_active = 1");
    $stmt->execute([$code]);
    return $stmt->fetch() ?: null;
}

/**
 * Get tenant by domain
 * 
 * @param string $domain Primary domain (e.g., 'nipt.tr')
 * @return array|null Tenant data or null if not found
 */
function get_tenant_by_domain(string $domain): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM tenants WHERE primary_domain = ? AND is_active = 1");
    $stmt->execute([$domain]);
    return $stmt->fetch() ?: null;
}

/**
 * Get all active tenants
 * 
 * @return array List of tenants
 */
function get_all_tenants(): array
{
    $conn = get_db_connection();
    $stmt = $conn->query("SELECT * FROM tenants WHERE is_active = 1 ORDER BY name");
    return $stmt->fetchAll();
}

/**
 * Get tenants accessible by a user
 * 
 * @param int $user_id Admin user ID
 * @return array List of tenants with user's role
 */
function get_user_tenants(int $user_id): array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT t.id, t.code, t.name, t.primary_domain, t.logo_url, t.primary_color, aut.role as tenant_role
        FROM tenants t
        JOIN admin_user_tenants aut ON t.id = aut.tenant_id
        WHERE aut.user_id = ? AND t.is_active = 1
        ORDER BY t.name
    ");
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

/**
 * Check if user has access to tenant
 * 
 * @param int $user_id
 * @param int $tenant_id
 * @return array|null Tenant data with role, or null if no access
 */
function check_user_tenant_access(int $user_id, int $tenant_id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT t.*, aut.role as tenant_role 
        FROM tenants t
        JOIN admin_user_tenants aut ON t.id = aut.tenant_id
        WHERE t.id = ? AND aut.user_id = ? AND t.is_active = 1
    ");
    $stmt->execute([$tenant_id, $user_id]);
    return $stmt->fetch() ?: null;
}
