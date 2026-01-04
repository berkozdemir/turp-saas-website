<?php
/**
 * Script: Fix Tenant IDs (Migration)
 * Type: Maintenance / Migration
 * Description:
 *   - Standardizes `tenant_id` column values to Integer.
 *   - Updates legacy string IDs (e.g. 'nipt') to Integers (e.g. 3).
 * Usage:
 *   - CLI: php api/scripts/fix_tenants.php
 *   - Web: ?action=fix_tenants&key=...
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: text/plain');

// Security Gate: Prevent unauthorized execution
$key = $_GET['key'] ?? '';
if ($key !== 'turp_fix_admin_2026') {
    http_response_code(403);
    die("Erişim Reddedildi. (Access Denied). SSH erişimi yoksa '?key=turp_fix_admin_2026' parametresini kullanın.");
}

function log_msg($msg)
{
    echo $msg . "\n";
}

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    log_msg("Starting Tenant ID Standardization...");

    // 1. Legal Documents
    // nipt -> 3
    $stmt = $conn->prepare("UPDATE legal_documents SET tenant_id = '3' WHERE tenant_id = 'nipt'");
    $stmt->execute();
    log_msg("Legal Documents: Updated 'nipt' -> '3' (" . $stmt->rowCount() . " rows)");

    // 21 -> 3 (if any legacy from dev)
    $stmt = $conn->prepare("UPDATE legal_documents SET tenant_id = '3' WHERE tenant_id = '21'");
    $stmt->execute();
    log_msg("Legal Documents: Updated '21' -> '3' (" . $stmt->rowCount() . " rows)");

    // 2. Contact Submissions
    // nipt -> 3
    $stmt = $conn->prepare("UPDATE contact_submissions SET tenant_id = '3' WHERE tenant_id = 'nipt'");
    $stmt->execute();
    log_msg("Contact Submissions: Updated 'nipt' -> '3' (" . $stmt->rowCount() . " rows)");

    // 3. Contact Messages
    // turp -> 1 (Assuming 1 is Turp based on tenants table)
    $stmt = $conn->prepare("UPDATE contact_messages SET tenant_id = '1' WHERE tenant_id = 'turp'");
    $stmt->execute();
    log_msg("Contact Messages: Updated 'turp' -> '1' (" . $stmt->rowCount() . " rows)");

    // 4. Verification
    $counts = $conn->query("
        SELECT 
            (SELECT COUNT(*) FROM legal_documents WHERE tenant_id NOT REGEXP '^[0-9]+$') as bad_legal,
            (SELECT COUNT(*) FROM contact_submissions WHERE tenant_id NOT REGEXP '^[0-9]+$') as bad_subs,
            (SELECT COUNT(*) FROM contact_messages WHERE tenant_id NOT REGEXP '^[0-9]+$') as bad_msgs
    ")->fetch(PDO::FETCH_ASSOC);

    if ($counts['bad_legal'] == 0 && $counts['bad_subs'] == 0 && $counts['bad_msgs'] == 0) {
        log_msg("SUCCESS: All target tables are now using Integer IDs.");
    } else {
        log_msg("WARNING: Some non-integer IDs remain.");
        print_r($counts);
    }

} catch (Exception $e) {
    log_msg("ERROR: " . $e->getMessage());
}
