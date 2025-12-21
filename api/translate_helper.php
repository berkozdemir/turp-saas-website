<?php
// DeepSeek AI Translation Helper
// Uses DeepSeek API to translate FAQ content

function translate_with_deepseek($text, $target_language, $api_key)
{
    if (empty($text) || empty($api_key)) {
        return ['error' => 'Text or API key is missing'];
    }

    $language_names = [
        'en' => 'English',
        'zh' => 'Chinese (Simplified)'
    ];

    $target_lang_name = $language_names[$target_language] ?? 'English';

    $prompt = "You are a professional medical translator. Translate the following Turkish text to {$target_lang_name}. 
    
Rules:
- Maintain medical/clinical accuracy
- Keep the translation clear and patient-friendly
- Do not add or invent any medical facts
- Preserve the original meaning and tone
- Return ONLY the translated text, no explanations

Turkish text:
{$text}";

    $data = [
        'model' => 'deepseek-chat',
        'messages' => [
            ['role' => 'system', 'content' => 'You are a professional medical translator specializing in clinical trial and healthcare content.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.3,
        'max_tokens' => 2000
    ];

    $ch = curl_init('https://api.deepseek.com/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $api_key
        ],
        CURLOPT_TIMEOUT => 60
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ['error' => 'Connection error: ' . $error];
    }

    if ($http_code !== 200) {
        return ['error' => 'API error (HTTP ' . $http_code . ')'];
    }

    $result = json_decode($response, true);

    if (isset($result['choices'][0]['message']['content'])) {
        return ['success' => true, 'translation' => trim($result['choices'][0]['message']['content'])];
    }

    return ['error' => 'Invalid API response'];
}

// Translate FAQ (question + answer) to target language
function translate_faq($question_tr, $answer_tr, $target_language, $api_key)
{
    // Translate question
    $question_result = translate_with_deepseek($question_tr, $target_language, $api_key);
    if (isset($question_result['error'])) {
        return $question_result;
    }

    // Translate answer
    $answer_result = translate_with_deepseek($answer_tr, $target_language, $api_key);
    if (isset($answer_result['error'])) {
        return $answer_result;
    }

    return [
        'success' => true,
        'question' => $question_result['translation'],
        'answer' => $answer_result['translation']
    ];
}

// API endpoint for translating FAQ
if (isset($action) && $action == 'translate_faq' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    // Only admin and editor can translate
    if (!in_array($user['role'], ['admin', 'editor'])) {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $question_tr = $data['question_tr'] ?? '';
    $answer_tr = $data['answer_tr'] ?? '';
    $target_language = $data['target_language'] ?? 'en';

    if (empty($question_tr) || empty($answer_tr)) {
        echo json_encode(['error' => 'Soru ve cevap gereklidir']);
        exit;
    }

    global $deepseek_api_key;
    if (empty($deepseek_api_key)) {
        echo json_encode(['error' => 'DeepSeek API key yapılandırılmamış']);
        exit;
    }

    $result = translate_faq($question_tr, $answer_tr, $target_language, $deepseek_api_key);
    echo json_encode($result);
    exit;
}

// Batch translate FAQ to both EN and ZH
if (isset($action) && $action == 'translate_faq_all' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user = require_admin_auth($conn);

    if (!in_array($user['role'], ['admin', 'editor'])) {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkiniz yok']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $question_tr = $data['question_tr'] ?? '';
    $answer_tr = $data['answer_tr'] ?? '';

    if (empty($question_tr) || empty($answer_tr)) {
        echo json_encode(['error' => 'Soru ve cevap gereklidir']);
        exit;
    }

    global $deepseek_api_key;
    if (empty($deepseek_api_key)) {
        echo json_encode(['error' => 'DeepSeek API key yapılandırılmamış']);
        exit;
    }

    // Translate to English
    $en_result = translate_faq($question_tr, $answer_tr, 'en', $deepseek_api_key);
    if (isset($en_result['error'])) {
        echo json_encode(['error' => 'EN çeviri hatası: ' . $en_result['error']]);
        exit;
    }

    // Translate to Chinese
    $zh_result = translate_faq($question_tr, $answer_tr, 'zh', $deepseek_api_key);
    if (isset($zh_result['error'])) {
        echo json_encode(['error' => 'ZH çeviri hatası: ' . $zh_result['error']]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'translations' => [
            'en' => [
                'question' => $en_result['question'],
                'answer' => $en_result['answer']
            ],
            'zh' => [
                'question' => $zh_result['question'],
                'answer' => $zh_result['answer']
            ]
        ]
    ]);
    exit;
}
