<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: text/plain');
echo "=== Cookie Consents Table Migration ===\n\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Checking for existing cookie_consents table...\n";

    // Check if table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'cookie_consents'");
    $exists = $stmt->fetch();

    if ($exists) {
        echo "Table already exists ✓\n";
    } else {
        echo "Creating cookie_consents table...\n";

        $sql = "CREATE TABLE cookie_consents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id INT NOT NULL,
            user_ip_hash VARCHAR(64) NOT NULL COMMENT 'SHA256 hash of IP for privacy',
            region VARCHAR(10) COMMENT 'Detected region (EU, TR, US, etc.)',
            country VARCHAR(2) COMMENT 'ISO country code',
            browser_language VARCHAR(10) COMMENT 'Browser Accept-Language',
            consent_version VARCHAR(20) DEFAULT '1.0' COMMENT 'Policy version accepted',
            consent_details JSON NOT NULL COMMENT '{\"essential\": true, \"analytics\": true, \"marketing\": false}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_tenant_ip (tenant_id, user_ip_hash),
            INDEX idx_tenant_created (tenant_id, created_at),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        COMMENT='Stores user cookie consent preferences for GDPR compliance'";

        $conn->exec($sql);
        echo "Table created successfully ✓\n";
    }

    echo "\n=== Migration completed ===\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
