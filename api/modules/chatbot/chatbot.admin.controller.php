<?php
/**
 * Module: Chatbot Admin Controller
 * Endpoint: ?action=chatbot_admin_list, ?action=chatbot_admin_stats
 * Tenant: All (Admin Context)
 * Description:
 *   - Backend for managing chatbot logs and analytics.
 *   - Allows admin to view conversation history.
 * Related:
 *   - Service: chatbot.service.php
 */
/**
 * Chatbot Admin Controller
 * Handles admin API endpoints for chatbot management
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/chatbot.service.php';
require_once __DIR__ . '/rag.service.php';

/**
 * Handle chatbot admin actions
 *
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_chatbot_admin(string $action): bool
{
    $chatbot_actions = [
        'chatbot_reindex',
        'chatbot_get_conversations',
        'chatbot_get_conversation_detail'
    ];

    if (!in_array($action, $chatbot_actions)) {
        return false;
    }

    // Require admin authentication and tenant context
    $ctx = require_admin_context();
    $tenant_id = $ctx['tenant_id'];
    $user_id = $ctx['user_id'];

    // Get request method and data
    $method = $_SERVER['REQUEST_METHOD'];
    $data = $method === 'POST' ? json_decode(file_get_contents('php://input'), true) ?? [] : [];

    handle_chatbot_admin_action($action, $method, $tenant_id, $user_id, $data);
    return true;
}

/**
 * Handle individual chatbot admin action
 */
function handle_chatbot_admin_action(string $action, string $method, int $tenant_id, int $user_id, array $data): void
{

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

            // Get tenant info to determine which content to seed
            require_once __DIR__ . '/../../core/tenant/tenant.service.php';
            $tenant = get_tenant_by_id($tenant_id);
            $tenant_code = $tenant['code'] ?? '';

            // Determine static content based on tenant ID and code
            $static_content = [];

            // Check if this is the NIPT tenant (ID=3 or code='nipt')
            if ($tenant_id === 3 || $tenant_code === 'nipt') {
                // NIPT-focused content for nipt.tr
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
            } else {
                // Clinical trials-focused content for ct.turp.health (turp tenant, ID=1)
                $static_content = [
                    [
                        'title' => 'Klinik Araştırma Nedir?',
                        'type' => 'clinical_trial_info',
                        'content' => 'Klinik araştırmalar, yeni tedavi yöntemlerinin, ilaçların veya tıbbi cihazların güvenliğini ve etkinliğini test etmek için yapılan bilimsel çalışmalardır. Bu çalışmalar gönüllü katılımcılarla gerçekleştirilir ve tıbbi gelişmelerin temelini oluşturur. Klinik araştırmalar, hastalıkların daha iyi anlaşılmasını ve daha etkili tedavi seçeneklerinin geliştirilmesini sağlar. Tüm klinik araştırmalar, hasta güvenliğini ön planda tutan sıkı etik ve bilimsel kurallara tabidir.'
                    ],
                    [
                        'title' => 'Klinik Araştırmalara Nasıl Katılabilirim?',
                        'type' => 'participation_process',
                        'content' => 'Klinik araştırmalara katılım tamamen gönüllülük esasına dayanır. Katılmadan önce, araştırma hakkında detaylı bilgi verilir ve aydınlatılmış onam formu imzalanır. Katılım için uygun olup olmadığınız, belirli dahil edilme ve hariç tutulma kriterlerine göre değerlendirilir. Araştırma sürecinde düzenli kontroller yapılır ve sağlık durumunuz yakından takip edilir. Araştırmaya katılım sırasında veya sonrasında istediğiniz zaman çalışmadan ayrılma hakkına sahipsiniz.'
                    ],
                    [
                        'title' => 'Klinik Araştırmalara Kimler Katılabilir?',
                        'type' => 'eligibility',
                        'content' => 'Her klinik araştırmanın kendine özgü dahil edilme ve hariç tutulma kriterleri vardır. Bu kriterler yaş, cinsiyet, hastalık tipi ve evresi, önceki tedaviler ve genel sağlık durumu gibi faktörlere bağlı olabilir. Bazı çalışmalar yalnızca belirli bir hastalığı olan kişileri ararken, bazıları sağlıklı gönüllülerle yürütülür. Katılım uygunluğunuz araştırma ekibi tarafından yapılan kapsamlı bir değerlendirme sonucunda belirlenir. Web sitemizde mevcut araştırmaları ve uygunluk kriterlerini inceleyebilirsiniz.'
                    ],
                    [
                        'title' => 'TURP Research Platform Hakkında',
                        'type' => 'company_info',
                        'content' => 'TURP Research Platform, Türkiye\'de klinik araştırmaları yönetmek ve desteklemek için kurulmuş bir platformdur. Hastalar, araştırmacılar ve sponsorlar arasında köprü görevi görüyoruz. Platformumuz, devam eden ve planlanan klinik çalışmaları şeffaf bir şekilde sunar, katılımcı bulma sürecini kolaylaştırır ve araştırma süreçlerini dijitalleştirir. Amacımız, Türkiye\'de klinik araştırmaların kalitesini artırmak ve daha fazla hastanın yenilikçi tedavilere erişimini sağlamaktır.'
                    ],
                    [
                        'title' => 'Klinik Araştırmalarda Hasta Hakları',
                        'type' => 'patient_rights',
                        'content' => 'Klinik araştırmalara katılan hastalara özel haklar tanınmıştır. Bunlar arasında: Araştırma hakkında tam ve anlaşılır bilgi alma hakkı, aydınlatılmış onam verme hakkı, herhangi bir nedenle ve ceza olmaksızın çalışmadan ayrılma hakkı, kişisel verilerin gizliliği ve korunması hakkı, araştırma kaynaklı zararlar için tazminat hakkı ve sürekli tıbbi bakım hakkı yer almaktadır. Tüm haklarınız Helsinki Bildirgesi ve İyi Klinik Uygulamalar (ICH-GCP) rehberi ile korunmaktadır.'
                    ],
                    [
                        'title' => 'Devam Eden Klinik Çalışmalar',
                        'type' => 'ongoing_studies',
                        'content' => 'Platformumuzda onkoloji, kardiyoloji, nöroloji, romatoloji ve daha birçok alanda klinik çalışmalar devam etmektedir. Her çalışma için detaylı bilgi, amaç, süre, uygunluk kriterleri ve iletişim bilgileri web sitemizde mevcuttur. Aktif çalışmaları incelemek ve katılım başvurusu yapmak için araştırmalar bölümünü ziyaret edebilirsiniz. Yeni çalışmalardan haberdar olmak için bültenimize abone olabilirsiniz.'
                    ],
                    [
                        'title' => 'İletişim ve Başvuru',
                        'type' => 'contact',
                        'content' => 'Klinik araştırmalar hakkında daha fazla bilgi almak veya başvuru yapmak için bizimle iletişime geçebilirsiniz. Telefon: 0212 555 98 76, E-posta: info@turpresearch.com. Merkez Ofis: Maslak, İstanbul. Online başvuru formunu doldurarak katılmak istediğiniz çalışma için başvurunuzu yapabilirsiniz. Araştırma koordinatörlerimiz en kısa sürede sizinle iletişime geçecektir. Hafta içi 09:00-18:00 saatleri arasında hizmetinizdeyiz.'
                    ]
                ];
            }

            $static_count = rag_seed_static($tenant_id, $static_content);
            $counts['static'] = $static_count;
        }

        echo json_encode([
            'success' => true,
            'indexed_counts' => $counts
        ]);
        exit;
    }

    if ($action === 'chatbot_get_conversations' && $method === 'GET') {
        try {
            $conn = get_db_connection();

            $status = $_GET['status'] ?? 'all';
            $page = max(1, (int) ($_GET['page'] ?? 1));
            $limit = min(100, max(1, (int) ($_GET['limit'] ?? 20)));
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
                    'total' => (int) $total,
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

    if ($action === 'chatbot_get_conversation_detail' && $method === 'GET') {
        $conversation_id = (int) ($_GET['conversation_id'] ?? 0);

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
}
