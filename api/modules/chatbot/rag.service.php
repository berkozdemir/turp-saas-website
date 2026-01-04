<?php
/**
 * Service: RAG Service (Retrieval-Augmented Generation)
 * Scope: API Internal
 * Description:
 *   - Handles vector search and context retrieval for the Chatbot.
 *   - Embeds podcast transcripts and documents for AI context.
 * Related:
 *   - Service: chatbot.service.php
 */

require_once __DIR__ . '/../../config/db.php';

/**
 * Search knowledge index with MySQL FULLTEXT
 *
 * @param int $tenant_id Tenant ID
 * @param string $query Search query
 * @param string $language Language code (default: 'tr')
 * @param int $limit Number of results (default: 5)
 * @return array Search results
 */
function rag_search($tenant_id, $query, $language = 'tr', $limit = 5)
{
    try {
        $conn = get_db_connection();

        // Escape query for FULLTEXT search
        $search_query = $conn->quote($query);

        $sql = "
            SELECT
                id,
                source_type,
                source_id,
                title,
                content,
                metadata,
                MATCH(title, content) AGAINST($search_query IN NATURAL LANGUAGE MODE) as relevance_score
            FROM chatbot_knowledge_index
            WHERE tenant_id = :tenant_id
              AND language = :language
              AND MATCH(title, content) AGAINST($search_query IN NATURAL LANGUAGE MODE)
            ORDER BY relevance_score DESC, updated_at DESC
            LIMIT :limit
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':tenant_id', $tenant_id, PDO::PARAM_INT);
        $stmt->bindValue(':language', $language, PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode metadata JSON
        foreach ($results as &$result) {
            if (!empty($result['metadata'])) {
                $result['metadata'] = json_decode($result['metadata'], true);
            }
        }

        return $results;
    } catch (PDOException $e) {
        error_log("RAG search error: " . $e->getMessage());
        return [];
    }
}

/**
 * Index a podcast episode
 *
 * @param int $tenant_id Tenant ID
 * @param int $podcast_id Podcast ID
 * @return bool Success status
 */
function rag_index_podcast($tenant_id, $podcast_id)
{
    try {
        $conn = get_db_connection();

        // Get podcast data
        $sql = "SELECT id, title, short_description, full_description, tags, slug, publish_date
                FROM podcasts
                WHERE tenant_id = :tenant_id AND id = :podcast_id AND status = 'published'";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':tenant_id' => $tenant_id, ':podcast_id' => $podcast_id]);
        $podcast = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$podcast) {
            return false;
        }

        // Build content for indexing
        $content = $podcast['title'] . "\n\n";
        if (!empty($podcast['short_description'])) {
            $content .= $podcast['short_description'] . "\n\n";
        }
        if (!empty($podcast['full_description'])) {
            // Strip HTML tags from full description
            $clean_description = strip_tags($podcast['full_description']);
            $content .= $clean_description;
        }

        $metadata = json_encode([
            'slug' => $podcast['slug'],
            'tags' => json_decode($podcast['tags'], true) ?? [],
            'publish_date' => $podcast['publish_date']
        ]);

        // Delete existing index for this podcast
        rag_clear_index($tenant_id, 'podcast', $podcast_id);

        // Insert new index
        $sql = "INSERT INTO chatbot_knowledge_index
                (tenant_id, source_type, source_id, title, content, language, metadata)
                VALUES (:tenant_id, 'podcast', :source_id, :title, :content, 'tr', :metadata)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':tenant_id' => $tenant_id,
            ':source_id' => $podcast_id,
            ':title' => $podcast['title'],
            ':content' => $content,
            ':metadata' => $metadata
        ]);

        return true;
    } catch (PDOException $e) {
        error_log("RAG index podcast error: " . $e->getMessage());
        return false;
    }
}

/**
 * Index a blog post
 *
 * @param int $tenant_id Tenant ID
 * @param int $blog_id Blog post ID
 * @return bool Success status
 */
function rag_index_blog($tenant_id, $blog_id)
{
    try {
        $conn = get_db_connection();

        // Get blog data
        $sql = "SELECT id, title_tr, excerpt_tr, content_tr, slug, published_at, category
                FROM blog_posts
                WHERE tenant_id = :tenant_id AND id = :blog_id AND status = 'published'";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':tenant_id' => $tenant_id, ':blog_id' => $blog_id]);
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$blog || empty($blog['title_tr'])) {
            return false;
        }

        // Build content
        $content = $blog['title_tr'] . "\n\n";
        if (!empty($blog['excerpt_tr'])) {
            $content .= $blog['excerpt_tr'] . "\n\n";
        }
        if (!empty($blog['content_tr'])) {
            $clean_content = strip_tags($blog['content_tr']);
            $content .= $clean_content;
        }

        $metadata = json_encode([
            'slug' => $blog['slug'],
            'category' => $blog['category'],
            'published_at' => $blog['published_at']
        ]);

        // Delete existing
        rag_clear_index($tenant_id, 'blog', $blog_id);

        // Insert new
        $sql = "INSERT INTO chatbot_knowledge_index
                (tenant_id, source_type, source_id, title, content, language, metadata)
                VALUES (:tenant_id, 'blog', :source_id, :title, :content, 'tr', :metadata)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':tenant_id' => $tenant_id,
            ':source_id' => $blog_id,
            ':title' => $blog['title_tr'],
            ':content' => $content,
            ':metadata' => $metadata
        ]);

        return true;
    } catch (PDOException $e) {
        error_log("RAG index blog error: " . $e->getMessage());
        return false;
    }
}

/**
 * Index a FAQ
 *
 * @param int $tenant_id Tenant ID
 * @param int $faq_id FAQ ID
 * @return bool Success status
 */
function rag_index_faq($tenant_id, $faq_id)
{
    try {
        $conn = get_db_connection();

        // Get FAQ data
        $sql = "SELECT id, question_tr, answer_tr, category
                FROM faqs
                WHERE tenant_id = :tenant_id AND id = :faq_id AND is_active = 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':tenant_id' => $tenant_id, ':faq_id' => $faq_id]);
        $faq = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$faq || empty($faq['question_tr'])) {
            return false;
        }

        // Build content
        $content = "Soru: " . $faq['question_tr'] . "\n\n";
        $content .= "Cevap: " . $faq['answer_tr'];

        $metadata = json_encode([
            'category' => $faq['category']
        ]);

        // Delete existing
        rag_clear_index($tenant_id, 'faq', $faq_id);

        // Insert new
        $sql = "INSERT INTO chatbot_knowledge_index
                (tenant_id, source_type, source_id, title, content, language, metadata)
                VALUES (:tenant_id, 'faq', :source_id, :title, :content, 'tr', :metadata)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':tenant_id' => $tenant_id,
            ':source_id' => $faq_id,
            ':title' => $faq['question_tr'],
            ':content' => $content,
            ':metadata' => $metadata
        ]);

        return true;
    } catch (PDOException $e) {
        error_log("RAG index FAQ error: " . $e->getMessage());
        return false;
    }
}

/**
 * Seed static content (NIPT info, company info, etc.)
 *
 * @param int $tenant_id Tenant ID
 * @param array $content_array Array of content items with 'title' and 'content'
 * @return int Number of items indexed
 */
function rag_seed_static($tenant_id, $content_array)
{
    try {
        $conn = get_db_connection();
        $count = 0;

        foreach ($content_array as $item) {
            if (empty($item['title']) || empty($item['content'])) {
                continue;
            }

            $metadata = json_encode([
                'type' => $item['type'] ?? 'general'
            ]);

            $sql = "INSERT INTO chatbot_knowledge_index
                    (tenant_id, source_type, source_id, title, content, language, metadata)
                    VALUES (:tenant_id, 'static', NULL, :title, :content, 'tr', :metadata)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':tenant_id' => $tenant_id,
                ':title' => $item['title'],
                ':content' => $item['content'],
                ':metadata' => $metadata
            ]);
            $count++;
        }

        return $count;
    } catch (PDOException $e) {
        error_log("RAG seed static error: " . $e->getMessage());
        return 0;
    }
}

/**
 * Clear index for specific source
 *
 * @param int $tenant_id Tenant ID
 * @param string $source_type Source type (podcast, blog, faq, static)
 * @param int|null $source_id Source ID (null for all static content)
 * @return bool Success status
 */
function rag_clear_index($tenant_id, $source_type, $source_id = null)
{
    try {
        $conn = get_db_connection();

        if ($source_id === null) {
            $sql = "DELETE FROM chatbot_knowledge_index
                    WHERE tenant_id = :tenant_id AND source_type = :source_type";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':tenant_id' => $tenant_id,
                ':source_type' => $source_type
            ]);
        } else {
            $sql = "DELETE FROM chatbot_knowledge_index
                    WHERE tenant_id = :tenant_id
                      AND source_type = :source_type
                      AND source_id = :source_id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':tenant_id' => $tenant_id,
                ':source_type' => $source_type,
                ':source_id' => $source_id
            ]);
        }

        return true;
    } catch (PDOException $e) {
        error_log("RAG clear index error: " . $e->getMessage());
        return false;
    }
}

/**
 * Reindex all content for a tenant
 *
 * @param int $tenant_id Tenant ID
 * @param array $source_types Array of source types to reindex
 * @return array Counts of indexed items
 */
function rag_reindex_all($tenant_id, $source_types = ['podcast', 'blog', 'faq'])
{
    $counts = [];

    try {
        $conn = get_db_connection();

        // Index podcasts
        if (in_array('podcast', $source_types)) {
            $sql = "SELECT id FROM podcasts WHERE tenant_id = :tenant_id AND status = 'published'";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':tenant_id' => $tenant_id]);
            $podcasts = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $count = 0;
            foreach ($podcasts as $podcast_id) {
                if (rag_index_podcast($tenant_id, $podcast_id)) {
                    $count++;
                }
            }
            $counts['podcast'] = $count;
        }

        // Index blogs
        if (in_array('blog', $source_types)) {
            $sql = "SELECT id FROM blog_posts WHERE tenant_id = :tenant_id AND status = 'published'";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':tenant_id' => $tenant_id]);
            $blogs = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $count = 0;
            foreach ($blogs as $blog_id) {
                if (rag_index_blog($tenant_id, $blog_id)) {
                    $count++;
                }
            }
            $counts['blog'] = $count;
        }

        // Index FAQs
        if (in_array('faq', $source_types)) {
            $sql = "SELECT id FROM faqs WHERE tenant_id = :tenant_id AND is_active = 1";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':tenant_id' => $tenant_id]);
            $faqs = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $count = 0;
            foreach ($faqs as $faq_id) {
                if (rag_index_faq($tenant_id, $faq_id)) {
                    $count++;
                }
            }
            $counts['faq'] = $count;
        }

        return $counts;
    } catch (PDOException $e) {
        error_log("RAG reindex all error: " . $e->getMessage());
        return $counts;
    }
}
