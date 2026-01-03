<?php
/**
 * Chatbot Public Controller
 * Handles public API endpoints for chatbot functionality
 */

require_once __DIR__ . '/../../core/tenant/public_resolver.php';
require_once __DIR__ . '/chatbot.service.php';

// Resolve tenant
$tenant = require_public_tenant();
$tenant_id = $tenant['id'];

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$data = $method === 'POST' ? json_decode(file_get_contents('php://input'), true) ?? [] : [];

/**
 * Start a new chatbot conversation
 * POST /api/index.php?action=chatbot_start
 *
 * Body: {
 *   email: string,
 *   name: string,
 *   phone: string (optional),
 *   context_type: 'podcast_hub' | 'podcast_detail',
 *   context_id: number (optional, podcast_id if detail page)
 * }
 */
if ($action === 'chatbot_start' && $method === 'POST') {
    $result = chatbot_start_conversation($tenant_id, $data);
    echo json_encode($result);
    exit;
}

/**
 * Send a message in existing conversation
 * POST /api/index.php?action=chatbot_send_message
 *
 * Body: {
 *   session_id: string,
 *   message: string
 * }
 */
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

/**
 * Get conversation history
 * GET /api/index.php?action=chatbot_get_history&session_id=xxx
 */
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
