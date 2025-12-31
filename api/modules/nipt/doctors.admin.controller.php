<?php
// api/modules/nipt/doctors.admin.controller.php
// Admin endpoints for Doctor Management

require_once __DIR__ . '/../../core/auth/auth.middleware.php';

function handle_doctors_admin($action)
{
    global $conn;
    if (!isset($conn)) {
        $conn = get_db_connection();
    }

    // GET - List all doctors
    if ($action === 'admin_list_doctors' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        // All admin actions require authentication
        require_admin_context();

        try {
            $stmt = $conn->prepare("
                SELECT id, name, email, phone, city, clinic, notes, is_active, created_at, updated_at 
                FROM doctors 
                ORDER BY name ASC
            ");
            $stmt->execute();
            $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'data' => $doctors]);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch doctors: ' . $e->getMessage()]);
            return true;
        }
    }

    // POST - Create new doctor
    if ($action === 'admin_create_doctor' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        require_admin_context();

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validation
            if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['city'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields: name, email, phone, city']);
                return true;
            }

            // Check for duplicate email
            $checkStmt = $conn->prepare("SELECT id FROM doctors WHERE email = ?");
            $checkStmt->execute([$data['email']]);
            if ($checkStmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'Bu e-posta adresi zaten kayıtlı']);
                return true;
            }

            $stmt = $conn->prepare("
                INSERT INTO doctors (name, email, phone, city, clinic, notes, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
            ");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['phone'],
                $data['city'],
                $data['clinic'] ?? null,
                $data['notes'] ?? null
            ]);

            $id = $conn->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Doktor eklendi']);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create doctor: ' . $e->getMessage()]);
            return true;
        }
    }

    // PUT - Update doctor
    if ($action === 'admin_update_doctor' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
        require_admin_context();

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Doctor ID required']);
                return true;
            }

            $stmt = $conn->prepare("
                UPDATE doctors 
                SET name = ?, email = ?, phone = ?, city = ?, clinic = ?, notes = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['phone'],
                $data['city'],
                $data['clinic'] ?? null,
                $data['notes'] ?? null,
                $data['id']
            ]);

            echo json_encode(['success' => true, 'message' => 'Doktor güncellendi']);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update doctor: ' . $e->getMessage()]);
            return true;
        }
    }

    // DELETE - Soft delete doctor
    if ($action === 'admin_delete_doctor' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
        require_admin_context();

        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Doctor ID required']);
                return true;
            }

            $stmt = $conn->prepare("UPDATE doctors SET is_active = 0, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['success' => true, 'message' => 'Doktor silindi']);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete doctor: ' . $e->getMessage()]);
            return true;
        }
    }

    // POST - Bulk import from CSV
    if ($action === 'admin_import_doctors' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        require_admin_context();

        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $doctors = $data['doctors'] ?? [];

            if (empty($doctors)) {
                http_response_code(400);
                echo json_encode(['error' => 'No doctors to import']);
                return true;
            }

            $imported = 0;
            $errors = [];

            foreach ($doctors as $index => $doc) {
                if (empty($doc['name']) || empty($doc['email']) || empty($doc['phone']) || empty($doc['city'])) {
                    $errors[] = "Satır " . ($index + 1) . ": Eksik zorunlu alanlar";
                    continue;
                }

                // Check for duplicate email
                $checkStmt = $conn->prepare("SELECT id FROM doctors WHERE email = ?");
                $checkStmt->execute([$doc['email']]);
                if ($checkStmt->fetch()) {
                    $errors[] = "Satır " . ($index + 1) . ": E-posta zaten mevcut ({$doc['email']})";
                    continue;
                }

                $stmt = $conn->prepare("
                    INSERT INTO doctors (name, email, phone, city, clinic, notes, is_active, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
                ");
                $stmt->execute([
                    $doc['name'],
                    $doc['email'],
                    $doc['phone'],
                    $doc['city'],
                    $doc['clinic'] ?? null,
                    $doc['notes'] ?? null
                ]);
                $imported++;
            }

            echo json_encode([
                'success' => true,
                'imported' => $imported,
                'total' => count($doctors),
                'errors' => $errors
            ]);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Import failed: ' . $e->getMessage()]);
            return true;
        }
    }

    // GET - Export doctors as JSON (frontend converts to CSV)
    if ($action === 'admin_export_doctors' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        require_admin_context();

        try {
            $stmt = $conn->prepare("
                SELECT name, email, phone, city, clinic, notes 
                FROM doctors 
                WHERE is_active = 1 
                ORDER BY name ASC
            ");
            $stmt->execute();
            $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'data' => $doctors]);
            return true;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Export failed: ' . $e->getMessage()]);
            return true;
        }
    }

    return false;
}
