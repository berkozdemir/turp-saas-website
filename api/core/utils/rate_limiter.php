<?php
/**
 * Simple Rate Limiter
 * File-based rate limiting for login and password reset attempts
 */

/**
 * Check if action is rate limited
 * @param string $key Unique identifier (IP, email, etc.)
 * @param string $action Action type (login, forgot_password)
 * @param int $max_attempts Maximum attempts allowed
 * @param int $window_seconds Time window in seconds
 * @return array ['allowed' => bool, 'remaining' => int, 'reset_at' => int]
 */
function check_rate_limit(string $key, string $action, int $max_attempts = 10, int $window_seconds = 900): array
{
    $cache_dir = sys_get_temp_dir() . '/rate_limit';
    if (!is_dir($cache_dir)) {
        @mkdir($cache_dir, 0755, true);
    }

    $file = $cache_dir . '/' . md5($action . '_' . $key) . '.json';
    $now = time();

    // Load existing data
    $data = ['attempts' => [], 'created_at' => $now];
    if (file_exists($file)) {
        $content = @file_get_contents($file);
        if ($content) {
            $data = json_decode($content, true) ?: $data;
        }
    }

    // Filter out old attempts (outside window)
    $window_start = $now - $window_seconds;
    $data['attempts'] = array_filter($data['attempts'], fn($ts) => $ts > $window_start);

    $attempt_count = count($data['attempts']);
    $allowed = $attempt_count < $max_attempts;
    $remaining = max(0, $max_attempts - $attempt_count);
    $reset_at = empty($data['attempts']) ? $now + $window_seconds : min($data['attempts']) + $window_seconds;

    return [
        'allowed' => $allowed,
        'remaining' => $remaining,
        'reset_at' => $reset_at,
        'current_attempts' => $attempt_count
    ];
}

/**
 * Record an attempt
 * @param string $key Unique identifier
 * @param string $action Action type
 */
function record_attempt(string $key, string $action): void
{
    $cache_dir = sys_get_temp_dir() . '/rate_limit';
    if (!is_dir($cache_dir)) {
        @mkdir($cache_dir, 0755, true);
    }

    $file = $cache_dir . '/' . md5($action . '_' . $key) . '.json';
    $now = time();

    // Load existing data
    $data = ['attempts' => [], 'created_at' => $now];
    if (file_exists($file)) {
        $content = @file_get_contents($file);
        if ($content) {
            $data = json_decode($content, true) ?: $data;
        }
    }

    // Add new attempt
    $data['attempts'][] = $now;

    // Save
    @file_put_contents($file, json_encode($data), LOCK_EX);
}

/**
 * Clear rate limit for a key (e.g., after successful login)
 * @param string $key Unique identifier
 * @param string $action Action type
 */
function clear_rate_limit(string $key, string $action): void
{
    $cache_dir = sys_get_temp_dir() . '/rate_limit';
    $file = $cache_dir . '/' . md5($action . '_' . $key) . '.json';
    if (file_exists($file)) {
        @unlink($file);
    }
}

/**
 * Get client IP address
 * @return string IP address
 */
function get_client_ip(): string
{
    $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // Handle comma-separated IPs (X-Forwarded-For)
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '0.0.0.0';
}
