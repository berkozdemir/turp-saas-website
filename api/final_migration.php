<?php
/**
 * Final Migration Script
 * Resolves schema mismatches and naming inconsistencies for ROI, Blog, and FAQ.
 */

require_once __DIR__ . '/config/db.php';

echo "Starting Final Migration...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 1. FAQ Table ---
    echo "Processing 'faqs' table...\n";

    // Add missing columns
    $cols = [
        "tenant_id INT NOT NULL DEFAULT 1",
        "status ENUM('draft', 'published') DEFAULT 'published'",
        "question_en VARCHAR(500) NULL",
        "question_zh VARCHAR(500) NULL",
        "answer_en TEXT NULL",
        "answer_zh TEXT NULL"
    ];

    foreach ($cols as $col_def) {
        $col_name = explode(' ', trim($col_def))[0];
        try {
            $conn->query("SELECT $col_name FROM faqs LIMIT 1");
        } catch (Exception $e) {
            echo "  Adding column: $col_name\n";
            $conn->exec("ALTER TABLE faqs ADD COLUMN $col_def");
        }
    }

    // Rename question/answer to question_tr/answer_tr if needed by service
    // But wait, if service expects tr, let's just make sure both exist or rename.
    // The service uses question_tr, so let's rename.
    try {
        $conn->query("SELECT question_tr FROM faqs LIMIT 1");
    } catch (Exception $e) {
        echo "  Renaming question to question_tr...\n";
        $conn->exec("ALTER TABLE faqs CHANGE COLUMN question question_tr VARCHAR(500) NOT NULL");
        $conn->exec("ALTER TABLE faqs CHANGE COLUMN answer answer_tr TEXT NOT NULL");
    }

    // --- 2. Blog Posts Table ---
    echo "Processing 'blog_posts' table...\n";

    // Check if table exists (might be iwrs_saas_blog_posts)
    $stmt = $conn->query("SHOW TABLES LIKE 'blog_posts'");
    if ($stmt->rowCount() == 0) {
        $stmt2 = $conn->query("SHOW TABLES LIKE 'iwrs_saas_blog_posts'");
        if ($stmt2->rowCount() > 0) {
            echo "  Renaming 'iwrs_saas_blog_posts' to 'blog_posts'...\n";
            $conn->exec("RENAME TABLE iwrs_saas_blog_posts TO blog_posts");
        } else {
            echo "  Creating 'blog_posts' table...\n";
            // Create minimal table if missing
            $conn->exec("CREATE TABLE IF NOT EXISTS blog_posts (
                id CHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp',
                slug VARCHAR(255) NOT NULL,
                title_tr VARCHAR(255) NOT NULL,
                content_tr TEXT NOT NULL,
                status ENUM('draft', 'published') DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");
        }
    }

    // Ensure all multilingual columns exist
    $blog_cols = ["title_en", "excerpt_en", "content_en", "title_zh", "excerpt_zh", "content_zh"];
    foreach ($blog_cols as $c) {
        try {
            $conn->query("SELECT $c FROM blog_posts LIMIT 1");
        } catch (Exception $e) {
            echo "  Adding column: $c\n";
            $conn->exec("ALTER TABLE blog_posts ADD COLUMN $c TEXT NULL");
        }
    }

    // --- 3. ROI Settings ---
    echo "Processing 'roi_settings' table...\n";
    $stmt = $conn->query("SHOW TABLES LIKE 'roi_settings'");
    if ($stmt->rowCount() == 0) {
        echo "  Creating 'roi_settings' table...\n";
        $conn->exec("CREATE TABLE roi_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            cra_monthly_salary DECIMAL(15,2),
            cra_daily_expense DECIMAL(15,2),
            trad_cra_minutes INT,
            sdc_monthly_salary DECIMAL(15,2),
            trad_sdc_minutes INT,
            investigator_fee DECIMAL(15,2),
            exam_fee DECIMAL(15,2),
            patient_travel_fee DECIMAL(15,2),
            turp_daily_license DECIMAL(15,2),
            turp_cra_minutes INT,
            turp_sdc_minutes INT,
            usd_rate DECIMAL(15,2),
            eur_rate DECIMAL(15,2)
        )");
    }

    // Seed data if empty
    $count = $conn->query("SELECT COUNT(*) FROM roi_settings")->fetchColumn();
    if ($count == 0) {
        echo "  Seeding ROI settings...\n";
        $conn->exec("INSERT INTO roi_settings (id, created_at, cra_monthly_salary, cra_daily_expense, trad_cra_minutes, sdc_monthly_salary, trad_sdc_minutes, investigator_fee, exam_fee, patient_travel_fee, turp_daily_license, turp_cra_minutes, turp_sdc_minutes, usd_rate, eur_rate) 
                     VALUES (1, NOW(), 160000, 6000, 10, 120000, 45, 3000, 3000, 800, 69.99, 2, 15, 45, 50)");
    }

    echo "\nAll migrations completed safely!\n";

} catch (Exception $e) {
    echo "FATAL ERROR during migration: " . $e->getMessage() . "\n";
    exit(1);
}
