<?php
/**
 * Landing Admin Controller
 */

function handle_landing_admin($action)
{
    global $conn;
    if (!isset($conn))
        $conn = get_db_connection();

    require_admin_context();
    $tenant_id = get_current_tenant_code(); // Some modules use code

    switch ($action) {
        case 'get_landing_configs':
            return landing_admin_list($conn, $tenant_id);
        case 'get_landing_config':
            return landing_admin_get($conn, $tenant_id);
        case 'save_landing_config':
            return landing_admin_save($conn, $tenant_id);
        case 'delete_landing_config':
            return landing_admin_delete($conn, $tenant_id);
        default:
            return false;
    }
}

function landing_admin_list($conn, $tenant_id)
{
    try {
        $stmt = $conn->prepare("SELECT id, config_key, description, is_active, updated_at FROM landing_configs WHERE tenant_id = ?");
        $stmt->execute([$tenant_id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function landing_admin_get($conn, $tenant_id)
{
    $id = $_GET['id'] ?? 0;
    try {
        $stmt = $conn->prepare("SELECT * FROM landing_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetch(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function landing_admin_save($conn, $tenant_id)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    unset($data['id']);
    $data['tenant_id'] = $tenant_id;

    try {
        if ($id > 0) {
            $stmt = $conn->prepare("UPDATE landing_configs SET config_key=?, config_value=?, description=?, is_active=? WHERE id=? AND tenant_id=?");
            $stmt->execute([$data['config_key'], $data['config_value'], $data['description'], $data['is_active'], $id, $tenant_id]);
        } else {
            $stmt = $conn->prepare("INSERT INTO landing_configs (tenant_id, config_key, config_value, description, is_active) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$tenant_id, $data['config_key'], $data['config_value'], $data['description'], $data['is_active']]);
        }
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function landing_admin_delete($conn, $tenant_id)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;
    try {
        $stmt = $conn->prepare("DELETE FROM landing_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}
