<?php
/**
 * Input Sanitization Helper Functions
 * 
 * Provides consistent input sanitization across API endpoints.
 */

/**
 * Sanitize a string for safe output (XSS protection)
 */
function sanitize_string(?string $input, int $max_length = 0): string
{
    if ($input === null) {
        return '';
    }

    $clean = htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');

    if ($max_length > 0 && mb_strlen($clean) > $max_length) {
        $clean = mb_substr($clean, 0, $max_length);
    }

    return $clean;
}

/**
 * Sanitize email address
 */
function sanitize_email(?string $email): string
{
    if ($email === null) {
        return '';
    }

    $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    return $email ?: '';
}

/**
 * Validate and return email or false
 */
function validate_email(?string $email): ?string
{
    if ($email === null) {
        return null;
    }

    $email = trim($email);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return $email;
    }

    return null;
}

/**
 * Sanitize integer input
 */
function sanitize_int($input, int $default = 0, int $min = PHP_INT_MIN, int $max = PHP_INT_MAX): int
{
    $value = filter_var($input, FILTER_VALIDATE_INT);

    if ($value === false) {
        return $default;
    }

    return max($min, min($max, $value));
}

/**
 * Sanitize boolean input
 */
function sanitize_bool($input): bool
{
    return filter_var($input, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
}

/**
 * Sanitize URL
 */
function sanitize_url(?string $url): string
{
    if ($url === null) {
        return '';
    }

    $url = filter_var(trim($url), FILTER_SANITIZE_URL);

    if (filter_var($url, FILTER_VALIDATE_URL)) {
        return $url;
    }

    return '';
}

/**
 * Sanitize phone number (keep only digits and +)
 */
function sanitize_phone(?string $phone): string
{
    if ($phone === null) {
        return '';
    }

    return preg_replace('/[^0-9+]/', '', trim($phone));
}

/**
 * Sanitize slug (URL-safe string)
 */
function sanitize_slug(?string $input): string
{
    if ($input === null || $input === '') {
        return '';
    }

    // Convert to lowercase
    $slug = mb_strtolower(trim($input), 'UTF-8');

    // Turkish character conversion
    $slug = str_replace(
        ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', 'İ', 'Ğ', 'Ü', 'Ş', 'Ö', 'Ç'],
        ['i', 'g', 'u', 's', 'o', 'c', 'i', 'g', 'u', 's', 'o', 'c'],
        $slug
    );

    // Replace non-alphanumeric with dash
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);

    // Remove leading/trailing dashes
    return trim($slug, '-');
}

/**
 * Sanitize rich HTML content (for blog posts, etc.)
 * Allows safe HTML tags, removes dangerous attributes
 */
function sanitize_html(?string $html): string
{
    if ($html === null) {
        return '';
    }

    $allowed_tags = [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        's',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'blockquote',
        'code',
        'pre',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'div',
        'span'
    ];

    // Strip all tags except allowed ones
    $clean = strip_tags($html, '<' . implode('><', $allowed_tags) . '>');

    // Remove dangerous attributes (onclick, onerror, etc.)
    $clean = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $clean);
    $clean = preg_replace('/\s*javascript\s*:/i', '', $clean);

    return $clean;
}

/**
 * Get sanitized input from array (POST/GET data)
 */
function get_input(array $data, string $key, string $type = 'string', $default = null)
{
    $value = $data[$key] ?? $default;

    switch ($type) {
        case 'string':
            return sanitize_string($value);
        case 'email':
            return sanitize_email($value);
        case 'int':
            return sanitize_int($value, $default ?? 0);
        case 'bool':
            return sanitize_bool($value);
        case 'url':
            return sanitize_url($value);
        case 'phone':
            return sanitize_phone($value);
        case 'slug':
            return sanitize_slug($value);
        case 'html':
            return sanitize_html($value);
        case 'raw':
            return $value;
        default:
            return $value;
    }
}
