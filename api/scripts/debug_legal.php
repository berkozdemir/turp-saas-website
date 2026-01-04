<?php
require_once __DIR__ . '/../config/db.php';
$conn = get_db_connection();

echo "Tenants:\n";
$tenants = $conn->query("SELECT * FROM tenants")->fetchAll(PDO::FETCH_ASSOC);
foreach ($tenants as $t) {
    echo "ID: {$t['id']} | Code: {$t['code']} | Name: {$t['name']}\n";
}

echo "\nLegal Docs:\n";
$docs = $conn->query("SELECT * FROM legal_documents")->fetchAll(PDO::FETCH_ASSOC);
foreach ($docs as $d) {
    echo "ID: {$d['id']} | TenantID: {$d['tenant_id']} | Key: {$d['key']} | Title: {$d['title_tr']}\n";
}
