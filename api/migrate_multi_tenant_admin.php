<?php
// migrate_multi_tenant_admin.php
// Creates tenants table and admin_user_tenants join table for multi-site admin

require_once __DIR__ . '/db_connection.php';

echo "Starting Multi-Tenant Admin Migration...\n\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Step 1: Create tenants table
    echo "Step 1: Creating tenants table...\n";
    $conn->exec("
        CREATE TABLE IF NOT EXISTS tenants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            primary_domain VARCHAR(255),
            logo_url VARCHAR(512),
            primary_color VARCHAR(20) DEFAULT '#0891b2',
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "  -> tenants table created.\n";

    // Step 2: Seed tenant data
    echo "\nStep 2: Seeding tenants...\n";
    $stmt = $conn->prepare("SELECT COUNT(*) FROM tenants WHERE code = ?");

    // IWRS tenant
    $stmt->execute(['iwrs']);
    if ($stmt->fetchColumn() == 0) {
        $conn->exec("
            INSERT INTO tenants (code, name, primary_domain, primary_color) 
            VALUES ('iwrs', 'IWRS Clinical Trials', 'iwrs.com.tr', '#0891b2')
        ");
        echo "  -> Seeded: iwrs (iwrs.com.tr)\n";
    } else {
        echo "  -> iwrs already exists.\n";
    }

    // Turp tenant
    $stmt->execute(['turp']);
    if ($stmt->fetchColumn() == 0) {
        $conn->exec("
            INSERT INTO tenants (code, name, primary_domain, primary_color) 
            VALUES ('turp', 'Turp Clinical Health', 'ct.turp.health', '#e11d48')
        ");
        echo "  -> Seeded: turp (ct.turp.health)\n";
    } else {
        echo "  -> turp already exists.\n";
    }

    // Step 3: Create admin_user_tenants join table
    echo "\nStep 3: Creating admin_user_tenants table...\n";
    $conn->exec("
        CREATE TABLE IF NOT EXISTS admin_user_tenants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            tenant_id INT NOT NULL,
            role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_tenant (user_id, tenant_id),
            INDEX idx_user (user_id),
            INDEX idx_tenant (tenant_id)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "  -> admin_user_tenants table created.\n";

    // Step 4: Grant existing admin users access to all tenants
    echo "\nStep 4: Granting existing admin users access to all tenants...\n";
    $result = $conn->query("SELECT id FROM admin_users");
    $users = $result->fetchAll(PDO::FETCH_COLUMN);

    $tenantsResult = $conn->query("SELECT id FROM tenants");
    $tenants = $tenantsResult->fetchAll(PDO::FETCH_COLUMN);

    $insertStmt = $conn->prepare("
        INSERT IGNORE INTO admin_user_tenants (user_id, tenant_id, role) VALUES (?, ?, 'admin')
    ");

    $count = 0;
    foreach ($users as $userId) {
        foreach ($tenants as $tenantId) {
            $insertStmt->execute([$userId, $tenantId]);
            $count++;
        }
    }
    echo "  -> Granted access: {$count} user-tenant relationships created.\n";

    echo "\n✅ Migration completed successfully!\n";
    echo "Tables created: tenants, admin_user_tenants\n";
    echo "All existing admin users now have access to both tenants.\n";

} catch (PDOException $e) {
    echo "❌ Migration Error: " . $e->getMessage() . "\n";
}
