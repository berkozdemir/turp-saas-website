<?php
/**
 * Fix Tenant IDs Script
 * 
 * Migrates invalid string tenant_ids (e.g., 'turp') to integer IDs (e.g., 1).
 */

require_once 'config/db.php';

// Allow external execution
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = [];

try {
    $conn = get_db_connection();

    // 1. Identify rows with 'turp' tenant_id in blog_posts
    $stmt = $conn->query("SELECT COUNT(*) as count FROM blog_posts WHERE tenant_id = 'turp'");
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    $response['found_turp_posts'] = $count;

    if ($count > 0) {
        // 2. Update to ID 1
        $update = $conn->prepare("UPDATE blog_posts SET tenant_id = '1' WHERE tenant_id = 'turp'");
        $update->execute();
        $response['updated_posts'] = $update->rowCount();
    } else {
        $response['message'] = 'No posts with tenant_id="turp" found.';
    }

    // 3. Check for any other non-numeric tenant_ids
    $stmt = $conn->query("SELECT id, tenant_id FROM blog_posts WHERE tenant_id NOT REGEXP '^[0-9]+$'");
    $anomalies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($anomalies)) {
        $response['other_anomalies'] = $anomalies;
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
