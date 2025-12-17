# Otomatik Çeviri Sistemi

## Kullanım

Türkçe metinleri `src/i18n.ts` dosyasındaki `tr` bölümüne ekleyin.
Ardından otomatik çeviri için:

```bash
# DeepSeek API key'inizi environment variable olarak ekleyin
export DEEPSEEK_API_KEY="your_deepseek_api_key"

# Otomatik çeviriyi çalıştırın
npm run translate
```

## Nasıl Çalışır?

1. **Script**, `src/i18n.ts` dosyasındaki **Türkçe** metinleri okur
2. **DeepSeek API**'sine gönderir ve **İngilizce** + **Çince** çevirileri alır
3. Eski dosyanın yedeğini alır (`i18n.ts.backup`)
4. Yeni çevirileri `i18n.ts` dosyasına kaydeder

## Avantajlar

✅ **Tutarlı çeviriler** - AI her seferinde aynı terimleri kullanır
✅ **Hızlı** - Manuel çeviriden 100x hızlı
✅ **Ucuz** - DeepSeek çok uygun fiyatlı
✅ **Kolay** - Sadece Türkçe'yi düzenleyin, gerisini AI halleder

## Notlar

- Çeviri sonrasında **manuel kontrol** yapmanız önerilir
- Özel terimleri (ePRO, ICH-GCP vs.) düzeltmeniz gerekebilir
- Her çeviri yaklaşık **2-3 saniye** sürer

## Örnek Workflow

```bash
# 1. Türkçe metni düzenle
vim src/i18n.ts  # "nav_new_feature": "Yeni Özellik" ekle

# 2. Çeviriyi çalıştır
npm run translate

# 3. Kontrol et
git diff src/i18n.ts
```
