<?php
// Legal Documents Management API
// Requires: $conn, $action

require_once __DIR__ . '/tenant_helper.php';

// ========================================
// SETUP / MIGRATION (Lazy Init)
// ========================================
function ensure_legal_table_exists($conn)
{
    $sql = "CREATE TABLE IF NOT EXISTS legal_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `key` VARCHAR(50) NOT NULL,
        title_tr VARCHAR(255) NOT NULL,
        content_tr TEXT,
        title_en VARCHAR(255),
        content_en TEXT,
        title_zh VARCHAR(255),
        content_zh TEXT,
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        effective_date DATE NULL,
        tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_updated_by INT NULL,
        UNIQUE KEY unique_key_tenant (`key`, tenant_id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

    try {
        $conn->exec($sql);
    } catch (PDOException $e) {
        // Table might exist or error, handled in logs if needed
    }
}

// ========================================
// ADMIN ENDPOINTS
// ========================================

// 1. ADMIN: List Legal Documents
if ($action == 'get_legal_docs_admin' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    ensure_legal_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    try {
        $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE tenant_id = ? ORDER BY sort_order ASC, created_at DESC");
        $stmt->execute([$tenant_id]);
        $docs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $docs]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'db_error: ' . $e->getMessage()]);
    }
    exit;
}

// 2. ADMIN: Get Single Document
if ($action == 'get_legal_doc_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $id = $_GET['id'] ?? 0;

    try {
        $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        $doc = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($doc) {
            echo json_encode(['success' => true, 'data' => $doc]);
        } else {
            echo json_encode(['error' => 'not_found']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'db_error']);
    }
    exit;
}

// 3. ADMIN: Create/Update Document (Upsert logic or separate)
// We'll separate for clarity but typically ID determines update.
if (($action == 'save_legal_doc') && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_legal_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = $data['id'] ?? null;
    $key = trim($data['key'] ?? '');
    $title_tr = trim($data['title_tr'] ?? '');
    $content_tr = trim($data['content_tr'] ?? '');

    // Optional fields
    $title_en = $data['title_en'] ?? '';
    $content_en = $data['content_en'] ?? '';
    $title_zh = $data['title_zh'] ?? '';
    $content_zh = $data['content_zh'] ?? '';
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
    $sort_order = (int) ($data['sort_order'] ?? 0);
    $effective_date = !empty($data['effective_date']) ? $data['effective_date'] : null;

    if (empty($key) || empty($title_tr)) {
        echo json_encode(['error' => 'Key and Title TR are required']);
        exit;
    }

    try {
        if ($id) {
            // Update
            $sql = "UPDATE legal_documents SET 
                `key`=?, title_tr=?, content_tr=?, 
                title_en=?, content_en=?, 
                title_zh=?, content_zh=?, 
                is_active=?, sort_order=?, effective_date=?, 
                last_updated_by=? 
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
                $user_id,
                $id,
                $tenant_id
            ]);
            echo json_encode(['success' => true, 'message' => 'Updated']);
        } else {
            // Create
            // Check if key exists for this tenant
            $check = $conn->prepare("SELECT id FROM legal_documents WHERE `key` = ? AND tenant_id = ?");
            $check->execute([$key, $tenant_id]);
            if ($check->fetch()) {
                echo json_encode(['error' => 'Bu Key (anahtar) zaten kullanılıyor.']);
                exit;
            }

            $sql = "INSERT INTO legal_documents (
                `key`, title_tr, content_tr, 
                title_en, content_en, 
                title_zh, content_zh, 
                is_active, sort_order, effective_date, 
                last_updated_by, tenant_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
                $user_id,
                $tenant_id
            ]);
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Save failed: ' . $e->getMessage()]);
    }
    exit;
}

// 4. ADMIN: Delete
if ($action == 'delete_legal_doc' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM legal_documents WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Delete failed']);
    }
    exit;
}

// ========================================
// PUBLIC ENDPOINTS
// ========================================

// 5. PUBLIC: Get Document by Key
if ($action == 'get_legal_doc_public' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    ensure_legal_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $key = $_GET['key'] ?? '';

    if (empty($key)) {
        echo json_encode(['error' => 'Key required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM legal_documents WHERE `key` = ? AND is_active = 1 AND tenant_id = ?");
        $stmt->execute([$key, $tenant_id]);
        $doc = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($doc) {
            echo json_encode(['success' => true, 'data' => $doc]);
        } else {
            echo json_encode(['error' => 'not_found', 'key' => $key]);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'db_error']);
    }
    exit;
}
