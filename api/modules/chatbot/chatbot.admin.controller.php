<?php
/**
 * Chatbot Admin Controller
 * Handles admin API endpoints for chatbot management
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/chatbot.service.php';
require_once __DIR__ . '/rag.service.php';

// Require admin authentication and tenant context
$ctx = require_admin_context();
$tenant_id = $ctx['tenant_id'];
$user_id = $ctx['user_id'];

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$data = $method === 'POST' ? json_decode(file_get_contents('php://input'), true) ?? [] : [];

/**
 * Reindex content for RAG
 * POST /api/index.php?action=chatbot_reindex
 *
 * Body: {
 *   source_types: ['podcast', 'blog', 'faq', 'static'] (optional)
 * }
 */
if ($action === 'chatbot_reindex' && $method === 'POST') {
    $source_types = $data['source_types'] ?? ['podcast', 'blog', 'faq'];

    // Validate source types
    $valid_types = ['podcast', 'blog', 'faq', 'static'];
    $source_types = array_intersect($source_types, $valid_types);

    if (empty($source_types)) {
        http_response_code(400);
        echo json_encode(['error' => 'Geçersiz kaynak tipleri']);
        exit;
    }

    // Perform reindexing
    $counts = rag_reindex_all($tenant_id, $source_types);

    // Handle static content seeding if requested
    if (in_array('static', $source_types)) {
        // Clear existing static content
        rag_clear_index($tenant_id, 'static');

        // Seed NIPT and Omega Genetik information
        $static_content = [
            [
                'title' => 'NIPT Testi Nedir?',
                'type' => 'nipt_info',
                'content' => 'NIPT (Non-Invasive Prenatal Test), hamilelik sırasında bebeğin genetik hastalıklarını ve kromozom anomalilerini tespit etmek için yapılan non-invaziv (invaziv olmayan) bir testtir. Anne adayının kanından alınan örnekle, bebeğin DNA\'sı analiz edilir. Test, Down sendromu (Trizomi 21), Edwards sendromu (Trizomi 18) ve Patau sendromu (Trizomi 13) gibi kromozom bozukluklarını %99\'a varan doğrulukla tespit edebilir. NIPT testi hamileliğin 10. haftasından itibaren güvenle uygulanabilir.'
            ],
            [
                'title' => 'NIPT Testi Nasıl Yapılır?',
                'type' => 'nipt_process',
                'content' => 'NIPT testi için anne adayından sadece 10 ml kan örneği alınır. Bu işlem tamamen ağrısızdır ve bebek için hiçbir risk taşımaz. Alınan kan örneği laboratuvarımızda ileri teknoloji DNA dizileme yöntemleriyle analiz edilir. Test sonuçları genellikle 7-10 iş günü içinde hazır olur. Sonuçlar size e-posta ve telefon ile bildirilir ve detaylı raporunuzu almak için kliniğimize davet edilirsiniz.'
            ],
            [
                'title' => 'NIPT Testi Kimlere Önerilir?',
                'type' => 'nipt_indications',
                'content' => 'NIPT testi özellikle şu durumlarda önerilir: 35 yaş ve üzeri anne adayları, ailesinde genetik hastalık öyküsü olanlar, önceki hamileliklerinde kromozom anomalisi tespit edilenler, ultrason taramalarında risk işareti görülenler, double test veya triple test sonuçları riskli çıkanlar. Ancak NIPT testi her hamile için güvenlidir ve 10. haftadan itibaren uygulanabilir. Risk grubunda olmayan anne adayları da istedikleri takdirde bu testi yaptırabilirler.'
            ],
            [
                'title' => 'Omega Genetik Hakkında',
                'type' => 'company_info',
                'content' => 'Omega Genetik, Türkiye\'nin önde gelen genetik test ve danışmanlık merkezlerinden biridir. 2015 yılından bu yana NIPT, kanser genetiği, nadir hastalıklar ve farmakogenetik alanlarında hizmet vermekteyiz. ISO 9001 ve CAP akreditasyonlarına sahip laboratuvarımızda, son teknoloji Next Generation Sequencing (NGS) cihazları ve deneyimli genetik uzmanlarımızla en yüksek kalitede hizmet sunuyoruz. Merkez ofisimiz İstanbul\'da bulunmakta olup, tüm Türkiye\'ye evde kan alma hizmeti sağlamaktayız.'
            ],
            [
                'title' => 'NIPT Testi Fiyatları',
                'type' => 'pricing',
                'content' => 'NIPT test fiyatları test kapsamına göre değişiklik gösterir. Temel NIPT testi Trizomi 21, 18 ve 13 taraması yapar. Genişletilmiş NIPT testi ise mikrodelesyon sendromları ve cinsiyet kromozom anomalilerini de içerir. Doktor sevkli hastalarda indirimli fiyatlandırma uygulanmaktadır. Güncel fiyat bilgisi için lütfen 0212 555 12 34 numaralı telefonumuzu arayın veya web sitemizden randevu talep edin. Bazı özel sağlık sigortaları NIPT testini kapsayabilir, sigorta durumunuzu bize bildirebilirsiniz.'
            ],
            [
                'title' => 'NIPT Test Sonuçları Nasıl Yorumlanır?',
                'type' => 'results',
                'content' => 'NIPT test sonuçları "Düşük Risk" veya "Yüksek Risk" olarak raporlanır. Düşük risk sonucu, test edilen kromozom anomalilerinin görülme olasılığının çok düşük olduğunu gösterir. Yüksek risk sonucu ise bebeğinizde bir anomali olabileceğini işaret eder, ancak kesin tanı değildir. Yüksek risk sonuçlarında, kesin tanı için amniyosentez veya koryon villus örneklemesi (CVS) gibi invaziv testler yapılması önerilir. Tüm sonuçlar deneyimli genetik danışmanlarımız tarafından size detaylı olarak açıklanır.'
            ],
            [
                'title' => 'Randevu ve İletişim',
                'type' => 'contact',
                'content' => 'NIPT testi için randevu almak veya detaylı bilgi almak için bizimle iletişime geçebilirsiniz. Telefon: 0212 555 12 34, E-posta: info@omegagenetik.com. Merkez Ofis: Nişantaşı, İstanbul. Evde kan alma hizmeti için online randevu sistemimizi kullanabilir veya çağrı merkezimizi arayabilirsiniz. Uzman genetik danışmanlarımız tüm sorularınızı yanıtlamak için hazırdır. Hafta içi 09:00-18:00, Cumartesi 09:00-14:00 saatleri arasında hizmetinizdeyiz.'
            ]
        ];

        $static_count = rag_seed_static($tenant_id, $static_content);
        $counts['static'] = $static_count;
    }

    echo json_encode([
        'success' => true,
        'indexed_counts' => $counts
    ]);
    exit;
}

/**
 * Get all conversations with filters
 * GET /api/index.php?action=chatbot_get_conversations
 *
 * Query params:
 *   - status: 'active' | 'archived' | 'all'
 *   - page: number
 *   - limit: number
 */
if ($action === 'chatbot_get_conversations' && $method === 'GET') {
    try {
        $conn = get_db_connection();

        $status = $_GET['status'] ?? 'all';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int)($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        // Build query
        $where = "tenant_id = :tenant_id";
        $params = [':tenant_id' => $tenant_id];

        if ($status !== 'all') {
            $where .= " AND status = :status";
            $params[':status'] = $status;
        }

        // Get total count
        $sql = "SELECT COUNT(*) FROM chatbot_conversations WHERE $where";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $total = $stmt->fetchColumn();

        // Get conversations
        $sql = "SELECT id, session_id, user_email, user_name, user_phone,
                       context_type, context_id, message_count, lead_saved,
                       status, first_message_at, last_message_at
                FROM chatbot_conversations
                WHERE $where
                ORDER BY last_message_at DESC
                LIMIT :limit OFFSET :offset";
        $stmt = $conn->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'conversations' => $conversations,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Get conversations error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Bir hata oluştu']);
    }
    exit;
}

/**
 * Get conversation detail with messages
 * GET /api/index.php?action=chatbot_get_conversation_detail&conversation_id=123
 */
if ($action === 'chatbot_get_conversation_detail' && $method === 'GET') {
    $conversation_id = (int)($_GET['conversation_id'] ?? 0);

    if (!$conversation_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Conversation ID gereklidir']);
        exit;
    }

    try {
        $conn = get_db_connection();

        // Get conversation
        $sql = "SELECT * FROM chatbot_conversations
                WHERE id = :id AND tenant_id = :tenant_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $conversation_id, ':tenant_id' => $tenant_id]);
        $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conversation) {
            http_response_code(404);
            echo json_encode(['error' => 'Conversation bulunamadı']);
            exit;
        }

        // Get messages
        $messages = chatbot_get_history_array($conversation_id, true);

        echo json_encode([
            'success' => true,
            'conversation' => $conversation,
            'messages' => $messages
        ]);
    } catch (PDOException $e) {
        error_log("Get conversation detail error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Bir hata oluştu']);
    }
    exit;
}
