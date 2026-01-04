<?php
require_once __DIR__ . '/config/db.php';

try {
    $conn = get_db_connection();
    $stmt = $conn->query("DESCRIBE podcasts");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (in_array('preview_clip_url', $columns)) {
        echo "COLUMN_EXISTS";
    } else {
        echo "COLUMN_MISSING";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
