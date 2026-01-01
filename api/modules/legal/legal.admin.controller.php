<?php
/**
 * Legal Admin Controller
 */

function handle_legal_admin($action)
{
    global $conn;
    if (!isset($conn))
        $conn = get_db_connection();

    require_admin_context();
    $tenant_id = get_current_tenant_code();

    switch ($action) {
        case 'get_legal_docs':
            return legal_admin_list($conn, $tenant_id);
        case 'get_legal_doc':
            return legal_admin_get($conn, $tenant_id);
        case 'save_legal_doc':
            return legal_admin_save($conn, $tenant_id);
        case 'delete_legal_doc':
            return legal_admin_delete($conn, $tenant_id);
        default:
            return false;
    }
}

function legal_admin_list($conn, $tenant_id)
{
    try {
        $stmt = $conn->prepare("SELECT id, doc_key, title_tr, is_active, updated_at FROM legal_documents WHERE tenant_id = ?");
        $stmt->execute([$tenant_id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function legal_admin_get($conn, $tenant_id)
{
    $id = $_GET['id'] ?? 0;
    try {
        $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetch(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function legal_admin_save($conn, $tenant_id)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        if ($id > 0) {
            $stmt = $conn->prepare("UPDATE legal_documents SET doc_key=?, title_tr=?, content_tr=?, is_active=? WHERE id=? AND tenant_id=?");
            $stmt->execute([$data['doc_key'], $data['title_tr'], $data['content_tr'], $data['is_active'], $id, $tenant_id]);
        } else {
            $stmt = $conn->prepare("INSERT INTO legal_documents (tenant_id, doc_key, title_tr, content_tr, is_active) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$tenant_id, $data['doc_key'], $data['title_tr'], $data['content_tr'], $data['is_active']]);
        }
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}

function legal_admin_delete($conn, $tenant_id)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;
    try {
        $stmt = $conn->prepare("DELETE FROM legal_documents WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    return true;
}
