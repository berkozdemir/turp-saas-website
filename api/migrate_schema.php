<?php
// Migration script to apply schema changes
require_once __DIR__ . '/db_connection.php';

echo "Starting Database Migration...\n";

try {
    $conn = get_db_connection();

    // Read the SQL file
    $sql = file_get_contents(__DIR__ . '/iwrs_schema.sql');

    // Execute multiple queries
    // PDO::exec handles multiple statements if strictly allowed, but usage varies.
    // It's safer to split by semicolon if the driver doesn't support it directly, 
    // but MySQL + PDO usually allows multi-query string if configured, OR we execute block by block.
    // For simplicity with this simple schema, we'll try direct execution.

    // Fix Schema Drift: Ensure blog_posts has published_at
    try {
        $check = $conn->query("SHOW COLUMNS FROM blog_posts LIKE 'published_at'");
        if ($check->rowCount() == 0) {
            echo "Adding missing column 'published_at' to blog_posts...\n";
            $conn->exec("ALTER TABLE blog_posts ADD COLUMN published_at TIMESTAMP NULL AFTER seo_keywords");
        }
    } catch (Exception $e) {
        echo "Column check warning: " . $e->getMessage() . "\n";
    }

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Split SQL by semicolon
    // Note: This naive split might break if semicolons are inside strings/comments, 
    // but our schema is simple enough.
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $stmt) {
        if (empty($stmt))
            continue;
        try {
            $conn->exec($stmt);
            echo "Executed: " . substr(str_replace("\n", " ", $stmt), 0, 40) . "...\n";
        } catch (PDOException $e) {
            // Log but don't stop for "Table exists" (42S01) if we trust IF NOT EXISTS
            // Check error code if possible, or just print
            echo "Failed: " . substr(str_replace("\n", " ", $stmt), 0, 40) . "... -> " . $e->getMessage() . "\n";
        }
    }

    echo "Migration completed.\n";

} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
