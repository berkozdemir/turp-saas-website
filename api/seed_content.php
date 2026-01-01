<?php
/**
 * Seed Demo Content Script
 * Populates Blog and FAQ tables with demo data for 'turp' tenant.
 */

require_once __DIR__ . '/config/db.php';

echo "Starting Content Seeding...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 1. Seed Blog Posts ---
    echo "Seeding Blog Posts...\n";
    $blog_count = $conn->query("SELECT COUNT(*) FROM blog_posts WHERE tenant_id = 'turp'")->fetchColumn();

    if ($blog_count == 0) {
        $stmt = $conn->prepare("INSERT INTO blog_posts (id, tenant_id, title_tr, content_tr, excerpt_tr, slug, status, created_at, published_at) VALUES (:id, :tenant_id, :title, :content, :excerpt, :slug, :status, NOW(), NOW())");

        $posts = [
            [
                'title' => 'Klinik Araştırmalarda Dijital Dönüşüm',
                'excerpt' => 'Sağlık sektöründe dijitalleşmenin klinik araştırmalara etkisi ve geleceği.',
                'content' => '<p>Klinik araştırmalar, teknolojinin gelişmesiyle birlikte büyük bir dönüşüm geçiriyor. Geleneksel yöntemlerin yerini alan dijital çözümler, veri kalitesini artırırken maliyetleri düşürüyor.</p><p>CT.TURP gibi platformlar, bu dönüşümün öncüsü olarak araştırmacılara ve sponsorlara büyük kolaylıklar sağlıyor.</p>',
                'slug' => 'klinik-arastirmalarda-dijital-donusum',
                'status' => 'published'
            ],
            [
                'title' => 'RWE (Gerçek Yaşam Verisi) Nedir?',
                'excerpt' => 'Real World Evidence kavramı ve modern tıptaki önemi.',
                'content' => '<p>RWE, klinik araştırmaların kontrollü ortamı dışında, gerçek yaşam koşullarında toplanan verilerin analiz edilmesiyle elde edilen kanıtlardır.</p><p>Bu veriler, ilaçların ve tedavilerin günlük hayattaki etkinliğini ve güvenliğini anlamak için kritik öneme sahiptir.</p>',
                'slug' => 'rwe-nedir',
                'status' => 'published'
            ]
        ];

        foreach ($posts as $i => $post) {
            $stmt->execute([
                ':id' => sprintf('demo-%d', $i),
                ':tenant_id' => 'turp',
                ':title' => $post['title'],
                ':content' => $post['content'],
                ':excerpt' => $post['excerpt'],
                ':slug' => $post['slug'],
                ':status' => $post['status']
            ]);
            echo "  -> Inserted post: {$post['title']}\n";
        }
    } else {
        echo "  -> Blog posts already exist ($blog_count entries). Skipping.\n";
    }

    // --- 2. Seed FAQs ---
    echo "Seeding FAQs...\n";
    // Check various table names just in case
    $faq_table = 'faqs';

    // Ensure table exists (final_migration should have fixed this, but safety first)

    $faq_count = $conn->query("SELECT COUNT(*) FROM $faq_table WHERE tenant_id = 1")->fetchColumn(); // Using ID 1 for turp default based on migration

    if ($faq_count == 0) {
        $stmt = $conn->prepare("INSERT INTO $faq_table (tenant_id, question_tr, answer_tr, category, is_active, sort_order) VALUES (:tenant_id, :question, :answer, :category, 1, :order)");

        $faqs = [
            [
                'question' => 'CT.TURP nedir?',
                'answer' => 'CT.TURP, klinik araştırmaların ve gerçek yaşam verisi (RWE) çalışmalarının dijital ortamda yönetilmesini sağlayan kapsamlı bir platformdur.',
                'category' => 'General',
                'order' => 1
            ],
            [
                'question' => 'Verilerim güvende mi?',
                'answer' => 'Evet, tüm verileriniz KVKK ve GDPR uyumlu sunucularda, uçtan uca şifreleme yöntemleri ile saklanmaktadır.',
                'category' => 'Security',
                'order' => 2
            ],
            [
                'question' => 'Entegrasyon süreçleri nasıl işliyor?',
                'answer' => 'Mevcut hastane bilgi yönetim sistemleri (HBYS) ve diğer klinik sistemlerle API tabanlı entegrasyonlar sağlıyoruz.',
                'category' => 'Technical',
                'order' => 3
            ]
        ];

        foreach ($faqs as $faq) {
            $stmt->execute([
                ':tenant_id' => 1,
                ':question' => $faq['question'],
                ':answer' => $faq['answer'],
                ':category' => $faq['category'],
                ':order' => $faq['order']
            ]);
            echo "  -> Inserted FAQ: {$faq['question']}\n";
        }
    } else {
        echo "  -> FAQs already exist ($faq_count entries). Skipping.\n";
    }

    echo "\nContent Seeding Completed Successfully!\n";

} catch (Exception $e) {
    echo "FATAL ERROR during seeding: " . $e->getMessage() . "\n";
    exit(1);
}
