<?php
// Migration Runner
// Applies iwrs_schema.sql to the database

require_once __DIR__ . '/db_connection.php';

echo "Migration Start...\n";

try {
    $conn = get_db_connection();

    $sql_file = __DIR__ . '/iwrs_schema.sql';
    if (!file_exists($sql_file)) {
        die("Error: Schema file not found at $sql_file\n");
    }

    $sql = file_get_contents($sql_file);

    // Split by semicolon (basic splitting)
    // Note: This might fail if stored procedures contain semicolons, but for simple schema it's fine
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            $conn->exec($stmt);
            echo "Executed: " . substr($stmt, 0, 50) . "...\n";
        }
    }

    echo "Migration Completed Successfully!\n";

} catch (Exception $e) {
    die("Migration Failed: " . $e->getMessage() . "\n");
}
