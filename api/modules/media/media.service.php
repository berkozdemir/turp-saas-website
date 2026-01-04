<?php
/**
 * Service: Media Manager Service
 * Scope: Admin / API
 * Description:
 * - Business logic for managing media assets (images, docs).
 * - Handles file uploads, optimizing resizing, and DB records.
 * Related:
 * - Controller: media.admin.controller.php
 * - Helper: ImageOptimizerService
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * List media assets for tenant
 */
function media_list(int $tenant_id, array $options = []): array
{
    $conn = get_db_connection();

    $type = $options['type'] ?? null;
    $page = max(1, (int) ($options['page'] ?? 1));
    $limit = min(100, max(1, (int) ($options['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM media_assets WHERE tenant_id = ?";
    $params = [$tenant_id];

    if ($type) {
        $query .= " AND mime_type LIKE ?";
        $params[] = "$type%";
    }

    // Count total
    $count_stmt = $conn->prepare(str_replace("SELECT *", "SELECT COUNT(*) as total", $query));
    $count_stmt->execute($params);
    $total = (int) $count_stmt->fetch()['total'];

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    return [
        'assets' => $stmt->fetchAll(),
        'total' => $total,
        'page' => $page,
        'pages' => (int) ceil($total / $limit)
    ];
}

/**
 * Get single media asset
 */
function media_get(int $tenant_id, int $id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Create media asset record
 */
function media_create(int $tenant_id, array $data): int
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
INSERT INTO media_assets
(tenant_id, filename, original_name, mime_type, size, path, alt_text)
VALUES (?, ?, ?, ?, ?, ?, ?)
");

    $stmt->execute([
        $tenant_id,
        $data['filename'],
        $data['original_name'],
        $data['mime_type'],
        $data['size'],
        $data['path'],
        $data['alt_text'] ?? null
    ]);

    return (int) $conn->lastInsertId();
}

/**
 * Delete media asset
 */
function media_delete(int $tenant_id, int $id): bool
{
    $conn = get_db_connection();

    // Get asset to delete file
    $asset = media_get($tenant_id, $id);
    if ($asset && !empty($asset['path'])) {
        $file_path = __DIR__ . '/../../uploads/' . $asset['path'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }
    }

    $stmt = $conn->prepare("DELETE FROM media_assets WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$id, $tenant_id]);
}