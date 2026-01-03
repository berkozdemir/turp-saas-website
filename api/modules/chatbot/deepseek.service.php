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
        return ['error' => 'DeepSeek API key yapılandırılmamış'];
    }

    if (empty($messages) || !is_array($messages)) {
        return ['error' => 'Geçersiz mesaj formatı'];
    }

    $data = [
        'model' => 'deepseek-chat',
        'messages' => $messages,
        'temperature' => $temperature,
        'max_tokens' => $max_tokens
    ];

    $ch = curl_init('https://api.deepseek.com/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $api_key
        ],
        CURLOPT_TIMEOUT => 60
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ['error' => 'Bağlantı hatası: ' . $error];
    }

    if ($http_code !== 200) {
        return ['error' => 'API hatası (HTTP ' . $http_code . ')'];
    }

    $result = json_decode($response, true);

    if (isset($result['choices'][0]['message']['content'])) {
        return [
            'success' => true,
            'content' => trim($result['choices'][0]['message']['content']),
            'usage' => $result['usage'] ?? null
        ];
    }

    return ['error' => 'Geçersiz API yanıtı'];
}

/**
 * Build system prompt for chatbot with RAG context
 *
 * @param array $rag_results RAG search results
 * @return string System prompt with context
 */
function build_chatbot_system_prompt($rag_results = [])
{
    $base_prompt = "Sen Omega Genetik için yardımsever ve dostane bir AI asistanısın. Omega Genetik, Türkiye'nin önde gelen NIPT (Non-Invasive Prenatal Test) ve genetik test şirketidir.

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

UYARI: Sen bilgilendirmek ve yönlendirmek için buradasın, teşhis koymak veya reçete yazmak için değil.";

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
