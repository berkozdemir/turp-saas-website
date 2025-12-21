<?php
// Contact Form & Admin Inbox API
// Requires: $conn, $action, $brevo_api_key

// 1. PUBLIC: Submit Contact Form
if ($action == 'contact' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $full_name = trim($data['full_name'] ?? '');
    $email = trim($data['email'] ?? '');
    $organization = trim($data['organization'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $message_body = trim($data['message_body'] ?? '');
    $consent = !empty($data['consent']);

    // Validation
    if (empty($full_name) || empty($email) || empty($subject) || empty($message_body)) {
        echo json_encode(['error' => 'Lütfen tüm zorunlu alanları doldurun.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Geçersiz e-posta adresi.']);
        exit;
    }

    if (!$consent) {
        // Optional enforcement depending on requirement, but usually good to check
        // echo json_encode(['error' => 'KVKK aydınlatma metnini onaylamanız gerekmektedir.']);
    }

    try {
        // Save to Database
        $stmt = $conn->prepare("INSERT INTO contact_messages (full_name, email, organization, subject, message_body, consent) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$full_name, $email, $organization, $subject, $message_body, $consent ? 1 : 0]);

        // Get notification emails from settings (or use default)
        $admin_emails = 'berko@omega-cro.com.tr'; // Default
        try {
            $stmt = $conn->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_emails'");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result && !empty($result['setting_value'])) {
                $admin_emails = $result['setting_value'];
            }
        } catch (Exception $e) {
            // Table might not exist, use default
        }

        // Send Email Notification to Admin(s)
        require_once __DIR__ . '/email_helper.php';

        $email_subject = "Yeni İletişim Mesajı: " . $subject;
        $html_content = "
            <h3>Yeni bir iletişim mesajı aldınız</h3>
            <p><strong>Gönderen:</strong> {$full_name} ({$email})</p>
            <p><strong>Kurum:</strong> {$organization}</p>
            <p><strong>Konu:</strong> {$subject}</p>
            <hr>
            <p><strong>Mesaj:</strong></p>
            <p>" . nl2br(htmlspecialchars($message_body)) . "</p>
        ";

        // Send to each email address (comma-separated)
        $email_list = array_map('trim', explode(',', $admin_emails));
        foreach ($email_list as $admin_email) {
            if (filter_var($admin_email, FILTER_VALIDATE_EMAIL)) {
                send_email_via_brevo($brevo_api_key, $admin_email, 'Admin', $email_subject, $html_content);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Mesajınız başarıyla iletildi.']);
    } catch (Exception $e) {
        error_log("Contact form error: " . $e->getMessage());
        echo json_encode(['error' => 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.']);
    }
    exit;
}

// 2. ADMIN: List Messages
if ($action == 'get_messages' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    $status = $_GET['status'] ?? 'all';
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $query = "SELECT * FROM contact_messages";
    $params = [];

    if ($status !== 'all') {
        $query .= " WHERE status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count for pagination
        $count_query = "SELECT COUNT(*) as total FROM contact_messages";
        if ($status !== 'all') {
            $count_query .= " WHERE status = ?";
        }
        $stmt = $conn->prepare($count_query);
        if ($status !== 'all') {
            $stmt->execute([$status]);
        } else {
            $stmt->execute();
        }
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        echo json_encode([
            'success' => true,
            'data' => $messages,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'pages' => ceil($total / $limit)
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Veritabanı hatası: ' . $e->getMessage()]);
    }
    exit;
}

// 3. ADMIN: Update Status
if ($action == 'update_message_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $data['id'] ?? 0;
    $status = $data['status'] ?? '';

    if (empty($id) || !in_array($status, ['new', 'read', 'archived'])) {
        echo json_encode(['error' => 'Geçersiz parametreler']);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE contact_messages SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Güncelleme hatası']);
    }
    exit;
}
