<?php
/**
 * Public Tenant Resolver
 * 
 * Resolves tenant from Host header for public-facing endpoints.
 * Used for landing pages, blog, FAQ, etc.
 */

require_once __DIR__ . '/tenant.service.php';

/**
 * Resolve tenant from Host header
 * 
 * @return array|null Tenant data or null if not found
 */
function resolve_public_tenant(): ?array
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $host = explode(':', $host)[0]; // Remove port if present

    return get_tenant_by_domain($host);
}

/**
 * Require public tenant - returns tenant or sends 404
 * 
 * @return array Tenant data
 */
function require_public_tenant(): array
{
    $tenant = resolve_public_tenant();

    if (!$tenant) {
        http_response_code(404);
        echo json_encode(['error' => 'Site not found']);
        exit();
    }

    return $tenant;
}
