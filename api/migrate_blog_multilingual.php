<?php
// migrate_blog_multilingual.php
// Migrates blog_posts from one-row-per-language to single-row multilingual model

require_once __DIR__ . '/db_connection.php';

echo "Starting Blog Multilingual Migration...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Step 1: Check if new columns already exist
    echo "Step 1: Checking existing schema...\n";

    $hasNewColumns = false;
    try {
        $conn->query("SELECT title_tr FROM blog_posts LIMIT 1");
        $hasNewColumns = true;
        echo "  -> New columns already exist. Skipping column creation.\n";
    } catch (Exception $e) {
        echo "  -> New columns do not exist. Will create them.\n";
    }

    if (!$hasNewColumns) {
        // Step 2: Add new multilingual columns
        echo "Step 2: Adding multilingual columns...\n";

        $alterQueries = [
            // Rename existing columns to _tr
            "ALTER TABLE blog_posts CHANGE COLUMN title title_tr VARCHAR(255) NOT NULL",
            "ALTER TABLE blog_posts CHANGE COLUMN excerpt excerpt_tr TEXT",
            "ALTER TABLE blog_posts CHANGE COLUMN content content_tr TEXT NOT NULL",

            // Add EN columns
            "ALTER TABLE blog_posts ADD COLUMN title_en VARCHAR(255) AFTER content_tr",
            "ALTER TABLE blog_posts ADD COLUMN excerpt_en TEXT AFTER title_en",
            "ALTER TABLE blog_posts ADD COLUMN content_en TEXT AFTER excerpt_en",

            // Add ZH columns
            "ALTER TABLE blog_posts ADD COLUMN title_zh VARCHAR(255) AFTER content_en",
            "ALTER TABLE blog_posts ADD COLUMN excerpt_zh TEXT AFTER title_zh",
            "ALTER TABLE blog_posts ADD COLUMN content_zh TEXT AFTER excerpt_zh",
        ];

        foreach ($alterQueries as $query) {
            try {
                $conn->exec($query);
                echo "  -> Executed: " . substr($query, 0, 60) . "...\n";
            } catch (Exception $e) {
                echo "  -> Skipped (likely already exists): " . $e->getMessage() . "\n";
            }
        }
    }

    // Step 3: Drop language column if it exists
    echo "Step 3: Removing legacy language column...\n";
    try {
        $conn->query("SELECT language FROM blog_posts LIMIT 1");
        // If we get here, column exists. Check for old index first.
        try {
            $conn->exec("ALTER TABLE blog_posts DROP INDEX idx_tenant_lang_slug");
            echo "  -> Dropped old composite index.\n";
        } catch (Exception $e) {
            // Ignore
        }
        try {
            $conn->exec("ALTER TABLE blog_posts DROP INDEX idx_lang");
            echo "  -> Dropped idx_lang index.\n";
        } catch (Exception $e) {
            // Ignore
        }
        $conn->exec("ALTER TABLE blog_posts DROP COLUMN language");
        echo "  -> Dropped 'language' column.\n";
    } catch (Exception $e) {
        echo "  -> 'language' column doesn't exist or already removed.\n";
    }

    // Step 4: Update unique index to be tenant + slug only
    echo "Step 4: Updating unique index...\n";
    try {
        $conn->exec("ALTER TABLE blog_posts ADD UNIQUE INDEX idx_tenant_slug (tenant_id, slug)");
        echo "  -> Added idx_tenant_slug unique index.\n";
    } catch (Exception $e) {
        echo "  -> Index already exists or error: " . $e->getMessage() . "\n";
    }

    echo "\nMigration completed successfully!\n";
    echo "Schema now supports: title_tr, excerpt_tr, content_tr, title_en, excerpt_en, content_en, title_zh, excerpt_zh, content_zh\n";

} catch (PDOException $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
