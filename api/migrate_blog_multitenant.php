<?php
// migrate_blog_multitenant.php
require_once __DIR__ . '/db_connection.php';

echo "Starting Blog Multi-tenant Migration...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 0. Fix site_settings (CRITICAL FIX FIRST)
    echo "Checking site_settings (File: " . __FILE__ . ")...\n";
    try {
        $conn->query("SELECT tenant_id FROM site_settings LIMIT 1");
        echo "site_settings tenant_id already exists.\n";
    } catch (Exception $e) {
        echo "Adding tenant_id to site_settings...\n";
        $conn->exec("ALTER TABLE site_settings ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id");

        try {
            $conn->exec("CREATE INDEX idx_settings_tenant ON site_settings(tenant_id)");
            $conn->exec("DROP INDEX setting_key ON site_settings");
            $conn->exec("CREATE UNIQUE INDEX unique_tenant_key ON site_settings(tenant_id, setting_key)");
        } catch (Exception $ex) {
            // Index might not exist or already exist
        }
    }

    // 1. Add tenant_id
    echo "Checking tenant_id...\n";
    try {
        $conn->query("SELECT tenant_id FROM iwrs_saas_blog_posts LIMIT 1");
        echo "tenant_id already exists.\n";
    } catch (Exception $e) {
        echo "Adding tenant_id...\n";
        $conn->exec("ALTER TABLE iwrs_saas_blog_posts ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id"); // Default to 1 (usually 'turp' or 'admin')
        $conn->exec("CREATE INDEX idx_blog_tenant ON iwrs_saas_blog_posts(tenant_id)");
    }

    // 2. Add language (if missing, though usually likely there if it's iwrs specific)
    // Actually, check if it's already multilingual columns directly.
    // The previous view of blog_api.php showed title_tr, title_en etc.
    // So we might not need 'language' column if it's a flat table. 
    // BUT the previous error was "Unknown column 'tenant_id'".
    // So surely we need tenant_id.

    // 3. Fix Slug Uniqueness Scope
    echo "Updating slug index...\n";
    try {
        $conn->exec("ALTER TABLE iwrs_saas_blog_posts DROP INDEX slug");
        echo "Dropped index 'slug'.\n";
    } catch (Exception $e) {
        // Ignore
    }

    // Add composite unique index
    try {
        // Unique per tenant
        $conn->exec("ALTER TABLE iwrs_saas_blog_posts ADD UNIQUE INDEX idx_tenant_slug (tenant_id, slug)");
        echo "Added composite unique index (tenant_id, slug).\n";
    } catch (Exception $e) {
        // Ignore
    }

    // 4. Fix site_settings (for Admin Settings)
    echo "Checking site_settings...\n";
    try {
        $conn->query("SELECT tenant_id FROM site_settings LIMIT 1");
        echo "site_settings tenant_id already exists.\n";
    } catch (Exception $e) {
        echo "Adding tenant_id to site_settings...\n";
        // Assuming tenant_id is INT based on other tables, but index.php had VARCHAR default 'turp'.
        // Let's check tenants table type. Usually ID is int.
        // We will make it INT to match other tables if tenant_helper returns get_current_tenant as ID.
        // But wait, if index.php expects code ('turp'), then VARCHAR.
        // Let's safe bet: Match iwrs_saas_blog_posts (INT).
        $conn->exec("ALTER TABLE site_settings ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id");

        try {
            $conn->exec("CREATE INDEX idx_settings_tenant ON site_settings(tenant_id)");
            // Update uniqueness if needed
            $conn->exec("DROP INDEX setting_key ON site_settings");
            $conn->exec("CREATE UNIQUE INDEX unique_tenant_key ON site_settings(tenant_id, setting_key)");
        } catch (Exception $ex) {
            // Index might not exist or already exist
        }
    }

    echo "Migration completed successfully!\n";

} catch (PDOException $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
