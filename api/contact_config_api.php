<?php
// Contact Config Management API
// Requires: $conn, $action

require_once __DIR__ . '/tenant_helper.php';

// ========================================
// TABLE SETUP (Lazy Init)
// ========================================
function ensure_contact_config_table_exists($conn)
{
    $sql = "CREATE TABLE IF NOT EXISTS contact_configs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id VARCHAR(50) NOT NULL,
        language ENUM('tr', 'en', 'zh') NOT NULL DEFAULT 'tr',
        contact_title VARCHAR(255),
        contact_subtitle TEXT,
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        country VARCHAR(100),
        phone VARCHAR(50),
        email VARCHAR(255),
        map_embed_url TEXT,
        working_hours VARCHAR(255),
        form_enabled TINYINT(1) DEFAULT 1,
        notification_email VARCHAR(255),
        success_message TEXT,
        error_message TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT NULL,
        INDEX idx_tenant_lang (tenant_id, language)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

    try {
        $conn->exec($sql);
    } catch (PDOException $e) {
        // Table might exist
    }
}

// ========================================
// ADMIN ENDPOINTS
// ========================================

// 1. ADMIN: List Contact Configs
if ($action == 'get_contact_configs_admin' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    ensure_contact_config_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $language = $_GET['language'] ?? 'all';

    $query = "SELECT * FROM contact_configs WHERE tenant_id = ?";
    $params = [$tenant_id];

    if ($language !== 'all') {
        $query .= " AND language = ?";
        $params[] = $language;
    }

    $query .= " ORDER BY language ASC, updated_at DESC";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $configs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $configs]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// 2. ADMIN: Get Single Config
if ($action == 'get_contact_config_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $id = $_GET['id'] ?? 0;

    try {
        $stmt = $conn->prepare("SELECT * FROM contact_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        $config = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($config) {
            echo json_encode(['success' => true, 'data' => $config]);
        } else {
            echo json_encode(['error' => 'not_found']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error']);
    }
    exit;
}

// 3. ADMIN: Save Config (Create/Update)
if ($action == 'save_contact_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_contact_config_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = $data['id'] ?? null;
    $language = $data['language'] ?? 'tr';
    $contact_title = trim($data['contact_title'] ?? '');
    $contact_subtitle = trim($data['contact_subtitle'] ?? '');
    $address_line1 = trim($data['address_line1'] ?? '');
    $address_line2 = trim($data['address_line2'] ?? '');
    $city = trim($data['city'] ?? '');
    $country = trim($data['country'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $email = trim($data['email'] ?? '');
    $map_embed_url = trim($data['map_embed_url'] ?? '');
    $working_hours = trim($data['working_hours'] ?? '');
    $form_enabled = isset($data['form_enabled']) ? ($data['form_enabled'] ? 1 : 0) : 1;
    $notification_email = trim($data['notification_email'] ?? '');
    $success_message = trim($data['success_message'] ?? '');
    $error_message = trim($data['error_message'] ?? '');
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

    if (empty($contact_title)) {
        echo json_encode(['error' => 'Contact title is required']);
        exit;
    }

    try {
        // If activating, deactivate other configs for same tenant+language
        if ($is_active) {
            $deactivate_sql = "UPDATE contact_configs SET is_active = 0 WHERE tenant_id = ? AND language = ?";
            if ($id) {
                $deactivate_sql .= " AND id != ?";
                $stmt = $conn->prepare($deactivate_sql);
                $stmt->execute([$tenant_id, $language, $id]);
            } else {
                $stmt = $conn->prepare($deactivate_sql);
                $stmt->execute([$tenant_id, $language]);
            }
        }

        if ($id) {
            // Update
            $sql = "UPDATE contact_configs SET 
                language=?, contact_title=?, contact_subtitle=?,
                address_line1=?, address_line2=?, city=?, country=?,
                phone=?, email=?, map_embed_url=?, working_hours=?,
                form_enabled=?, notification_email=?, success_message=?, error_message=?,
                is_active=?, updated_by=?
                WHERE id=? AND tenant_id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $language,
                $contact_title,
                $contact_subtitle,
                $address_line1,
                $address_line2,
                $city,
                $country,
                $phone,
                $email,
                $map_embed_url,
                $working_hours,
                $form_enabled,
                $notification_email,
                $success_message,
                $error_message,
                $is_active,
                $user_id,
                $id,
                $tenant_id
            ]);
            echo json_encode(['success' => true, 'message' => 'Updated']);
        } else {
            // Create
            $sql = "INSERT INTO contact_configs (
                tenant_id, language, contact_title, contact_subtitle,
                address_line1, address_line2, city, country,
                phone, email, map_embed_url, working_hours,
                form_enabled, notification_email, success_message, error_message,
                is_active, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $tenant_id,
                $language,
                $contact_title,
                $contact_subtitle,
                $address_line1,
                $address_line2,
                $city,
                $country,
                $phone,
                $email,
                $map_embed_url,
                $working_hours,
                $form_enabled,
                $notification_email,
                $success_message,
                $error_message,
                $is_active,
                $user_id
            ]);
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Save failed: ' . $e->getMessage()]);
    }
    exit;
}

// 4. ADMIN: Delete Config
if ($action == 'delete_contact_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM contact_configs WHERE id = ? AND tenant_id = ?");
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

// 5. PUBLIC: Get Active Contact Config
if ($action == 'get_contact_config_public' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    ensure_contact_config_table_exists($conn);
    $tenant_id = get_current_tenant($conn);
    $language = $_GET['language'] ?? 'tr';

    try {
        // Try to get active config for requested language
        $stmt = $conn->prepare("SELECT * FROM contact_configs WHERE tenant_id = ? AND language = ? AND is_active = 1 LIMIT 1");
        $stmt->execute([$tenant_id, $language]);
        $config = $stmt->fetch(PDO::FETCH_ASSOC);

        // Fallback to TR if not found
        if (!$config && $language !== 'tr') {
            $stmt = $conn->prepare("SELECT * FROM contact_configs WHERE tenant_id = ? AND language = 'tr' AND is_active = 1 LIMIT 1");
            $stmt->execute([$tenant_id]);
            $config = $stmt->fetch(PDO::FETCH_ASSOC);
        }

        if ($config) {
            echo json_encode(['success' => true, 'data' => $config]);
        } else {
            echo json_encode(['success' => true, 'data' => null]);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error']);
    }
    exit;
}
