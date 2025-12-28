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
function legal_list(int $tenant_id): array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT id, type, title_tr, title_en, title_zh, updated_at 
        FROM legal_documents 
        WHERE tenant_id = ?
        ORDER BY type ASC
    ");
    $stmt->execute([$tenant_id]);
    return $stmt->fetchAll();
}

/**
 * Get legal document by type
 */
function legal_get_by_type(int $tenant_id, string $type): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE tenant_id = ? AND type = ?");
    $stmt->execute([$tenant_id, $type]);
    return $stmt->fetch() ?: null;
}

/**
 * Get legal document by ID
 */
function legal_get(int $tenant_id, int $id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Create or update legal document
 */
function legal_save(int $tenant_id, string $type, array $data): int
{
    $conn = get_db_connection();

    $existing = legal_get_by_type($tenant_id, $type);

    if ($existing) {
        $stmt = $conn->prepare("
            UPDATE legal_documents SET 
                title_tr=?, content_tr=?, 
                title_en=?, content_en=?, 
                title_zh=?, content_zh=?,
                updated_at=NOW()
            WHERE tenant_id=? AND type=?
        ");
        $stmt->execute([
            $data['title_tr'] ?? '',
            $data['content_tr'] ?? '',
            $data['title_en'] ?? null,
            $data['content_en'] ?? null,
            $data['title_zh'] ?? null,
            $data['content_zh'] ?? null,
            $tenant_id,
            $type
        ]);
        return (int) $existing['id'];
    } else {
        $stmt = $conn->prepare("
            INSERT INTO legal_documents 
            (tenant_id, type, title_tr, content_tr, title_en, content_en, title_zh, content_zh) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $tenant_id,
            $type,
            $data['title_tr'] ?? '',
            $data['content_tr'] ?? '',
            $data['title_en'] ?? null,
            $data['content_en'] ?? null,
            $data['title_zh'] ?? null,
            $data['content_zh'] ?? null
        ]);
        return (int) $conn->lastInsertId();
    }
}

/**
 * Delete legal document
 */
function legal_delete(int $tenant_id, int $id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM legal_documents WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$id, $tenant_id]);
}
