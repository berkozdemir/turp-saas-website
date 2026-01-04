<?php
// api/scripts/migrate_tenant_ids.php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: text/plain');

$execute = isset($_GET['execute']) && $_GET['execute'] == '1';

function log_msg($msg)
{
    echo $msg . "\n";
    flush();
}

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Load Mappings
    $rows = $conn->query("SELECT id, code FROM tenants")->fetchAll(PDO::FETCH_ASSOC);
    $code_map = [];
    foreach ($rows as $r) {
        $code_map[$r['code']] = $r['id'];
    }

    log_msg("Mapping loaded: " . print_r($code_map, true));

    // Special fix for contact_submissions (3 -> 21 because admin has 21)
    // Only if 21 exists and is 'nipt'
    if (isset($code_map['nipt']) && $code_map['nipt'] == 21) {
        if ($execute) {
            $conn->exec("UPDATE contact_submissions SET tenant_id = '21' WHERE tenant_id = '3'");
            $conn->exec("UPDATE contact_submissions SET tenant_id = '21' WHERE tenant_id = 'nipt'");
            log_msg("Fixed contact_submissions: '3'/'nipt' -> '21'");
        } else {
            log_msg("[DRY RUN] Would update contact_submissions '3'/'nipt' -> '21'");
        }
    }

    $targets = [
        'blog_posts',
        'contact_configs',
        'contact_submissions',
        'landing_configs',
        'legal_documents',
        'media_assets'
    ];

    foreach ($targets as $table) {
        log_msg("\nProcessing table: $table");

        // Get column info
        $col = $conn->query("
            SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '$table' AND COLUMN_NAME = 'tenant_id'
        ")->fetchColumn();

        if (!$col) {
            log_msg("Skipped: tenant_id column not found");
            continue;
        }

        if (strpos($col, 'int') !== false) {
            log_msg("Skipped: already INT ($col)");
            continue;
        }

        log_msg("Current type: $col - Converting to INT...");

        if (!$execute) {
            log_msg("[DRY RUN] Would ADD tenant_id_int, MIGRATE, DROP tenant_id, RENAME");
            continue;
        }

        // 1. Add Temp Column
        try {
            $conn->exec("ALTER TABLE `$table` ADD COLUMN tenant_id_int INT NULL");
        } catch (Exception $e) {
            // Include just in case it exists from partial run
            log_msg("Notice: " . $e->getMessage());
        }

        // 2. Map Codes
        foreach ($code_map as $code => $id) {
            $stmt = $conn->prepare("UPDATE `$table` SET tenant_id_int = ? WHERE tenant_id = ?");
            $stmt->execute([$id, $code]);
            if ($stmt->rowCount() > 0) {
                log_msg("Mapped '$code' -> $id: " . $stmt->rowCount() . " rows");
            }
        }

        // 3. Map numeric strings (e.g. "21" -> 21)
        $conn->exec("UPDATE `$table` SET tenant_id_int = CAST(tenant_id AS UNSIGNED) WHERE tenant_id REGEXP '^[0-9]+$' AND tenant_id_int IS NULL");

        // 4. Verify
        $unmapped = $conn->query("SELECT COUNT(*) FROM `$table` WHERE tenant_id_int IS NULL")->fetchColumn();
        if ($unmapped > 0) {
            log_msg("CRITICAL: $unmapped rows could not be mapped in $table. Aborting drop.");
            // View problematic values
            $probs = $conn->query("SELECT DISTINCT tenant_id FROM `$table` WHERE tenant_id_int IS NULL LIMIT 5")->fetchAll(PDO::FETCH_COLUMN);
            log_msg("Problematic values: " . implode(", ", $probs));
            continue;
        }

        // 5. Swap
        $conn->exec("ALTER TABLE `$table` DROP COLUMN tenant_id");
        $conn->exec("ALTER TABLE `$table` CHANGE COLUMN tenant_id_int tenant_id INT NOT NULL");

        // 6. Index
        try {
            $conn->exec("CREATE INDEX idx_tenant_id ON `$table` (tenant_id)");
        } catch (Exception $e) { /* Index might exist */
        }

        log_msg("Success: Converted $table to INT");
    }

    log_msg("\nDone.");

} catch (Exception $e) {
    log_msg("ERROR: " . $e->getMessage());
    echo $e->getTraceAsString();
}
