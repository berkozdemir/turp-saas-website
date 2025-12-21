<?php
// IWRS API
// Handles Blog, Randomization, and Inventory endpoints

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/auth_helper.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = get_db_connection();
$request_method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? '';
$id = $_GET['id'] ?? null;

// Helper to generate UUID v4
function guidv4()
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Helper for JSON response
function json_response($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// --- BLOG POSTS ---
if ($resource === 'blog_posts') {
    // GET /api/iwrs_api.php?resource=blog_posts
    if ($request_method === 'GET') {
        if ($id) {
            // Get single post by ID or Slug
            $sql = "SELECT * FROM blog_posts WHERE id = ? OR slug = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id, $id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                json_response($post);
            } else {
                json_response(['error' => 'Post not found'], 404);
            }
        } else {
            // List posts
            // If admin, show all. If public, show only published.
            // Simplified: Public list always filters by published unless 'all' param is present (and authorized)

            $status_filter = "WHERE status = 'published'";
            // Check auth header for admin access to see drafts
            $headers = getallheaders();
            $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';

            if (!empty($auth_header)) {
                // Very basic check, proper auth_helper usage recommended for full security
                // For now, if authorized, showing all for admin dashboard
                $status_filter = "";
            }

            $sql = "SELECT * FROM blog_posts $status_filter ORDER BY created_at DESC";
            $stmt = $conn->query($sql);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_response($posts);
        }
    }

    // POST /api/iwrs_api.php?resource=blog_posts (Create)
    if ($request_method === 'POST') {
        $user = require_admin_auth($conn); // Protect this endpoint

        $data = json_decode(file_get_contents('php://input'), true);
        $uuid = guidv4();

        $sql = "INSERT INTO blog_posts (id, title, slug, content, excerpt, status, featured_image, seo_title, seo_description, seo_keywords, published_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $published_at = ($data['status'] === 'published') ? date('Y-m-d H:i:s') : null;

        try {
            $stmt->execute([
                $uuid,
                $data['title'],
                $data['slug'],
                $data['content'],
                $data['excerpt'] ?? null,
                $data['status'] ?? 'draft',
                $data['featured_image'] ?? null,
                $data['seo_title'] ?? null,
                $data['seo_description'] ?? null,
                $data['seo_keywords'] ?? null,
                $published_at
            ]);
            json_response(['id' => $uuid, 'message' => 'Blog post created'], 201);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }

    // PUT /api/iwrs_api.php?resource=blog_posts&id=UUID (Update)
    if ($request_method === 'PUT' && $id) {
        $user = require_admin_auth($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        $fields = [];
        $values = [];

        foreach (['title', 'slug', 'content', 'excerpt', 'status', 'featured_image', 'seo_title', 'seo_description', 'seo_keywords'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (isset($data['status']) && $data['status'] === 'published') {
            $fields[] = "published_at = IFNULL(published_at, NOW())";
        }

        if (empty($fields)) {
            json_response(['message' => 'No changes'], 200);
        }

        $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?";
        $values[] = $id;

        $stmt = $conn->prepare($sql);
        try {
            $stmt->execute($values);
            json_response(['message' => 'Blog post updated']);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }

    // DELETE /api/iwrs_api.php?resource=blog_posts&id=UUID
    if ($request_method === 'DELETE' && $id) {
        $user = require_admin_auth($conn);
        $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        json_response(['message' => 'Blog post deleted']);
    }
}

// --- RANDOMIZATION FORM ---
if ($resource === 'randomization') {
    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $uuid = guidv4();

        $sql = "INSERT INTO iwrs_randomizations (id, study_name, study_type, total_participants, treatment_arms, randomization_method, block_size, stratification_factors, blinding_type, reporting_preferences, contact_name, contact_email, institution)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        try {
            $stmt->execute([
                $uuid,
                $data['studyName'],
                $data['studyType'],
                $data['totalParticipants'],
                $data['treatmentArms'],
                $data['randomizationMethod'],
                $data['blockSize'] ?? null,
                $data['stratificationFactors'] ?? null,
                $data['blindingDetails'] ?? null,
                json_encode($data['reportingPreferences'] ?? []),
                $data['fullName'],
                $data['email'],
                $data['institution']
            ]);
            json_response(['id' => $uuid, 'message' => 'Form submitted successfully'], 201);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }
}

// --- CONTACT FORM ---
if ($resource === 'contact') {
    if ($request_method === 'POST') {
        // Mock success
        json_response(['message' => 'Message sent successfully']);
    }
}

// --- AI CHAT ---
if ($resource === 'ai-chat') {
    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        // Mock AI response
        json_response(['reply' => 'This is a mock AI response from the local PHP API. You said: ' . ($data['message'] ?? '')]);
    }
}

json_response(['error' => 'Resource not found'], 404);
