<?php
/**
 * Podcast Service
 * 
 * Business logic for Podcast management.
 * All functions must accept an explicit tenant_id.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * List Podcasts
 * 
 * @param string $tenant_id
 * @param array $options [status, language, search, page, limit]
 * @return array ['items' => [], 'pagination' => []]
 */
function podcast_list(string $tenant_id, array $options = []): array
{
    $conn = get_db_connection();

    $status = $options['status'] ?? 'all';
    $language = $options['language'] ?? 'all';
    $search = $options['search'] ?? '';

    $page = max(1, (int) ($options['page'] ?? 1));
    $limit = min(100, max(1, (int) ($options['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    // Build Query
    $where = ["tenant_id = ?"];
    $params = [$tenant_id];

    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }

    if ($language !== 'all') {
        $where[] = "language = ?";
        $params[] = $language;
    }

    if (!empty($search)) {
        $where[] = "(title LIKE ? OR short_description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $whereClause = implode(" AND ", $where);

    // Count Total
    $countQuery = "SELECT COUNT(*) as total FROM podcasts WHERE $whereClause";
    $stmt = $conn->prepare($countQuery);
    $stmt->execute($params);
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get Items
    $query = "SELECT * FROM podcasts WHERE $whereClause ORDER BY publish_date DESC, id DESC LIMIT $limit OFFSET $offset";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON fields
    foreach ($items as &$item) {
        $item['external_links'] = json_decode($item['external_links'], true);
        $item['tags'] = json_decode($item['tags'], true);
        $item['extra_images'] = json_decode($item['extra_images'], true);
        $item['extra_videos'] = json_decode($item['extra_videos'], true);
    }

    return [
        'items' => $items,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ];
}

/**
 * Get single Podcast by ID (Admin)
 */
function podcast_get(string $tenant_id, int $id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM podcasts WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        $item['external_links'] = json_decode($item['external_links'], true);
        $item['tags'] = json_decode($item['tags'], true);
        $item['extra_images'] = json_decode($item['extra_images'], true);
        $item['extra_videos'] = json_decode($item['extra_videos'], true);
    }

    return $item ?: null;
}

/**
 * Get single Podcast by Slug (Public)
 */
function podcast_get_by_slug(string $tenant_id, string $slug): ?array
{
    $conn = get_db_connection();
    // Only published and date <= now
    $stmt = $conn->prepare("
        SELECT * FROM podcasts 
        WHERE slug = ? AND tenant_id = ? 
        AND status = 'published' 
        AND (publish_date IS NULL OR publish_date <= NOW())
    ");
    $stmt->execute([$slug, $tenant_id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        $item['external_links'] = json_decode($item['external_links'], true);
        $item['tags'] = json_decode($item['tags'], true);
        $item['extra_images'] = json_decode($item['extra_images'], true);
        $item['extra_videos'] = json_decode($item['extra_videos'], true);
    }

    return $item ?: null;
}

/**
 * Create Podcast
 */
function podcast_create(string $tenant_id, array $data, int $user_id): int
{
    $conn = get_db_connection();

    $title = $data['title'] ?? '';
    // Generate slug from title if missing
    $slug = $data['slug'] ?? slugify($title);
    // Ensure slug uniqueness
    $slug = ensure_unique_slug($conn, $tenant_id, $slug);

    $stmt = $conn->prepare("
        INSERT INTO podcasts 
        (tenant_id, slug, title, short_description, full_description, audio_url, preview_clip_url, external_links, 
         duration_seconds, publish_date, status, cover_image_url, tags, language, 
         extra_images, extra_videos, created_by, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $tenant_id,
        $slug,
        $title,
        $data['short_description'] ?? null,
        $data['full_description'] ?? null,
        $data['audio_url'] ?? null,
        $data['preview_clip_url'] ?? null,
        json_encode($data['external_links'] ?? []),
        (int) ($data['duration_seconds'] ?? 0),
        $data['publish_date'] ?? date('Y-m-d H:i:s'),
        $data['status'] ?? 'draft',
        $data['cover_image_url'] ?? null,
        json_encode($data['tags'] ?? []),
        $data['language'] ?? 'tr',
        json_encode($data['extra_images'] ?? []),
        json_encode($data['extra_videos'] ?? []),
        $user_id,
        $user_id
    ]);

    return (int) $conn->lastInsertId();
}

/**
 * Update Podcast
 */
function podcast_update(string $tenant_id, int $id, array $data, int $user_id): bool
{
    $conn = get_db_connection();

    // Check existence
    $existing = podcast_get($tenant_id, $id);
    if (!$existing)
        return false;

    // Build update fields dynamically or static
    $fields = [];
    $params = [];

    // Allow updating slug? Yes.
    if (!empty($data['title'])) {
        $fields[] = "title=?";
        $params[] = $data['title'];
    }
    if (!empty($data['slug']) && $data['slug'] !== $existing['slug']) {
        $slug = ensure_unique_slug($conn, $tenant_id, $data['slug'], $id);
        $fields[] = "slug=?";
        $params[] = $slug;
    }

    // Map other fields
    $map = [
        'short_description',
        'full_description',
        'audio_url',
        'duration_seconds',
        'publish_date',
        'status',
        'cover_image_url',
        'language',
        'preview_clip_url'
    ];
    foreach ($map as $k) {
        if (array_key_exists($k, $data)) {
            $fields[] = "$k=?";
            $params[] = $data[$k];
        }
    }

    // JSON fields
    $jsonMap = ['external_links', 'tags', 'extra_images', 'extra_videos'];
    foreach ($jsonMap as $k) {
        if (array_key_exists($k, $data)) {
            $fields[] = "$k=?";
            $params[] = json_encode($data[$k]);
        }
    }

    $fields[] = "updated_by=?";
    $params[] = $user_id;

    if (empty($fields))
        return true;

    $params[] = $id;
    $params[] = $tenant_id;

    $sql = "UPDATE podcasts SET " . implode(", ", $fields) . " WHERE id=? AND tenant_id=?";
    $stmt = $conn->prepare($sql);
    return $stmt->execute($params);
}

/**
 * Delete (Soft delete via archiving preferred, but user prompt allows hard delete/archive options)
 * We will implement hard delete for now as per "Delete" verb availability
 */
function podcast_delete(string $tenant_id, int $id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM podcasts WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$id, $tenant_id]);
}

// Helpers

function slugify($text)
{
    // Simple slugify, potentially replace with centralized helper if available
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return $text ?: 'n-a';
}

function ensure_unique_slug($conn, $tenant_id, $slug, $ignore_id = 0)
{
    $original = $slug;
    $count = 1;
    while (true) {
        $stmt = $conn->prepare("SELECT id FROM podcasts WHERE tenant_id = ? AND slug = ? AND id != ?");
        $stmt->execute([$tenant_id, $slug, $ignore_id]);
        if ($stmt->fetch()) {
            $slug = $original . '-' . $count;
            $count++;
        } else {
            return $slug;
        }
    }
}
