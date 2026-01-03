# Email Authentication Setup Instructions

## ✅ TAMAMLANAN İŞLER

Email doğrulama sistemi başarıyla kuruldu! Şu dosyalar oluşturuldu/güncellendi:

### Backend:
- ✅ `api/services/email.service.php` - Email gönderim servisi
- ✅ `api/templates/emails/verification.html` - Email template
- ✅ `api/modules/enduser_auth/enduser_auth.service.php` - Doğrulama akışı
- ✅ `api/modules/enduser_auth/enduser_auth.public.controller.php` - API endpoints

### Frontend:
- ✅ `src/pages/EmailVerification.tsx` - Email kontrol sayfası
- ✅ `src/pages/VerifyEmail.tsx` - Token doğrulama sayfası
- ✅ `src/hooks/useEndUserAuth.tsx` - Auth hook güncellemeleri
- ✅ `src/pages/EndUserLogin.tsx` - Unverified user kontrolü
- ✅ `src/pages/EndUserSignup.tsx` - Email verification redirect
- ✅ `src/App.tsx` - Route'lar eklendi

## 📋 KURULUM ADIMLARI

### 1. PHPMailer Kurulumu

Plesk üzerinden 2 yöntemden birini kullanabilirsiniz:

#### Yöntem A: Composer ile (Önerilen)
```bash
# SSH ile sunucuya bağlanın
cd /var/www/vhosts/yourdomain.com/httpdocs/api
composer require phpmailer/phpmailer
```

#### Yöntem B: Manuel Kurulum
1. PHPMailer'ı indirin: https://github.com/PHPMailer/PHPMailer/releases
2. `api/vendor/phpmailer/phpmailer/` klasörüne çıkartın
3. Veya Plesk File Manager kullanarak yükleyin

### 2. SMTP Ayarları

Plesk'te `.env` dosyası oluşturun veya `api/config/` klasöründe bir config dosyası:

**Seçenek 1: Environment Variables (.env)**

Plesk → Domains → yourdomain.com → PHP Settings → Additional configuration directives:

```
env[SMTP_HOST] = "smtp.gmail.com"
env[SMTP_PORT] = "587"
env[SMTP_USER] = "noreply@nipt.tr"
env[SMTP_PASS] = "your-app-password"
env[SMTP_FROM_EMAIL] = "noreply@nipt.tr"
env[SMTP_FROM_NAME] = "Omega Genetik"
env[APP_URL] = "https://nipt.tr"
```

**Seçenek 2: Config Dosyası (Daha Güvenli)**

`api/config/email.config.php` oluşturun:

```php
<?php
return [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_user' => 'noreply@nipt.tr',
    'smtp_pass' => 'your-app-password', // Gmail App Password kullanın
    'from_email' => 'noreply@nipt.tr',
    'from_name' => 'Omega Genetik',
    'app_url' => 'https://nipt.tr',
];
```

Sonra `api/services/email.service.php`'de `get_email_config()` fonksiyonunu güncelleyin:

```php
function get_email_config(): array
{
    $config_file = __DIR__ . '/../config/email.config.php';
    if (file_exists($config_file)) {
        return require $config_file;
    }

    // Fallback to environment variables
    return [
        'smtp_host' => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
        // ... rest of the config
    ];
}
```

### 3. Gmail App Password Oluşturma

Eğer Gmail kullanıyorsanız:

1. Google Account → Security → 2-Step Verification'ı aktifleştirin
2. 2-Step Verification → App passwords
3. "Mail" ve "Other (Custom name)" seçin
4. Oluşan 16 haneli şifreyi `SMTP_PASS` olarak kullanın

### 4. Veritabanı Kontrolü

Plesk → Databases → phpMyAdmin'de `endusers` tablosunu kontrol edin:

```sql
-- Gerekli kolonları kontrol et
DESCRIBE endusers;

-- email_verified ve verification_token kolonları olmalı
-- Yoksa şu komutları çalıştırın:

ALTER TABLE endusers
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(64) NULL;
```

### 5. Test Etme

1. **Kayıt Testi**:
   - `https://nipt.tr/signup` veya `https://yourdomain.com/signup`
   - Form doldurun ve kayıt olun
   - Email gelmeli

2. **Email Doğrulama**:
   - Email'deki linke tıklayın
   - Başarılı doğrulama mesajı görmeli

3. **Login Testi**:
   - Email doğrulamadan önce login dene → Hata görmeli
   - Email doğruladıktan sonra login → Başarılı olmalı

### 6. Debugging

Email gitmiyorsa, error log'ları kontrol edin:

**Plesk'te Log Kontrol:**
- Plesk → Domains → Logs → Error Log
- `/var/log/apache2/error.log` veya `/var/log/nginx/error.log`

**PHP Error Log:**
```bash
tail -f /var/log/php-fpm/error.log
```

**Email Service Debug:**

`api/services/email.service.php` içinde SMTP debug açın:

```php
$mail = new PHPMailer(true);
$mail->SMTPDebug = 2; // Detaylı debug
$mail->Debugoutput = function($str, $level) {
    error_log("SMTP Debug: $str");
};
```

## 🔒 Güvenlik Önerileri

1. **Email config dosyasını git'e eklemeyin:**
```bash
echo "api/config/email.config.php" >> .gitignore
```

2. **SSL/TLS kullanın:**
```php
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Port 587
// veya
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Port 465
```

3. **Rate limiting ekleyin** (opsiyonel):
- Çok fazla email gönderimini engelleyin
- IP başına saatlik limit koyun

## 📧 Alternatif SMTP Servisleri

Gmail yerine profesyonel servisler kullanabilirsiniz:

- **SendGrid**: Günde 100 email ücretsiz
- **Mailgun**: İlk 5000 email ücretsiz
- **Amazon SES**: Çok ucuz, güvenilir
- **Plesk Mail Server**: Kendi mail sunucunuz varsa

## 🎯 Sonraki Adımlar

Email doğrulama sistemi hazır! Şimdi şunları yapabilirsiniz:

1. ✅ Email sistemini test edin
2. 🔄 IWRS'i enduser_auth'a migrate edin
3. 🎵 Podcast 30-saniye preview sistemi ekleyin
4. 📊 Production'a deploy edin

## ❓ Sorun Giderme

### "PHPMailer class not found" hatası
```bash
cd api
composer install
```

### "Could not authenticate" hatası
- Gmail App Password kullanıyor musunuz?
- 2-Step Verification aktif mi?
- SMTP kullanıcı adı ve şifre doğru mu?

### "Connection timeout" hatası
- Sunucu firewall'u 587 veya 465 portuna izin veriyor mu?
- Plesk'te outgoing email gönderimi aktif mi?

### Email spam'e düşüyor
- SPF, DKIM, DMARC kayıtlarını ayarlayın
- Profesyonel SMTP servisi kullanın
- "noreply@yourdomain.com" gibi geçerli bir adres kullanın

## 📝 Notlar

- Email template'i özelleştirebilirsiniz: `api/templates/emails/verification.html`
- Farklı diller için template'ler ekleyebilirsiniz
- Email gönderim loglarını veritabanında saklayabilirsiniz
