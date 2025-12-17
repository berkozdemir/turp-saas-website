#!/usr/bin/env node
/**
 * Sitemap Generator for Turp Health
 * Generates sitemap.xml with all pages and blog posts
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://turp.health';
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    user: process.env.DB_USER || 'turp_user',
    password: process.env.DB_PASS || 'turp_password',
    database: process.env.DB_NAME || 'turp_saas'
};

// Static pages
const staticPages = [
    { path: '', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/blog', priority: 0.9, changefreq: 'daily' },
    { path: '/case-rheuma', priority: 0.7, changefreq: 'monthly' }
];

const languages = ['tr', 'en', 'zh'];

function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}

function escapeXml(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function generateSitemap() {
    console.log('🗺️  Sitemap oluşturuluyor...\n');

    let connection;
    const urls = [];

    try {
        // Database connection
        connection = await mysql.createConnection(DB_CONFIG);

        // Static pages (all languages)
        for (const page of staticPages) {
            for (const lang of languages) {
                const url = `${SITE_URL}/${lang}${page.path}`;
                urls.push({
                    loc: url,
                    lastmod: formatDate(new Date()),
                    changefreq: page.changefreq,
                    priority: page.priority,
                    alternates: languages.map(l => ({
                        lang: l,
                        url: `${SITE_URL}/${l}${page.path}`
                    }))
                });
            }
        }

        // Blog posts
        const [posts] = await connection.execute(
            'SELECT id, title, created_at, lang FROM iwrs_saas_blog_posts WHERE status = ?',
            ['published']
        );

        console.log(`📝 ${posts.length} blog yazısı bulundu\n`);

        // Group by Turkish original (assuming Turkish is the source)
        const postsByLang = {};
        posts.forEach(post => {
            if (!postsByLang[post.lang]) postsByLang[post.lang] = [];
            postsByLang[post.lang].push(post);
        });

        // Add blog post URLs
        if (postsByLang['tr']) {
            postsByLang['tr'].forEach(trPost => {
                const slug = trPost.title
                    .toLowerCase()
                    .replace(/[ğ]/g, 'g')
                    .replace(/[ü]/g, 'u')
                    .replace(/[ş]/g, 's')
                    .replace(/[ı]/g, 'i')
                    .replace(/[ö]/g, 'o')
                    .replace(/[ç]/g, 'c')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                for (const lang of languages) {
                    const url = `${SITE_URL}/${lang}/blog/${slug}`;
                    urls.push({
                        loc: url,
                        lastmod: formatDate(trPost.created_at),
                        changefreq: 'weekly',
                        priority: 0.6,
                        alternates: languages.map(l => ({
                            lang: l,
                            url: `${SITE_URL}/${l}/blog/${slug}`
                        }))
                    });
                }
            });
        }

        // Generate XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

        urls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;
            xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
            xml += `    <priority>${url.priority}</priority>\n`;

            // Hreflang alternates
            url.alternates.forEach(alt => {
                xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXml(alt.url)}" />\n`;
            });

            xml += '  </url>\n';
        });

        xml += '</urlset>';

        // Save to public directory
        const outputPath = path.join(__dirname, '../public/sitemap.xml');
        fs.writeFileSync(outputPath, xml, 'utf8');

        console.log(`✅ Sitemap oluşturuldu: ${outputPath}`);
        console.log(`📊 Toplam ${urls.length} URL eklendi\n`);

        // Generate robots.txt
        const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin
User-agent: *
Disallow: /admin
`;

        const robotsPath = path.join(__dirname, '../public/robots.txt');
        fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
        console.log(`✅ robots.txt oluşturuldu: ${robotsPath}\n`);

    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

generateSitemap();
