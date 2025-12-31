<?php
/**
 * Blog Service
 * 
 * Business logic for blog posts.
 * All functions take explicit tenant_id parameter.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * List blog posts for a tenant
 * 
 * @param int $tenant_id
 * @param array $options [status, search, page, limit]
 * @return array ['posts' => array, 'total' => int, 'pages' => int]
 */
function blog_list_posts(int $tenant_id, array $options = []): array
{
    $conn = get_db_connection();

    $status = $options['status'] ?? 'all';
    $search = $options['search'] ?? '';
    $page = max(1, (int) ($options['page'] ?? 1));
    $limit = min(100, max(1, (int) ($options['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    // Build query
    $query = "SELECT id, slug, title_tr, title_en, title_zh, featured_image as image_url, status, created_at 
              FROM blog_posts WHERE tenant_id = ?";
    $params = [(string) $tenant_id];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($search)) {
        $query .= " AND (title_tr LIKE ? OR title_en LIKE ? OR title_zh LIKE ?)";
        $search_param = "%$search%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
    }

    // Count total
    $count_query = str_replace("SELECT id, slug, title_tr, title_en, title_zh, featured_image, status, created_at", "SELECT COUNT(*) as total", $query);
    $stmt = $conn->prepare($count_query);
    $stmt->execute($params);
    $total = (int) $stmt->fetch()['total'];

    // Get posts
    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $posts = $stmt->fetchAll();

    return [
        'posts' => $posts,
        'total' => $total,
        'pages' => (int) ceil($total / $limit),
        'page' => $page
    ];
}

/**
 * Get single blog post by ID
 * 
 * @param int $tenant_id
 * @param int $post_id
 * @return array|null Post data or null
 */
function blog_get_post(int $tenant_id, int $post_id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT id, slug, 
            title_tr, excerpt_tr, content_tr,
            title_en, excerpt_en, content_en,
            title_zh, excerpt_zh, content_zh,
            featured_image as image_url, status, published_at, created_at 
        FROM blog_posts 
        WHERE id = ? AND tenant_id = ?
    ");
    $stmt->execute([$post_id, (string) $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Get blog post by slug (public)
 * 
 * @param int $tenant_id
 * @param string $slug
 * @return array|null Post data or null
 */
function blog_get_post_by_slug(int $tenant_id, string $slug): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT id, slug, 
            title_tr, excerpt_tr, content_tr,
            title_en, excerpt_en, content_en,
            title_zh, excerpt_zh, content_zh,
            featured_image as image_url, status, published_at as created_at 
        FROM blog_posts 
        WHERE slug = ? AND tenant_id = ? AND status = 'published'
    ");
    $stmt->execute([$slug, (string) $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Create blog post
 * 
 * @param int $tenant_id
 * @param array $data Post data
 * @return int New post ID
 */
function blog_create_post(int $tenant_id, array $data): int
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        INSERT INTO blog_posts 
        (slug, title_tr, excerpt_tr, content_tr, title_en, excerpt_en, content_en, 
         title_zh, excerpt_zh, content_zh, status, published_at, featured_image, tenant_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['slug'],
        $data['title_tr'] ?? '',
        $data['excerpt_tr'] ?? '',
        $data['content_tr'] ?? '',
        $data['title_en'] ?? null,
        $data['excerpt_en'] ?? null,
        $data['content_en'] ?? null,
        $data['title_zh'] ?? null,
        $data['excerpt_zh'] ?? null,
        $data['content_zh'] ?? null,
        $data['status'] ?? 'draft',
        $data['published_at'] ?? null,
        $data['image_url'] ?? $data['featured_image'] ?? null,
        (string) $tenant_id
    ]);

    return (int) $conn->lastInsertId();
}

/**
 * Update blog post
 * 
 * @param int $tenant_id
 * @param int $post_id
 * @param array $data Post data
 * @return bool Success
 */
function blog_update_post(int $tenant_id, int $post_id, array $data): bool
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        UPDATE blog_posts SET 
            slug=?, title_tr=?, excerpt_tr=?, content_tr=?, 
            title_en=?, excerpt_en=?, content_en=?,
            title_zh=?, excerpt_zh=?, content_zh=?,
            status=?, published_at=?, featured_image=? 
        WHERE id=? AND tenant_id=?
    ");

    return $stmt->execute([
        $data['slug'],
        $data['title_tr'] ?? '',
        $data['excerpt_tr'] ?? '',
        $data['content_tr'] ?? '',
        $data['title_en'] ?? null,
        $data['excerpt_en'] ?? null,
        $data['content_en'] ?? null,
        $data['title_zh'] ?? null,
        $data['excerpt_zh'] ?? null,
        $data['content_zh'] ?? null,
        $data['status'] ?? 'draft',
        $data['published_at'] ?? null,
        $data['image_url'] ?? $data['featured_image'] ?? null,
        $post_id,
        (string) $tenant_id
    ]);
}

/**
 * Delete blog post
 * 
 * @param int $tenant_id
 * @param int $post_id
 * @return bool Success
 */
function blog_delete_post(int $tenant_id, int $post_id): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$post_id, (string) $tenant_id]);
}

/**
 * List published posts (public)
 * 
 * @param int $tenant_id
 * @return array Posts
 */
function blog_get_published_posts(int $tenant_id): array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("
        SELECT id, slug, 
            title_tr, excerpt_tr, content_tr,
            title_en, excerpt_en, content_en,
            title_zh, excerpt_zh, content_zh,
            featured_image as image_url, published_at as created_at 
        FROM blog_posts 
        WHERE tenant_id = ? AND status = 'published'
        ORDER BY published_at DESC
    ");
    $stmt->execute([(string) $tenant_id]);
    return $stmt->fetchAll();
}
