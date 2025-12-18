<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Veritabanı Bağlantı Testi</h2>";

// Mevcut db_connection.php'yi test et
require_once 'db_connection.php';

echo "Checking Environment Variables:<br>";
echo "DB_HOST: " . (getenv('DB_HOST') ? 'SET' : 'EMPTY') . "<br>";
echo "DB_NAME: " . (getenv('DB_NAME') ? 'SET' : 'EMPTY') . "<br>";
echo "DB_USER: " . (getenv('DB_USER') ? 'SET' : 'EMPTY') . "<br>";

try {
    $conn = get_db_connection();
    echo "<h3 style='color:green'>BAŞARILI: Veritabanına bağlanıldı.</h3>";

    // Check if table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'iwrs_saas_blog_posts'");
    if ($stmt->rowCount() > 0) {
        echo "Table 'iwrs_saas_blog_posts' FOUND.<br>";

        $count = $conn->query("SELECT count(*) FROM iwrs_saas_blog_posts")->fetchColumn();
        echo "Total Blog Posts: " . $count;
    } else {
        echo "<span style='color:red'>Table 'iwrs_saas_blog_posts' NOT FOUND.</span>";
    }

} catch (Exception $e) {
    echo "<h3 style='color:red'>HATA: " . $e->getMessage() . "</h3>";
}
