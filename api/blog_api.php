<?php
// Blog Management API
// Requires: $conn, $action

// 1. LIST BLOG POSTS
if ($action == 'get_blog_posts_admin' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    $lang = $_GET['lang'] ?? 'all';
    $status = $_GET['status'] ?? 'all';
    $search = $_GET['search'] ?? '';

    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $query = "SELECT id, title, featured_image as image_url, 'Admin' as author, lang as language, status, created_at FROM iwrs_saas_blog_posts WHERE 1=1";
    $params = [];

    if ($lang !== 'all') {
        $query .= " AND lang = ?";
        $params[] = $lang;
    }

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($search)) {
        $query .= " AND title LIKE ?";
        $params[] = "%$search%";
    }

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Count total
        $count_query = "SELECT COUNT(*) as total FROM iwrs_saas_blog_posts WHERE 1=1";
        // Re-use params logic for count... simplified strictly for brevity here, normally split builder
        $count_params = [];
        if ($lang !== 'all') {
            $count_query .= " AND lang = ?";
            $count_params[] = $lang;
        }
        if ($status !== 'all') {
            $count_query .= " AND status = ?";
            $count_params[] = $status;
        }
        if (!empty($search)) {
            $count_query .= " AND title LIKE ?";
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

// 2. GET SINGLE POST
if ($action == 'get_blog_post_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    $id = $_GET['id'] ?? 0;

    try {
        $stmt = $conn->prepare("SELECT id, title, slug, content, excerpt, featured_image as image_url, 'Admin' as author, lang as language, status, published_at as publish_at, created_at FROM iwrs_saas_blog_posts WHERE id = ?");
        $stmt->execute([$id]);
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

// 3. CREATE / UPDATE POST
if (($action == 'create_blog_post' || $action == 'update_blog_post') && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $title = trim($data['title'] ?? '');
    $slug = trim($data['slug'] ?? '');
    $language = $data['language'] ?? 'tr';
    $author = $data['author'] ?? '';
    $excerpt = $data['excerpt'] ?? '';
    $content = $data['content'] ?? '';
    $status = $data['status'] ?? 'draft';
    $publish_at = !empty($data['publish_at']) ? date('Y-m-d H:i:s', strtotime($data['publish_at'])) : null;
    $image_url = $data['image_url'] ?? null;

    if (empty($title) || empty($slug)) {
        echo json_encode(['error' => 'Title and slug are required']);
        exit;
    }

    try {
        if ($action == 'create_blog_post') {
            $stmt = $conn->prepare("INSERT INTO iwrs_saas_blog_posts (title, slug, lang, excerpt, content, status, published_at, featured_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $language, $excerpt, $content, $status, $publish_at, $image_url]);
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        } else {
            $id = $data['id'] ?? 0;
            if (empty($id)) {
                echo json_encode(['error' => 'ID required for update']);
                exit;
            }
            $stmt = $conn->prepare("UPDATE iwrs_saas_blog_posts SET title=?, slug=?, lang=?, excerpt=?, content=?, status=?, published_at=?, featured_image=? WHERE id=?");
            $stmt->execute([$title, $slug, $language, $excerpt, $content, $status, $publish_at, $image_url, $id]);
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

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM iwrs_saas_blog_posts WHERE id = ?");
        $stmt->execute([$id]);
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

    // Return public URL (adjust based on your server config if needed)
    // Assuming backend is at /api, so uploads are at /api/uploads
    echo json_encode(['success' => true, 'url' => "/api/uploads/$filename"]);
    exit;
}
