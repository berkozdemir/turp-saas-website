<?php
require_once 'config/db.php';
require_once 'core/tenant/tenant.service.php';

// Allow from anywhere for debugging
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = [];

// 1. Check Tenant Resolution
if (function_exists('getallheaders')) {
    $response['headers'] = getallheaders();
} else {
    $response['headers'] = 'getallheaders() function not available';
}
$response['server_superglobal'] = $_SERVER;
$response['tenant_id_resolved'] = get_current_tenant_id();
$response['tenant_code_resolved'] = get_current_tenant_code();

// 2. Check Tenants Table
try {
    $conn = get_db_connection();
    $response['tenants_db'] = $conn->query("SELECT id, code, primary_domain FROM tenants")->fetchAll(PDO::FETCH_ASSOC);

    // 3. Check Blog Posts
    $response['blog_counts_by_tenant'] = $conn->query("SELECT tenant_id, COUNT(*) as count, SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) as published_count FROM blog_posts GROUP BY tenant_id")->fetchAll(PDO::FETCH_ASSOC);

    // 4. Check Admin Users
    $response['admin_users_count'] = $conn->query("SELECT COUNT(*) as count FROM admin_users")->fetch(PDO::FETCH_ASSOC);

    // 5. Check if files exist
    $response['files_exist'] = [
        'user.admin.controller.php' => file_exists(__DIR__ . '/modules/user/user.admin.controller.php'),
        'admin.routes.php' => file_exists(__DIR__ . '/routes/admin.routes.php'),
    ];

} catch (Exception $e) {
    $response['db_error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
