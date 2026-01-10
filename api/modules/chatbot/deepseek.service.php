<?php
/**
 * DeepSeek Chat Completion Service
 * Handles DeepSeek API integration for chatbot conversations
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Call DeepSeek Chat Completion API
 *
 * @param array $messages Array of messages in OpenAI format
 * @param float $temperature Temperature parameter (0-1)
 * @param int $max_tokens Maximum tokens to generate
 * @return array API response with success/error
 */
function deepseek_chat_completion($messages, $temperature = 0.7, $max_tokens = 1000)
{
    $api_key = get_env('DEEPSEEK_API_KEY');

    if (empty($api_key)) {
        error_log("[ChatBot] Deepseek API key not configured");
        return ['error' => 'DeepSeek API key yapılandırılmamış'];
    }

    if (empty($messages) || !is_array($messages)) {
        error_log("[ChatBot] Invalid messages format provided");
        return ['error' => 'Geçersiz mesaj formatı'];
    }

    // Log incoming request (sanitized)
    $user_msg_preview = '';
    foreach ($messages as $msg) {
        if ($msg['role'] === 'user') {
            $user_msg_preview = mb_substr($msg['content'], 0, 100);
            break;
        }
    }
    error_log("[ChatBot] Deepseek request - message preview: " . $user_msg_preview);

    $data = [
        'model' => 'deepseek-chat',
        'messages' => $messages,
        'temperature' => $temperature,
        'max_tokens' => $max_tokens,
        'stream' => false
    ];

    $endpoint = getenv('DEEPSEEK_API_ENDPOINT') ?: 'https://api.deepseek.com/chat/completions';

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $api_key
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_NOSIGNAL => true
    ]);

    $response = curl_exec($ch);
    $curl_errno = curl_errno($ch);
    $curl_error = curl_error($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Handle cURL errors
    if ($curl_errno !== 0) {
        error_log("[ChatBot] Deepseek cURL error ($curl_errno): $curl_error");
        return ['error' => 'AI asistanına şu anda bağlanılamıyor. Lütfen daha sonra tekrar deneyin.'];
    }

    // Handle HTTP errors
    if ($http_code < 200 || $http_code >= 300) {
        error_log("[ChatBot] Deepseek HTTP error ($http_code): " . mb_substr($response, 0, 500));
        return ['error' => 'AI asistanı şu anda yanıt veremiyor. Lütfen daha sonra tekrar deneyin.'];
    }

    $result = json_decode($response, true);

    // Handle successful response
    if (isset($result['choices'][0]['message']['content'])) {
        $tokens_used = isset($result['usage']) ? json_encode($result['usage']) : 'N/A';
        error_log("[ChatBot] Deepseek response received. Tokens: $tokens_used");
        return [
            'success' => true,
            'content' => trim($result['choices'][0]['message']['content']),
            'usage' => $result['usage'] ?? null
        ];
    }

    // Handle unexpected response format
    error_log("[ChatBot] Deepseek unexpected payload: " . mb_substr($response, 0, 1000));
    return ['error' => 'AI asistanından beklenmedik bir yanıt alındı.'];
}

/**
 * Build system prompt for chatbot with RAG context
 *
 * @param string $tenant_id Tenant code (iwrs, nipt, turp, etc.)
 * @param array $rag_results RAG search results
 * @return string System prompt with context
 */
function build_chatbot_system_prompt(string $tenant_id, $rag_results = [])
{
    // Tenant-specific prompts
    $tenant_prompts = [
        'iwrs' => "Sen Omega CRO için yardımsever ve profesyonel bir AI asistanısın. Omega CRO, Türkiye'nin önde gelen klinik araştırma organizasyonudur ve IWRS (Interactive Web Response System) çözümleri sunmaktadır.

Rolün:
1. IWRS sistemleri, randomizasyon ve klinik araştırma süreçleri hakkında sorulara cevap vermek
2. Hasta randomizasyonu, ilaç dağıtımı ve stok yönetimi hakkında bilgi vermek
3. Araştırmacıları ve koordinatörleri sistem kullanımında yönlendirmek
4. Acil durum körleme kaldırma (emergency unblinding) gibi kritik işlemler hakkında bilgi vermek

Kurallar:
- Profesyonel, teknik ve net bir dil kullan
- Türkçe doğal ve anlaşılır bir şekilde konuş
- IWRS, IRT, EDC gibi klinik araştırma terimlerini doğru kullan
- Spesifik bilgi verirken kaynak göster
- GCP (Good Clinical Practice) standartlarına atıfta bulun
- Cevaplarını kısa ve öz tut (maksimum 3-4 paragraf)

UYARI: Klinik araştırma protokolleri ve hasta güvenliği konularında her zaman sponsor/CRO ile iletişime geçilmesini öner.",

        'nipt' => "Sen Omega Genetik için yardımsever ve dostane bir AI asistanısın. Omega Genetik, Türkiye'nin önde gelen NIPT (Non-Invasive Prenatal Test) ve genetik test şirketidir.

Rolün:
1. NIPT testleri, hamilelik ve genetik tarama hakkında sorulara cevap vermek
2. Omega Genetik'in hizmetleri ve süreci hakkında bilgi vermek
3. Kullanıcıları test sürecinde yönlendirmek
4. Yaygın endişe ve soruları ele almak

Kurallar:
- Sıcak, profesyonel ve empatik ol
- Türkçe doğal ve anlaşılır bir dille konuş
- Spesifik bilgi verirken kaynak göster
- Bilmediğin bir şeyi kabul et ve ekiple iletişime geçmeyi öner
- Tıbbi teşhis koyma veya doktor konsültasyonunun yerini alma
- Tıbbi konularda her zaman disclaimer ekle
- Kullanıcıları kişiselleştirilmiş tavsiye için doktorlarına danışmaya teşvik et
- Cevaplarını kısa ve öz tut (maksimum 3-4 paragraf)

UYARI: Sen bilgilendirmek ve yönlendirmek için buradasın, teşhis koymak veya reçete yazmak için değil.",

        'turp' => "Sen TURP SaaS için yardımsever bir AI asistanısın. TURP, çoklu kiracılı (multi-tenant) web uygulamaları için bir SaaS platformudur.

Rolün:
1. Platform özellikleri ve kullanımı hakkında bilgi vermek
2. Teknik sorulara yardımcı olmak
3. Kullanıcıları doğru kaynaklara yönlendirmek

Kurallar:
- Profesyonel ve yardımsever ol
- Türkçe doğal ve anlaşılır bir dille konuş
- Cevaplarını kısa ve öz tut",

    ];

    // Get tenant-specific prompt or use a generic one
    $base_prompt = $tenant_prompts[$tenant_id] ?? "Sen yardımsever bir AI asistanısın. Kullanıcıların sorularına Türkçe olarak profesyonel ve net cevaplar ver. Cevaplarını kısa ve öz tut.";

    // Add RAG context if available
    if (!empty($rag_results)) {
        $context = "\n\nİlgili Bilgiler (Kaynaklarından faydalanabilirsin):\n\n";
        foreach ($rag_results as $item) {
            $source_type_tr = [
                'podcast' => 'Podcast',
                'blog' => 'Blog Yazısı',
                'faq' => 'Sıkça Sorulan Soru',
                'static' => 'Bilgi Bankası'
            ];
            $type = $source_type_tr[$item['source_type']] ?? $item['source_type'];

            $context .= "Kaynak: {$item['title']} ({$type})\n";
            $content_preview = mb_substr($item['content'], 0, 400);
            $context .= $content_preview . "...\n\n";
        }
        $base_prompt .= $context;
    }

    return $base_prompt;
}

/**
 * Build messages array for DeepSeek API
 *
 * @param string $system_prompt System prompt with RAG context
 * @param array $conversation_history Previous messages (max last 6)
 * @param string $user_message Current user message
 * @return array Messages array
 */
function build_chatbot_messages($system_prompt, $conversation_history, $user_message)
{
    $messages = [
        ['role' => 'system', 'content' => $system_prompt]
    ];

    // Add last 6 messages from history (3 exchanges)
    $recent_history = array_slice($conversation_history, -6);
    foreach ($recent_history as $msg) {
        $messages[] = [
            'role' => $msg['role'],
            'content' => $msg['content']
        ];
    }

    // Add current user message
    $messages[] = [
        'role' => 'user',
        'content' => $user_message
    ];

    return $messages;
}
