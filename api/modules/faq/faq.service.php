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
function faq_get_published(int $tenant_id, ?string $page_slug = null): array
{
    $conn = get_db_connection();

    $query = "SELECT * FROM faqs WHERE tenant_id = ? AND status = 'published'";
    $params = [$tenant_id];

    if ($page_slug) {
        $query .= " AND page_slug = ?";
        $params[] = $page_slug;
    }

    $query .= " ORDER BY sort_order ASC, id DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Ensure FAQs table has page_slug column
 */
function ensure_faq_table(): void
{
    $conn = get_db_connection();

    // Create table if not exists
    $conn->exec("
        CREATE TABLE IF NOT EXISTS faqs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id INT NOT NULL,
            question_tr TEXT,
            answer_tr TEXT,
            question_en TEXT,
            answer_en TEXT,
            question_zh TEXT,
            answer_zh TEXT,
            category VARCHAR(100) DEFAULT 'general',
            page_slug VARCHAR(100) DEFAULT 'global',
            sort_order INT DEFAULT 0,
            status VARCHAR(50) DEFAULT 'published',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_tenant (tenant_id),
            INDEX idx_tenant_page (tenant_id, page_slug),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Add page_slug column if missing
    try {
        $stmt = $conn->query("SHOW COLUMNS FROM faqs LIKE 'page_slug'");
        if ($stmt->rowCount() === 0) {
            $conn->exec("ALTER TABLE faqs ADD COLUMN page_slug VARCHAR(100) DEFAULT 'global' AFTER category");
            $conn->exec("CREATE INDEX idx_tenant_page ON faqs(tenant_id, page_slug)");
        }
    } catch (Exception $e) {
        // Ignore if column exists
    }
}

/**
 * Bulk import FAQs for a tenant/page
 * Only imports if no FAQs exist for the tenant+page combination
 * 
 * @param int $tenant_id
 * @param string $page_slug
 * @param array $items Array of [question, answer, order]
 * @return array [imported => int, skipped => bool]
 */
function faq_bulk_import(int $tenant_id, string $page_slug, array $items): array
{
    $conn = get_db_connection();
    ensure_faq_table();

    // Check if already imported
    $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM faqs WHERE tenant_id = ? AND page_slug = ?");
    $stmt->execute([$tenant_id, $page_slug]);
    $count = $stmt->fetch()['cnt'];

    if ($count > 0) {
        return ['imported' => 0, 'skipped' => true];
    }

    $imported = 0;
    foreach ($items as $item) {
        if (empty($item['question']) || empty($item['answer']))
            continue;

        $stmt = $conn->prepare("
            INSERT INTO faqs (tenant_id, page_slug, question_tr, answer_tr, sort_order, status)
            VALUES (?, ?, ?, ?, ?, 'published')
        ");
        $stmt->execute([
            $tenant_id,
            $page_slug,
            $item['question'],
            $item['answer'],
            $item['order'] ?? $imported
        ]);
        $imported++;
    }

    return ['imported' => $imported, 'skipped' => false];
}
