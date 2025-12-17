#!/usr/bin/env node
/**
 * Blog Translation with OpenAI Chunking
 * Handles long content by splitting into chunks
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    user: process.env.DB_USER || 'turp_user',
    password: process.env.DB_PASS || 'turp_password',
    database: process.env.DB_NAME || 'turp_saas'
};

if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-proj-YOUR-ACTUAL-KEY-HERE') {
    console.error('❌ OPENAI_API_KEY gerekli!');
    process.exit(1);
}

console.log('\n🤖 OpenAI GPT-4 (Chunking Mode)\n');

// Split content into chunks by paragraphs
function chunkContent(content, maxChunkSize = 3000) {
    const paragraphs = content.split(/\n\n+/);
    const chunks = [];
    let currentChunk = '';

    for (const para of paragraphs) {
        // If adding this paragraph exceeds limit, save current chunk
        if ((currentChunk + para).length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = para;
        } else {
            currentChunk += (currentChunk ? '\n\n' : '') + para;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

// Translate a single chunk
async function translateChunk(text, targetLang, chunkIndex, totalChunks) {
    const langName = targetLang === 'en' ? 'English' : 'Simplified Chinese';

    const prompt = `Translate this medical/research text from Turkish to ${langName}.

CRITICAL RULES:
1. This is chunk ${chunkIndex + 1} of ${totalChunks}
2. Preserve ALL Markdown formatting (##, **, lists, tables)
3. Keep technical terms: ePRO, ICH-GCP, RWE, FDA, KVKK, e-Nabız, PROMIS, SF-36
4. Return ONLY the translated text (no explanations, no JSON)
5. Maintain medical accuracy and professional tone

Turkish Text:
${text}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: 'You are a professional medical/research translator.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 4000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Translate full content (chunked)
async function translateContent(content, targetLang) {
    const langName = targetLang === 'en' ? 'English' : 'Simplified Chinese';

    // If content is short, translate directly
    if (content.length < 3000) {
        console.log(`    📝 Tek parça (${content.length} char)...`);
        return await translateChunk(content, targetLang, 0, 1);
    }

    // Split into chunks
    const chunks = chunkContent(content);
    console.log(`    ℹ️  ${chunks.length} parçaya bölündü`);

    const translatedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
        console.log(`    📡 Parça ${i + 1}/${chunks.length} çevriliyor (${chunks[i].length} char)...`);
        const translated = await translateChunk(chunks[i], targetLang, i, chunks.length);
        translatedChunks.push(translated);

        // Rate limit delay
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return translatedChunks.join('\n\n');
}

// Translate title and excerpt (short)
async function translateShort(text, targetLang) {
    const langName = targetLang === 'en' ? 'English' : 'Simplified Chinese';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: `Translate from Turkish to ${langName}. Return only the translation.` },
                { role: 'user', content: text }
            ],
            temperature: 0.2,
            max_tokens: 500
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.replace(/["""]/g, '').trim();
}

async function main() {
    console.log('🌍 Blog Çeviri (Chunking Mode)...\n');

    let connection;

    try {
        console.log('📦 Veritabanına bağlanılıyor...');
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Bağlantı başarılı\n');

        const [posts] = await connection.execute(
            'SELECT id, title, content, excerpt, featured_image FROM iwrs_saas_blog_posts WHERE lang = ? OR lang IS NULL',
            ['tr']
        );

        console.log(`📝 ${posts.length} Türkçe yazı bulundu\n`);

        for (const post of posts) {
            console.log(`\n📄 "${post.title.substring(0, 50)}..."`);
            console.log(`   ℹ️  İçerik: ${post.content.length} karakter`);

            try {
                // Check existing translations by source_post_id (100% accurate!)
                const [existingEn] = await connection.execute(
                    'SELECT id FROM iwrs_saas_blog_posts WHERE source_post_id = ? AND lang = ?',
                    [post.id, 'en']
                );

                const [existingZh] = await connection.execute(
                    'SELECT id FROM iwrs_saas_blog_posts WHERE source_post_id = ? AND lang = ?',
                    [post.id, 'zh']
                );

                const needsEn = existingEn.length === 0;
                const needsZh = existingZh.length === 0;

                if (!needsEn && !needsZh) {
                    console.log('  ✅ Tüm çeviriler mevcut, atlanıyor...');
                    continue;
                }

                // English
                if (needsEn) {
                    console.log('  📝 İngilizce çevirisi başlıyor...');

                    const titleEn = await translateShort(post.title, 'en');
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const contentEn = await translateContent(post.content, 'en');
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const excerptEn = post.excerpt ? await translateShort(post.excerpt, 'en') : '';

                    await connection.execute(
                        'INSERT INTO iwrs_saas_blog_posts (title, content, excerpt, featured_image, status, lang, source_post_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                        [titleEn, contentEn, excerptEn, post.featured_image || null, 'published', 'en', post.id]
                    );
                    console.log(`  ✅ İngilizce kaydedildi (${contentEn.length} char)`);

                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log('  ⏭️  İngilizce zaten var');
                }

                // Chinese
                if (needsZh) {
                    console.log('  📝 Çince çevirisi başlıyor...');

                    const titleZh = await translateShort(post.title, 'zh');
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const contentZh = await translateContent(post.content, 'zh');
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const excerptZh = post.excerpt ? await translateShort(post.excerpt, 'zh') : '';

                    await connection.execute(
                        'INSERT INTO iwrs_saas_blog_posts (title, content, excerpt, featured_image, status, lang, source_post_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                        [titleZh, contentZh, excerptZh, post.featured_image || null, 'published', 'zh', post.id]
                    );
                    console.log(`  ✅ Çince kaydedildi (${contentZh.length} char)`);

                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log('  ⏭️  Çince zaten var');
                }

            } catch (error) {
                console.error(`  ❌ Hata: ${error.message}`);
                continue;
            }
        }

        console.log('\n\n🎉 TAM metin çevirisi tamamlandı!\n');

    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

main();
