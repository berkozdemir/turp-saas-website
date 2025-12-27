<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: text/plain');

try {
    $conn = get_db_connection();

    echo "=== DATABASE SCHEMA AUDIT ===\n\n";

    // 1. Current Database
    $stmt = $conn->query("SELECT DATABASE()");
    echo "Current Database: " . $stmt->fetchColumn() . "\n\n";

    // 2. List all tables
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Total Tables: " . count($tables) . "\n\n";

    // 3. Check each table for tenant_id column
    $tables_with_tenant = [];
    $tables_without_tenant = [];

    foreach ($tables as $table) {
        try {
            $stmt = $conn->query("SELECT tenant_id FROM `$table` LIMIT 1");
            $tables_with_tenant[] = $table;
        } catch (Exception $e) {
            $tables_without_tenant[] = $table;
        }
    }

    echo "=== TABLES WITH tenant_id ===\n";
    foreach ($tables_with_tenant as $table) {
        echo "✓ $table\n";
    }

    echo "\n=== TABLES WITHOUT tenant_id (May need it) ===\n";
    foreach ($tables_without_tenant as $table) {
        echo "✗ $table\n";
    }

    echo "\n=== DETAILED SCHEMA ANALYSIS ===\n";

    // Focus on specific tables that likely need tenant_id
    $critical_tables = [
        'contact_messages',
        'faqs',
        'legal_documents',
        'media_assets',
        'landing_configs',
        'contact_configs',
        'site_settings'
    ];

    foreach ($critical_tables as $table) {
        if (!in_array($table, $tables))
            continue;

        echo "\n--- $table ---\n";
        $stmt = $conn->query("DESCRIBE `$table`");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $has_tenant = false;
        foreach ($columns as $col) {
            echo "{$col['Field']} ({$col['Type']})\n";
            if ($col['Field'] === 'tenant_id')
                $has_tenant = true;
        }
        echo "Status: " . ($has_tenant ? "HAS tenant_id ✓" : "MISSING tenant_id ✗") . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
