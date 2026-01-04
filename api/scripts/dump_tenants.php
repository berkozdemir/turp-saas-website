<?php
require_once __DIR__ . '/../config/db.php';
$conn = get_db_connection();
$stmt = $conn->query("SELECT * FROM tenants");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
