<?php
/**
 * FAQ Public Controller
 */

require_once __DIR__ . '/../../core/tenant/admin_resolver.php';
require_once __DIR__ . '/faq.service.php';

function handle_faq_public(string $action): bool
{
    switch ($action) {
        case 'get_faqs_public':
        case 'get_faqs_showcase':
            return faq_public_list();
        default:
            return false;
    }
}

function faq_public_list(): bool
{
    $tenant_id = get_current_tenant_id();
    $faqs = faq_get_published($tenant_id);
    echo json_encode(['success' => true, 'data' => $faqs]);
    return true;
}
