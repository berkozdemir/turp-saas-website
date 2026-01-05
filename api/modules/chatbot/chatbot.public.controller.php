<?php
/**
 * Chatbot Public Controller
 * Handles public API endpoints for chatbot functionality
 */

require_once __DIR__ . '/../../core/tenant/public_resolver.php';
require_once __DIR__ . '/chatbot.service.php';

/**
 * Handle chatbot public actions
 *
 * @param string $action Action name
 * @return bool True if action was handled
 */
function handle_chatbot_public(string $action): bool
{
    $chatbot_actions = [
        'chatbot_start',
        'chatbot_send_message',
        'chatbot_get_history'
    ];

    if (!in_array($action, $chatbot_actions)) {
        return false;
    }

    // Resolve tenant
    $tenant_id = get_current_tenant_code();

    if (!$tenant_id) {
        http_response_code(404);
        echo json_encode(['error' => 'Tenant not found']);
        return true;
    }

    // Get request method and data
    $method = $_SERVER['REQUEST_METHOD'];
    $data = $method === 'POST' ? json_decode(file_get_contents('php://input'), true) ?? [] : [];

    handle_chatbot_action($action, $method, $tenant_id, $data);
    return true;
}

/**
 * Handle individual chatbot action
 */
function handle_chatbot_action(string $action, string $method, string $tenant_id, array $data): void
{

    if ($action === 'chatbot_start' && $method === 'POST') {
        $result = chatbot_start_conversation($tenant_id, $data);
        echo json_encode($result);
        exit;
    }

    if ($action === 'chatbot_send_message' && $method === 'POST') {
        $session_id = $data['session_id'] ?? '';
        $message = $data['message'] ?? '';

        if (empty($session_id) || empty($message)) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID ve mesaj gereklidir']);
            exit;
        }

        $result = chatbot_send_message($tenant_id, $session_id, $message);
        echo json_encode($result);
        exit;
    }

    if ($action === 'chatbot_get_history' && $method === 'GET') {
        $session_id = $_GET['session_id'] ?? '';

        if (empty($session_id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID gereklidir']);
            exit;
        }

        $result = chatbot_get_history($tenant_id, $session_id);
        echo json_encode($result);
        exit;
    }
}
