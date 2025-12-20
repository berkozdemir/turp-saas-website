<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Veritabanı ve Config Testi</h2>";

$env_file = __DIR__ . '/env.php';
echo "<b>Checking env.php:</b> ";
if (file_exists($env_file)) {
    echo "<span style='color:green'>FOUND</span><br>";
    $config = include $env_file;
    if (is_array($config)) {
        echo "env.php returned an ARRAY.<br>";
        echo "DB_HOST in file: " . ($config['DB_HOST'] ?? 'MISSING') . "<br>";
        echo "DB_USER in file: " . ($config['DB_USER'] ?? 'MISSING') . "<br>";
    } else {
        echo "<span style='color:red'>env.php did NOT return an array! Check syntax.</span><br>";
    }
} else {
    echo "<span style='color:red'>NOT FOUND at $env_file</span><br>";
    echo "Please make sure you created 'env.php' inside the 'api' folder.<br>";
}

echo "<hr>";

require_once 'db_connection.php';

try {
    $conn = get_db_connection();
    echo "<h3 style='color:green'>BAŞARILI: Veritabanına bağlanıldı.</h3>";

    // Check table
    $stmt = $conn->query("SHOW TABLES LIKE 'iwrs_saas_blog_posts'");
    if ($stmt->rowCount() > 0) {
        $count = $conn->query("SELECT count(*) FROM iwrs_saas_blog_posts")->fetchColumn();
        echo "Total Blog Posts: " . $count;
    } else {
        echo "<span style='color:red'>Table 'iwrs_saas_blog_posts' NOT FOUND.</span>";
    }

} catch (Exception $e) {
    echo "<h3 style='color:red'>BAĞLANTI HATASI: " . $e->getMessage() . "</h3>";

    // Debug info using the connection logic
    $is_docker = @file_exists('/.dockerenv') || getenv('IS_DOCKER');
    $default_host = $is_docker ? 'db' : '127.0.0.1';

    $final_host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: $default_host;
    echo "Attempted Host: " . $final_host . "<br>";
}
