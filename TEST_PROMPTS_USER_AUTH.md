# Test Prompts: Kullanıcı Authentication Sistemi

Bu dokümantasyon, Turp SaaS website için end-user authentication sistemini test etmek üzere kullanılabilecek test senaryolarını ve promptları içerir.

## Test Ortamı Bilgileri

**Base URL:** `http://localhost` (veya production URL)
**Tenant ID:** Test yaparken kullanılacak tenant ID'si

---

## 1. KULLANICI KAYIT (SIGNUP) TESTLERİ

### Test 1.1: Başarılı Kayıt
**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "name": "Test User",
  "phone": "+90 555 123 4567"
}
```

**Beklenen Sonuç:**
- Status: 200 OK
- Response içinde kullanıcı bilgileri ve verification token
- Email'e doğrulama linki gönderilmeli
- Kullanıcı durumu: `pending`
- `email_verified`: `false`

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Response'da `user_id` var mı?
- [ ] Email gönderildi mi?
- [ ] Veritabanında kullanıcı `pending` status ile kaydedildi mi?

---

### Test 1.2: Duplicate Email ile Kayıt
**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "testuser@example.com",
  "password": "AnotherPass123!",
  "name": "Another User",
  "phone": "+90 555 999 9999"
}
```

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: "Email already exists"

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Uygun hata mesajı verildi mi?

---

### Test 1.3: Zayıf Şifre ile Kayıt
**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "newuser@example.com",
  "password": "123",
  "name": "Weak Password User",
  "phone": "+90 555 111 2222"
}
```

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: Şifre minimum 6 karakter olmalı

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Şifre validasyon hatası döndü mü?

---

### Test 1.4: Eksik Alan ile Kayıt
**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "incomplete@example.com"
}
```

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: Required fields missing

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Uygun validasyon hatası döndü mü?

---

## 2. EMAIL DOĞRULAMA TESTLERİ

### Test 2.1: Başarılı Email Doğrulama
**Endpoint:** `GET /api/public/enduser_auth/enduser_verify_email?token=<verification_token>`

**URL Parametreleri:**
- `token`: Kayıt sırasında oluşturulan verification token

**Beklenen Sonuç:**
- Status: 200 OK
- Response: `{"message": "Email verified successfully", "user": {...}}`
- Kullanıcı durumu: `active`
- `email_verified`: `true`
- `verification_token`: `NULL`

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Kullanıcı active durumuna geçti mi?
- [ ] email_verified true oldu mu?
- [ ] verification_token silindi mi?

---

### Test 2.2: Geçersiz Token ile Doğrulama
**Endpoint:** `GET /api/public/enduser_auth/enduser_verify_email?token=invalid_token_123`

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: "Invalid or expired verification token"

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Uygun hata mesajı döndü mü?

---

### Test 2.3: Süresi Dolmuş Token ile Doğrulama
**Not:** Token'ların süresi 24 saat. Bu testi yapmak için veritabanında token'ın created_at tarihini 25 saat öncesine ayarlayın.

**Endpoint:** `GET /api/public/enduser_auth/enduser_verify_email?token=<expired_token>`

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: "Verification token has expired"

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Expire mesajı döndü mü?

---

### Test 2.4: Zaten Doğrulanmış Email
**Endpoint:** `GET /api/public/enduser_auth/enduser_verify_email?token=<token_of_verified_user>`

**Beklenen Sonuç:**
- Status: 400 Bad Request veya mesaj: "Email already verified"

**Kontrol Edilecekler:**
- [ ] Uygun mesaj döndü mü?
- [ ] Gereksiz işlem yapılmadı mı?

---

## 3. EMAIL DOĞRULAMA YENİDEN GÖNDERME TESTLERİ

### Test 3.1: Başarılı Resend Verification
**Endpoint:** `POST /api/public/enduser_auth/enduser_resend_verification`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "testuser@example.com"
}
```

**Beklenen Sonuç:**
- Status: 200 OK
- Response: `{"message": "Verification email sent successfully"}`
- Yeni email gönderilmeli
- Yeni verification token oluşturulmalı

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Email gönderildi mi?
- [ ] Yeni token oluşturuldu mu?

---

### Test 3.2: Zaten Doğrulanmış Email'e Resend
**Endpoint:** `POST /api/public/enduser_auth/enduser_resend_verification`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "verified@example.com"
}
```

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: "Email already verified"

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Uygun mesaj döndü mü?

---

### Test 3.3: Olmayan Email'e Resend
**Endpoint:** `POST /api/public/enduser_auth/enduser_resend_verification`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "nonexistent@example.com"
}
```

**Beklenen Sonuç:**
- Status: 404 Not Found
- Hata mesajı: "User not found"

**Kontrol Edilecekler:**
- [ ] HTTP 404 status code döndü mü?
- [ ] Uygun mesaj döndü mü?

---

## 4. KULLANICI GİRİŞ (LOGIN) TESTLERİ

### Test 4.1: Başarılı Login (Doğrulanmış Email)
**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 200 OK
- Response içinde `token`, `user` bilgileri
- Session oluşturulmalı (30 gün geçerli)
- `last_login` güncellenmiş olmalı

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Token döndü mü?
- [ ] User bilgileri doğru mu?
- [ ] Session veritabanına kaydedildi mi?
- [ ] last_login güncelendi mi?

---

### Test 4.2: Doğrulanmamış Email ile Login
**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "unverified@example.com",
  "password": "TestPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 403 Forbidden
- Hata mesajı: "Please verify your email before logging in"

**Kontrol Edilecekler:**
- [ ] HTTP 403 status code döndü mü?
- [ ] Email verification uyarısı verildi mi?
- [ ] Session oluşturulmadı mı?

---

### Test 4.3: Yanlış Şifre ile Login
**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "testuser@example.com",
  "password": "WrongPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 401 Unauthorized
- Hata mesajı: "Invalid email or password"

**Kontrol Edilecekler:**
- [ ] HTTP 401 status code döndü mü?
- [ ] Güvenli hata mesajı döndü mü? (email/şifre hangisinin yanlış olduğu belirtilmemeli)
- [ ] Session oluşturulmadı mı?

---

### Test 4.4: Olmayan Email ile Login
**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "nonexistent@example.com",
  "password": "AnyPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 401 Unauthorized
- Hata mesajı: "Invalid email or password"

**Kontrol Edilecekler:**
- [ ] HTTP 401 status code döndü mü?
- [ ] Güvenli hata mesajı döndü mü?

---

### Test 4.5: Disabled User ile Login
**Not:** Veritabanında bir kullanıcının status'ünü `disabled` yapın.

**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "disabled@example.com",
  "password": "TestPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 403 Forbidden
- Hata mesajı: "Account is disabled"

**Kontrol Edilecekler:**
- [ ] HTTP 403 status code döndü mü?
- [ ] Uygun mesaj döndü mü?

---

## 5. SESSION YÖNETİMİ TESTLERİ

### Test 5.1: Geçerli Token ile Current User Bilgisi Alma
**Endpoint:** `GET /api/public/enduser_auth/enduser_me`

**Headers:**
```
Authorization: Bearer <valid_token>
```

**Beklenen Sonuç:**
- Status: 200 OK
- Response: Kullanıcı bilgileri (şifre hariç)

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] User bilgileri doğru mu?
- [ ] Şifre response'da yok mu?

---

### Test 5.2: Geçersiz Token ile Current User Bilgisi
**Endpoint:** `GET /api/public/enduser_auth/enduser_me`

**Headers:**
```
Authorization: Bearer invalid_token_12345
```

**Beklenen Sonuç:**
- Status: 401 Unauthorized
- Hata mesajı: "Invalid or expired token"

**Kontrol Edilecekler:**
- [ ] HTTP 401 status code döndü mü?
- [ ] Uygun hata mesajı döndü mü?

---

### Test 5.3: Token Olmadan Current User Bilgisi
**Endpoint:** `GET /api/public/enduser_auth/enduser_me`

**Headers:**
```
(Authorization header yok)
```

**Beklenen Sonuç:**
- Status: 401 Unauthorized
- Hata mesajı: "No token provided"

**Kontrol Edilecekler:**
- [ ] HTTP 401 status code döndü mü?
- [ ] Uygun hata mesajı döndü mü?

---

### Test 5.4: Başarılı Logout
**Endpoint:** `POST /api/public/enduser_auth/enduser_logout`

**Headers:**
```
Authorization: Bearer <valid_token>
```

**Beklenen Sonuç:**
- Status: 200 OK
- Response: `{"message": "Logged out successfully"}`
- Session veritabanından silinmiş olmalı

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Session silindi mi?
- [ ] Aynı token ile tekrar istek yapıldığında 401 dönüyor mu?

---

## 6. ŞİFRE SIFIRLAMA/DEĞİŞTİRME TESTLERİ

**Not:** Mevcut sistemde end-user için şifre sıfırlama henüz implement edilmemiş görünüyor.
Sadece admin için şifre sıfırlama var. Bu feature'ı implement etmek gerekiyorsa, aşağıdaki test senaryoları kullanılabilir:

### Test 6.1: Şifre Sıfırlama İsteği (Forgot Password)
**Endpoint:** `POST /api/public/enduser_auth/forgot_password` (TO BE IMPLEMENTED)

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "testuser@example.com"
}
```

**Beklenen Sonuç:**
- Status: 200 OK
- Email'e reset link gönderilmeli
- Reset token oluşturulmalı (1 saat geçerli)

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Email gönderildi mi?
- [ ] Reset token oluşturuldu mu?

---

### Test 6.2: Reset Token Doğrulama
**Endpoint:** `GET /api/public/enduser_auth/verify_reset_token?token=<reset_token>` (TO BE IMPLEMENTED)

**Beklenen Sonuç:**
- Status: 200 OK
- Token geçerliyse başarı mesajı

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Token geçerli mi?

---

### Test 6.3: Yeni Şifre Belirleme
**Endpoint:** `POST /api/public/enduser_auth/reset_password` (TO BE IMPLEMENTED)

**Request Body:**
```json
{
  "token": "<reset_token>",
  "new_password": "NewTestPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 200 OK
- Şifre güncellenmiş olmalı
- Reset token used_at field'ı dolu olmalı
- Yeni şifre ile login yapılabilmeli

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Şifre güncellendi mi?
- [ ] Token kullanıldı olarak işaretlendi mi?
- [ ] Yeni şifre ile login çalışıyor mu?

---

### Test 6.4: Süresi Dolmuş Token ile Reset
**Endpoint:** `POST /api/public/enduser_auth/reset_password` (TO BE IMPLEMENTED)

**Request Body:**
```json
{
  "token": "<expired_reset_token>",
  "new_password": "NewPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: "Reset token has expired"

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Expire mesajı döndü mü?

---

### Test 6.5: Kullanılmış Token ile Reset
**Endpoint:** `POST /api/public/enduser_auth/reset_password` (TO BE IMPLEMENTED)

**Request Body:**
```json
{
  "token": "<already_used_reset_token>",
  "new_password": "AnotherPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 400 Bad Request
- Hata mesajı: "Reset token already used"

**Kontrol Edilecekler:**
- [ ] HTTP 400 status code döndü mü?
- [ ] Uygun mesaj döndü mü?

---

## 7. TENANT AYARLARI TESTLERİ

### Test 7.1: Tenant Auth Ayarlarını Görüntüleme
**Endpoint:** `GET /api/public/enduser_auth/tenant_settings/<tenant_id>`

**Beklenen Sonuç:**
- Status: 200 OK
- Response: `{"signup_enabled": true/false, "login_enabled": true/false}`

**Kontrol Edilecekler:**
- [ ] HTTP 200 status code döndü mü?
- [ ] Ayarlar doğru mu?

---

### Test 7.2: Signup Disabled Tenant'ta Kayıt Denemesi
**Not:** Admin panelinden tenant'ın signup_enabled ayarını false yapın.

**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Request Body:**
```json
{
  "tenant_id": "signup-disabled-tenant",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "name": "Test User"
}
```

**Beklenen Sonuç:**
- Status: 403 Forbidden
- Hata mesajı: "Signup is disabled for this tenant"

**Kontrol Edilecekler:**
- [ ] HTTP 403 status code döndü mü?
- [ ] Uygun mesaj döndü mü?

---

### Test 7.3: Login Disabled Tenant'ta Login Denemesi
**Not:** Admin panelinden tenant'ın login_enabled ayarını false yapın.

**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "login-disabled-tenant",
  "email": "existing@example.com",
  "password": "TestPassword123!"
}
```

**Beklenen Sonuç:**
- Status: 403 Forbidden
- Hata mesajı: "Login is disabled for this tenant"

**Kontrol Edilecekler:**
- [ ] HTTP 403 status code döndü mü?
- [ ] Uygun mesaj döndü mü?

---

## 8. GÜVENLİK TESTLERİ

### Test 8.1: SQL Injection Denemesi
**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "admin@example.com' OR '1'='1",
  "password": "anything"
}
```

**Beklenen Sonuç:**
- Status: 401 Unauthorized
- SQL injection başarısız olmalı

**Kontrol Edilecekler:**
- [ ] SQL injection koruması çalışıyor mu?
- [ ] Unauthorized döndü mü?

---

### Test 8.2: XSS Denemesi (Name Field)
**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "xsstest@example.com",
  "password": "TestPassword123!",
  "name": "<script>alert('XSS')</script>"
}
```

**Beklenen Sonuç:**
- Kayıt başarılı olabilir ama script sanitize edilmeli
- Response'da script çalıştırılmamalı

**Kontrol Edilecekler:**
- [ ] XSS koruması var mı?
- [ ] Script sanitize edildi mi?

---

### Test 8.3: Rate Limiting (Çok Fazla Login Denemesi)
**Endpoint:** `POST /api/public/enduser_auth/enduser_login`

**Senaryo:** Aynı IP'den 10+ kez yanlış şifre ile login dene

**Beklenen Sonuç:**
- Belirli bir deneme sayısından sonra rate limit devreye girmeli
- Status: 429 Too Many Requests

**Kontrol Edilecekler:**
- [ ] Rate limiting çalışıyor mu?
- [ ] 429 status code döndü mü?

---

### Test 8.4: Password Hash Kontrolü
**Manuel Test:** Veritabanında password_hash field'ına bak

**Kontrol Edilecekler:**
- [ ] Şifreler plain text değil mi?
- [ ] BCRYPT hash kullanılıyor mu? ($2y$ ile başlamalı)
- [ ] Her kullanıcının hash'i farklı mı? (aynı şifre bile farklı hash'lenmeli)

---

## 9. EMAIL GÖNDERİM TESTLERİ

### Test 9.1: Verification Email İçeriği
**Manuel Test:** Kayıt ol ve gelen email'i kontrol et

**Kontrol Edilecekler:**
- [ ] Email geldi mi?
- [ ] Doğrulama linki çalışıyor mu?
- [ ] HTML template düzgün görünüyor mu?
- [ ] Tenant bilgisi doğru mu?

---

### Test 9.2: Email Gönderim Hatası
**Not:** Email servisini geçici olarak devre dışı bırak (SMTP ayarlarını yanlış yap)

**Endpoint:** `POST /api/public/enduser_auth/enduser_signup`

**Beklenen Sonuç:**
- Kayıt başarılı olmalı ama email gönderilemedi uyarısı verilebilir
- Veya email gönderimi retry edilmeli

**Kontrol Edilecekler:**
- [ ] Kullanıcı kaydedildi mi?
- [ ] Email hatası loglandi mı?
- [ ] User'a uygun feedback verildi mi?

---

## 10. FRONTEND ENTEGRASYON TESTLERİ

### Test 10.1: useEndUserAuth Hook - Signup Flow
**Test Senaryosu:**
1. `/signup` sayfasına git
2. Email, şifre, ad, telefon gir
3. "Sign Up" butonuna tıkla
4. Email verification sayfasına yönlendir

**Kontrol Edilecekler:**
- [ ] Form validation çalışıyor mu?
- [ ] API çağrısı başarılı mı?
- [ ] Yönlendirme doğru mu?
- [ ] Hata mesajları gösteriliyor mu?

---

### Test 10.2: useEndUserAuth Hook - Login Flow
**Test Senaryosu:**
1. `/login` sayfasına git
2. Email ve şifre gir
3. "Login" butonuna tıkla
4. Dashboard'a yönlendir

**Kontrol Edilecekler:**
- [ ] API çağrısı başarılı mı?
- [ ] Token localStorage'a kaydedildi mi?
- [ ] Auth context güncellendi mi?
- [ ] Yönlendirme doğru mu?

---

### Test 10.3: useEndUserAuth Hook - Email Verification Flow
**Test Senaryosu:**
1. Email'den verification link'e tıkla
2. `/verify-email?token=xxx` sayfası açılır
3. Email doğrulanır
4. Login sayfasına yönlendir

**Kontrol Edilecekler:**
- [ ] Token URL'den alındı mı?
- [ ] API çağrısı başarılı mı?
- [ ] Success mesajı gösterildi mi?
- [ ] Yönlendirme doğru mu?

---

### Test 10.4: useEndUserAuth Hook - Logout Flow
**Test Senaryosu:**
1. Login olmuş kullanıcı ile dashboard'da ol
2. "Logout" butonuna tıkla
3. Login sayfasına yönlendir

**Kontrol Edilecekler:**
- [ ] API çağrısı yapıldı mı?
- [ ] Token localStorage'dan silindi mi?
- [ ] Auth context temizlendi mi?
- [ ] Yönlendirme doğru mu?

---

## 11. EDGE CASE TESTLERİ

### Test 11.1: Aynı Email Farklı Tenant'larda
**Senaryo:** Aynı email'i farklı tenant_id'ler ile kaydet

**Beklenen Sonuç:**
- Her iki kayıt da başarılı olmalı
- Tenant isolation çalışmalı

**Kontrol Edilecekler:**
- [ ] Her iki kullanıcı da oluşturuldu mu?
- [ ] Login yaparken doğru tenant'a gidiyor mu?

---

### Test 11.2: Çok Uzun Email/Name
**Request Body:**
```json
{
  "tenant_id": "test-tenant",
  "email": "verylongemailaddressverylongemailaddressverylongemailaddress@example.com",
  "password": "TestPassword123!",
  "name": "Very Long Name That Exceeds Normal Character Limit Very Long Name That Exceeds Normal Character Limit Very Long Name That Exceeds Normal Character Limit"
}
```

**Kontrol Edilecekler:**
- [ ] Validasyon var mı?
- [ ] Veritabanı field limitleri aşılmadı mı?

---

### Test 11.3: Concurrent Login Denemeleri
**Senaryo:** Aynı kullanıcı ile aynı anda birden fazla cihazdan login ol

**Kontrol Edilecekler:**
- [ ] Multiple session oluşturulabilir mi?
- [ ] Her session bağımsız mı?
- [ ] Logout bir session'ı diğerlerini etkilemiyor mu?

---

## 12. PERFORMANS TESTLERİ

### Test 12.1: Toplu Kullanıcı Kaydı
**Senaryo:** 100 kullanıcı kaydet (script ile)

**Kontrol Edilecekler:**
- [ ] Tüm kayıtlar başarılı mı?
- [ ] Response time makul mü? (<500ms ideal)
- [ ] Email servisinde tıkanma var mı?

---

### Test 12.2: Session Token Doğrulama Performansı
**Senaryo:** 1000 istek yap (valid token ile)

**Kontrol Edilecekler:**
- [ ] Her istek başarılı mı?
- [ ] Response time tutarlı mı?
- [ ] Database connection pool yeterli mi?

---

## TEST OTOMASYONU ÖRNEĞİ (cURL)

```bash
#!/bin/bash

BASE_URL="http://localhost/api/public/enduser_auth"
TENANT_ID="test-tenant"

# Test 1: Signup
echo "Test 1: User Signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/enduser_signup" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "'$TENANT_ID'",
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "name": "Test User",
    "phone": "+90 555 123 4567"
  }')
echo $SIGNUP_RESPONSE | jq .

# Test 2: Login (should fail - email not verified)
echo -e "\nTest 2: Login with unverified email"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/enduser_login" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "'$TENANT_ID'",
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }')
echo $LOGIN_RESPONSE | jq .

# Test 3: Resend Verification
echo -e "\nTest 3: Resend Verification Email"
RESEND_RESPONSE=$(curl -s -X POST "$BASE_URL/enduser_resend_verification" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "'$TENANT_ID'",
    "email": "testuser@example.com"
  }')
echo $RESEND_RESPONSE | jq .

# Note: Verification token'ı veritabanından alıp Test 4'te kullanın
# Test 4: Email Verification
# TOKEN="get_from_database"
# curl -s "$BASE_URL/enduser_verify_email?token=$TOKEN" | jq .

# Test 5: Login (should succeed after verification)
# curl -s -X POST "$BASE_URL/enduser_login" \
#   -H "Content-Type: application/json" \
#   -d '{"tenant_id": "'$TENANT_ID'", "email": "testuser@example.com", "password": "TestPassword123!"}' | jq .
```

---

## POSTMAN COLLECTION

Test senaryolarını Postman'de çalıştırmak için:

1. Postman'i aç
2. Import > Raw Text
3. Aşağıdaki JSON'ı yapıştır:

```json
{
  "info": {
    "name": "Turp SaaS - End User Auth Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Signup",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tenant_id\": \"{{tenant_id}}\",\n  \"email\": \"{{test_email}}\",\n  \"password\": \"{{test_password}}\",\n  \"name\": \"Test User\",\n  \"phone\": \"+90 555 123 4567\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_signup",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_signup"]
        }
      }
    },
    {
      "name": "2. Login (Unverified)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tenant_id\": \"{{tenant_id}}\",\n  \"email\": \"{{test_email}}\",\n  \"password\": \"{{test_password}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_login",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_login"]
        }
      }
    },
    {
      "name": "3. Resend Verification",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tenant_id\": \"{{tenant_id}}\",\n  \"email\": \"{{test_email}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_resend_verification",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_resend_verification"]
        }
      }
    },
    {
      "name": "4. Verify Email",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_verify_email?token={{verification_token}}",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_verify_email"],
          "query": [{"key": "token", "value": "{{verification_token}}"}]
        }
      }
    },
    {
      "name": "5. Login (Verified)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tenant_id\": \"{{tenant_id}}\",\n  \"email\": \"{{test_email}}\",\n  \"password\": \"{{test_password}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_login",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_login"]
        }
      }
    },
    {
      "name": "6. Get Current User",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{auth_token}}"}],
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_me",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_me"]
        }
      }
    },
    {
      "name": "7. Logout",
      "request": {
        "method": "POST",
        "header": [{"key": "Authorization", "value": "Bearer {{auth_token}}"}],
        "url": {
          "raw": "{{base_url}}/api/public/enduser_auth/enduser_logout",
          "host": ["{{base_url}}"],
          "path": ["api", "public", "enduser_auth", "enduser_logout"]
        }
      }
    }
  ],
  "variable": [
    {"key": "base_url", "value": "http://localhost"},
    {"key": "tenant_id", "value": "test-tenant"},
    {"key": "test_email", "value": "testuser@example.com"},
    {"key": "test_password", "value": "TestPassword123!"},
    {"key": "verification_token", "value": ""},
    {"key": "auth_token", "value": ""}
  ]
}
```

---

## NOTLAR

1. **Email Token'ları:** Verification ve reset token'ları veritabanından manuel olarak alınmalı veya email'den kopyalanmalı.

2. **Tenant Kurulumu:** Testlere başlamadan önce en az bir tenant oluşturulmuş olmalı.

3. **Email Servisi:** Email gönderimi için Brevo API key veya SMTP ayarları yapılmış olmalı.

4. **Database:** Her test grubundan önce veritabanını temizlemek veya farklı email adresleri kullanmak önerilir.

5. **Şifre Sıfırlama:** End-user için şifre sıfırlama feature'ı henüz implement edilmemiş. Section 6'daki testler implement edildikten sonra çalıştırılabilir.

---

## SIK KARŞILAŞILAN SORUNLAR

### Email Gönderilmiyor
- BREVO_API_KEY kontrol edin (env.php)
- SMTP ayarlarını kontrol edin
- Email servis loglarını inceleyin

### Token Geçersiz
- Token'ın expire süresi geçmiş olabilir
- Token veritabanında doğru mu kontrol edin
- URL encoding sorunları olabilir

### Login Başarısız
- Email doğrulandı mı kontrol edin
- Şifre doğru mu kontrol edin
- User status active mi kontrol edin
- Tenant ID doğru mu kontrol edin

### CORS Hataları
- Frontend farklı domain'den çalışıyorsa CORS headers ayarlanmalı
- Preflight OPTIONS requestleri handle edilmeli

---

Bu test promptlarını kullanarak sisteminizi kapsamlı bir şekilde test edebilirsiniz. Her test senaryosu için beklenen sonuçlar ve kontrol listesi verilmiştir.
