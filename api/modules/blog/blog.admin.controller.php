<?php
/**
 * Blog Admin Controller
 * 
 * Handles admin API requests for blog management.
 * Routes: get_blog_posts_admin, get_blog_post_detail, create_blog_post, update_blog_post, delete_blog_post
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/blog.service.php';

/**
 * Handle admin blog actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_blog_admin(string $action): bool
{
    switch ($action) {
        case 'get_blog_posts_admin':
            return blog_admin_list();
        case 'get_blog_post_detail':
            return blog_admin_get();
        case 'create_blog_post':
            return blog_admin_create();
        case 'update_blog_post':
            return blog_admin_update();
        case 'delete_blog_post':
            return blog_admin_delete();
        default:
            return false;
    }
}

function blog_admin_list(): bool
{
    $ctx = require_admin_context();

    $result = blog_list_posts($ctx['tenant_id'], [
        'status' => $_GET['status'] ?? 'all',
        'search' => $_GET['search'] ?? '',
        'page' => $_GET['page'] ?? 1,
        'limit' => $_GET['limit'] ?? 20
    ]);

    echo json_encode([
        'success' => true,
        'data' => $result['posts'],
        'pagination' => [
            'total' => $result['total'],
            'page' => $result['page'],
            'pages' => $result['pages']
        ]
    ]);
    return true;
}

function blog_admin_get(): bool
{
    $ctx = require_admin_context();
    $id = (int) ($_GET['id'] ?? 0);

    $post = blog_get_post($ctx['tenant_id'], $id);

    if ($post) {
        echo json_encode(['success' => true, 'data' => $post]);
    } else {
        echo json_encode(['error' => 'Post not found']);
    }
    return true;
}

function blog_admin_create(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    if (empty($data['slug']) || empty($data['title_tr'])) {
        echo json_encode(['error' => 'Slug and Turkish title are required']);
        return true;
    }

    $id = blog_create_post($ctx['tenant_id'], $data);
    echo json_encode(['success' => true, 'id' => $id]);
    return true;
}

function blog_admin_update(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (empty($id)) {
        echo json_encode(['error' => 'ID required for update']);
        return true;
    }

    blog_update_post($ctx['tenant_id'], $id, $data);
    echo json_encode(['success' => true]);
    return true;
}

function blog_admin_delete(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    blog_delete_post($ctx['tenant_id'], $id);
    echo json_encode(['success' => true]);
    return true;
}
