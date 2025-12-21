<?php
// FAQ Management API
// Requires: $conn, $action

// ========================================
// ADMIN ENDPOINTS (Authenticated)
// ========================================

// 1. ADMIN: List FAQs with filters
if ($action == 'get_faqs_admin' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    $language = $_GET['language'] ?? 'all';
    $is_showcased = $_GET['is_showcased'] ?? 'all';
    $is_active = $_GET['is_active'] ?? 'all';
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM faqs WHERE 1=1";
    $params = [];

    if ($language !== 'all') {
        $query .= " AND language = ?";
        $params[] = $language;
    }

    if ($is_showcased !== 'all') {
        $query .= " AND is_showcased = ?";
        $params[] = $is_showcased === 'true' ? 1 : 0;
    }

    if ($is_active !== 'all') {
        $query .= " AND is_active = ?";
        $params[] = $is_active === 'true' ? 1 : 0;
    }

    if (!empty($search)) {
        $query .= " AND question LIKE ?";
        $params[] = "%$search%";
    }

    $query .= " ORDER BY sort_order ASC, created_at DESC LIMIT $limit OFFSET $offset";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Count total
        $count_query = "SELECT COUNT(*) as total FROM faqs WHERE 1=1";
        $count_params = [];
        if ($language !== 'all') {
            $count_query .= " AND language = ?";
            $count_params[] = $language;
        }
        if ($is_showcased !== 'all') {
            $count_query .= " AND is_showcased = ?";
            $count_params[] = $is_showcased === 'true' ? 1 : 0;
        }
        if ($is_active !== 'all') {
            $count_query .= " AND is_active = ?";
            $count_params[] = $is_active === 'true' ? 1 : 0;
        }
        if (!empty($search)) {
            $count_query .= " AND question LIKE ?";
            $count_params[] = "%$search%";
        }

        $stmt = $conn->prepare($count_query);
        $stmt->execute($count_params);
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        echo json_encode([
            'success' => true,
            'data' => $faqs,
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

// 2. ADMIN: Get single FAQ
if ($action == 'get_faq_detail' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    $id = $_GET['id'] ?? 0;

    try {
        $stmt = $conn->prepare("SELECT * FROM faqs WHERE id = ?");
        $stmt->execute([$id]);
        $faq = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($faq) {
            echo json_encode(['success' => true, 'data' => $faq]);
        } else {
            echo json_encode(['error' => 'FAQ bulunamadı']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error']);
    }
    exit;
}

// 3. ADMIN: Create FAQ
if ($action == 'create_faq' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $question = trim($data['question'] ?? '');
    $answer = trim($data['answer'] ?? '');
    $category = $data['category'] ?? 'Genel';
    $language = $data['language'] ?? 'tr';
    $is_showcased = !empty($data['is_showcased']) ? 1 : 0;
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
    $sort_order = (int) ($data['sort_order'] ?? 0);

    if (empty($question) || empty($answer)) {
        echo json_encode(['error' => 'Soru ve cevap zorunludur']);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO faqs (question, answer, category, language, is_showcased, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$question, $answer, $category, $language, $is_showcased, $is_active, $sort_order]);
        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Kayıt oluşturulamadı']);
    }
    exit;
}

// 4. ADMIN: Update FAQ
if ($action == 'update_faq' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = $data['id'] ?? 0;
    $question = trim($data['question'] ?? '');
    $answer = trim($data['answer'] ?? '');
    $category = $data['category'] ?? 'Genel';
    $language = $data['language'] ?? 'tr';
    $is_showcased = !empty($data['is_showcased']) ? 1 : 0;
    $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
    $sort_order = (int) ($data['sort_order'] ?? 0);

    if (empty($id) || empty($question) || empty($answer)) {
        echo json_encode(['error' => 'ID, soru ve cevap zorunludur']);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE faqs SET question=?, answer=?, category=?, language=?, is_showcased=?, is_active=?, sort_order=? WHERE id=?");
        $stmt->execute([$question, $answer, $category, $language, $is_showcased, $is_active, $sort_order, $id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Güncelleme başarısız']);
    }
    exit;
}

// 5. ADMIN: Delete FAQ
if ($action == 'delete_faq' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;

    try {
        $stmt = $conn->prepare("DELETE FROM faqs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Silme işlemi başarısız']);
    }
    exit;
}

// ========================================
// PUBLIC ENDPOINTS (No Auth Required)
// ========================================

// 6. PUBLIC: Get showcased FAQs for homepage
if ($action == 'get_faqs_showcase' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $language = $_GET['language'] ?? 'tr';
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 4;

    try {
        $stmt = $conn->prepare("SELECT id, question, answer, category FROM faqs WHERE is_active = 1 AND is_showcased = 1 AND language = ? ORDER BY sort_order ASC, created_at DESC LIMIT ?");
        $stmt->bindValue(1, $language, PDO::PARAM_STR);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $faqs]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Veri alınamadı']);
    }
    exit;
}

// 7. PUBLIC: Get all active FAQs for FAQ page
if ($action == 'get_faqs_public' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $language = $_GET['language'] ?? 'tr';
    $category = $_GET['category'] ?? 'all';

    $query = "SELECT id, question, answer, category FROM faqs WHERE is_active = 1 AND language = ?";
    $params = [$language];

    if ($category !== 'all') {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    $query .= " ORDER BY category ASC, sort_order ASC, created_at DESC";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get categories
        $stmt = $conn->prepare("SELECT DISTINCT category FROM faqs WHERE is_active = 1 AND language = ? ORDER BY category ASC");
        $stmt->execute([$language]);
        $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(['success' => true, 'data' => $faqs, 'categories' => $categories]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Veri alınamadı']);
    }
    exit;
}
