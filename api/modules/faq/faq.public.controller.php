<?php
/**
 * FAQ Public Controller
 */



function handle_faq_public(string $action): bool
{
    global $conn;
    $conn = get_db_connection();
    switch ($action) {
        case 'get_faqs_public':
        case 'get_faqs_showcase':
            return faq_public_list();
        case 'get_faqs_by_page':
            return faq_public_by_page();
        case 'bulk_import_faqs':
            return faq_public_bulk_import();
        default:
            return false;
    }
}

function faq_public_list(): bool
{
    $tenant_id = get_current_tenant_id();
    $lang = $_GET['language'] ?? 'tr';
    $page_slug = $_GET['page'] ?? null;

    // Normalize language (e.g., 'tr-TR' -> 'tr')
    $lang = strtolower(explode('-', $lang)[0]);
    if (!in_array($lang, ['tr', 'en', 'zh'])) {
        $lang = 'tr';
    }

    $raw_faqs = faq_get_published($tenant_id, $page_slug);

    // Map fields based on language for frontend expectations (question, answer)
    $mapped_faqs = array_map(function ($f) use ($lang) {
        $question = $f["question_$lang"] ?? $f["question_tr"] ?? $f["question"] ?? '';
        $answer = $f["answer_$lang"] ?? $f["answer_tr"] ?? $f["answer"] ?? '';

        return [
            'id' => $f['id'],
            'question' => $question,
            'answer' => $answer,
            'category' => $f['category'] ?? 'general',
            'page_slug' => $f['page_slug'] ?? 'global'
        ];
    }, $raw_faqs);

    echo json_encode([
        'success' => true,
        'data' => $mapped_faqs,
        'categories' => array_values(array_unique(array_column($mapped_faqs, 'category')))
    ]);
    return true;
}

function faq_public_by_page(): bool
{
    $tenant_id = get_current_tenant_id();
    $page_slug = $_GET['page'] ?? 'global';
    $lang = $_GET['language'] ?? 'tr';

    $lang = strtolower(explode('-', $lang)[0]);
    if (!in_array($lang, ['tr', 'en', 'zh'])) {
        $lang = 'tr';
    }

    ensure_faq_table();
    $raw_faqs = faq_get_published($tenant_id, $page_slug);

    $mapped_faqs = array_map(function ($f) use ($lang) {
        return [
            'id' => $f['id'],
            'question' => $f["question_$lang"] ?? $f["question_tr"] ?? '',
            'answer' => $f["answer_$lang"] ?? $f["answer_tr"] ?? ''
        ];
    }, $raw_faqs);

    echo json_encode([
        'success' => true,
        'data' => $mapped_faqs
    ]);
    return true;
}

function faq_public_bulk_import(): bool
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return true;
    }

    $tenant_id = get_current_tenant_id();
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['page_slug']) || !is_array($data['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'page_slug and items required']);
        return true;
    }

    $result = faq_bulk_import($tenant_id, $data['page_slug'], $data['items']);

    echo json_encode([
        'success' => true,
        'imported' => $result['imported'],
        'skipped' => $result['skipped']
    ]);
    return true;
}
