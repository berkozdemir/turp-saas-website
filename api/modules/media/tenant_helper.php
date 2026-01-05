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
    $tenant_code = get_current_tenant_code();
    return (string) ($tenant_code ?? 'turp');
}
