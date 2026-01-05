<?php
/**
 * Blog Public Controller
 * 
 * Handles public API requests for blog viewing.
 * Routes: get_blog_posts, get_blog_post
 */



/**
 * Handle public blog actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_blog_public(string $action): bool
{
    global $conn;
    $conn = get_db_connection();
    switch ($action) {
        case 'get_blog_posts':
            return blog_public_list();
        case 'get_blog_post':
            return blog_public_get();
        default:
            return false;
    }
}

function blog_public_list(): bool
{
    $tenant_id = get_current_tenant_code();

    $posts = blog_get_published_posts($tenant_id);

    echo json_encode([
        'success' => true,
        'data' => $posts
    ]);
    return true;
}

function blog_public_get(): bool
{
    $tenant_id = get_current_tenant_code();
    $slug = $_GET['slug'] ?? '';

    if (empty($slug)) {
        echo json_encode(['error' => 'Slug required']);
        return true;
    }

    $post = blog_get_post_by_slug($tenant_id, $slug);

    if ($post) {
        echo json_encode(['success' => true, 'data' => $post]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
    }
    return true;
}
