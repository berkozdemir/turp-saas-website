<?php
/**
 * Media Admin Controller
 * 
 * Handles admin API requests for media management.
 * Routes: upload_media, get_media_list, get_media_detail, update_media, delete_media
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/../../config/db.php';

// Constants (with guards to prevent redefinition)
if (!defined('MEDIA_MAX_FILE_SIZE')) {
    define('MEDIA_MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
}
if (!defined('MEDIA_ALLOWED_TYPES')) {
    define('MEDIA_ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
}
if (!defined('MEDIA_ALLOWED_EXTENSIONS')) {
    define('MEDIA_ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);
}

/**
 * Handle admin media actions
 * 
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_media_admin(string $action): bool
{
    switch ($action) {
        case 'upload_media':
        case 'upload_image': // Alias for blog editor compatibility
            return media_admin_upload();
        case 'get_media_list':
            return media_admin_list();
        case 'get_media_detail':
            return media_admin_get();
        case 'update_media':
            return media_admin_update();
        case 'delete_media':
            return media_admin_delete();
        case 'get_media_categories':
            return media_admin_categories();
        default:
            return false;
    }
}

function ensure_media_table(): void
{
    $conn = get_db_connection();
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

function media_admin_upload(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];
    $user_id = $ctx['user_id'];

    // Check if files were uploaded (support multiple field names)
    if (!isset($_FILES['files']) && !isset($_FILES['file']) && !isset($_FILES['image'])) {
        echo json_encode(['error' => 'No files uploaded']);
        return true;
    }

    // Normalize to array of files
    $files = [];
    if (isset($_FILES['files'])) {
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
    } elseif (isset($_FILES['file'])) {
        $files[] = $_FILES['file'];
    } elseif (isset($_FILES['image'])) {
        $files[] = $_FILES['image'];
    }

    $uploaded = [];
    $errors = [];

    foreach ($files as $file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = ['file' => $file['name'], 'error' => 'Upload failed with code: ' . $file['error']];
            continue;
        }

        if ($file['size'] > MEDIA_MAX_FILE_SIZE) {
            $errors[] = ['file' => $file['name'], 'error' => 'File too large. Max: 10MB'];
            continue;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($ext, MEDIA_ALLOWED_EXTENSIONS) || !in_array($mime, MEDIA_ALLOWED_TYPES)) {
            $errors[] = ['file' => $file['name'], 'error' => 'Invalid file type'];
            continue;
        }

        $year = date('Y');
        $month = date('m');
        $unique_name = uniqid('media_') . '_' . time() . '.' . $ext;
        $relative_path = "media/{$tenant_id}/{$year}/{$month}";
        $full_dir = __DIR__ . '/../../uploads/' . $relative_path;

        if (!is_dir($full_dir)) {
            mkdir($full_dir, 0755, true);
        }

        $file_path = $relative_path . '/' . $unique_name;
        $full_path = $full_dir . '/' . $unique_name;

        if (!move_uploaded_file($file['tmp_name'], $full_path)) {
            $errors[] = ['file' => $file['name'], 'error' => 'Failed to save file'];
            continue;
        }

        $width = null;
        $height = null;
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            $size = getimagesize($full_path);
            if ($size) {
                $width = $size[0];
                $height = $size[1];
            }
        }

        $url = "/api/uploads/{$file_path}";

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
            if (file_exists($full_path)) {
                unlink($full_path);
            }
        }
    }

    // Build response - include top-level 'url' for ImageUploader compatibility
    $response = [
        'success' => count($uploaded) > 0,
        'uploaded' => $uploaded,
        'errors' => $errors
    ];

    // Add top-level url for single-file uploads (ImageUploader expects this)
    if (count($uploaded) > 0) {
        $response['url'] = $uploaded[0]['url'];
    }

    echo json_encode($response);
    return true;
}

function media_admin_list(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(50, max(12, (int) ($_GET['limit'] ?? 24)));
    $offset = ($page - 1) * $limit;

    $query = "SELECT id, filename_original, filename_stored, url, mime_type, size_bytes, width, height, alt_text, title, tags, category, created_at 
              FROM media_assets WHERE tenant_id = ?";
    $params = [$tenant_id];

    if (!empty($search)) {
        $query .= " AND (filename_original LIKE ? OR title LIKE ? OR alt_text LIKE ?)";
        $search_term = "%{$search}%";
        $params[] = $search_term;
        $params[] = $search_term;
        $params[] = $search_term;
    }

    if (!empty($category)) {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    $count_query = str_replace("SELECT id, filename_original, filename_stored, url, mime_type, size_bytes, width, height, alt_text, title, tags, category, created_at", "SELECT COUNT(*) as total", $query);
    $stmt = $conn->prepare($count_query);
    $stmt->execute($params);
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
    return true;
}

function media_admin_get(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        return true;
    }

    $stmt = $conn->prepare("SELECT * FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    $asset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asset) {
        echo json_encode(['error' => 'Asset not found']);
        return true;
    }

    $asset['tags'] = $asset['tags'] ? json_decode($asset['tags'], true) : [];
    echo json_encode(['success' => true, 'data' => $asset]);
    return true;
}

function media_admin_update(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        return true;
    }

    $stmt = $conn->prepare("SELECT id FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    if (!$stmt->fetch()) {
        echo json_encode(['error' => 'Asset not found or access denied']);
        return true;
    }

    $title = trim($data['title'] ?? '');
    $alt_text = trim($data['alt_text'] ?? '');
    $category = trim($data['category'] ?? '');
    $tags = $data['tags'] ?? [];

    try {
        $stmt = $conn->prepare("UPDATE media_assets SET title = ?, alt_text = ?, category = ?, tags = ? WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$title, $alt_text, $category, json_encode($tags), $id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Update failed: ' . $e->getMessage()]);
    }
    return true;
}

function media_admin_delete(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($data['id'] ?? 0);

    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        return true;
    }

    $stmt = $conn->prepare("SELECT file_path FROM media_assets WHERE id = ? AND tenant_id = ?");
    $stmt->execute([$id, $tenant_id]);
    $asset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asset) {
        echo json_encode(['error' => 'Asset not found or access denied']);
        return true;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM media_assets WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);

        $full_path = __DIR__ . '/../../uploads/' . $asset['file_path'];
        if (file_exists($full_path)) {
            unlink($full_path);
        }

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Delete failed: ' . $e->getMessage()]);
    }
    return true;
}

function media_admin_categories(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    $stmt = $conn->prepare("SELECT DISTINCT category FROM media_assets WHERE tenant_id = ? AND category != '' ORDER BY category");
    $stmt->execute([$tenant_id]);
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(['success' => true, 'data' => $categories]);
    return true;
}
