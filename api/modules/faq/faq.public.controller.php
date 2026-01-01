<?php
/**
 * FAQ Public Controller
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/faq.service.php';

function handle_faq_public(string $action): bool
{
    switch ($action) {
        case 'get_faqs_public':
        case 'get_faqs_showcase':
            return faq_public_list();
        default:
            return false;
    }
}

function faq_public_list(): bool
{
    $tenant_id = get_current_tenant_id();
    $lang = $_GET['language'] ?? 'tr';

    // Normalize language (e.g., 'tr-TR' -> 'tr')
    $lang = strtolower(explode('-', $lang)[0]);
    if (!in_array($lang, ['tr', 'en', 'zh'])) {
        $lang = 'tr';
    }

    $raw_faqs = faq_get_published($tenant_id);

    // Map fields based on language for frontend expectations (question, answer)
    $mapped_faqs = array_map(function ($f) use ($lang) {
        $question = $f["question_$lang"] ?? $f["question_tr"] ?? $f["question"] ?? '';
        $answer = $f["answer_$lang"] ?? $f["answer_tr"] ?? $f["answer"] ?? '';

        return [
            'id' => $f['id'],
            'question' => $question,
            'answer' => $answer,
            'category' => $f['category']
        ];
    }, $raw_faqs);

    echo json_encode([
        'success' => true,
        'data' => $mapped_faqs,
        'categories' => array_values(array_unique(array_column($mapped_faqs, 'category')))
    ]);
    return true;
}
