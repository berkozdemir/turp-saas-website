<?php
require_once __DIR__ . '/../../config/db.php';

$conn = get_db_connection();

echo "--- Table Schema ---" . PHP_EOL;
$stmt = $conn->query("DESCRIBE legal_documents");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($columns as $col) {
    echo "{$col['Field']} ({$col['Type']})" . PHP_EOL;
}

echo PHP_EOL . "--- First 10 Rows ---" . PHP_EOL;
$stmt = $conn->query("SELECT id, tenant_id, `key`, title_tr FROM legal_documents LIMIT 10");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $row) {
    echo "ID: {$row['id']}, Tenant: {$row['tenant_id']}, Key: {$row['key']}, Title: {$row['title_tr']}" . PHP_EOL;
}

echo PHP_EOL . "--- Tenant NIPT lookup ---" . PHP_EOL;
$stmt = $conn->query("SELECT * FROM tenants WHERE code = 'nipt' OR domain LIKE '%nipt%'");
$tenants = $stmt->fetchAll(PDO::FETCH_ASSOC);
print_r($tenants);
