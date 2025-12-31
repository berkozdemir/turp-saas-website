<?php
// Media Management API
// Multi-tenant image library
// Requires: $conn, $action

require_once __DIR__ . '/tenant_helper.php';

// Helper function to ensure media table exists
function ensure_media_table_exists($conn)
{
    $sql = "CREATE TABLE IF NOT EXISTS media_assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id VARCHAR(50) NOT NULL,
        filename_original VARCHAR(255) NOT NULL,
        filename_stored VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        url VARCHAR(500) NOT NULL,
        mime_type VARCHAR(100),
        size_bytes INT,
        width INT,
        height INT,
        alt_text VARCHAR(500) DEFAULT '',
        title VARCHAR(255) DEFAULT '',
        tags JSON,
        category VARCHAR(50) DEFAULT '',
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tenant (tenant_id),
        INDEX idx_tenant_category (tenant_id, category),
        INDEX idx_tenant_created (tenant_id, created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $conn->exec($sql);
}

// Constants
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);

// 1. UPLOAD MEDIA (single or multiple)
if ($action == 'upload_media' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_media_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    // Check if files were uploaded
    if (!isset($_FILES['files']) && !isset($_FILES['file'])) {
        echo json_encode(['error' => 'No files uploaded']);
        exit;
    }

    // Normalize to array of files
    $files = [];
    if (isset($_FILES['files'])) {
        // Multiple files
        $count = count($_FILES['files']['name']);
        for ($i = 0; $i < $count; $i++) {
            $files[] = [
                'name' => $_FILES['files']['name'][$i],
                'type' => $_FILES['files']['type'][$i],
                'tmp_name' => $_FILES['files']['tmp_name'][$i],
                'error' => $_FILES['files']['error'][$i],
                'size' => $_FILES['files']['size'][$i],
            ];
        }
    } else {
        // Single file
        $files[] = $_FILES['file'];
    }

    $uploaded = [];
    $errors = [];

    foreach ($files as $file) {
        // Validate upload error
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = ['file' => $file['name'], 'error' => 'Upload failed with code: ' . $file['error']];
            continue;
        }

        // Validate size
        if ($file['size'] > MAX_FILE_SIZE) {
            $errors[] = ['file' => $file['name'], 'error' => 'File too large. Max: 10MB'];
            continue;
        }

        // Validate type
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($ext, ALLOWED_EXTENSIONS) || !in_array($mime, ALLOWED_TYPES)) {
            $errors[] = ['file' => $file['name'], 'error' => 'Invalid file type. Allowed: jpg, png, webp, gif, svg'];
            continue;
        }

        // Generate path: /media/{tenantId}/YYYY/MM/filename.ext
        $year = date('Y');
        $month = date('m');
        $unique_name = uniqid('media_') . '_' . time() . '.' . $ext;
        $relative_path = "media/{$tenant_id}/{$year}/{$month}";
        $full_dir = __DIR__ . '/uploads/' . $relative_path;

        // Create directory if not exists
        if (!is_dir($full_dir)) {
            mkdir($full_dir, 0755, true);
        }

        $file_path = $relative_path . '/' . $unique_name;
        $full_path = $full_dir . '/' . $unique_name;

        // Move file
        if (!move_uploaded_file($file['tmp_name'], $full_path)) {
            $errors[] = ['file' => $file['name'], 'error' => 'Failed to save file'];
            continue;
        }

        // Extract dimensions (for images)
        $width = null;
        $height = null;
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            $size = getimagesize($full_path);
            if ($size) {
                $width = $size[0];
                $height = $size[1];
            }
        }

        // Public URL
        $url = "/api/uploads/{$file_path}";

        // Insert into database
        try {
            $stmt = $conn->prepare("INSERT INTO media_assets 
                (tenant_id, filename_original, filename_stored, file_path, url, mime_type, size_bytes, width, height, uploaded_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $tenant_id,
                $file['name'],
                $unique_name,
                $file_path,
                $url,
                $mime,
                $file['size'],
                $width,
                $height,
                $user_id
            ]);

            $asset_id = $conn->lastInsertId();

            $uploaded[] = [
                'id' => $asset_id,
                'filename' => $file['name'],
                'url' => $url,
                'mime_type' => $mime,
                'size_bytes' => $file['size'],
                'width' => $width,
                'height' => $height
            ];
        } catch (Exception $e) {
            $errors[] = ['file' => $file['name'], 'error' => 'Database error: ' . $e->getMessage()];
            // Clean up file
            if (file_exists($full_path)) {
                unlink($full_path);
            }
        }
    }

    echo json_encode([
        'success' => count($uploaded) > 0,
        'uploaded' => $uploaded,
        'errors' => $errors
    ]);
    exit;
}

// 2. LIST MEDIA (paginated, with filters)
if ($action == 'get_media_list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_media_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(50, max(12, (int) ($_GET['limit'] ?? 24)));
    $offset = ($page - 1) * $limit;

    $query = "SELECT id, filename_original, filename_stored, url, mime_type, size_bytes, width, height, alt_text, title, tags, category, created_at 
              FROM media_assets WHERE tenant_id = ?";
    $params = [$tenant_id];

    if (!empty($search)) {
        $query .= " AND (filename_original LIKE ? OR title LIKE ? OR alt_text LIKE ? OR JSON_SEARCH(tags, 'one', ?) IS NOT NULL)";
        $search_term = "%{$search}%";
        $params[] = $search_term;
        $params[] = $search_term;
        $params[] = $search_term;
        $params[] = $search;
    }

    if (!empty($category)) {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    // Count total
    $count_query = str_replace("SELECT id, filename_original, filename_stored, url, mime_type, size_bytes, width, height, alt_text, title, tags, category, created_at", "SELECT COUNT(*) as total", $query);
    $stmt = $conn->prepare($count_query);
    $stmt->execute($params);
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get page
    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse tags JSON
    foreach ($assets as &$asset) {
        $asset['tags'] = $asset['tags'] ? json_decode($asset['tags'], true) : [];
    }

    echo json_encode([
        'success' => true,
        'data' => $assets,
        'pagination' => [
            'total' => (int) $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]
    ]);
    exit;
}

// 3. GET SINGLE MEDIA DETAIL
if ($action == 'get_media_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_media_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    $asset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asset) {
        echo json_encode(['error' => 'Asset not found']);
        exit;
    }

    $asset['tags'] = $asset['tags'] ? json_decode($asset['tags'], true) : [];

    echo json_encode(['success' => true, 'data' => $asset]);
    exit;
}

// 4. UPDATE MEDIA METADATA
if ($action == 'update_media' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_media_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        exit;
    }

    // Verify ownership
    $stmt = $conn->prepare("SELECT id FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    if (!$stmt->fetch()) {
        echo json_encode(['error' => 'Asset not found or access denied']);
        exit;
    }

    $title = trim($data['title'] ?? '');
    $alt_text = trim($data['alt_text'] ?? '');
    $category = trim($data['category'] ?? '');
    $tags = $data['tags'] ?? [];

    try {
        $stmt = $conn->prepare("UPDATE media_assets SET title = ?, alt_text = ?, category = ?, tags = ? WHERE id = ? AND tenant_id = ?");
        $stmt->execute([
            $title,
            $alt_text,
            $category,
            json_encode($tags),
            $id,
            $tenant_id
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Update failed: ' . $e->getMessage()]);
    }
    exit;
}

// 5. DELETE MEDIA
if ($action == 'delete_media' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_media_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        exit;
    }

    // Get asset to find file path
    $stmt = $conn->prepare("SELECT file_path FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    $asset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asset) {
        echo json_encode(['error' => 'Asset not found or access denied']);
        exit;
    }

    try {
        // Delete from database
        $stmt = $conn->prepare("DELETE FROM media_assets WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);

        // Delete file from disk
        $full_path = __DIR__ . '/uploads/' . $asset['file_path'];
        if (file_exists($full_path)) {
            unlink($full_path);
        }

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Delete failed: ' . $e->getMessage()]);
    }
    exit;
}

// 6. GET CATEGORIES (for filter dropdown)
if ($action == 'get_media_categories' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    ensure_media_table_exists($conn);
    $tenant_id = get_current_tenant($conn);

    $stmt = $conn->prepare("SELECT DISTINCT category FROM media_assets WHERE tenant_id = ? AND category != '' ORDER BY category");
    $stmt->execute([$tenant_id]);
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(['success' => true, 'data' => $categories]);
    exit;
}
