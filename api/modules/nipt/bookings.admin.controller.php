<?php
/**
 * NIPT Bookings Admin Controller
 * Wrapper for legacy nipt.controller.php get_bookings action
 */

require_once __DIR__ . '/../../core/auth/auth.middleware.php';
require_once __DIR__ . '/../../config/db.php';

function handle_nipt_bookings_admin(string $action): bool
{
    $supported_actions = ['get_bookings', 'update_booking_status'];

    if (!in_array($action, $supported_actions)) {
        return false;
    }

    // Require admin auth for all booking actions
    $ctx = require_admin_context();
    $conn = get_db_connection();

    switch ($action) {
        case 'get_bookings':
            return nipt_get_bookings($conn);
        case 'update_booking_status':
            return nipt_update_booking_status($conn);
        default:
            return false;
    }
}

function nipt_get_bookings($conn): bool
{
    header('Content-Type: application/json');

    try {
        $status = $_GET['status'] ?? null;
        $date = $_GET['date'] ?? null;
        $search = $_GET['search'] ?? null;

        $sql = "
            SELECT 
                b.*,
                p.full_name as patient_name,
                p.phone as patient_phone,
                p.email as patient_email,
                pk.code as referral_code,
                pk.doctor_name as referrer_name,
                t.name as tenant_name
            FROM nipt_bookings b
            JOIN nipt_patients p ON b.patient_id = p.id
            JOIN tenants t ON b.tenant_id = t.id
            LEFT JOIN referral_codes pk ON b.referral_code_id = pk.id
            WHERE t.code IN ('momguard', 'verifi', 'veritas', 'westesti', 'nipt')
        ";

        $params = [];

        if ($status) {
            $sql .= " AND b.status = ?";
            $params[] = $status;
        }

        if ($date) {
            $sql .= " AND b.booking_date = ?";
            $params[] = $date;
        }

        if ($search) {
            $search_term = "%" . $search . "%";
            $sql .= " AND (p.full_name LIKE ? OR p.phone LIKE ? OR b.id LIKE ?)";
            $params[] = $search_term;
            $params[] = $search_term;
            $params[] = $search_term;
        }

        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;

        $sql .= " ORDER BY b.booking_date DESC, b.booking_time ASC LIMIT $limit OFFSET $offset";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $bookings]);
        return true;

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        return true;
    }
}

function nipt_update_booking_status($conn): bool
{
    header('Content-Type: application/json');

    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id']) || empty($data['status'])) {
            throw new Exception('ID and Status required');
        }

        $valid_statuses = ['pending', 'confirmed', 'sample_collected', 'in_lab', 'completed', 'cancelled'];
        if (!in_array($data['status'], $valid_statuses)) {
            throw new Exception('Invalid status');
        }

        $stmt = $conn->prepare("UPDATE nipt_bookings SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);

        echo json_encode(['success' => true, 'message' => 'Status updated']);
        return true;

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        return true;
    }
}
