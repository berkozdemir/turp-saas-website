<?php
// Debug script to check DEEPSEEK_API_KEY loading
header('Content-Type: application/json');

// Function to load .env file
function load_env_debug()
{
    $results = [];

    // Check multiple possible locations
    $locations = [
        __DIR__ . '/.env',
        __DIR__ . '/../.env',
        $_SERVER['DOCUMENT_ROOT'] . '/.env',
        $_SERVER['DOCUMENT_ROOT'] . '/../.env'
    ];

    foreach ($locations as $path) {
        $results['locations'][] = [
            'path' => $path,
            'exists' => file_exists($path),
            'readable' => file_exists($path) ? is_readable($path) : false,
            'absolute_path' => realpath($path) ?: 'N/A'
        ];
    }

    // Try to load from the most common location
    $env_file = __DIR__ . '/../.env';
    if (file_exists($env_file)) {
        $results['env_file_found'] = true;
        $results['env_file_path'] = realpath($env_file);

        $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $results['total_lines'] = count($lines);
        $results['deepseek_found_in_file'] = false;

        foreach ($lines as $line) {
            if (strpos(trim($line), 'DEEPSEEK_API_KEY=') === 0) {
                $results['deepseek_found_in_file'] = true;
                $parts = explode('=', $line, 2);
                $value = isset($parts[1]) ? trim($parts[1]) : '';
                // Don't show full key for security
                $results['deepseek_value_length'] = strlen($value);
                $results['deepseek_value_preview'] = substr($value, 0, 10) . '...';

                // Try to set it
                putenv('DEEPSEEK_API_KEY=' . $value);
                $_ENV['DEEPSEEK_API_KEY'] = $value;
            }
        }
    } else {
        $results['env_file_found'] = false;
    }

    // Check if env var is accessible
    $results['getenv_result'] = getenv('DEEPSEEK_API_KEY');
    $results['env_array_result'] = $_ENV['DEEPSEEK_API_KEY'] ?? null;

    // Additional PHP environment info
    $results['php_info'] = [
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
        'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'N/A',
        'current_dir' => __DIR__,
        'working_dir' => getcwd()
    ];

    return $results;
}

$debug = load_env_debug();
echo json_encode($debug, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
