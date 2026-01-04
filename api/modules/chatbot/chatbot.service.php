<?php
/**
 * Service: Chatbot Service
 * Scope: Public / Admin API
 * Description:
 *   - Core logic for AI Chatbot interactions.
 *   - Manages conversation history, RAG integration, and message persistence.
 * Related:
 *   - Service: rag.service.php
 *   - Controller: chatbot.public.controller.php
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../services/email.service.php';
require_once __DIR__ . '/deepseek.service.php';
require_once __DIR__ . '/rag.service.php';

/**
 * Generate UUID v4
 *
 * @return string UUID
 */
function generate_uuid()
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}

/**
 * Start a new chatbot conversation
 */
function chatbot_start_conversation(int $tenant_id, array $data)
{
    try {
        $conn = get_db_connection();

        // Validate required fields
        $email = trim($data['email'] ?? '');
        $name = trim($data['name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $context_type = $data['context_type'] ?? 'podcast_hub';
        $context_id = $data['context_id'] ?? null;

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['error' => 'Geçerli bir e-posta adresi giriniz'];
        }

        if (empty($name)) {
            return ['error' => 'İsim gereklidir'];
        }

        // Generate session ID
        $session_id = generate_uuid();

        // Insert conversation
        $sql = "INSERT INTO chatbot_conversations
                (tenant_id, session_id, user_email, user_name, user_phone, context_type, context_id, message_count)
                VALUES (:tenant_id, :session_id, :email, :name, :phone, :context_type, :context_id, 0)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':tenant_id' => $tenant_id,
            ':session_id' => $session_id,
            ':email' => $email,
            ':name' => $name,
            ':phone' => $phone,
            ':context_type' => $context_type,
            ':context_id' => $context_id
        ]);

        $conversation_id = $conn->lastInsertId();

        // Save lead to contact_submissions
        chatbot_save_lead($tenant_id, $conversation_id, $context_id);

        // Send emails
        chatbot_send_confirmation_email($tenant_id, $name, $email, $phone, $context_type, $context_id);
        chatbot_send_admin_notification($tenant_id, $name, $email, $phone, $context_type, $context_id);

        return [
            'success' => true,
            'session_id' => $session_id,
            'conversation_id' => $conversation_id
        ];
    } catch (PDOException $e) {
        error_log("Chatbot start conversation error: " . $e->getMessage());
        return ['error' => 'Bir hata oluştu. Lütfen tekrar deneyin.'];
    }
}

/**
 * Send a message and get AI response
 */
function chatbot_send_message(int $tenant_id, string $session_id, string $message)
{
    try {
        $conn = get_db_connection();

        // Get conversation
        $sql = "SELECT id, context_type, context_id, message_count
                FROM chatbot_conversations
                WHERE tenant_id = :tenant_id AND session_id = :session_id AND status = 'active'";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':tenant_id' => $tenant_id, ':session_id' => $session_id]);
        $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conversation) {
            return ['error' => 'Geçersiz oturum'];
        }

        $conversation_id = $conversation['id'];

        // Validate message
        $message = trim($message);
        if (empty($message) || strlen($message) > 1000) {
            return ['error' => 'Mesaj 1-1000 karakter arası olmalıdır'];
        }

        // Save user message
        $sql = "INSERT INTO chatbot_messages (conversation_id, role, content)
                VALUES (:conversation_id, 'user', :content)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':conversation_id' => $conversation_id, ':content' => $message]);

        // Get conversation history
        $history = chatbot_get_history_array($conversation_id);

        // RAG search
        $rag_results = rag_search($tenant_id, $message, 'tr', 5);

        // Build DeepSeek prompt
        $system_prompt = build_chatbot_system_prompt($rag_results);
        $messages = build_chatbot_messages($system_prompt, $history, $message);

        // Call DeepSeek API
        $ai_response = deepseek_chat_completion($messages, 0.7, 800);

        if (isset($ai_response['error'])) {
            return ['error' => 'AI yanıt hatası: ' . $ai_response['error']];
        }

        $reply = $ai_response['content'];

        // Prepare sources for response
        $sources = [];
        foreach ($rag_results as $item) {
            $source = [
                'type' => $item['source_type'],
                'id' => $item['source_id'],
                'title' => $item['title']
            ];

            // Add URL if available
            if ($item['source_type'] === 'podcast' && !empty($item['metadata']['slug'])) {
                $source['url'] = '/podcast/' . $item['metadata']['slug'];
            } elseif ($item['source_type'] === 'blog' && !empty($item['metadata']['slug'])) {
                $source['url'] = '/blog/' . $item['metadata']['slug'];
            }

            $sources[] = $source;
        }

        // Save assistant message with metadata
        $metadata = json_encode([
            'sources' => $sources,
            'usage' => $ai_response['usage'] ?? null
        ]);

        $sql = "INSERT INTO chatbot_messages (conversation_id, role, content, metadata)
                VALUES (:conversation_id, 'assistant', :content, :metadata)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':conversation_id' => $conversation_id,
            ':content' => $reply,
            ':metadata' => $metadata
        ]);

        // Update conversation message count
        $sql = "UPDATE chatbot_conversations
                SET message_count = message_count + 2, last_message_at = CURRENT_TIMESTAMP
                WHERE id = :conversation_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':conversation_id' => $conversation_id]);

        return [
            'success' => true,
            'reply' => $reply,
            'sources' => $sources
        ];
    } catch (PDOException $e) {
        error_log("Chatbot send message error: " . $e->getMessage());
        return ['error' => 'Bir hata oluştu. Lütfen tekrar deneyin.'];
    }
}

/**
 * Get conversation history for display
 */
function chatbot_get_history(int $tenant_id, string $session_id)
{
    try {
        $conn = get_db_connection();

        // Get conversation
        $sql = "SELECT id FROM chatbot_conversations
                WHERE tenant_id = :tenant_id AND session_id = :session_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':tenant_id' => $tenant_id, ':session_id' => $session_id]);
        $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conversation) {
            return ['error' => 'Geçersiz oturum'];
        }

        $messages = chatbot_get_history_array($conversation['id'], true);

        return [
            'success' => true,
            'messages' => $messages
        ];
    } catch (PDOException $e) {
        error_log("Chatbot get history error: " . $e->getMessage());
        return ['error' => 'Bir hata oluştu'];
    }
}

/**
 * Get conversation history as array (internal use)
 *
 * @param int $conversation_id Conversation ID
 * @param bool $include_metadata Include metadata in response
 * @return array Messages array
 */
function chatbot_get_history_array(int $conversation_id, bool $include_metadata = false)
{
    try {
        $conn = get_db_connection();

        $sql = "SELECT role, content, metadata, created_at
                FROM chatbot_messages
                WHERE conversation_id = :conversation_id
                ORDER BY created_at ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':conversation_id' => $conversation_id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($include_metadata) {
            // Decode metadata and add sources
            foreach ($messages as &$msg) {
                if (!empty($msg['metadata'])) {
                    $metadata = json_decode($msg['metadata'], true);
                    $msg['sources'] = $metadata['sources'] ?? [];
                }
                unset($msg['metadata']);
            }
        }

        return $messages;
    } catch (PDOException $e) {
        error_log("Chatbot get history array error: " . $e->getMessage());
        return [];
    }
}

/**
 * Save lead to contact_submissions
 */
function chatbot_save_lead(int $tenant_id, int $conversation_id, ?int $context_id = null)
{
    try {
        $conn = get_db_connection();

        // Get conversation data
        $sql = "SELECT user_email, user_name, user_phone
                FROM chatbot_conversations
                WHERE id = :conversation_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':conversation_id' => $conversation_id]);
        $conv = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conv) {
            return false;
        }

        // Insert into contact_submissions
        $sql = "INSERT INTO contact_submissions
                (tenant_id, name, email, phone, message, source, chatbot_conversation_id, status)
                VALUES (:tenant_id, :name, :email, :phone, :message, 'chatbot', :conversation_id, 'new')";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':tenant_id' => $tenant_id,
            ':name' => $conv['user_name'],
            ':email' => $conv['user_email'],
            ':phone' => $conv['user_phone'] ?? '',
            ':message' => 'Chatbot üzerinden başlatılan görüşme',
            ':conversation_id' => $conversation_id
        ]);

        // Mark lead as saved
        $sql = "UPDATE chatbot_conversations SET lead_saved = 1 WHERE id = :conversation_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':conversation_id' => $conversation_id]);

        return true;
    } catch (PDOException $e) {
        error_log("Chatbot save lead error: " . $e->getMessage());
        return false;
    }
}

/**
 * Send confirmation email to user
 *
 * @param int $tenant_id Tenant ID
 * @param string $name User name
 * @param string $email User email
 * @param string $phone User phone
 * @param string $context_type Context type
 * @param int|null $context_id Context ID
 * @return void
 */
function chatbot_send_confirmation_email($tenant_id, $name, $email, $phone, $context_type, $context_id)
{
    $subject = "Mesajınız Alındı - Omega Genetik";

    $body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Omega Genetik</h2>
            </div>
            <div class='content'>
                <p>Merhaba <strong>{$name}</strong>,</p>
                <p>Chatbot üzerinden bizimle iletişime geçtiğiniz için teşekkür ederiz.</p>
                <p>Sorularınız en kısa sürede uzman ekibimiz tarafından değerlendirilecek ve size geri dönüş yapılacaktır.</p>
                <p><strong>İletişim Bilgileriniz:</strong></p>
                <ul>
                    <li>E-posta: {$email}</li>
                    <li>Telefon: {$phone}</li>
                </ul>
                <p>Acil sorularınız için bizi <a href='tel:+902125551234'>0212 555 12 34</a> numarasından arayabilirsiniz.</p>
            </div>
            <div class='footer'>
                <p>En iyi dileklerimizle,<br><strong>Omega Genetik Ekibi</strong></p>
                <p><a href='https://omegagenetik.com'>omegagenetik.com</a></p>
            </div>
        </div>
    </body>
    </html>
    ";

    $alt_body = "Merhaba {$name},\n\nChatbot üzerinden bizimle iletişime geçtiğiniz için teşekkür ederiz.\n\nE-posta: {$email}\nTelefon: {$phone}\n\nEn iyi dileklerimizle,\nOmega Genetik Ekibi";

    send_email($email, $subject, $body, $alt_body);
}

/**
 * Send notification email to admin
 *
 * @param int $tenant_id Tenant ID
 * @param string $name User name
 * @param string $email User email
 * @param string $phone User phone
 * @param string $context_type Context type
 * @param int|null $context_id Context ID
 * @return void
 */
function chatbot_send_admin_notification($tenant_id, $name, $email, $phone, $context_type, $context_id)
{
    // Get admin notification email from contact config or use default
    $admin_email = getenv('ADMIN_EMAIL') ?: 'info@omegagenetik.com';

    $context_text = $context_type === 'podcast_detail'
        ? "Podcast Detay Sayfası (ID: {$context_id})"
        : "Podcast Ana Sayfa";

    $subject = "Yeni Chatbot Lead - {$name}";

    $body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c5282; color: white; padding: 15px; }
            .content { padding: 20px; background: #fff; border: 1px solid #ddd; }
            .info-table { width: 100%; }
            .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
            .info-table td:first-child { font-weight: bold; width: 150px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h3>Yeni Chatbot Görüşmesi Başladı</h3>
            </div>
            <div class='content'>
                <table class='info-table'>
                    <tr>
                        <td>İsim:</td>
                        <td>{$name}</td>
                    </tr>
                    <tr>
                        <td>E-posta:</td>
                        <td>{$email}</td>
                    </tr>
                    <tr>
                        <td>Telefon:</td>
                        <td>{$phone}</td>
                    </tr>
                    <tr>
                        <td>Kaynak:</td>
                        <td>{$context_text}</td>
                    </tr>
                    <tr>
                        <td>Zaman:</td>
                        <td>" . date('d.m.Y H:i') . "</td>
                    </tr>
                </table>
                <p style='margin-top: 20px;'>
                    Admin panelinden chatbot görüşmelerini görüntüleyebilirsiniz.
                </p>
            </div>
        </div>
    </body>
    </html>
    ";

    $alt_body = "Yeni Chatbot Lead\n\nİsim: {$name}\nE-posta: {$email}\nTelefon: {$phone}\nKaynak: {$context_text}\nZaman: " . date('d.m.Y H:i');

    send_email($admin_email, $subject, $body, $alt_body);
}
