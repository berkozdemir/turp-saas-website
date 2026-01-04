<?php
/**
 * Legal Admin Controller
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';

function handle_legal_admin($action)
{
    // First check if this is our action - don't auth for unrelated actions!
    $supported_actions = [
        'get_legal_docs',
        'get_legal_docs_admin',
        'get_legal_doc',
        'get_legal_doc_admin',
        'save_legal_doc',
        'save_legal_doc_admin',
        'delete_legal_doc',
        'delete_legal_doc_admin'
    ];
    if (!in_array($action, $supported_actions)) {
        return false;
    }

    // Only require auth for OUR actions
    $ctx = require_admin_context();
    $tenant_id = $ctx['tenant_id'];

    // 2. Get Tenant Context (Standardized: INT)
    $tenant_id = (int) $tenant_id;

    $conn = get_db_connection();

    // 3. Route Action
    switch ($action) {
        case 'get_legal_docs':
        case 'get_legal_docs_admin':
            return legal_admin_list($conn, $tenant_id);
        case 'get_legal_doc':
        case 'get_legal_doc_admin':
            return legal_admin_get($conn, $tenant_id);
        case 'save_legal_doc':
        case 'save_legal_doc_admin':
            return legal_admin_save($conn, $tenant_id);
        case 'delete_legal_doc':
        case 'delete_legal_doc_admin':
            return legal_admin_delete($conn, $tenant_id);
        default:
            return false;
    }
}

function legal_admin_list($conn, $tenant_id)
{
    try {
        // Fetch ALL fields so the editor has data to show
        $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE tenant_id = ? ORDER BY type, version DESC");
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

    // Prepare fields
    $key = $data['key'] ?? '';
    // TR
    $title_tr = $data['title_tr'] ?? '';
    $content_tr = $data['content_tr'] ?? '';
    // EN
    $title_en = $data['title_en'] ?? null;
    $content_en = $data['content_en'] ?? null;
    // ZH
    $title_zh = $data['title_zh'] ?? null;
    $content_zh = $data['content_zh'] ?? null;

    // Meta
    $is_active = isset($data['is_active']) ? (int) $data['is_active'] : 1;
    $sort_order = isset($data['sort_order']) ? (int) $data['sort_order'] : 0;
    $effective_date = $data['effective_date'] ?? null; // YYYY-MM-DD

    try {
        if ($id > 0) {
            $sql = "UPDATE legal_documents SET 
                    `key`=?, 
                    title_tr=?, content_tr=?, 
                    title_en=?, content_en=?, 
                    title_zh=?, content_zh=?, 
                    is_active=?, sort_order=?, effective_date=? 
                    WHERE id=? AND tenant_id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $key,
                $title_tr,
                $content_tr,
                $title_en,
                $content_en,
                $title_zh,
                $content_zh,
                $is_active,
                $sort_order,
                $effective_date,
                $id,
                $tenant_id
            ]);
        } else {
            $sql = "INSERT INTO legal_documents (
                    tenant_id, `key`, 
                    title_tr, content_tr, 
                    title_en, content_en, 
                    title_zh, content_zh, 
                    is_active, sort_order, effective_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $tenant_id,
                $key,
                $title_tr,
                $content_tr,
                $title_en,
                $content_en,
                $title_zh,
                $content_zh,
                $is_active,
                $sort_order,
                $effective_date
            ]);
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
