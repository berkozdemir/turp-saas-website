#!/usr/bin/env node
/**
 * Translation Script - DeepSeek API ile otomatik çeviri
 * Kullanım: npm run translate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DeepSeek API Key (env'den alınacak)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'sk-your-key-here') {
    console.error('❌ DEEPSEEK_API_KEY environment variable gerekli!');
    console.log('📝 Önce .env dosyasına DeepSeek API key\'inizi ekleyin:');
    console.log('   DEEPSEEK_API_KEY=sk-xxxxx');
    console.log('\n💡 DeepSeek key almak için: https://platform.deepseek.com/');
    process.exit(1);
}

// i18n dosyasını oku
const i18nPath = path.join(__dirname, '../src/i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

// Türkçe translation objesini çıkar (regex ile)
const trMatch = i18nContent.match(/tr:\s*{\s*translation:\s*({[\s\S]*?})\s*},\s*\/\/ --- İNGİLİZCE/);
if (!trMatch) {
    console.error('❌ Türkçe translation bulunamadı!');
    process.exit(1);
}

const trTranslation = trMatch[1];
console.log('✅ Türkçe çeviriler yüklendi');

// DeepSeek API çağrısı
async function translateText(text, targetLang) {
    const langMap = {
        'English': 'en',
        'Simplified Chinese': 'zh'
    };

    console.log(`📡 ${targetLang} çevirisi için DeepSeek API çağrısı yapılıyor...`);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional translator specializing in technical and medical terminology. Translate the following JavaScript object from Turkish to ${targetLang}. 

RULES:
1. Preserve ALL keys exactly as they are (do not translate keys)
2. Only translate the string VALUES
3. Maintain the exact same structure and formatting
4. Keep technical terms like "ePRO", "ICH-GCP", "RWE", "FDA" unchanged
5. Preserve special characters and formatting (\\n, quotes, etc.)
6. Return ONLY the translated object, no explanations`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.2,
            max_tokens: 8000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let translatedContent = data.choices[0].message.content;

    // Markdown code block içindeyse çıkart
    if (translatedContent.includes('```')) {
        const match = translatedContent.match(/```(?:javascript|json)?\s*([\s\S]*?)```/);
        if (match) {
            translatedContent = match[1].trim();
        }
    }

    // JSON temizliği ve validasyonu
    try {
        // Parse edip tekrar stringify et (format düzeltme)
        const parsed = JSON.parse(translatedContent);
        translatedContent = JSON.stringify(parsed, null, 2);
    } catch (e) {
        console.warn(`  ⚠️  JSON parse hatası, düzeltme deneniyor...`);
        // Yaygın hataları düzelt
        translatedContent = translatedContent
            .replace(/(\w+)"/g, '"$1"')  // method_1_t" -> "method_1_t"
            .replace(/"(\w+):'"/g, '"$1": "'); // "key:'" -> "key": "
    }

    return translatedContent;
}

async function main() {
    console.log('\n🌍 Otomatik çeviri başlıyor...\n');

    try {
        // İngilizce çeviri
        console.log('📝 İngilizce çeviriliyor...');
        const enTranslation = await translateText(trTranslation, 'English');
        console.log('✅ İngilizce tamamlandı');

        // 2 saniye bekle (rate limit için)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Çince çeviri
        console.log('📝 Çince çeviriliyor...');
        const zhTranslation = await translateText(trTranslation, 'Simplified Chinese');
        console.log('✅ Çince tamamlandı');

        // Yeni i18n.ts dosyasını oluştur
        const newI18nContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- TÜRKÇE (TR) ---
  tr: {
    translation: ${trTranslation}
  },

  // --- İNGİLİZCE (EN) ---
  en: {
    translation: ${enTranslation}
  },

  // --- ÇİNCE (ZH) ---
  zh: {
    translation: ${zhTranslation}
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    ns: ["translation"],
    defaultNS: "translation",
    keySeparator: false,
    interpolation: { escapeValue: false }
  });

export default i18n;
`;

        // Yedek al
        const backupPath = i18nPath + '.backup';
        fs.copyFileSync(i18nPath, backupPath);
        console.log(`💾 Eski dosya yedeklendi: ${path.basename(backupPath)}`);

        // Yeni dosyayı yaz
        fs.writeFileSync(i18nPath, newI18nContent, 'utf8');
        console.log('✅ Yeni çeviriler kaydedildi!');
        console.log('\n🎉 Çeviri tamamlandı!\n');
        console.log('💡 Değişiklikleri görmek için: git diff src/i18n.ts');
        console.log('🔄 Frontend\'i yenileyerek test edin\n');

    } catch (error) {
        console.error('\n❌ Hata:', error.message);
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
            console.error('💡 API Key\'inizi kontrol edin: .env dosyasındaki DEEPSEEK_API_KEY');
        }
        process.exit(1);
    }
}

main();
