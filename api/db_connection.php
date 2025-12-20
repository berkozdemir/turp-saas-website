<?php
/**
 * Database Connection Helper
 */

function get_db_connection()
{
    // 1. Try to load key/value pairs from env.php (Plesk/Production secure method)
    $env_file = __DIR__ . '/env.php';
    if (file_exists($env_file)) {
        $config = include $env_file;
        if (is_array($config)) {
            foreach ($config as $key => $value) {
                // Set into environment for getenv() to pick up (if supported)
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }

    // 2. Detect Docker (suppress warning with @ for open_basedir restrictions)
    $is_docker = @file_exists('/.dockerenv') || getenv('IS_DOCKER');

    // Default to 'db' for Docker, '127.0.0.1' for Prod (if env.php didn't set DB_HOST)
    $default_host = $is_docker ? 'db' : '127.0.0.1';

    // 3. Get values (Priority: env.php > real environment > defaults)
    $db_host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: $default_host;
    $db_name = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'turp_saas';
    $db_user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'turp_user';
    $db_pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: 'turp_password';

    try {
        $dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";
        $conn = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $conn;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Veritabanı bağlantı hatası"]);
        exit;
    }
}
