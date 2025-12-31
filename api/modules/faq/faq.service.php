<?php
/**
 * FAQ Service
 * 
 * Business logic for FAQ management.
 * All functions take explicit tenant_id parameter.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * List FAQs for a tenant
 * 
 * @param int $tenant_id
 * @param array $options [status, search, page, limit]
 * @return array FAQs
 */
function faq_list(int $tenant_id, array $options = []): array
{
    $conn = get_db_connection();

    $status = $options['status'] ?? 'all';
    $page = max(1, (int) ($options['page'] ?? 1));
    $limit = min(100, max(1, (int) ($options['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM faqs WHERE tenant_id = ?";
    $params = [$tenant_id];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY sort_order ASC, id DESC LIMIT $limit OFFSET $offset";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Get single FAQ
 */
function faq_get(int $tenant_id, int $id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM faqs WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Create FAQ
 */
function faq_create(int $tenant_id, array $data): int
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        INSERT INTO faqs 
        (question_tr, answer_tr, question_en, answer_en, question_zh, answer_zh, 
         category, sort_order, status, tenant_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['question_tr'] ?? '',
        $data['answer_tr'] ?? '',
        $data['question_en'] ?? null,
        $data['answer_en'] ?? null,
        $data['question_zh'] ?? null,
        $data['answer_zh'] ?? null,
        $data['category'] ?? 'general',
        $data['sort_order'] ?? 0,
        $data['status'] ?? 'published',
        $tenant_id
    ]);

    return (int) $conn->lastInsertId();
}

/**
 * Update FAQ
 */
function faq_update(int $tenant_id, int $id, array $data): bool
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        UPDATE faqs SET 
            question_tr=?, answer_tr=?, question_en=?, answer_en=?, 
            question_zh=?, answer_zh=?, category=?, sort_order=?, status=?
        WHERE id=? AND tenant_id=?
    ");

    return $stmt->execute([
        $data['question_tr'] ?? '',
        $data['answer_tr'] ?? '',
        $data['question_en'] ?? null,
        $data['answer_en'] ?? null,
        $data['question_zh'] ?? null,
        $data['answer_zh'] ?? null,
        $data['category'] ?? 'general',
        $data['sort_order'] ?? 0,
        $data['status'] ?? 'published',
        $id,
        $tenant_id
    ]);
}

/**
 * Delete FAQ
 */
function faq_delete(int $tenant_id, int $id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM faqs WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$id, $tenant_id]);
}

/**
 * Get published FAQs (public)
 */
function faq_get_published(int $tenant_id): array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT * FROM faqs 
        WHERE tenant_id = ? AND status = 'published'
        ORDER BY sort_order ASC, id DESC
    ");
    $stmt->execute([$tenant_id]);
    return $stmt->fetchAll();
}
