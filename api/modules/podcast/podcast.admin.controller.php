<?php
/**
 * Podcast Admin Controller
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/podcast.service.php';

function handle_podcast_admin(string $action): bool
{
    switch ($action) {
        case 'get_podcasts':
            return podcast_admin_list();
        case 'get_podcast':
            return podcast_admin_get();
        case 'create_podcast':
            return podcast_admin_create();
        case 'update_podcast':
            return podcast_admin_update();
        case 'delete_podcast':
            return podcast_admin_delete();
        default:
            return false;
    }
}

function podcast_admin_list(): bool
{
    $ctx = require_admin_context();
    $result = podcast_list($ctx['tenant_id'], [
        'status' => $_GET['status'] ?? 'all',
        'language' => $_GET['language'] ?? 'all',
        'search' => $_GET['search'] ?? '',
        'page' => $_GET['page'] ?? 1,
        'limit' => $_GET['pageSize'] ?? 20
    ]);

    echo json_encode(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
    return true;
}

function podcast_admin_get(): bool
{
    $ctx = require_admin_context();
    $id = (int) ($_GET['id'] ?? 0);
    $item = podcast_get($ctx['tenant_id'], $id);

    if ($item) {
        echo json_encode(['success' => true, 'data' => $item]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Podcast bulunamadı']);
    }
    return true;
}

function podcast_admin_create(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    if (empty($data['title'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Başlık zorunludur']);
        return true;
    }

    $id = podcast_create($ctx['tenant_id'], $data, $ctx['user_id']);
    echo json_encode(['success' => true, 'id' => $id, 'message' => 'Podcast oluşturuldu']);
    return true;
}

function podcast_admin_update(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID zorunludur']);
        return true;
    }

    $success = podcast_update($ctx['tenant_id'], $id, $data, $ctx['user_id']);
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Podcast güncellendi']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Podcast bulunamadı veya güncelleme başarısız']);
    }
    return true;
}

function podcast_admin_delete(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID zorunludur']);
        return true;
    }

    $success = podcast_delete($ctx['tenant_id'], $id);
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Podcast silindi']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Podcast bulunamadı']);
    }
    return true;
}
