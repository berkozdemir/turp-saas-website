<?php
// Landing Config Management API
// Requires: $conn, $action

require_once __DIR__ . '/tenant_helper.php';

// ========================================
// TABLE SETUP (Lazy Init)
// ========================================
function ensure_landing_table_exists($conn)
{
    $sql = "CREATE TABLE IF NOT EXISTS landing_configs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id VARCHAR(50) NOT NULL,
        language ENUM('tr', 'en', 'zh') NOT NULL DEFAULT 'tr',
        hero_title VARCHAR(500) NOT NULL,
        hero_subtitle TEXT,
        hero_badge VARCHAR(200),
        primary_cta_label VARCHAR(100),
        primary_cta_url VARCHAR(500),
        secondary_cta_label VARCHAR(100),
        secondary_cta_url VARCHAR(500),
        hero_image_url VARCHAR(500),
        background_style ENUM('default', 'light', 'dark', 'gradient') DEFAULT 'default',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT NULL,
        INDEX idx_tenant_lang (tenant_id, language),
        INDEX idx_active (tenant_id, language, is_active)
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

// 1. ADMIN: List Landing Configs
if ($action == 'get_landing_configs_admin' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    ensure_landing_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $language = $_GET['language'] ?? 'all';

    $query = "SELECT * FROM landing_configs WHERE tenant_id = ?";
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
if ($action == 'get_landing_config_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $id = $_GET['id'] ?? 0;

    try {
        $stmt = $conn->prepare("SELECT * FROM landing_configs WHERE id = ? AND tenant_id = ?");
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
if ($action == 'save_landing_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_landing_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = $data['id'] ?? null;
    $language = $data['language'] ?? 'tr';
    $hero_title = trim($data['hero_title'] ?? '');
    $hero_subtitle = trim($data['hero_subtitle'] ?? '');
    $hero_badge = trim($data['hero_badge'] ?? '');
    $primary_cta_label = trim($data['primary_cta_label'] ?? '');
    $primary_cta_url = trim($data['primary_cta_url'] ?? '');
    $secondary_cta_label = trim($data['secondary_cta_label'] ?? '');
    $secondary_cta_url = trim($data['secondary_cta_url'] ?? '');
    $hero_image_url = trim($data['hero_image_url'] ?? '');
    $background_style = $data['background_style'] ?? 'default';
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

    if (empty($hero_title)) {
        echo json_encode(['error' => 'Hero title is required']);
        exit;
    }

    try {
        // If activating, deactivate other configs for same tenant+language
        if ($is_active) {
            $deactivate_sql = "UPDATE landing_configs SET is_active = 0 WHERE tenant_id = ? AND language = ?";
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
            $sql = "UPDATE landing_configs SET 
                language=?, hero_title=?, hero_subtitle=?, hero_badge=?,
                primary_cta_label=?, primary_cta_url=?,
                secondary_cta_label=?, secondary_cta_url=?,
                hero_image_url=?, background_style=?, is_active=?, updated_by=?
                WHERE id=? AND tenant_id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $language,
                $hero_title,
                $hero_subtitle,
                $hero_badge,
                $primary_cta_label,
                $primary_cta_url,
                $secondary_cta_label,
                $secondary_cta_url,
                $hero_image_url,
                $background_style,
                $is_active,
                $user_id,
                $id,
                $tenant_id
            ]);
            echo json_encode(['success' => true, 'message' => 'Updated']);
        } else {
            // Create
            $sql = "INSERT INTO landing_configs (
                tenant_id, language, hero_title, hero_subtitle, hero_badge,
                primary_cta_label, primary_cta_url,
                secondary_cta_label, secondary_cta_url,
                hero_image_url, background_style, is_active, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $tenant_id,
                $language,
                $hero_title,
                $hero_subtitle,
                $hero_badge,
                $primary_cta_label,
                $primary_cta_url,
                $secondary_cta_label,
                $secondary_cta_url,
                $hero_image_url,
                $background_style,
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
if ($action == 'delete_landing_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM landing_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Delete failed']);
    }
    exit;
}

// 5. ADMIN: Duplicate Config
if ($action == 'duplicate_landing_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        // Get original
        $stmt = $conn->prepare("SELECT * FROM landing_configs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        $original = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$original) {
            echo json_encode(['error' => 'Config not found']);
            exit;
        }

        // Insert copy (inactive)
        $sql = "INSERT INTO landing_configs (
            tenant_id, language, hero_title, hero_subtitle, hero_badge,
            primary_cta_label, primary_cta_url,
            secondary_cta_label, secondary_cta_url,
            hero_image_url, background_style, is_active, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $tenant_id,
            $original['language'],
            $original['hero_title'] . ' (Kopya)',
            $original['hero_subtitle'],
            $original['hero_badge'],
            $original['primary_cta_label'],
            $original['primary_cta_url'],
            $original['secondary_cta_label'],
            $original['secondary_cta_url'],
            $original['hero_image_url'],
            $original['background_style'],
            $user_id
        ]);
        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Duplicate failed: ' . $e->getMessage()]);
    }
    exit;
}

// ========================================
// PUBLIC ENDPOINTS
// ========================================

// 6. PUBLIC: Get Active Landing Config
if ($action == 'get_landing_config_public' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    ensure_landing_table_exists($conn);
    $tenant_id = get_current_tenant($conn);
    $language = $_GET['language'] ?? 'tr';

    try {
        // Try to get active config for requested language
        $stmt = $conn->prepare("SELECT * FROM landing_configs WHERE tenant_id = ? AND language = ? AND is_active = 1 LIMIT 1");
        $stmt->execute([$tenant_id, $language]);
        $config = $stmt->fetch(PDO::FETCH_ASSOC);

        // Fallback to TR if not found
        if (!$config && $language !== 'tr') {
            $stmt = $conn->prepare("SELECT * FROM landing_configs WHERE tenant_id = ? AND language = 'tr' AND is_active = 1 LIMIT 1");
            $stmt->execute([$tenant_id]);
            $config = $stmt->fetch(PDO::FETCH_ASSOC);
        }

        if ($config) {
            echo json_encode(['success' => true, 'data' => $config]);
        } else {
            // Return null/empty - frontend will use defaults
            echo json_encode(['success' => true, 'data' => null]);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error']);
    }
    exit;
}
