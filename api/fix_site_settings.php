<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: text/plain');
echo "Starting Site Settings Fix...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected. Checking site_settings table...\n";

    // Check if table exists
    $tables = $conn->query("SHOW TABLES LIKE 'site_settings'")->fetchAll();
    if (count($tables) === 0) {
        echo "Table site_settings does NOT exist. Creating...\n";
        $conn->exec("CREATE TABLE site_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id INT NOT NULL DEFAULT 1,
            setting_key VARCHAR(100) NOT NULL,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_tenant_key (tenant_id, setting_key)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "Table created.\n";
    } else {
        echo "Table exists. Checking tenant_id column...\n";
        try {
            $conn->query("SELECT tenant_id FROM site_settings LIMIT 1");
            echo "tenant_id column ALREADY EXISTS.\n";
        } catch (Exception $e) {
            echo "Column missing. Adding tenant_id...\n";
            $conn->exec("ALTER TABLE site_settings ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id");
            echo "Column added.\n";

            try {
                echo "Updating indexes...\n";
                // Drop old index if exists
                try {
                    $conn->exec("DROP INDEX setting_key ON site_settings");
                } catch (Exception $ex) {
                }

                $conn->exec("CREATE INDEX idx_settings_tenant ON site_settings(tenant_id)");
                $conn->exec("CREATE UNIQUE INDEX unique_tenant_key ON site_settings(tenant_id, setting_key)");
                echo "Indexes updated.\n";
            } catch (Exception $ex) {
                echo "Index update warning: " . $ex->getMessage() . "\n";
            }
        }
    }

    echo "Fix completed successfully.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
