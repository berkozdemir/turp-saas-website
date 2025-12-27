<?php
// Mock script to debug get_media_list including tenant header

// 1. Simulating the request
$_GET['action'] = 'get_media_list';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['HTTP_X_TENANT_CODE'] = 'turp'; // or 'iwrs'

// We need to bypass auth or mock it.
// To avoid auth issues, I'll direct include the connection and run the query manually to see what's in DB.

require_once __DIR__ . '/env.php'; // get db creds 
$env = include __DIR__ . '/env.php';

try {
    $conn = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8", $env['DB_USER'], $env['DB_PASS']);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}

$tenant_code = 'turp'; // Test for Turp
// Get tenant ID first
$stmt = $conn->prepare("SELECT id FROM tenants WHERE code = ?");
$stmt->execute([$tenant_code]);
$tenant_id = $stmt->fetchColumn();

echo "Tenant Code: {$tenant_code}\n";
echo "Tenant ID: {$tenant_id}\n\n";

if (!$tenant_id) {
    die("Tenant not found.");
}

// Check media assets
$sql = "SELECT id, filename_original, tenant_id FROM media_assets WHERE tenant_id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$tenant_id]);
$assets = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Found " . count($assets) . " assets for tenant {$tenant_id}:\n";
print_r($assets);

// Check ALL media assets to see what's going on
$sql = "SELECT id, filename_original, tenant_id FROM media_assets LIMIT 10";
$stmt = $conn->query($sql);
$all = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "\n--- ALL MEDIA DUMP (First 10) ---\n";
print_r($all);

// Check if tenant_id is string 'turp' or int '2'
$sql = "SELECT DISTINCT tenant_id FROM media_assets";
$stmt = $conn->query($sql);
$tenants = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo "\n--- DISTINCT TENANT IDs IN MEDIA ---\n";
print_r($tenants);

?>