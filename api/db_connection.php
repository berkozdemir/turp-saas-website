<?php
/**
 * Database Connection Helper
 */

function get_db_connection()
{
    $db_host = getenv('DB_HOST') ?? 'localhost';
    $db_name = getenv('DB_NAME') ?? 'turp_saas';
    $db_user = getenv('DB_USER') ?? 'turp_user';
    $db_pass = getenv('DB_PASS') ?? 'turp_password';

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
