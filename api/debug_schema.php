<?php
header('Content-Type: text/plain');
require_once __DIR__ . '/db_connection.php';

try {
    $stmt = $conn->query("DESCRIBE iwrs_saas_blog_posts");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Columns in iwrs_saas_blog_posts:\n";
    foreach ($columns as $col) {
        echo "- " . $col['Field'] . " (" . $col['Type'] . ")\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>