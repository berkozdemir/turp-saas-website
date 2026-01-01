<?php
/**
 * Blog Admin Controller
 * 
 * Handles admin API requests for blog management.
 * Routes: get_blog_posts_admin, get_blog_post_detail, create_blog_post, update_blog_post, delete_blog_post
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/blog.service.php';

/**
 * Handle admin blog actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_blog_admin(string $action): bool
{
    switch ($action) {
        case 'get_blog_posts_admin':
            return blog_admin_list();
        case 'get_blog_post_detail':
            return blog_admin_get();
        case 'create_blog_post':
            return blog_admin_create();
        case 'update_blog_post':
            return blog_admin_update();
        case 'delete_blog_post':
            return blog_admin_delete();
        case 'ai_translate_blog_all':
            return blog_admin_translate_all();
        default:
            return false;
    }
}

function blog_admin_list(): bool
{
    $ctx = require_admin_context();

    $result = blog_list_posts($ctx['tenant_id'], [
        'status' => $_GET['status'] ?? 'all',
        'search' => $_GET['search'] ?? '',
        'page' => $_GET['page'] ?? 1,
        'limit' => $_GET['limit'] ?? 20
    ]);

    echo json_encode([
        'success' => true,
        'data' => $result['posts'],
        'pagination' => [
            'total' => $result['total'],
            'page' => $result['page'],
            'pages' => $result['pages']
        ]
    ]);
    return true;
}

function blog_admin_get(): bool
{
    $ctx = require_admin_context();
    $id = (int) ($_GET['id'] ?? 0);

    $post = blog_get_post($ctx['tenant_id'], $id);

    if ($post) {
        echo json_encode(['success' => true, 'data' => $post]);
    } else {
        echo json_encode(['error' => 'Post not found']);
    }
    return true;
}

function blog_admin_create(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    if (empty($data['slug']) || empty($data['title_tr'])) {
        echo json_encode(['error' => 'Slug and Turkish title are required']);
        return true;
    }

    $id = blog_create_post($ctx['tenant_id'], $data);
    echo json_encode(['success' => true, 'id' => $id]);
    return true;
}

function blog_admin_update(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (empty($id)) {
        echo json_encode(['error' => 'ID required for update']);
        return true;
    }

    blog_update_post($ctx['tenant_id'], $id, $data);
    echo json_encode(['success' => true]);
    return true;
}

function blog_admin_delete(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    blog_delete_post($ctx['tenant_id'], $id);
    echo json_encode(['success' => true]);
    return true;
}

function blog_admin_translate_all(): bool
{
    require_admin_context(); // Auth check
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $title_tr = $data['title_tr'] ?? '';
    // Use either excerpt or content as source if one is missing, but prefer title + content
    $excerpt_tr = $data['excerpt_tr'] ?? '';
    $content_tr = $data['content_tr'] ?? '';

    if (empty($title_tr) && empty($content_tr)) {
        echo json_encode(['error' => 'Turkish content (title or body) required as source']);
        return true;
    }

    $apiKey = get_env_strict('DEEPSEEK_API_KEY');
    if (!$apiKey) {
        // Fallback for development if env is not loaded correctly, or explicit error
        echo json_encode(['error' => 'API Key configuration missing (DEEPSEEK_API_KEY)']);
        return true;
    }

    // Prepare prompt
    $prompt = "You are a professional translator for a SaaS website. 
    Translate the following Turkish blog content into English (EN) and Chinese (ZH).
    
    Source Title: " . json_encode($title_tr) . "
    Source Excerpt: " . json_encode($excerpt_tr) . "
    Source Content: " . json_encode($content_tr) . "
    
    Return ONLY a valid JSON object with this structure:
    {
      \"en\": { \"title\": \"...\", \"excerpt\": \"...\", \"content\": \"...\" },
      \"zh\": { \"title\": \"...\", \"excerpt\": \"...\", \"content\": \"...\" }
    }
    
    Keep the tone professional and SEO-friendly. Preserve HTML tags if any. Do not include markdown code blocks.
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
    curl_setopt($ch, CURLOPT_TIMEOUT, 120); // 2 minute timeout for long content
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30); // 30 second connection timeout
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        echo json_encode(['error' => 'Curl Error: ' . $error]);
        return true;
    }

    curl_close($ch);

    // Check HTTP status
    if ($httpCode !== 200) {
        echo json_encode(['error' => 'API Error: HTTP ' . $httpCode, 'raw' => $response]);
        return true;
    }

    $ai_data = json_decode($response, true);
    $content = $ai_data['choices'][0]['message']['content'] ?? null;

    if ($content) {
        // Parse JSON from content
        try {
            $parsed = json_decode($content, true);
            if ($parsed) {
                echo json_encode($parsed);
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
