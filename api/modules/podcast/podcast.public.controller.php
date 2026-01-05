<?php
/**
 * Module: Podcast Public Controller
 * Endpoint: ?action=get_podcasts_public, ?action=get_podcast_detail
 * Tenant: All (Filtered by Tenant ID)
 * Description:
 *   - Public API for fetching podcast episodes.
 *   - Supports filtering by category/tag and detailed view.
 * Related:
 *   - Service: podcast.service.php
 */
/**
 * Podcast Public Controller
 */

require_once __DIR__ . '/../../core/tenant/public_resolver.php';
require_once __DIR__ . '/podcast.service.php';

function handle_podcast_public(string $action): bool
{
    switch ($action) {
        case 'get_podcasts':
            return podcast_public_list();
        case 'get_podcast_detail':
            return podcast_public_detail();
        default:
            return false;
    }
}

function podcast_public_list(): bool
{
    // Use centralized tenant resolution (handles headers + domain)
    $tenant_id = get_current_tenant_code();

    // Safety check? get_current_tenant_id always returns an int (fallback to 1/turp).
    // But if we want to be strict for podcasts:
    // Actually, blog uses it directly. Let's align.

    $result = podcast_list($tenant_id, [
        'status' => 'published',
        'language' => $_GET['language'] ?? 'tr', // Default to TR or detect
        'page' => $_GET['page'] ?? 1,
        'limit' => $_GET['pageSize'] ?? 12
    ]);

    // Filter out future dates here or in SQL (handled in Service for consistency?)
    // Service returns all by default if status=published, need to enforce date check better
    // Service handles basic filtering, let's refine items here if needed or trust Service logic
    // Actually, Service logic for 'list' does not strictly enforce date <= NOW(). 
    // Let's filter in PHP for simplicity or assume front-end handles it? 
    // Better: Update Service to handle 'public_mode' or filter here. 
    // The prompt explicitly asked for "publish_date <= now()". 
    // I will filter the array here since it's cleaner than modifying the generic list function excessively.

    $now = new DateTime();
    $filteredItems = array_values(array_filter($result['items'], function ($item) use ($now) {
        if (empty($item['publish_date']))
            return true; // Assume immediate if null? Or draft? Schema says published.
        return new DateTime($item['publish_date']) <= $now;
    }));

    echo json_encode(['success' => true, 'data' => $filteredItems, 'pagination' => $result['pagination']]);
    return true;
}

function podcast_public_detail(): bool
{
    $tenant_code = get_current_tenant_code();
    if (!$tenant_code) {
        http_response_code(404);
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    $slug = $_GET['slug'] ?? '';
    if (empty($slug)) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug required']);
        return true;
    }

    $item = podcast_get_by_slug($tenant_code, $slug);

    if ($item) {
        echo json_encode(['success' => true, 'data' => $item]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Podcast not found']);
    }
    return true;
}
