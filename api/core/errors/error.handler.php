<?php
/**
 * Error Handler
 * 
 * Centralized error handling for API responses.
 */

/**
 * Check if running in production
 * 
 * @return bool
 */
function is_production(): bool
{
    // Adjust path based on file location: api/core/errors/ -> api/env.php
    return file_exists(__DIR__ . '/../../env.php');
}

// Register handlers immediately when this file is included
register_error_handlers();

/**
 * Send JSON error response
 * 
 * @param string $message Error message
 * @param int $code HTTP status code
 */
function send_error(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit();
}

/**
 * Send JSON success response
 * 
 * @param mixed $data Response data
 */
function send_success($data): void
{
    echo json_encode(['success' => true, 'data' => $data]);
    exit();
}

/**
 * Send JSON response
 * 
 * @param array $response Response array
 * @param int $code HTTP status code
 */
function send_json(array $response, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($response);
    exit();
}

/**
 * Global exception handler
 */
function handle_exception(Throwable $e): void
{
    error_log("API Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());

    if (is_production()) {
        send_error('An error occurred', 500);
    } else {
        send_error($e->getMessage(), 500);
    }
}

/**
 * Register global error handlers
 */
function register_error_handlers(): void
{
    set_exception_handler('handle_exception');

    // In production, hide errors
    if (is_production()) {
        error_reporting(0);
        ini_set('display_errors', 0);
    } else {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    }
}
