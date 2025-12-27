<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: text/plain');
echo "=== COMPREHENSIVE TENANT_ID MIGRATION ===\n\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Define tables that need tenant_id (INT, NOT NULL, DEFAULT 1)
    $tables_to_migrate = [
        'contact_messages',
        'faqs',
        'legal_documents',
        'media_assets',
        'landing_configs',
        'contact_configs',
        'site_settings',
        'iwrs_saas_blog_posts',
        'blog_posts' // If exists
    ];

    foreach ($tables_to_migrate as $table) {
        echo "\n--- Checking $table ---\n";

        // Check if table exists
        try {
            $conn->query("SELECT 1 FROM `$table` LIMIT 1");
        } catch (Exception $e) {
            echo "Table does not exist, skipping.\n";
            continue;
        }

        // Check if tenant_id exists
        try {
            $conn->query("SELECT tenant_id FROM `$table` LIMIT 1");
            echo "tenant_id already exists ✓\n";
        } catch (Exception $e) {
            echo "Adding tenant_id column...\n";
            try {
                $conn->exec("ALTER TABLE `$table` ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id");
                echo "Column added ✓\n";

                // Add index
                try {
                    $conn->exec("CREATE INDEX idx_{$table}_tenant ON `$table`(tenant_id)");
                    echo "Index created ✓\n";
                } catch (Exception $ex) {
                    echo "Index might already exist or failed: " . $ex->getMessage() . "\n";
                }
            } catch (Exception $ex) {
                echo "FAILED to add column: " . $ex->getMessage() . "\n";
            }
        }
    }

    echo "\n=== MIGRATION COMPLETED ===\n";
    echo "Run audit_tenant_columns.php to verify.\n";

} catch (PDOException $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
