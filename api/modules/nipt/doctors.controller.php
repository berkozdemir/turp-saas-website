<?php
// api/modules/nipt/doctors.controller.php

/**
 * Handle public doctor actions
 */
function handle_doctors_public($action)
{
    if ($action === 'get_doctors') {
        global $conn;
        if (!isset($conn))
            $conn = get_db_connection();

        try {
            // specialty removed, added clinic if needed, but let's stick to what exists
            $stmt = $conn->prepare("SELECT id, name, city, phone, email FROM doctors WHERE is_active = 1 ORDER BY name ASC");
            $stmt->execute();
            $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Return clean JSON
            echo json_encode($doctors);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch doctors']);
            return true;
        }
    }
    return false;
}
