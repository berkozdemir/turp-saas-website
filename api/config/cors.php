<?php
/**
 * CORS Configuration
 * 
 * Sets up CORS headers for API requests.
 */

function setup_cors(): void
{
    $allowed_domains = [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:8080",
        "https://ct.turp.health",
        "https://iwrs.com.tr",
        "https://nipt.tr",
        "https://westesti.com",
        "https://trombofili.com"
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // Allow all origins in development, specific origins in production
    if (in_array($origin, $allowed_domains) || !is_production()) {
        header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
    }

    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Api-Key, X-Tenant-Id, X-Tenant-Code");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");
}

/**
 * Handle OPTIONS preflight request
 */
function handle_preflight(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
