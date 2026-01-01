<?php
/**
 * Fix Tenant IDs Script v2 (Comprehensive)
 * 
 * Migrates invalid string tenant_ids (e.g., 'turp') to integer IDs (e.g., 1)
 * across all relevant tables.
 */

require_once 'config/db.php';

// Allow external execution
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = [
    'actions' => []
];

$tables_to_check = [
    'blog_posts',
    'faqs',
    'landing_configs',
    'contact_configs',
    'doctors' // Just in case
];

try {
    $conn = get_db_connection();

    foreach ($tables_to_check as $table) {
        $table_result = ['table' => $table];

        // 1. Check if table exists to avoid errors
        try {
            $check = $conn->query("SELECT 1 FROM $table LIMIT 1");
        } catch (Exception $e) {
            $table_result['status'] = 'skipped_not_found';
            $response['actions'][] = $table_result;
            continue;
        }

        // 2. Identify rows with 'turp' tenant_id
        // Using explicit string check
        $stmt = $conn->query("SELECT COUNT(*) as count FROM $table WHERE tenant_id = 'turp'");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        $table_result['found_turp_records'] = $count;

        if ($count > 0) {
            // 3. Update to ID 1
            $update = $conn->prepare("UPDATE $table SET tenant_id = '1' WHERE tenant_id = 'turp'");
            $update->execute();
            $table_result['updated_records'] = $update->rowCount();
            $table_result['status'] = 'fixed';
        } else {
            $table_result['status'] = 'clean';
        }

        // 4. Check for other anomalies (non-numeric)
        try {
            // Only check if column type allows strings (varchar)
            // If it's int, this query might fail or return nothing relevant
            $stmt = $conn->query("SELECT id, tenant_id FROM $table WHERE tenant_id NOT REGEXP '^[0-9]+$' LIMIT 5");
            $anomalies = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!empty($anomalies)) {
                $table_result['other_anomalies_sample'] = $anomalies;
            }
        } catch (Exception $e) {
            // Regex might fail on some DB versions or non-string columns
        }

        $response['actions'][] = $table_result;
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
