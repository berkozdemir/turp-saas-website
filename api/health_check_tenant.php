<?php
/**
 * Tenant Health Check Endpoint
 * 
 * Verifies which tenant is resolved by the backend.
 * Useful for debugging resolution issues.
 */

require_once 'core/tenant/tenant.service.php';

// Allow external checks
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = [
    'resolved_tenant' => null,
    'resolution_method' => 'unknown',
    'headers_received' => get_request_headers(),
    'env' => [
        'host' => $_SERVER['HTTP_HOST'] ?? 'unknown',
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown'
    ]
];

// Trace resolution
$tenant_id = get_current_tenant_id();
$tenant = get_tenant_by_id($tenant_id);

if ($tenant) {
    $response['resolved_tenant'] = [
        'id' => $tenant['id'],
        'code' => $tenant['code'],
        'name' => $tenant['name']
    ];
} else {
    $response['error'] = 'Could not resolve any tenant (fallback failed)';
}

// Infer method
$headers = get_request_headers();
// Normalize for check
$check_headers = array_change_key_case($headers, CASE_LOWER);

if (!empty($check_headers['x-tenant-id'])) {
    $response['resolution_method'] = 'header_id';
} elseif (!empty($check_headers['x-tenant-code'])) {
    $response['resolution_method'] = 'header_code';
} elseif (isset($_SERVER['HTTP_ORIGIN']) || isset($_SERVER['HTTP_REFERER'])) {
    $response['resolution_method'] = 'origin_referer (or fallback)';
} else {
    $response['resolution_method'] = 'fallback';
}

echo json_encode($response, JSON_PRETTY_PRINT);
