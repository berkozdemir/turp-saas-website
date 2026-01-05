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
$tenant_code = get_current_tenant_code();
$tenant = get_tenant_by_code($tenant_code);

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
$host = $_SERVER['HTTP_HOST'] ?? '';

if (!empty($check_headers['x-tenant-id'])) {
    $response['resolution_method'] = 'header_id';
} elseif (!empty($check_headers['x-tenant-code'])) {
    $response['resolution_method'] = 'header_code';
} elseif (isset($_SERVER['HTTP_ORIGIN']) || isset($_SERVER['HTTP_REFERER'])) {
    $response['resolution_method'] = 'origin_referer';
} elseif ($host) {
    $response['resolution_method'] = 'host_check';
} else {
    $response['resolution_method'] = 'fallback';
}

// Debug Host Lookup explicitly
if ($host) {
    try {
        $conn = get_db_connection();

        // Check raw lookup
        $stmt = $conn->prepare("SELECT * FROM tenants WHERE primary_domain = ?");
        $stmt->execute([$host]);
        $raw_entry = $stmt->fetch(PDO::FETCH_ASSOC);

        $response['debug_host_lookup'] = [
            'host_queried' => $host,
            'raw_found' => $raw_entry ? 'yes' : 'no',
            'is_active' => $raw_entry['is_active'] ?? 'N/A',
            'tenant_code' => $raw_entry['code'] ?? 'N/A'
        ];

        // Check clean host
        if (strpos($host, 'www.') === 0) {
            $clean_host = substr($host, 4);
            $stmt->execute([$clean_host]);
            $raw_clean = $stmt->fetch(PDO::FETCH_ASSOC);
            $response['debug_host_lookup']['clean_host_queried'] = $clean_host;
            $response['debug_host_lookup']['clean_found'] = $raw_clean ? 'yes' : 'no';
            if ($raw_clean) {
                $response['debug_host_lookup']['clean_active'] = $raw_clean['is_active'];
                $response['debug_host_lookup']['clean_code'] = $raw_clean['code'];
            }
        }
    } catch (Exception $e) {
        $response['debug_host_lookup']['error'] = $e->getMessage();
    }
}

echo json_encode($response, JSON_PRETTY_PRINT);
