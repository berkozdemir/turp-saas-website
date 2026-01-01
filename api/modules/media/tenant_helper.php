<?php
/**
 * Tenant Helper for Media Module
 * 
 * Provides tenant context for media operations.
 */

require_once __DIR__ . '/../../core/tenant/tenant.service.php';

/**
 * Get current tenant ID for media operations
 * @param PDO $conn Database connection (unused, kept for compatibility)
 * @return string Tenant ID
 */
function get_current_tenant($conn): string
{
    $tenant_id = get_current_tenant_id();
    return (string) ($tenant_id ?? 1);
}
