<?php
// Trombofili.com API Handler
// Handles thrombophilia screening specific logic

require_once __DIR__ . '/tenant_helper.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/email_service.php';

// Helper to validate Trombofili tenant
function validate_trombofili_tenant($conn)
{
    $tenant_id = get_current_tenant($conn);
    $stmt = $conn->prepare("SELECT code FROM tenants WHERE id = ?");
    $stmt->execute([$tenant_id]);
    $tenant = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tenant || ($tenant['code'] !== 'trombofili' && $tenant['code'] !== 'nipt')) {
        return $tenant_id;
    }
    return $tenant_id;
}

$action = $_GET['action'] ?? '';
$tenant_id = get_current_tenant($conn);

// 1. GET TESTS (Trombofili Specific)
if ($action == 'get_trombofili_tests') {
    $tests = [
        [
            'slug' => 'f5l',
            'name' => 'Factor V Leiden',
            'price' => 500,
            'description' => 'Genetic mutation causing increased thrombosis risk',
            'turnaround' => '5-7 days'
        ],
        [
            'slug' => 'panel',
            'name' => 'Comprehensive Thrombophilia Panel',
            'price' => 1500,
            'description' => 'Complete genetic screening for clotting disorders',
            'turnaround' => '7-10 days'
        ]
    ];
    echo json_encode(['success' => true, 'data' => $tests]);
    exit;
}

// 2. GET HEALTHCARE PROVIDERS
if ($action == 'get_healthcare_providers') {
    try {
        $stmt = $conn->prepare("SELECT id, name, specialty, hospital_clinic, discount_percent FROM healthcare_providers WHERE tenant_id = ? AND is_active = 1");
        $stmt->execute([$tenant_id]);
        $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $providers]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 3. CREATE BOOKING (Trombofili Logic)
if ($action == 'create_trombofili_booking' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['patient_name']) || empty($data['patient_phone'])) {
            throw new Exception("Name and phone are required");
        }

        // Create separate booking in trombofili_bookings
        $stmt = $conn->prepare("INSERT INTO trombofili_bookings 
            (tenant_id, patient_name, patient_email, patient_phone, patient_age, patient_gender, test_slug, collection_method, appointment_date, healthcare_provider_id, total_price, booking_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')");

        $stmt->execute([
            $tenant_id,
            $data['patient_name'],
            $data['patient_email'] ?? '',
            $data['patient_phone'],
            $data['patient_age'] ?? null,
            $data['patient_gender'] ?? null,
            $data['test_slug'] ?? 'panel',
            $data['collection_method'] ?? 'lab',
            $data['appointment_date'] ?? date('Y-m-d'), // Default to today if missing? Or null.
            $data['healthcare_provider_id'] ?? null,
            $data['total_price'] ?? 0
        ]);

        $booking_id = $conn->lastInsertId();

        // Handle Indication creation if provided
        if (!empty($data['indication_type'])) {
            $stmtInd = $conn->prepare("INSERT INTO test_indications (tenant_id, booking_id, indication_type, details) VALUES (?, ?, ?, ?)");
            $stmtInd->execute([
                $tenant_id,
                $booking_id,
                $data['indication_type'],
                $data['indication_details'] ?? ''
            ]);
            // Link back to booking if we strictly followed FKs, but we did foreign key one way. 
            // Actually schema has `indication_id` on bookings table. Using reverse update to link it?
            // Or just rely on `booking_id` in indications table. The schema had both?
            // Schema: `test_indications` has `booking_id`. `bookings` has `indication_id`. Circular. 
            // We'll stick to `test_indications` having `booking_id` for 1:N or 1:1.
        }

        echo json_encode(['success' => true, 'booking_id' => $booking_id, 'message' => 'Trombofili booking created']);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}
// 4. Admin: Get Trombofili Bookings
if ($action == 'get_trombofili_bookings') {
    try {
        $sql = "
            SELECT 
                b.*,
                t.name as tenant_name,
                i.indication_type
            FROM trombofili_bookings b
            JOIN tenants t ON b.tenant_id = t.id
            LEFT JOIN test_indications i ON b.indication_id = i.id
            WHERE t.code = 'trombofili'
        ";
        // Add search/filter logic if needed similar to nipt_api
        $sql .= " ORDER BY b.appointment_date DESC";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $bookings]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}
?>