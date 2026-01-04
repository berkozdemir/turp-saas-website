<?php
/**
 * Debug Public Blog Logic
 * 
 * Simulates a public blog request for a specific domain/host.
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/core/tenant/tenant.service.php';
require_once __DIR__ . '/modules/blog/blog.service.php';

header('Content-Type: application/json');

// Mock host for testing if provided in query
$test_host = $_GET['host'] ?? $_SERVER['HTTP_HOST'];
$_SERVER['HTTP_HOST'] = $test_host; // Force tenant service to see this host

$response = [
    'env' => [
        'host' => $test_host,
        'request_host_header' => $_SERVER['HTTP_HOST']
    ],
    'resolution' => [],
    'posts' => []
];

// 1. Resolve Tenant
$tenant_id = get_current_tenant_id();
$tenant_code = get_current_tenant_code();

$response['resolution'] = [
    'resolved_id' => $tenant_id,
    'resolved_code' => $tenant_code,
    'method' => 'get_current_tenant_id()'
];

// 2. Check DB directly for this tenant
try {
    $conn = get_db_connection();

    // Check total count
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM blog_posts WHERE tenant_id = ?");
    $stmt->execute([(string) $tenant_id]);
    $total_any = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Check published count
    $stmt = $conn->prepare("SELECT COUNT(*) as published FROM blog_posts WHERE tenant_id = ? AND status = 'published'");
    $stmt->execute([(string) $tenant_id]);
    $total_published = $stmt->fetch(PDO::FETCH_ASSOC)['published'];

    $response['db_check'] = [
        'total_posts_for_tenant' => $total_any,
        'published_posts_for_tenant' => $total_published
    ];

    // 3. fetch actual posts via service
    $posts = blog_get_published_posts($tenant_id);
    $response['service_result_count'] = count($posts);
    if (count($posts) > 0) {
        $response['first_post_keys'] = array_keys($posts[0]);
        $response['first_post_status_value'] = $posts[0]['status'] ?? 'MISSING';
    }
    $response['service_posts_sample'] = array_slice($posts, 0, 2); // Show first 2

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
