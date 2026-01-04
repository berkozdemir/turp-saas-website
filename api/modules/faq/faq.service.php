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
 * @param mixed $tenant_id
 * @param array $options [is_active, is_showcased, search, page, limit]
 * @return array FAQs
 */
function faq_list($tenant_id, array $options = []): array
{
    $conn = get_db_connection();

    $is_active = $options['is_active'] ?? 'all';
    $is_showcased = $options['is_showcased'] ?? 'all';
    $search = $options['search'] ?? '';

    $page = max(1, (int) ($options['page'] ?? 1));
    $limit = min(100, max(1, (int) ($options['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM faqs WHERE tenant_id = ?";
    $params = [$tenant_id];

    if ($is_active !== 'all') {
        $query .= " AND is_active = ?";
        $params[] = $is_active === 'true' ? 1 : 0;
    }

    if ($is_showcased !== 'all') {
        $query .= " AND is_showcased = ?";
        $params[] = $is_showcased === 'true' ? 1 : 0;
    }

    if (!empty($search)) {
        $query .= " AND (question_tr LIKE ? OR question_en LIKE ?)";
        $term = "%$search%";
        $params[] = $term;
        $params[] = $term;
    }

    $query .= " ORDER BY sort_order ASC, id DESC LIMIT $limit OFFSET $offset";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Get single FAQ
 */
function faq_get($tenant_id, int $id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM faqs WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

/**
 * Create FAQ
 */
function faq_create($tenant_id, array $data): int
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        INSERT INTO faqs 
        (question_tr, answer_tr, question_en, answer_en, question_zh, answer_zh, 
         category, sort_order, is_active, is_showcased, tenant_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        isset($data['is_active']) ? (int) $data['is_active'] : 1,
        isset($data['is_showcased']) ? (int) $data['is_showcased'] : 0,
        $tenant_id
    ]);

    return (int) $conn->lastInsertId();
}

/**
 * Update FAQ
 */
function faq_update($tenant_id, int $id, array $data): bool
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        UPDATE faqs SET 
            question_tr=?, answer_tr=?, question_en=?, answer_en=?, 
            question_zh=?, answer_zh=?, category=?, sort_order=?, is_active=?, is_showcased=?
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
        isset($data['is_active']) ? (int) $data['is_active'] : 1,
        isset($data['is_showcased']) ? (int) $data['is_showcased'] : 0,
        $id,
        $tenant_id
    ]);
}

/**
 * Delete FAQ
 */
function faq_delete($tenant_id, int $id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM faqs WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$id, $tenant_id]);
}

/**
 * Get published FAQs (public)
 */
function faq_get_published($tenant_id, ?string $page_slug = null): array
{
    $conn = get_db_connection();

    $query = "SELECT * FROM faqs WHERE tenant_id = ? AND is_active = 1";
    $params = [$tenant_id];

    if ($page_slug) {
        $query .= " AND page_slug = ?";
        $params[] = $page_slug;
    }

    $query .= " ORDER BY sort_order ASC, id DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Ensure FAQs table has necessary columns
 */
function ensure_faq_table(): void
{
    $conn = get_db_connection();

    // Create table if not exists with new columns
    $conn->exec("
        CREATE TABLE IF NOT EXISTS faqs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id VARCHAR(50) NOT NULL,
            question_tr TEXT,
            answer_tr TEXT,
            question_en TEXT,
            answer_en TEXT,
            question_zh TEXT,
            answer_zh TEXT,
            category VARCHAR(100) DEFAULT 'general',
            page_slug VARCHAR(100) DEFAULT 'global',
            sort_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            is_showcased TINYINT(1) DEFAULT 0,
            status VARCHAR(50) DEFAULT 'published', -- Deprecated but kept for compatibility
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_tenant (tenant_id),
            INDEX idx_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Add columns if they don't exist
    try {
        $columns = [
            'page_slug' => "VARCHAR(100) DEFAULT 'global' AFTER category",
            'is_active' => "TINYINT(1) DEFAULT 1 AFTER sort_order",
            'is_showcased' => "TINYINT(1) DEFAULT 0 AFTER is_active"
        ];

        foreach ($columns as $col => $def) {
            $stmt = $conn->query("SHOW COLUMNS FROM faqs LIKE '$col'");
            if ($stmt->rowCount() === 0) {
                $conn->exec("ALTER TABLE faqs ADD COLUMN $col $def");
            }
        }
    } catch (Exception $e) {
        // Ignore errors
    }
}

/**
 * Bulk import FAQs for a tenant/page
 * Only imports if no FAQs exist for the tenant+page combination
 * 
 * @param mixed $tenant_id
 * @param string $page_slug
 * @param array $items Array of [question, answer, order]
 * @return array [imported => int, skipped => bool]
 */
function faq_bulk_import($tenant_id, string $page_slug, array $items): array
{
    $conn = get_db_connection();
    ensure_faq_table();

    // Check if already imported
    $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM faqs WHERE tenant_id = ? AND page_slug = ?");
    $stmt->execute([$tenant_id, $page_slug]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['cnt'];

    if ($count > 0) {
        return ['imported' => 0, 'skipped' => true];
    }

    $imported = 0;
    foreach ($items as $item) {
        if (empty($item['question']) || empty($item['answer']))
            continue;

        $stmt = $conn->prepare("
            INSERT INTO faqs (tenant_id, page_slug, question_tr, answer_tr, sort_order, is_active, status)
            VALUES (?, ?, ?, ?, ?, 1, 'published')
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

