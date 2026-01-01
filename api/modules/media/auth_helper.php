<?php
/**
 * Auth Helper for Media Module
 * 
 * Provides authentication for media operations.
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';

/**
 * Require admin authentication for media operations
 * @param PDO $conn Database connection (unused, kept for compatibility)
 * @return int User ID if authenticated
 */
function require_admin_auth($conn): int
{
    $ctx = require_admin_context();
    return (int) ($ctx['user_id'] ?? 0);
}
