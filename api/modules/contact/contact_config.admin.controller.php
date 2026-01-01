<?php
/**
 * Contact Config Admin Controller
 */

function handle_contact_config_admin($action)
{
    global $conn;
    if (!isset($conn))
        $conn = get_db_connection();

    require_admin_context();
    $tenant_id = get_current_tenant_code();

    switch ($action) {
        case 'get_contact_configs':
            return contact_config_admin_list($conn, $tenant_id);
        case 'get_contact_config':
            return contact_config_admin_get($conn, $tenant_id);
        case 'save_contact_config':
            return contact_config_admin_save($conn, $tenant_id);
        case 'delete_contact_config':
            return contact_config_admin_delete($conn, $tenant_id);
        default:
            return false;
    }
}

function contact_config_admin_list($conn, $tenant_id)
{
    try {
        $stmt = $conn->prepare("SELECT id, config_name, is_active FROM contact_configs WHERE tenant_id = ?");
        $stmt->execute([$tenant_id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function contact_config_admin_get($conn, $tenant_id)
{
    $id = $_GET['id'] ?? 0;
    try {
        $stmt = $conn->prepare("SELECT * FROM contact_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetch(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function contact_config_admin_save($conn, $tenant_id)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $json_data = json_encode($data);
        if ($id > 0) {
            $stmt = $conn->prepare("UPDATE contact_configs SET config_name=?, config_data=?, is_active=? WHERE id=? AND tenant_id=?");
            $stmt->execute([$data['config_name'], $json_data, $data['is_active'], $id, $tenant_id]);
        } else {
            $stmt = $conn->prepare("INSERT INTO contact_configs (tenant_id, config_name, config_data, is_active) VALUES (?, ?, ?, ?)");
            $stmt->execute([$tenant_id, $data['config_name'], $json_data, $data['is_active']]);
        }
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function contact_config_admin_delete($conn, $tenant_id)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;
    try {
        $stmt = $conn->prepare("DELETE FROM contact_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}
