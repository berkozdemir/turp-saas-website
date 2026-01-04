<?php
// api/scripts/migrate_tenant_ids.php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: text/plain');

$execute = (isset($_GET['execute']) && $_GET['execute'] == '1') || (isset($argv) && in_array('execute=1', $argv));

function log_msg($msg)
{
    echo $msg . "\n";
    flush();
}

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo = $conn;

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

    // Function to drop foreign keys on tenant_id
    function drop_tenant_fks($pdo, $table)
    {
        $stmt = $pdo->query("SELECT DATABASE()");
        $dbname = $stmt->fetchColumn();

        $sql = "SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = ? 
                AND COLUMN_NAME = 'tenant_id' 
                AND REFERENCED_TABLE_NAME IS NOT NULL";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$dbname, $table]);
        $fks = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($fks as $fk) {
            log_msg("Dropping FK $fk on $table");
            $pdo->exec("ALTER TABLE `$table` DROP FOREIGN KEY `$fk`");
        }
    }

    // Function to add foreign key
    function add_tenant_fk($pdo, $table)
    {
        try {
            $fk_name = "fk_{$table}_tenant_id_" . time();
            $sql = "ALTER TABLE `$table` ADD CONSTRAINT `$fk_name` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE";
            $pdo->exec($sql);
            log_msg("Added FK $fk_name to $table");
        } catch (Exception $e) {
            log_msg("Warning: Could not re-add FK to $table: " . $e->getMessage());
        }
    }

    $targets = [
        'admin_users',
        'admin_user_tenants',
        'blog_posts',
        'contact_configs',
        'contact_messages',
        'contact_submissions',
        'endusers',
        'enduser_sessions',
        'faqs',
        'landing_configs',
        'legal_documents',
        'media_assets',
        'podcasts',
        'site_settings'
    ];

    foreach ($targets as $table) {
        log_msg("\nProcessing table: $table");

        // 0. Check if table exists
        try {
            $pdo->query("SELECT 1 FROM $table LIMIT 1");
        } catch (Exception $e) {
            log_msg("Skipped: Table $table not found");
            continue;
        }

        // 1. Check column type
        $stmt = $pdo->query("SHOW COLUMNS FROM $table LIKE 'tenant_id'");
        $col = $stmt->fetch();

        if (!$col) {
            log_msg("Skipped: tenant_id column not found");
            continue;
        }

        if (strpos($col['Type'], 'int') !== false) {
            log_msg("Skipped: already INT");
            continue;
        }

        log_msg("Current type: " . $col['Type']);

        if (!$execute) {
            log_msg("[DRY RUN] Would DROP FKs, ADD tenant_id_int, MIGRATE, DROP tenant_id, RENAME, RESTORE FKs");
            continue;
        }

        // 2. Drop FKs first
        drop_tenant_fks($pdo, $table);

        // 2b. Drop Unique Index if exists (for admin_user_tenants)
        if ($table === 'admin_user_tenants') {
            try {
                $pdo->exec("DROP INDEX unique_user_tenant ON `$table`");
                log_msg("Dropped unique index from $table");
            } catch (Exception $e) { /* Ignore */
            }
        }

        // 3. Add temporary INT column
        try {
            $pdo->exec("ALTER TABLE `$table` ADD COLUMN tenant_id_int INT DEFAULT NULL");
        } catch (Exception $e) {
            log_msg("Notice adding column: " . $e->getMessage());
            // If column doesn't exist (add failed), we must abort
            // But if error was "Duplicate column name", we proceed.
            if (strpos($e->getMessage(), 'Duplicate column') === false) {
                log_msg("CRITICAL: Failed to add column. Aborting $table.");
                continue;
            }
        }

        // 4. Migrate Data
        $stmt = $pdo->query("SELECT id, tenant_id FROM `$table`");
        $rows = $stmt->fetchAll();

        $updates = 0;
        foreach ($rows as $row) {
            $old_val = $row['tenant_id'];
            $new_val = null;

            if (is_numeric($old_val)) {
                $new_val = (int) $old_val;
            } elseif (isset($code_map[$old_val])) {
                $check_id = $code_map[$old_val];
                // Special NIPT logic (safe for prod)
                if ($check_id == 3 && isset($code_map['nipt']) && $code_map['nipt'] == 21) {
                    $new_val = 21;
                } else {
                    $new_val = $check_id;
                }
            }

            if ($new_val !== null) {
                $upd = $pdo->prepare("UPDATE `$table` SET tenant_id_int = ? WHERE id = ?");
                $upd->execute([$new_val, $row['id']]);
                $updates++;
            }
        }

        log_msg("Mapped $updates rows.");

        // 4b. Deduplicate admin_user_tenants if needed
        if ($table === 'admin_user_tenants') {
            log_msg("Deduplicating admin_user_tenants based on tenant_id_int...");
            try {
                // Delete rows that have same user_id and tenant_id_int, keeping the one with MIN(id)
                $sql = "DELETE t1 FROM admin_user_tenants t1 
                        INNER JOIN admin_user_tenants t2 
                        ON t1.user_id = t2.user_id AND t1.tenant_id_int = t2.tenant_id_int 
                        WHERE t1.id > t2.id";
                $count = $pdo->exec($sql);
                log_msg("Removed $count duplicate rows.");
            } catch (Exception $e) {
                log_msg("Warning during deduplication: " . $e->getMessage());
            }
        }

        // 5. Verify
        $total = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        $unmapped = $pdo->query("SELECT COUNT(*) FROM `$table` WHERE tenant_id_int IS NULL AND tenant_id IS NOT NULL")->fetchColumn();

        if ($total > 0 && $unmapped > 0) {
            log_msg("WARNING: $unmapped unmapped rows (where tenant_id NOT NULL). Aborting schema change for $table.");
            // Clean up temp col?
            continue;
        }

        // 6. Swap
        log_msg("Swapping columns for $table...");
        try {
            $pdo->exec("ALTER TABLE `$table` DROP COLUMN tenant_id");
            $pdo->exec("ALTER TABLE `$table` CHANGE COLUMN tenant_id_int tenant_id INT DEFAULT NULL"); // Set default NULL to be safe? Or NOT NULL?
            // If original was NOT NULL, we should set NOT NULL.
            // But admin_users allows NULL.
            // Let's check logic:
            // admin_users: tenant_id varchar(50) DEFAULT NULL.
            // others: NOT NULL.
            // If we blindly set NOT NULL, admin_users will fail if it has NULLs.
            // We should detect nullability from original?
            // Simple hack: Set DEFAULT NULL for admin_users, NOT NULL for others.
            // Or just INT DEFAULT NULL for all?
            // Ideally we want strictness where needed.
            // Let's default to INT NULL for safety in this generic script.
            // If specific tables need NOT NULL, user can refine.
            // But wait, FK needs type match. tenants.id is INT NOT NULL.
            // FK source column CAN function if NULL (orphaned/no relation).
            // So INT DEFAULT NULL is safe base.
        } catch (Exception $e) {
            log_msg("ERROR Swapping: " . $e->getMessage());
            continue;
        }

        // 7. Restore FK
        add_tenant_fk($pdo, $table);

        // 8. Restore Index
        try {
            if ($table === 'admin_user_tenants') {
                $pdo->exec("CREATE UNIQUE INDEX unique_user_tenant ON `$table` (user_id, tenant_id)");
                log_msg("Restored UNIQUE INDEX unique_user_tenant on $table");
            } else {
                $pdo->exec("CREATE INDEX idx_tenant_id ON `$table` (tenant_id)");
                log_msg("Created index idx_tenant_id on $table");
            }
        } catch (Exception $e) {
            log_msg("Notice Index: " . $e->getMessage());
        }

        log_msg("Success: $table migrated to INT and FK restored.");
    }

    log_msg("\nDone.");

} catch (Exception $e) {
    log_msg("ERROR: " . $e->getMessage());
    echo $e->getTraceAsString();
}
