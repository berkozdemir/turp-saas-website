<?php
/**
 * Comprehensive Database Debug Script (v2)
 */

// Load environment
$env_config_file = __DIR__ . '/env.php';
$env_config = [];
if (file_exists($env_config_file)) {
    $env_config = include $env_config_file;
}

function get_env($key, $default = null)
{
    global $env_config;
    return $env_config[$key] ?? $_SERVER[$key] ?? $_ENV[$key] ?? getenv($key) ?? $default;
}

header('Content-Type: text/plain; charset=utf-8');

try {
    $db_host = get_env('DB_HOST', 'db');
    $db_name = get_env('DB_NAME', 'turp_saas');
    $db_user = get_env('DB_USER', 'turp_user');
    $db_pass = get_env('DB_PASS', 'turp_password');

    echo "Attempting to connect to: $db_host / $db_name\n";

    $conn = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    echo "SUCCESS: Connected to database.\n\n";

    $tables_to_check = ['tenants', 'roi_settings', 'blog_posts', 'faqs'];

    foreach ($tables_to_check as $table) {
        echo "--- Checking Table: $table ---\n";
        try {
            $stmt = $conn->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                echo "Table EXISTS.\n";
                $cols = $conn->query("DESCRIBE $table")->fetchAll(PDO::FETCH_ASSOC);
                foreach ($cols as $col) {
                    echo "  - {$col['Field']} ({$col['Type']})\n";
                }

                $count = $conn->query("SELECT COUNT(*) FROM $table")->fetchColumn();
                echo "Row count: $count\n";
            } else {
                echo "Table DOES NOT EXIST.\n";
            }
        } catch (Exception $e) {
            echo "Error checking table $table: " . $e->getMessage() . "\n";
        }
        echo "\n";
    }

} catch (Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
}
