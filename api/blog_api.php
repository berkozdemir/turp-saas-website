<?php
// Blog Management API - Multilingual Single-Row Model
// Requires: $conn, $action

require_once __DIR__ . '/tenant_helper.php';

// 1. LIST BLOG POSTS (Public)
if ($action == 'get_blog_posts' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/tenant_helper.php';
    $tenant_id = get_current_tenant($conn);

    try {
        // Select all multilingual fields for public display
        $query = "SELECT id, slug, 
            title_tr, excerpt_tr, content_tr,
            title_en, excerpt_en, content_en,
            title_zh, excerpt_zh, content_zh,
            featured_image as image_url, 'Admin' as author, status, published_at as created_at 
            FROM iwrs_saas_blog_posts 
            WHERE tenant_id = ? AND status = 'published'
            ORDER BY published_at DESC";

        $stmt = $conn->prepare($query);
        $stmt->execute([$tenant_id]);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $posts
        ]);
    } catch (Exception $e) {
        // Return empty array on error for public safety
        error_log("Blog API Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'data' => [], 'error' => $e->getMessage()]);
    }
    exit;
}

// 1.5 LIST BLOG POSTS (Admin)
if ($action == 'get_blog_posts_admin' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $status = $_GET['status'] ?? 'all';
    $search = $_GET['search'] ?? '';

    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = 20;
    $offset = ($page - 1) * $limit;

    // Select all multilingual fields
    $query = "SELECT id, slug, title_tr, title_en, title_zh, featured_image as image_url, 'Admin' as author, status, created_at FROM iwrs_saas_blog_posts WHERE tenant_id = ?";
    $params = [$tenant_id];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($search)) {
        $query .= " AND (title_tr LIKE ? OR title_en LIKE ? OR title_zh LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Count total
        $count_query = "SELECT COUNT(*) as total FROM iwrs_saas_blog_posts WHERE tenant_id = ?";
        $count_params = [$tenant_id];
        if ($status !== 'all') {
            $count_query .= " AND status = ?";
            $count_params[] = $status;
        }
        if (!empty($search)) {
            $count_query .= " AND (title_tr LIKE ? OR title_en LIKE ? OR title_zh LIKE ?)";
            $count_params[] = "%$search%";
            $count_params[] = "%$search%";
            $count_params[] = "%$search%";
        }

        $stmt = $conn->prepare($count_query);
        $stmt->execute($count_params);
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        echo json_encode([
            'success' => true,
            'data' => $posts,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'pages' => ceil($total / $limit)
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// 2. GET SINGLE POST (Admin Detail)
if ($action == 'get_blog_post_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $id = $_GET['id'] ?? 0;

    try {
        $stmt = $conn->prepare("SELECT id, slug, 
            title_tr, excerpt_tr, content_tr,
            title_en, excerpt_en, content_en,
            title_zh, excerpt_zh, content_zh,
            featured_image as image_url, 'Admin' as author, status, published_at as publish_at, created_at 
            FROM iwrs_saas_blog_posts WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($post) {
            echo json_encode(['success' => true, 'data' => $post]);
        } else {
            echo json_encode(['error' => 'Post not found']);
        }
    } catch (Exception $e) {
        error_log("Database Error: " . $e->getMessage());
        echo json_encode(['error' => 'İçerik bulunamadı veya bir hata oluştu.']);
    }
    exit;
}

// 3. CREATE / UPDATE POST (Multilingual)
if (($action == 'create_blog_post' || $action == 'update_blog_post') && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $slug = trim($data['slug'] ?? '');
    $status = $data['status'] ?? 'draft';
    $publish_at = !empty($data['publish_at']) ? date('Y-m-d H:i:s', strtotime($data['publish_at'])) : null;
    $image_url = $data['image_url'] ?? null;

    // Multilingual fields
    $title_tr = trim($data['title_tr'] ?? $data['title'] ?? '');
    $excerpt_tr = $data['excerpt_tr'] ?? $data['excerpt'] ?? '';
    $content_tr = $data['content_tr'] ?? $data['content'] ?? '';
    $title_en = $data['title_en'] ?? null;
    $excerpt_en = $data['excerpt_en'] ?? null;
    $content_en = $data['content_en'] ?? null;
    $title_zh = $data['title_zh'] ?? null;
    $excerpt_zh = $data['excerpt_zh'] ?? null;
    $content_zh = $data['content_zh'] ?? null;

    if (empty($title_tr) || empty($slug)) {
        echo json_encode(['error' => 'Turkish title and slug are required']);
        exit;
    }

    try {
        if ($action == 'create_blog_post') {
            $stmt = $conn->prepare("INSERT INTO iwrs_saas_blog_posts 
                (slug, title_tr, excerpt_tr, content_tr, title_en, excerpt_en, content_en, title_zh, excerpt_zh, content_zh, status, published_at, featured_image, tenant_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $slug,
                $title_tr,
                $excerpt_tr,
                $content_tr,
                $title_en,
                $excerpt_en,
                $content_en,
                $title_zh,
                $excerpt_zh,
                $content_zh,
                $status,
                $publish_at,
                $image_url,
                $tenant_id
            ]);
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        } else {
            $id = $data['id'] ?? 0;
            if (empty($id)) {
                echo json_encode(['error' => 'ID required for update']);
                exit;
            }
            $stmt = $conn->prepare("UPDATE iwrs_saas_blog_posts SET 
                slug=?, title_tr=?, excerpt_tr=?, content_tr=?, 
                title_en=?, excerpt_en=?, content_en=?,
                title_zh=?, excerpt_zh=?, content_zh=?,
                status=?, published_at=?, featured_image=? 
                WHERE id=? AND tenant_id=?");
            $stmt->execute([
                $slug,
                $title_tr,
                $excerpt_tr,
                $content_tr,
                $title_en,
                $excerpt_en,
                $content_en,
                $title_zh,
                $excerpt_zh,
                $content_zh,
                $status,
                $publish_at,
                $image_url,
                $id,
                $tenant_id
            ]);
            echo json_encode(['success' => true]);
        }
    } catch (Exception $e) {
        error_log("Database Error: " . $e->getMessage());
        echo json_encode(['error' => 'Kayıt işlemi sırasında bir hata oluştu.']);
    }
    exit;
}

// 4. DELETE POST
if ($action == 'delete_blog_post' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);
    $tenant_id = get_current_tenant($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM iwrs_saas_blog_posts WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        error_log("Database Error: " . $e->getMessage());
        echo json_encode(['error' => 'Silme işlemi başarısız oldu.']);
    }
    exit;
}

// 5. UPLOAD IMAGE
if ($action == 'upload_image' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $error_code = $_FILES['image']['error'] ?? 'No file';
        echo json_encode(['error' => 'File upload failed. Code: ' . $error_code]);
        exit;
    }

    $file = $_FILES['image'];
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        echo json_encode(['error' => 'Invalid file type. Allowed: jpg, png, webp']);
        exit;
    }

    $filename = uniqid('img_') . '.' . $ext;
    $upload_dir = __DIR__ . '/uploads/';

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $upload_dir . $filename)) {
        echo json_encode(['error' => 'Failed to move uploaded file']);
        exit;
    }

    echo json_encode(['success' => true, 'url' => "/api/uploads/$filename"]);
    exit;
}

// 6. AI TRANSLATE BLOG (Batch EN + ZH)
if ($action == 'ai_translate_blog_all' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);
    require_once __DIR__ . '/translate_helper.php';

    $data = json_decode(file_get_contents('php://input'), true);

    // Get DeepSeek API Key from env
    $deepseek_key = getenv('DEEPSEEK_API_KEY');
    if (!$deepseek_key && file_exists(__DIR__ . '/../.env')) {
        $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), 'DEEPSEEK_API_KEY=') === 0) {
                $deepseek_key = trim(substr($line, 17));
                break;
            }
        }
    }

    if (!$deepseek_key) {
        echo json_encode(['error' => 'Configuration error: DeepSeek API Key missing']);
        exit;
    }

    $title_tr = $data['title_tr'] ?? '';
    $excerpt_tr = $data['excerpt_tr'] ?? '';
    $content_tr = $data['content_tr'] ?? '';

    $results = ['en' => [], 'zh' => []];

    // Translate to English
    if (!empty($title_tr)) {
        $trans = translate_with_deepseek($title_tr, 'en', $deepseek_key);
        if (isset($trans['success']))
            $results['en']['title'] = $trans['translation'];
    }
    if (!empty($excerpt_tr)) {
        $trans = translate_with_deepseek($excerpt_tr, 'en', $deepseek_key);
        if (isset($trans['success']))
            $results['en']['excerpt'] = $trans['translation'];
    }
    if (!empty($content_tr)) {
        $trans = translate_with_deepseek($content_tr, 'en', $deepseek_key);
        if (isset($trans['success']))
            $results['en']['content'] = $trans['translation'];
    }

    // Translate to Chinese
    if (!empty($title_tr)) {
        $trans = translate_with_deepseek($title_tr, 'zh', $deepseek_key);
        if (isset($trans['success']))
            $results['zh']['title'] = $trans['translation'];
    }
    if (!empty($excerpt_tr)) {
        $trans = translate_with_deepseek($excerpt_tr, 'zh', $deepseek_key);
        if (isset($trans['success']))
            $results['zh']['excerpt'] = $trans['translation'];
    }
    if (!empty($content_tr)) {
        $trans = translate_with_deepseek($content_tr, 'zh', $deepseek_key);
        if (isset($trans['success']))
            $results['zh']['content'] = $trans['translation'];
    }

    echo json_encode($results);
    exit;
}
