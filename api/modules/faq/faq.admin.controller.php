<?php
/**
 * FAQ Admin Controller
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/faq.service.php';

function handle_faq_admin(string $action): bool
{
    switch ($action) {
        case 'get_faqs_admin':
            return faq_admin_list();
        case 'get_faq_detail':
            return faq_admin_get();
        case 'create_faq':
            return faq_admin_create();
        case 'update_faq':
            return faq_admin_update();
        case 'delete_faq':
            return faq_admin_delete();
        default:
            return false;
    }
}

function faq_admin_list(): bool
{
    $ctx = require_admin_context();
    $faqs = faq_list($ctx['tenant_id'], [
        'status' => $_GET['status'] ?? 'all',
        'page' => $_GET['page'] ?? 1
    ]);
    echo json_encode(['success' => true, 'data' => $faqs]);
    return true;
}

function faq_admin_get(): bool
{
    $ctx = require_admin_context();
    $faq = faq_get($ctx['tenant_id'], (int) ($_GET['id'] ?? 0));
    if ($faq) {
        echo json_encode(['success' => true, 'data' => $faq]);
    } else {
        echo json_encode(['error' => 'FAQ not found']);
    }
    return true;
}

function faq_admin_create(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = faq_create($ctx['tenant_id'], $data);
    echo json_encode(['success' => true, 'id' => $id]);
    return true;
}

function faq_admin_update(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    faq_update($ctx['tenant_id'], (int) ($data['id'] ?? 0), $data);
    echo json_encode(['success' => true]);
    return true;
}

function faq_admin_delete(): bool
{
    $ctx = require_admin_context();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    faq_delete($ctx['tenant_id'], (int) ($data['id'] ?? 0));
    echo json_encode(['success' => true]);
    return true;
}
