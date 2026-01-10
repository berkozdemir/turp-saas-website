<?php
/**
 * Debug: Test Chatbot Configuration
 * Run this script on the live server to check if chatbot is properly configured
 * URL: https://iwrs.com.tr/api/test_chatbot.php
 */

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Load env
$env_config_file = __DIR__ . '/env.php';
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

function get_env($key, $default = null)
{
    $value = $_SERVER[$key] ?? $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || trim($value) === '') {
        return $default;
    }
    return trim($value);
}

$result = [
    'env_file_exists' => file_exists($env_config_file),
    'deepseek_key_exists' => !empty(get_env('DEEPSEEK_API_KEY')),
    'deepseek_key_length' => strlen(get_env('DEEPSEEK_API_KEY') ?? ''),
    'deepseek_key_preview' => substr(get_env('DEEPSEEK_API_KEY') ?? 'NOT_SET', 0, 8) . '***',
    'deepseek_endpoint' => get_env('DEEPSEEK_API_ENDPOINT', 'https://api.deepseek.com/chat/completions (default)')
];

// Test DB connection
try {
    require_once __DIR__ . '/config/db.php';
    $conn = get_db_connection();

    // Check chatbot_knowledge_index for iwrs
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM chatbot_knowledge_index WHERE tenant_id = 'iwrs'");
    $stmt->execute();
    $row = $stmt->fetch();
    $result['iwrs_knowledge_count'] = $row['count'];

    // Check chatbot_conversations
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM chatbot_conversations WHERE tenant_id = 'iwrs'");
    $stmt->execute();
    $row = $stmt->fetch();
    $result['iwrs_conversation_count'] = $row['count'];

    $result['db_connection'] = 'OK';
} catch (Exception $e) {
    $result['db_connection'] = 'FAILED: ' . $e->getMessage();
}

// If test=1, try to call DeepSeek API
if (isset($_GET['test']) && $_GET['test'] == '1') {
    $api_key = get_env('DEEPSEEK_API_KEY');

    if (empty($api_key)) {
        $result['deepseek_api_test'] = 'FAILED: No API key';
    } else {
        $endpoint = get_env('DEEPSEEK_API_ENDPOINT', 'https://api.deepseek.com/chat/completions');

        $data = [
            'model' => 'deepseek-chat',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                ['role' => 'user', 'content' => 'Say hello in Turkish, just one word.']
            ],
            'temperature' => 0.7,
            'max_tokens' => 50,
            'stream' => false
        ];

        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $api_key
            ],
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);

        if ($curl_error) {
            $result['deepseek_api_test'] = 'CURL_ERROR: ' . $curl_error;
        } else {
            $json_response = json_decode($response, true);
            $result['deepseek_http_code'] = $http_code;

            if ($http_code === 200 && isset($json_response['choices'][0]['message']['content'])) {
                $result['deepseek_api_test'] = 'OK';
                $result['deepseek_response'] = $json_response['choices'][0]['message']['content'];
            } else {
                $result['deepseek_api_test'] = 'FAILED';
                $result['deepseek_response'] = $json_response;
            }
        }
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
