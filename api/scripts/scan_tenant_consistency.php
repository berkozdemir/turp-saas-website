<?php
// api/scripts/scan_tenant_consistency.php

require_once __DIR__ . '/../config/db.php';

// CLI helper
function log_msg($msg)
{
    echo "[INFO] " . $msg . PHP_EOL;
}

try {
    $conn = get_db_connection();
    $db_name = $conn->query("SELECT DATABASE()")->fetchColumn();
    log_msg("Scanning database: $db_name");

    // 1. Find all tenant-related columns
    $sql = "
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
          AND (COLUMN_NAME LIKE '%tenant%' OR COLUMN_NAME = 'tenant_id')
        ORDER BY TABLE_NAME
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$db_name]);
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $report = [];

    foreach ($columns as $col) {
        $table = $col['TABLE_NAME'];
        $column = $col['COLUMN_NAME'];
        $type = $col['DATA_TYPE'];

        // Sample values
        $sample_sql = "SELECT DISTINCT `$column` FROM `$table` LIMIT 5";
        try {
            $samples = $conn->query($sample_sql)->fetchAll(PDO::FETCH_COLUMN);
        } catch (Exception $e) {
            $samples = ["Error reading: " . $e->getMessage()];
        }

        $report[] = [
            'table' => $table,
            'column' => $column,
            'type' => $col['COLUMN_TYPE'],
            'samples' => $samples
        ];
    }

    // Output JSON report
    echo json_encode($report, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo "[ERROR] " . $e->getMessage() . PHP_EOL;
}
