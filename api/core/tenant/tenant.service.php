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

/**
 * Get current tenant ID from various sources (backward compatible)
 * Priority: X-Tenant-Id > X-Tenant-Code > Origin domain
 * 
 * @return int|null Tenant ID
 */

/**
 * Safe function to get all headers
 */
function get_request_headers()
{
    if (function_exists('getallheaders')) {
        return getallheaders();
    }
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
    }
    return $headers;
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

    // 1. Try X-Tenant-Id header
    // Normalize headers to lowercase keys for case-insensitive lookup
    $raw_headers = get_request_headers();
    $headers = [];
    foreach ($raw_headers as $k => $v) {
        $headers[strtolower($k)] = $v;
    }

    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? $headers['x-tenant-id'] ?? null;
    if ($tenant_id) {
        if (is_numeric($tenant_id)) {
            return (int) $tenant_id;
        } else {
            // It might be a slug/code (e.g. 'iwrs')
            $tenant = get_tenant_by_code($tenant_id);
            if ($tenant) {
                return (int) $tenant['id'];
            }
        }
    }

    // 2. Try X-Tenant-Code header
    if (isset($headers['x-tenant-code'])) {
        $tenant = get_tenant_by_code($headers['x-tenant-code']);
        if ($tenant) {
            return (int) $tenant['id'];
        }
    }

    // 3. Try Origin/Referer domain
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

    // 4. Try Host header (direct access)
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($host) {
        $tenant = get_tenant_by_domain($host);
        if ($tenant) {
            return (int) $tenant['id'];
        }

        // Also try cleaning www. prefix just in case
        if (strpos($host, 'www.') === 0) {
            $clean_host = substr($host, 4);
            $tenant = get_tenant_by_domain($clean_host);
            if ($tenant) {
                return (int) $tenant['id'];
            }
        }
    }

    // 5. Fallback to turp tenant
    $tenant = get_tenant_by_code('turp');
    return $tenant ? (int) $tenant['id'] : 1;
}

/**
 * Get current tenant code
 * 
 * @return string|null Tenant code
 */
function get_current_tenant_code(): ?string
{
    // Normalize headers
    $raw_headers = get_request_headers();
    $headers = [];
    foreach ($raw_headers as $k => $v) {
        $headers[strtolower($k)] = $v;
    }

    // 1. Try X-Tenant-Code header
    if (isset($headers['x-tenant-code'])) {
        return $headers['x-tenant-code'];
    }

    // 2. Try ID to Code resolution
    $tenant_id = $_SERVER['HTTP_X_TENANT_ID'] ?? $headers['x-tenant-id'] ?? null;
    if ($tenant_id) {
        $tenant = get_tenant_by_id((int) $tenant_id);
        if ($tenant)
            return $tenant['code'];
    }

    // 3. Try Origin/Referer domain
    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    if ($origin) {
        $domain = parse_url($origin, PHP_URL_HOST);
        if ($domain) {
            $tenant = get_tenant_by_domain($domain);
            if ($tenant)
                return $tenant['code'];
        }
    }

    // 4. Try Host header
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($host) {
        $tenant = get_tenant_by_domain($host);
        if ($tenant)
            return $tenant['code'];

        if (strpos($host, 'www.') === 0) {
            $clean_host = substr($host, 4);
            $tenant = get_tenant_by_domain($clean_host);
            if ($tenant)
                return $tenant['code'];
        }
    }

    return 'turp';
}
