<?php
/**
 * Contact Admin Controller
 * 
 * Handles contact message management.
 */

function handle_contact_admin($action)
{
    global $conn;
    if (!isset($conn)) {
        $conn = get_db_connection();
    }

    // All admin actions require authentication
    require_admin_context();
    $tenant_id = get_current_tenant_id();

    switch ($action) {
        case 'get_messages':
            return contact_admin_list_messages($conn, $tenant_id);
        case 'update_message_status':
            return contact_admin_update_status($conn, $tenant_id);
        case 'delete_message':
            return contact_admin_delete($conn, $tenant_id);
        default:
            return false;
    }
}

function contact_admin_list_messages($conn, $tenant_id)
{
    $status = $_GET['status'] ?? 'all';
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM contact_messages WHERE tenant_id = ?";
    $params = [$tenant_id];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $count_query = "SELECT COUNT(*) as total FROM contact_messages WHERE tenant_id = ?";
        $count_params = [$tenant_id];
        if ($status !== 'all') {
            $count_query .= " AND status = ?";
            $count_params[] = $status;
        }
        $stmt = $conn->prepare($count_query);
        $stmt->execute($count_params);
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        echo json_encode([
            'success' => true,
            'data' => $messages,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'pages' => ceil($total / $limit)
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'DATABASE_ERROR', 'message' => $e->getMessage()]);
    }
    return true;
}

function contact_admin_update_status($conn, $tenant_id)
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST')
        return false;
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;
    $status = $data['status'] ?? '';

    if (empty($id) || !in_array($status, ['new', 'read', 'archived'])) {
        echo json_encode(['error' => 'INVALID_PARAMS']);
        return true;
    }

    try {
        $stmt = $conn->prepare("UPDATE contact_messages SET status = ? WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$status, $id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'UPDATE_ERROR']);
    }
    return true;
}

function contact_admin_delete($conn, $tenant_id)
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST')
        return false;
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM contact_messages WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'DELETE_ERROR']);
    }
    return true;
}
