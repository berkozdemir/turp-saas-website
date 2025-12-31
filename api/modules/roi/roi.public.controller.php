<?php
/**
 * ROI Settings Public Controller
 */
function handle_roi_public($action)
{
    if ($action === 'get_roi_settings') {
        global $conn;
        if (!isset($conn)) {
            $conn = get_db_connection();
        }

        try {
            $stmt = $conn->prepare("SELECT * FROM roi_settings LIMIT 1");
            $stmt->execute();
            $settings = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($settings) {
                // Convert numeric types
                foreach ($settings as $key => $value) {
                    if (is_numeric($value)) {
                        $settings[$key] = (float) $value;
                    }
                }
                echo json_encode(['success' => true, 'data' => $settings]);
            } else {
                echo json_encode(['success' => false, 'error' => 'ROI settings not found']);
            }
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to fetch ROI settings: ' . $e->getMessage()]);
            return true;
        }
    }
    return false;
}
