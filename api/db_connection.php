<?php
/**
 * Database Connection Helper
 */

function get_db_connection()
{
    // Detect environment
    $is_docker = file_exists('/.dockerenv') || getenv('IS_DOCKER');

    // Default to 'db' service name in Docker, '127.0.0.1' in Production
    $default_host = $is_docker ? 'db' : '127.0.0.1';

    $db_host = getenv('DB_HOST') ?: $default_host;
    $db_name = getenv('DB_NAME') ?: 'turp_saas';
    $db_user = getenv('DB_USER') ?: 'turp_user';
    $db_pass = getenv('DB_PASS') ?: 'turp_password';

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
