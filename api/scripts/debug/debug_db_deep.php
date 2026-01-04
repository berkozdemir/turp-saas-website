<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: text/plain');

try {
    $conn = get_db_connection();

    echo "Connected successfully.\n";

    // 1. Check DB Name
    $stmt = $conn->query("SELECT DATABASE()");
    echo "Current Database: " . $stmt->fetchColumn() . "\n\n";

    // 2. List Tables
    echo "Tables:\n";
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "- $table\n";
    }
    echo "\n";

    // 3. Describe iwrs_saas_blog_posts
    if (in_array('iwrs_saas_blog_posts', $tables)) {
        echo "DESCRIBE iwrs_saas_blog_posts:\n";
        $stmt = $conn->query("DESCRIBE iwrs_saas_blog_posts");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo "{$col['Field']} - {$col['Type']}\n";
        }
    } else {
        echo "Table 'iwrs_saas_blog_posts' NOT FOUND.\n";
    }

    echo "\n";

    // 4. Describe site_settings
    if (in_array('site_settings', $tables)) {
        echo "DESCRIBE site_settings:\n";
        $stmt = $conn->query("DESCRIBE site_settings");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo "{$col['Field']} - {$col['Type']}\n";
        }
    } else {
        echo "Table 'site_settings' NOT FOUND.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
