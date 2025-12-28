<?php
/**
 * Database Configuration
 * 
 * Provides PDO connection to MySQL database.
 * Uses environment variables with fallbacks for local development.
 */

// Load environment if exists
$env_config_file = __DIR__ . '/../env.php';
if (file_exists($env_config_file)) {
    $env_config = include $env_config_file;
    if (is_array($env_config)) {
        foreach ($env_config as $key => $value) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

/**
 * Get environment variable with fallback
 */
function get_env($key, $default = null)
{
    $value = $_SERVER[$key] ?? $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || trim($value) === '') {
        return $default;
    }
    return trim($value);
}

/**
 * Get database connection
 * 
 * @return PDO Database connection
 * @throws PDOException on connection failure
 */
function get_db_connection(): PDO
{
    static $conn = null;

    if ($conn === null) {
        $db_host = get_env('DB_HOST', 'db');
        $db_name = get_env('DB_NAME', 'turp_saas');
        $db_user = get_env('DB_USER', 'turp_user');
        $db_pass = get_env('DB_PASS', 'turp_password');

        $conn = new PDO(
            "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
            $db_user,
            $db_pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
    }

    return $conn;
}

/**
 * Get API secret key
 */
function get_api_secret(): ?string
{
    return get_env('VITE_API_SECRET');
}

/**
 * Get Brevo API key
 */
function get_brevo_key(): ?string
{
    return get_env('BREVO_API_KEY');
}

/**
 * Get DeepSeek API key
 */
function get_deepseek_key(): ?string
{
    return get_env('DEEPSEEK_API_KEY');
}

/**
 * Check if running in production
 */
function is_production(): bool
{
    return file_exists(__DIR__ . '/../env.php');
}
