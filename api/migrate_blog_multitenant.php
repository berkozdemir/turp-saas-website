<?php
// migrate_blog_multitenant.php
require_once __DIR__ . '/db_connection.php';

echo "Starting Blog Multi-tenant Migration...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Add tenant_id
    echo "Checking tenant_id...\n";
    try {
        $conn->query("SELECT tenant_id FROM blog_posts LIMIT 1");
        echo "tenant_id already exists.\n";
    } catch (Exception $e) {
        echo "Adding tenant_id...\n";
        $conn->exec("ALTER TABLE blog_posts ADD COLUMN tenant_id VARCHAR(50) NOT NULL DEFAULT 'turp' AFTER id");
        $conn->exec("CREATE INDEX idx_blog_tenant ON blog_posts(tenant_id)");
    }

    // 2. Add language
    echo "Checking language...\n";
    try {
        $conn->query("SELECT language FROM blog_posts LIMIT 1");
        echo "language already exists.\n";
    } catch (Exception $e) {
        echo "Adding language...\n";
        $conn->exec("ALTER TABLE blog_posts ADD COLUMN language VARCHAR(10) NOT NULL DEFAULT 'tr' AFTER slug");
        $conn->exec("CREATE INDEX idx_blog_lang ON blog_posts(language)");
    }

    // 3. Fix Slug Uniqueness Scope
    // Currently slug is UNIQUE globally. We want UNIQUE(tenant_id, slug) or (tenant_id, language, slug).
    // Let's go with (tenant_id, slug) to keep URLs simple per tenant, or allow same slug in diff langs?
    // Usually /tr/blog/slug and /en/blog/slug => same slug OK if different ID? 
    // Actually, usually slug is unique per tenant.

    echo "Updating slug index...\n";
    try {
        // Try to drop existing simple unique index
        // Note: The constraint name for UNIQUE(slug) is typically 'slug' or 'idx_slug' depends on creation.
        // We will try dropping both common names using a procedure or just try-catch.

        // First check if index is just on slug
        // SHOW INDEX FROM blog_posts WHERE Key_name = 'slug'

        $conn->exec("ALTER TABLE blog_posts DROP INDEX slug");
        echo "Dropped index 'slug'.\n";
    } catch (Exception $e) {
        try {
            $conn->exec("ALTER TABLE blog_posts DROP INDEX idx_slug");
            echo "Dropped index 'idx_slug'.\n";
        } catch (Exception $e2) {
            echo "Index drop skipped (might not exist or different name): " . $e2->getMessage() . "\n";
        }
    }

    // Add composite unique index
    try {
        // We allow same slug for different languages? 
        // Example: /blog/hello (TR) and /blog/hello (EN). 
        // If the frontend URL is /blog/:slug, then we rely on current language to find the post.
        // So yes, slug + language + tenant should be unique.
        $conn->exec("ALTER TABLE blog_posts ADD UNIQUE INDEX idx_tenant_lang_slug (tenant_id, language, slug)");
        echo "Added composite unique index (tenant_id, language, slug).\n";
    } catch (Exception $e) {
        echo "Composite index addition skipped: " . $e->getMessage() . "\n";
    }

    echo "Migration completed successfully!\n";

} catch (PDOException $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
