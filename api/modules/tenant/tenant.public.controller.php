<?php
/**
 * Tenant Public Controller
 *
 * Public endpoints for tenant information
 */

require_once __DIR__ . '/../../core/tenant/tenant.service.php';

/**
 * Handle public tenant actions
 */
function handle_tenant_public(string $action): bool
{
    switch ($action) {
        case 'get_tenants':
            get_tenants_list();
            return true;

        case 'get_tenant_by_domain':
            get_tenant_by_domain_endpoint();
            return true;

        case 'get_tenant_settings':
            get_tenant_settings_endpoint();
            return true;

        default:
            return false;
    }
}

/**
 * Get all active tenants (domain mapping)
 * Public endpoint for frontend to dynamically map domains to tenant codes
 */
function get_tenants_list(): void
{
    try {
        $tenants = get_all_tenants();

        // Format for frontend consumption
        $tenant_map = [];
        foreach ($tenants as $tenant) {
            $tenant_map[] = [
                'id' => $tenant['id'],
                'code' => $tenant['code'],
                'name' => $tenant['name'],
                'domain' => $tenant['primary_domain'],
                'color' => $tenant['primary_color'] ?? '#000000',
                'logo' => $tenant['logo_url'] ?? null
            ];
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $tenant_map
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch tenants: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get tenant by domain
 */
function get_tenant_by_domain_endpoint(): void
{
    $domain = $_GET['domain'] ?? '';

    if (empty($domain)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Domain parameter required'
        ]);
        return;
    }

    try {
        $tenant = get_tenant_by_domain($domain);

        if (!$tenant) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Tenant not found for domain: ' . $domain
            ]);
            return;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $tenant['id'],
                'code' => $tenant['code'],
                'name' => $tenant['name'],
                'domain' => $tenant['primary_domain'],
                'color' => $tenant['primary_color'] ?? '#000000',
                'logo' => $tenant['logo_url'] ?? null
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch tenant: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get tenant settings (including feature flags)
 */
function get_tenant_settings_endpoint(): void
{
    try {
        $tenant_id = get_current_tenant_id();

        if (!$tenant_id) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Tenant not found'
            ]);
            return;
        }

        $tenant = get_tenant_by_id($tenant_id);

        if (!$tenant) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Tenant not found'
            ]);
            return;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'tenant_id' => $tenant['code'],
            'tenant_name' => $tenant['name'],
            'allow_enduser_login' => (bool)($tenant['allow_enduser_login'] ?? false),
            'allow_enduser_signup' => (bool)($tenant['allow_enduser_signup'] ?? false)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch tenant settings: ' . $e->getMessage()
        ]);
    }
}
