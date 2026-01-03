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
            $stmt = $conn->prepare("SELECT id, name, specialty, city, phone, email FROM doctors WHERE is_active = 1 ORDER BY name ASC");
            $stmt->execute();
            $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Return clean JSON
            echo json_encode($doctors); // Frontend expects array directly based on prompt, or object?
            // Prompt JS says: `const doctors = await response.json(); doctors.forEach...` -> Array
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to fetch doctors',
                'debug_message' => $e->getMessage()
            ]);
            return true;
        }
    }
    return false;
}
