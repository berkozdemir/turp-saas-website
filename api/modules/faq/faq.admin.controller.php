<?php
/**
 * FAQ Admin Controller
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/faq.service.php';

function handle_faq_admin(string $action): bool
{
    switch ($action) {
        case 'get_faqs_admin':
            return faq_admin_list();
        case 'get_faq_detail':
            return faq_admin_get();
        case 'create_faq':
            return faq_admin_create();
        case 'update_faq':
            return faq_admin_update();
        case 'delete_faq':
            return faq_admin_delete();
        case 'translate_faq_all':
            return faq_admin_translate_all();
        default:
            return false;
    }
}

function faq_admin_list(): bool
{
    $ctx = require_admin_context();
    ensure_faq_table(); // Ensure table exists with page_slug column
    $faqs = faq_list($ctx['tenant_id'], [
        'status' => $_GET['status'] ?? 'all',
        'page' => $_GET['page'] ?? 1
    ]);
    echo json_encode([
        'success' => true,
        'data' => $faqs,
        '_debug_tenant_id' => $ctx['tenant_id']
    ]);
    return true;
}

function faq_admin_get(): bool
{
    $ctx = require_admin_context();
    $faq = faq_get($ctx['tenant_id'], (int) ($_GET['id'] ?? 0));
    if ($faq) {
        echo json_encode(['success' => true, 'data' => $faq]);
    } else {
        echo json_encode(['error' => 'FAQ not found']);
    }
    return true;
}

function faq_admin_create(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = faq_create($ctx['tenant_id'], $data);
    echo json_encode(['success' => true, 'id' => $id]);
    return true;
}

function faq_admin_update(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    faq_update($ctx['tenant_id'], (int) ($data['id'] ?? 0), $data);
    echo json_encode(['success' => true]);
    return true;
}

function faq_admin_delete(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    faq_delete($ctx['tenant_id'], (int) ($data['id'] ?? 0));
    echo json_encode(['success' => true]);
    return true;
}

function faq_admin_translate_all(): bool
{
    require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $question_tr = $data['question_tr'] ?? '';
    $answer_tr = $data['answer_tr'] ?? '';

    if (empty($question_tr) || empty($answer_tr)) {
        echo json_encode(['error' => 'Turkish question and answer required']);
        return true;
    }

    $apiKey = get_env_strict('DEEPSEEK_API_KEY');
    if (!$apiKey) {
        echo json_encode(['error' => 'API Key configuration missing (DEEPSEEK_API_KEY)']);
        return true;
    }

    $prompt = "You are a professional translator for a medical SaaS website. 
    Translate the following Turkish FAQ content into English (EN) and Chinese (ZH).
    
    Question: " . json_encode($question_tr) . "
    Answer: " . json_encode($answer_tr) . "
    
    Return ONLY a valid JSON object with this structure:
    {
      \"en\": { \"question\": \"...\", \"answer\": \"...\" },
      \"zh\": { \"question\": \"...\", \"answer\": \"...\" }
    }
    
    Keep the tone professional and concise.
    ";

    $url = 'https://api.deepseek.com/chat/completions';

    $ch = curl_init($url);
    $payload = json_encode([
        'model' => 'deepseek-chat',
        'messages' => [
            ['role' => 'system', 'content' => 'You are a helpful assistant that outputs strictly valid JSON.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.3,
        'response_format' => ['type' => 'json_object']
    ]);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Curl Error: ' . curl_error($ch)]);
        curl_close($ch);
        return true;
    }

    curl_close($ch);

    $ai_data = json_decode($response, true);
    $content = $ai_data['choices'][0]['message']['content'] ?? null;

    if ($content) {
        try {
            $parsed = json_decode($content, true);
            if ($parsed) {
                echo json_encode(['success' => true, 'translations' => $parsed]);
            } else {
                echo json_encode(['error' => 'Failed to parse AI response', 'raw' => $content]);
            }
        } catch (Exception $e) {
            echo json_encode(['error' => 'JSON Error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'No content from AI', 'raw' => $response]);
    }

    return true;
}
