<?php
/**
 * Contact Service
 * 
 * Business logic for contact config and messages.
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Get contact config for tenant
 */
function contact_get_config($tenant_id): ?array
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT * FROM contact_configs WHERE tenant_id = ?");
    $stmt->execute([(string) $tenant_id]);
    return $stmt->fetch() ?: null;
}

/**
 * Save contact config
 */
function contact_save_config($tenant_id, array $data): bool
{
    $conn = get_db_connection();

    $existing = contact_get_config($tenant_id);

    if ($existing) {
        $stmt = $conn->prepare("
            UPDATE contact_configs SET 
                page_title=?, page_subtitle=?,
                phone=?, email=?, address=?,
                map_embed_url=?, working_hours=?,
                form_title=?, form_subtitle=?,
                social_links_json=?
            WHERE tenant_id=?
        ");
        return $stmt->execute([
            $data['page_title'] ?? 'Contact Us',
            $data['page_subtitle'] ?? '',
            $data['phone'] ?? '',
            $data['email'] ?? '',
            $data['address'] ?? '',
            $data['map_embed_url'] ?? '',
            $data['working_hours'] ?? '',
            $data['form_title'] ?? 'Send a Message',
            $data['form_subtitle'] ?? '',
            json_encode($data['social_links'] ?? []),
            (string) $tenant_id
        ]);
    } else {
        $stmt = $conn->prepare("
            INSERT INTO contact_configs 
            (tenant_id, page_title, page_subtitle, phone, email, address, 
             map_embed_url, working_hours, form_title, form_subtitle, social_links_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            (string) $tenant_id,
            $data['page_title'] ?? 'Contact Us',
            $data['page_subtitle'] ?? '',
            $data['phone'] ?? '',
            $data['email'] ?? '',
            $data['address'] ?? '',
            $data['map_embed_url'] ?? '',
            $data['working_hours'] ?? '',
            $data['form_title'] ?? 'Send a Message',
            $data['form_subtitle'] ?? '',
            json_encode($data['social_links'] ?? [])
        ]);
    }
}

/**
 * List contact messages for tenant
 */
function contact_list_messages($tenant_id, array $options = []): array
{
    $conn = get_db_connection();

    $status = $options['status'] ?? 'all';
    $page = max(1, (int) ($options['page'] ?? 1));
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM contact_messages WHERE tenant_id = ?";
    $params = [(string) $tenant_id];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Create contact message
 */
function contact_create_message($tenant_id, array $data): int
{
    $conn = get_db_connection();

    $stmt = $conn->prepare("
        INSERT INTO contact_messages 
        (tenant_id, name, email, phone, subject, message, status) 
        VALUES (?, ?, ?, ?, ?, ?, 'new')
    ");

    $stmt->execute([
        (string) $tenant_id,
        $data['name'] ?? '',
        $data['email'] ?? '',
        $data['phone'] ?? null,
        $data['subject'] ?? '',
        $data['message'] ?? ''
    ]);

    return (int) $conn->lastInsertId();
}

/**
 * Update message status
 */
function contact_update_message_status($tenant_id, int $id, string $status): bool
{
    $conn = get_db_connection();
    $stmt = $conn->prepare("UPDATE contact_messages SET status = ? WHERE id = ? AND tenant_id = ?");
    return $stmt->execute([$status, $id, (string) $tenant_id]);
}
