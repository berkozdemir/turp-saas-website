# 🚀 Plesk Deployment Guide - Multi-Tenant Optimizations

Bu guide, Plesk ortamında dynamic multi-tenant yapısını aktive etmek ve deploy süresini optimize etmek için gerekli adımları içerir.

---

## 📋 Önkoşullar

- ✅ Plesk Panel Erişimi
- ✅ phpMyAdmin Erişimi (MariaDB)
- ✅ FTP/SFTP Erişimi
- ✅ GitHub Actions Secrets Yapılandırması
  - `FTP_SERVER`
  - `FTP_USERNAME`
  - `FTP_PASSWORD`

---

## 🗄️ 1. Veritabanı Migrasyonu (İLK ADIM)

### Adım 1.1: phpMyAdmin'e Giriş
1. Plesk Panel → **Veritabanları** → **phpMyAdmin**
2. Doğru veritabanını seç (örn: `turp_saas`, `omega_iwrs_db`)

### Adım 1.2: Migration Script'i Çalıştır
1. phpMyAdmin'de **SQL** sekmesine tıkla
2. `api/schema/PLESK_MIGRATION_2026_01.sql` dosyasının içeriğini kopyala
3. SQL sorgusuna yapıştır ve **Git** butonuna tıkla

### Adım 1.3: Sonuçları Doğrula

Migration başarılı olduysa şunları görmelisin:

```sql
-- Tenants tablosu yapısı
DESCRIBE tenants;
```

**Beklenen Kolonlar:**
- `id` (INT, PRIMARY KEY)
- `code` (VARCHAR(50), UNIQUE)
- `name` (VARCHAR(255))
- `primary_domain` (VARCHAR(255))
- `logo_url` (VARCHAR(500))
- `primary_color` (VARCHAR(7))
- `is_active` (BOOLEAN)
- **`allow_enduser_login`** (BOOLEAN) ← YENİ
- **`allow_enduser_signup`** (BOOLEAN) ← YENİ
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

```sql
-- Mevcut tenant'ları kontrol et
SELECT * FROM tenants;
```

**Beklenen Çıktı:**
```
+----+--------------+-------------+------------------+--------------+---------+-----------------------+------------------------+
| id | code         | name        | primary_domain   | primary_color| is_active| allow_enduser_login | allow_enduser_signup |
+----+--------------+-------------+------------------+--------------+---------+-----------------------+------------------------+
|  1 | turp         | Turp CRO    | ct.turp.health   | #6366f1      |       1 |                     0 |                      0 |
|  2 | iwrs         | Omega IWRS  | iwrs.com.tr      | #10b981      |       1 |                     1 |                      1 |
|  3 | omega_nipt   | Omega NIPT  | nipt.tr          | #2563EB      |       1 |                     0 |                      0 |
+----+--------------+-------------+------------------+--------------+---------+-----------------------+------------------------+
```

### Adım 1.4: Tenant Ayarlarını Güncelle (Opsiyonel)

Eğer bir tenant için end-user login/signup'ı aktive etmek istersen:

```sql
-- IWRS tenant için end-user auth aktif et
UPDATE tenants
SET allow_enduser_login = TRUE,
    allow_enduser_signup = TRUE
WHERE code = 'iwrs';
```

---

## 📦 2. Kod Deployment (GitHub Actions)

### Otomatik Deploy (Önerilen)

GitHub'a push yaptığınızda `.github/workflows/deploy.yml` otomatik çalışacak:

```bash
git add .
git commit -m "feat: Add dynamic multi-tenant support + deploy optimizations"
git push origin main
```

**Deploy Süresi Karşılaştırması:**
- ❌ Önce: ~5-9 dakika
- ✅ Sonra: **~2-3 dakika** (60% iyileştirme)

---

## 🧪 3. Production Test

### Test 3.1: Tenant API Kontrolü

Browser'da veya curl ile test et:

```bash
# Tüm tenant listesi
curl https://ct.turp.health/api/index.php?action=get_tenants

# Beklenen response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "turp",
      "name": "Turp CRO",
      "domain": "ct.turp.health",
      "color": "#6366f1",
      "logo": null
    },
    {
      "id": 2,
      "code": "iwrs",
      "name": "Omega IWRS",
      "domain": "iwrs.com.tr",
      "color": "#10b981",
      "logo": null
    }
  ]
}
```

```bash
# Domain'e göre tenant çek
curl "https://ct.turp.health/api/index.php?action=get_tenant_by_domain&domain=iwrs.com.tr"

# Beklenen response:
{
  "success": true,
  "data": {
    "id": 2,
    "code": "iwrs",
    "name": "Omega IWRS",
    "domain": "iwrs.com.tr",
    "color": "#10b981",
    "logo": null
  }
}
```

### Test 3.2: Frontend Cache Kontrolü

Site'yi aç ve browser console'da:

```javascript
// Tenant cache'i kontrol et
console.log(window.__TENANT_CODE_CACHE__);

// Beklenen çıktı:
{
  "ct.turp.health": "turp",
  "iwrs.com.tr": "iwrs",
  "nipt.tr": "omega_nipt"
}
```

### Test 3.3: Tenant Settings API

```bash
# IWRS domain'inden istek at
curl https://iwrs.com.tr/api/index.php?action=get_tenant_settings

# Beklenen response:
{
  "success": true,
  "tenant_id": "iwrs",
  "tenant_name": "Omega IWRS",
  "allow_enduser_login": true,
  "allow_enduser_signup": true
}
```

---

## 🔧 4. Troubleshooting

### Sorun 1: "Tenant not found" Hatası

**Çözüm:**
```sql
-- Tenant'ın var olduğunu doğrula
SELECT * FROM tenants WHERE code = 'iwrs';

-- Yoksa ekle:
INSERT INTO tenants (code, name, primary_domain, is_active)
VALUES ('iwrs', 'Omega IWRS', 'iwrs.com.tr', TRUE);
```

### Sorun 2: Kolonlar Eklenmiyor

**MariaDB sürümü <10.0.2 ise** `IF NOT EXISTS` desteklenmez:

```sql
-- Manuel kolon kontrolü
SHOW COLUMNS FROM tenants LIKE 'allow_enduser_login';

-- Empty set dönerse ekle:
ALTER TABLE tenants
ADD COLUMN allow_enduser_login BOOLEAN DEFAULT FALSE,
ADD COLUMN allow_enduser_signup BOOLEAN DEFAULT FALSE;
```

### Sorun 3: Cache Çalışmıyor

Browser console'da:

```javascript
// Cache'i manuel doldur
fetch('/api/index.php?action=get_tenants')
  .then(r => r.json())
  .then(data => {
    window.__TENANT_CODE_CACHE__ = {};
    data.data.forEach(t => {
      window.__TENANT_CODE_CACHE__[t.domain] = t.code;
    });
    console.log('Cache populated:', window.__TENANT_CODE_CACHE__);
  });
```

### Sorun 4: Deploy Hala Yavaş

`.github/workflows/deploy.yml` kontrol et:

```yaml
# Bu satırların olduğundan emin ol
set mirror:parallel-transfer-count 4;
set mirror:use-pget-n 4;
mirror -R ./dist/ / --parallel=4;
```

---

## 📊 5. Performans Metrikleri

### Build Performance

```bash
# Local test
npm run build

# Önceki süre: ~90-120s
# Yeni süre: ~40-50s
```

### Deploy Performance

GitHub Actions → **Actions** sekmesi → Son workflow'u kontrol et:

**Beklenen Süreler:**
- 📦 Install Dependencies: ~30s (cached)
- 🔨 Build Project: ~40s
- 🚀 Deploy via FTP: ~60s
- **TOPLAM: ~2.5 dakika**

---

## ✅ 6. Checklist

Deployment tamamlandıktan sonra:

- [ ] Migration script başarıyla çalıştı
- [ ] `tenants` tablosunda `allow_enduser_login` ve `allow_enduser_signup` kolonları var
- [ ] En az 3 tenant mevcut (turp, iwrs, omega_nipt)
- [ ] `/api/index.php?action=get_tenants` başarılı response veriyor
- [ ] Frontend cache `window.__TENANT_CODE_CACHE__` dolu
- [ ] Deploy süresi <3 dakika
- [ ] Her tenant için tenant settings API çalışıyor
- [ ] Production'da hata yok (browser console temiz)

---

## 🚀 7. Yeni Tenant Ekleme

Artık **kod değişikliği yapmadan** yeni tenant ekleyebilirsin:

### phpMyAdmin'de:

```sql
INSERT INTO tenants (code, name, primary_domain, primary_color, is_active, allow_enduser_login, allow_enduser_signup)
VALUES
('yeni_tenant', 'Yeni Tenant Adı', 'yeni-domain.com', '#FF5733', TRUE, FALSE, FALSE);
```

**O kadar!** Frontend otomatik olarak bu tenant'ı algılayacak.

---

## 📞 Destek

Sorun yaşıyorsan:

1. **Logs:** Browser console + Network tab + Plesk logs
2. **SQL Debug:** phpMyAdmin'de sorguları manuel çalıştır
3. **Cache:** Browser'ı hard refresh yap (Cmd+Shift+R / Ctrl+Shift+R)

---

**Son Güncelleme:** 2026-01-03
**Versiyon:** 1.0.0
