<?php
/**
 * Legal Service
 * 
 * Business logic for legal documents (Privacy Policy, Terms, etc.)
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * List legal documents for tenant
 */
function legal_list($tenant_id): array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT id, `key`, `key` as type, title_tr, title_en, title_zh, updated_at, 
               is_active, effective_date, sort_order
        FROM legal_documents 
        WHERE tenant_id = ?
        ORDER BY sort_order ASC, `key` ASC
    ");
    $stmt->execute([(string) $tenant_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Get legal document by type
 */
function legal_get_by_type($tenant_id, string $key): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE tenant_id = ? AND `key` = ?");
    $stmt->execute([(string) $tenant_id, $key]);
    return $stmt->fetch() ?: null;
}

/**
 * Get legal document by ID
 */
function legal_get($tenant_id, int $id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, (string) $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Create or update legal document
 */
function legal_save($tenant_id, string $key, array $data): int
{
    $conn = get_db_connection();

    $existing = legal_get_by_type($tenant_id, $key);

    if ($existing) {
        $stmt = $conn->prepare("
            UPDATE legal_documents SET 
                title_tr=?, content_tr=?, 
                title_en=?, content_en=?, 
                title_zh=?, content_zh=?,
                is_active=?, effective_date=?, sort_order=?,
                updated_at=NOW()
            WHERE tenant_id=? AND `key`=?
        ");
        $stmt->execute([
            $data['title_tr'] ?? '',
            $data['content_tr'] ?? '',
            $data['title_en'] ?? null,
            $data['content_en'] ?? null,
            $data['title_zh'] ?? null,
            $data['content_zh'] ?? null,
            $data['is_active'] ?? 1,
            $data['effective_date'] ?? null,
            $data['sort_order'] ?? 0,
            (string) $tenant_id,
            $key
        ]);
        return (int) $existing['id'];
    } else {
        $stmt = $conn->prepare("
            INSERT INTO legal_documents 
            (tenant_id, `key`, title_tr, content_tr, title_en, content_en, title_zh, content_zh, is_active, effective_date, sort_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            (string) $tenant_id,
            $key,
            $data['title_tr'] ?? '',
            $data['content_tr'] ?? '',
            $data['title_en'] ?? null,
            $data['content_en'] ?? null,
            $data['title_zh'] ?? null,
            $data['content_zh'] ?? null,
            $data['is_active'] ?? 1,
            $data['effective_date'] ?? null,
            $data['sort_order'] ?? 0
        ]);
        return (int) $conn->lastInsertId();
    }
}

/**
 * Delete legal document
 */
function legal_delete($tenant_id, int $id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM legal_documents WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$id, (string) $tenant_id]);
}
