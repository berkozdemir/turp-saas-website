<?php
require_once __DIR__ . '/../config/db.php';

echo "Running Podcast Preview Migration...\n";

try {
    $conn = get_db_connection();

    // Check if column exists first to avoid error spam
    $check = $conn->query("SHOW COLUMNS FROM podcasts LIKE 'preview_clip_url'");
    if ($check->rowCount() > 0) {
        echo "Column 'preview_clip_url' already exists. Skipping.\n";
    } else {
        $sql = "ALTER TABLE podcasts
                ADD COLUMN preview_clip_url VARCHAR(1024)
                COLLATE utf8mb4_unicode_ci
                DEFAULT NULL
                COMMENT '30 second preview for non-members'
                AFTER audio_url";

        $conn->exec($sql);
        echo "Successfully added 'preview_clip_url' column.\n";

        $conn->exec("CREATE INDEX idx_preview_clip ON podcasts(preview_clip_url)");
        echo "Successfully added index.\n";
    }

} catch (PDOException $e) {
    echo "Migration Failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "Done.\n";
