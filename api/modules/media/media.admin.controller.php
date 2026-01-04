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
        case 'optimize_media_batch':
            return media_admin_optimize_batch();
        case 'get_media_optimization_stats':
            return media_admin_optimization_stats();
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
        original_size_bytes INT NULL,
        optimized TINYINT(1) DEFAULT 0,
        optimized_at DATETIME NULL,
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
        INDEX idx_tenant_created (tenant_id, created_at DESC),
        INDEX idx_tenant_optimized (tenant_id, optimized)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $conn->exec($sql);

    // Add optimization columns if they don't exist (for existing tables)
    try {
        $conn->exec("ALTER TABLE media_assets ADD COLUMN original_size_bytes INT NULL AFTER size_bytes");
    } catch (PDOException $e) { /* Column exists */
    }

    try {
        $conn->exec("ALTER TABLE media_assets ADD COLUMN optimized TINYINT(1) DEFAULT 0 AFTER original_size_bytes");
    } catch (PDOException $e) { /* Column exists */
    }

    try {
        $conn->exec("ALTER TABLE media_assets ADD COLUMN optimized_at DATETIME NULL AFTER optimized");
    } catch (PDOException $e) { /* Column exists */
    }
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

        // ============================================
        // IMAGE OPTIMIZATION (if enabled)
        // ============================================
        $original_size = $file['size'];
        $optimized_size = $file['size'];
        $was_optimized = false;

        if (
            defined('IMAGE_OPTIMIZE_ON_UPLOAD') && IMAGE_OPTIMIZE_ON_UPLOAD
            && in_array($mime, ['image/jpeg', 'image/png', 'image/webp'])
        ) {

            require_once __DIR__ . '/../../core/services/ImageOptimizerService.php';

            try {
                $optimizer = new ImageOptimizerService();
                $result = $optimizer->optimize($full_path);

                if ($result['success']) {
                    $optimized_size = $result['optimized_size'];
                    $was_optimized = true;
                    error_log("[MediaUpload] Optimized {$file['name']}: {$result['original_size']} -> {$result['optimized_size']} ({$result['percentage_saved']}% saved)");
                } else {
                    error_log("[MediaUpload] Optimization failed for {$file['name']}: " . ($result['error'] ?? 'Unknown error'));
                }
            } catch (Exception $e) {
                error_log("[MediaUpload] Optimization exception for {$file['name']}: " . $e->getMessage());
            }
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
                (tenant_id, filename_original, filename_stored, file_path, url, mime_type, size_bytes, original_size_bytes, optimized, optimized_at, width, height, uploaded_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $tenant_id,
                $file['name'],
                $unique_name,
                $file_path,
                $url,
                $mime,
                $optimized_size,
                $was_optimized ? $original_size : null,
                $was_optimized ? 1 : 0,
                $was_optimized ? date('Y-m-d H:i:s') : null,
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
                'size_bytes' => $optimized_size,
                'original_size_bytes' => $original_size,
                'optimized' => $was_optimized,
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

    // DEBUG: Check actual database and raw count
    $db_name = $conn->query("SELECT DATABASE()")->fetchColumn();
    $raw_count = $conn->query("SELECT COUNT(*) FROM media_assets")->fetchColumn();
    $raw_count_t3 = $conn->query("SELECT COUNT(*) FROM media_assets WHERE tenant_id = 3")->fetchColumn();

    error_log("[MediaList] DB: $db_name, Raw total: $raw_count, Raw t3: $raw_count_t3, Context tenant: $tenant_id");


    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(50, max(12, (int) ($_GET['limit'] ?? 24)));
    $offset = ($page - 1) * $limit;

    // TEMPORARY FIX: Use direct value instead of prepared statement for tenant_id
    // This is a diagnostic test to isolate the PDO parameter binding issue
    $tenant_id_safe = (int) $tenant_id; // Ensure integer

    $query = "SELECT id, filename_original, filename_stored, url, mime_type, size_bytes, width, height, alt_text, title, tags, category, created_at 
              FROM media_assets WHERE tenant_id = {$tenant_id_safe}";
    $params = [];

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

    // DEBUG: Log query and params
    error_log("[MediaList] Query: " . $query);
    error_log("[MediaList] Params: " . json_encode($params));

    $count_query = str_replace("SELECT id, filename_original, filename_stored, url, mime_type, size_bytes, width, height, alt_text, title, tags, category, created_at", "SELECT COUNT(*) as total", $query);

    // DEBUG: Show exact count query
    error_log("[MediaList] Count Query: " . $count_query);

    $stmt = $conn->prepare($count_query);
    $stmt->execute($params);
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // DEBUG: Log count
    error_log("[MediaList] Total count: " . $total);

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
        ],
        '_debug' => [
            'tenant_id_used' => $tenant_id,
            'tenant_id_safe' => $tenant_id_safe,
            'query_count' => $total,
            'db_name' => $db_name,
            'raw_total' => (int) $raw_count,
            'raw_t3' => (int) $raw_count_t3,
            'count_query' => $count_query,
            'params' => $params,
            'category_raw' => $category,
            'search_raw' => $search
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

/**
 * Batch optimize existing images
 * Super-admins can optimize all tenants, regular admins only their tenant
 */
function media_admin_optimize_batch(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $request_tenant_id = $data['tenant_id'] ?? null;
    $limit = min(100, max(1, (int) ($data['limit'] ?? 50)));
    $only_unoptimized = $data['only_unoptimized'] ?? true;

    // Determine scope - regular admins can only optimize their own tenant
    $is_super_admin = ($ctx['role'] ?? '') === 'super_admin';

    if ($request_tenant_id === null && !$is_super_admin) {
        // Non-super-admin trying to optimize all tenants - restrict to their own
        $target_tenant_id = $ctx['tenant_id'];
    } elseif ($request_tenant_id !== null) {
        // Specific tenant requested
        if (!$is_super_admin && (string) $request_tenant_id !== (string) $ctx['tenant_id']) {
            echo json_encode(['error' => 'Access denied: cannot optimize other tenants']);
            return true;
        }
        $target_tenant_id = $request_tenant_id;
    } else {
        // Super-admin optimizing all tenants
        $target_tenant_id = null;
    }

    require_once __DIR__ . '/../../core/services/ImageOptimizerService.php';
    $optimizer = new ImageOptimizerService();

    // Build query
    $query = "SELECT id, tenant_id, file_path, size_bytes, filename_original FROM media_assets WHERE mime_type IN ('image/jpeg', 'image/png', 'image/webp')";
    $params = [];

    if ($target_tenant_id !== null) {
        $query .= " AND tenant_id = ?";
        $params[] = $target_tenant_id;
    }

    if ($only_unoptimized) {
        $query .= " AND (optimized = 0 OR optimized IS NULL)";
    }

    $query .= " ORDER BY size_bytes DESC LIMIT $limit";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $processed = 0;
    $optimized = 0;
    $skipped = 0;
    $bytes_saved = 0;
    $errors = [];

    foreach ($assets as $asset) {
        $processed++;
        $full_path = __DIR__ . '/../../uploads/' . $asset['file_path'];

        if (!file_exists($full_path)) {
            $skipped++;
            $errors[] = ['id' => $asset['id'], 'error' => 'File not found'];
            continue;
        }

        try {
            $result = $optimizer->optimize($full_path);

            if ($result['success']) {
                // Update database
                $update_stmt = $conn->prepare("UPDATE media_assets SET 
                    size_bytes = ?, 
                    original_size_bytes = COALESCE(original_size_bytes, ?),
                    optimized = 1, 
                    optimized_at = NOW() 
                    WHERE id = ?");
                $update_stmt->execute([
                    $result['optimized_size'],
                    $result['original_size'],
                    $asset['id']
                ]);

                $optimized++;
                $bytes_saved += $result['bytes_saved'];
            } else {
                $skipped++;
                $errors[] = ['id' => $asset['id'], 'error' => $result['error'] ?? 'Optimization failed'];
            }
        } catch (Exception $e) {
            $skipped++;
            $errors[] = ['id' => $asset['id'], 'error' => $e->getMessage()];
        }
    }

    // Count remaining
    $remaining_query = "SELECT COUNT(*) FROM media_assets WHERE mime_type IN ('image/jpeg', 'image/png', 'image/webp') AND (optimized = 0 OR optimized IS NULL)";
    if ($target_tenant_id !== null) {
        $remaining_query .= " AND tenant_id = " . (int) $target_tenant_id;
    }
    $remaining = (int) $conn->query($remaining_query)->fetchColumn();

    echo json_encode([
        'success' => true,
        'processed' => $processed,
        'optimized' => $optimized,
        'skipped' => $skipped,
        'bytes_saved' => $bytes_saved,
        'remaining' => $remaining,
        'errors' => count($errors) > 0 ? $errors : null
    ]);
    return true;
}

/**
 * Get optimization statistics for the admin panel
 */
function media_admin_optimization_stats(): bool
{
    $ctx = require_admin_context();
    ensure_media_table();
    $conn = get_db_connection();
    $tenant_id = $ctx['tenant_id'];

    // Stats for current tenant
    $stmt = $conn->prepare("SELECT 
        COUNT(*) as total_images,
        SUM(CASE WHEN optimized = 1 THEN 1 ELSE 0 END) as optimized_count,
        SUM(CASE WHEN optimized = 0 OR optimized IS NULL THEN 1 ELSE 0 END) as unoptimized_count,
        COALESCE(SUM(size_bytes), 0) as total_size,
        COALESCE(SUM(original_size_bytes), 0) as total_original_size,
        COALESCE(SUM(original_size_bytes - size_bytes), 0) as total_saved
        FROM media_assets 
        WHERE tenant_id = ? AND mime_type IN ('image/jpeg', 'image/png', 'image/webp')");
    $stmt->execute([$tenant_id]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Calculate percentage saved
    $percentage_saved = 0;
    if ((int) $stats['total_original_size'] > 0) {
        $percentage_saved = round(((int) $stats['total_saved'] / (int) $stats['total_original_size']) * 100, 1);
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'total_images' => (int) $stats['total_images'],
            'optimized_count' => (int) $stats['optimized_count'],
            'unoptimized_count' => (int) $stats['unoptimized_count'],
            'total_size_bytes' => (int) $stats['total_size'],
            'total_original_size_bytes' => (int) $stats['total_original_size'],
            'bytes_saved' => (int) $stats['total_saved'],
            'percentage_saved' => $percentage_saved
        ]
    ]);
    return true;
}

