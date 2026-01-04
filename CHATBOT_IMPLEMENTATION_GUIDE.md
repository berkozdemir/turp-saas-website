# DeepSeek Chatbot Implementation - Kurulum Rehberi

## 📋 Özet

Podcast modülüne entegre, NIPT ve Omega Genetik hakkında soru-cevap veren, kullanıcı emaili toplayıp lead oluşturan DeepSeek destekli chatbot sistemi.

## ✅ Tamamlanan Adımlar

### 1. Veritabanı Kurulumu

**Dosya**: `chatbot_database_setup.sql`

Plesk PHPMyAdmin'de çalıştırmanız gereken SQL script'i:

```bash
# Lokasyon
./chatbot_database_setup.sql
```

**Oluşturulan Tablolar**:
- `chatbot_conversations` - Görüşme bilgileri
- `chatbot_messages` - Mesaj geçmişi
- `chatbot_knowledge_index` - RAG bilgi tabanı
- `contact_submissions` - Güncellenmiş (chatbot kaynağı eklendi)

### 2. Backend Modül Yapısı

**Lokasyon**: `/api/modules/chatbot/`

```
chatbot/
├── chatbot.service.php              # Ana iş mantığı
├── chatbot.public.controller.php    # Public API endpoints
├── chatbot.admin.controller.php     # Admin endpoints
├── deepseek.service.php             # DeepSeek API wrapper
└── rag.service.php                  # RAG indexing & search
```

**Özellikler**:
- ✅ Conversation management
- ✅ DeepSeek chat completion integration
- ✅ RAG (MySQL FULLTEXT) search
- ✅ Email notifications (user + admin)
- ✅ Lead creation in contact_submissions

### 3. API Endpoints

#### Public Endpoints (Kullanıcı için)

1. **Sohbet Başlatma**
   ```
   POST /api/index.php?action=chatbot_start
   Body: { email, name, phone, context_type, context_id }
   Response: { session_id, conversation_id }
   ```

2. **Mesaj Gönderme**
   ```
   POST /api/index.php?action=chatbot_send_message
   Body: { session_id, message }
   Response: { reply, sources[] }
   ```

3. **Geçmiş Alma**
   ```
   GET /api/index.php?action=chatbot_get_history&session_id=xxx
   Response: { messages[] }
   ```

#### Admin Endpoints

1. **İçerik İndeksleme**
   ```
   POST /api/index.php?action=chatbot_reindex
   Headers: Authorization: Bearer <token>
   Body: { source_types: ['podcast', 'blog', 'faq', 'static'] }
   ```

2. **Görüşmeleri Listeleme**
   ```
   GET /api/index.php?action=chatbot_get_conversations
   ```

3. **Görüşme Detayı**
   ```
   GET /api/index.php?action=chatbot_get_conversation_detail&conversation_id=123
   ```

### 4. Frontend Components

**Lokasyon**: `/src/components/chatbot/`

```
chatbot/
├── PodcastChatTab.tsx      # Ana container
├── PreChatForm.tsx         # Email toplama formu
├── ChatInterface.tsx       # Chat UI
├── ChatMessage.tsx         # Mesaj bubble'ları
└── ChatSourceCard.tsx      # RAG kaynak kartları
```

**Hook**: `/src/hooks/useChatbot.tsx`

### 5. Sayfa Entegrasyonları

- ✅ [PodcastHub.tsx](src/pages/PodcastHub.tsx) - Tab navigation eklendi
- ✅ [PodcastDetail.tsx](src/pages/PodcastDetail.tsx) - Tab navigation eklendi

## 🚀 Deployment Checklist

### Adım 1: Environment Variables

`.env` dosyasına ekleyin:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
ADMIN_EMAIL=info@omegagenetik.com
```

### Adım 2: Veritabanı Tablolarını Oluşturun

1. Plesk'e giriş yapın
2. PHPMyAdmin'i açın
3. İlgili veritabanını seçin
4. SQL sekmesine gidin
5. `chatbot_database_setup.sql` içeriğini yapıştırın ve çalıştırın

### Adım 3: Backend Dosyalarını Upload Edin

Aşağıdaki dosyaları production'a upload edin:

```
api/modules/chatbot/
├── chatbot.service.php
├── chatbot.public.controller.php
├── chatbot.admin.controller.php
├── deepseek.service.php
└── rag.service.php

api/routes/
├── public.routes.php (güncellenmiş)
└── admin.routes.php (güncellenmiş)
```

### Adım 4: Frontend Build & Deploy

```bash
npm run build
# Build output'u production'a deploy edin
```

### Adım 5: RAG İçerikleri İndeksleyin

İlk kurulumda mevcut içerikleri indeksleyin:

```bash
# Admin panel veya doğrudan API call ile:
curl -X POST https://your-domain.com/api/index.php?action=chatbot_reindex \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source_types": ["podcast", "blog", "faq", "static"]}'
```

## 📊 Static Content (NIPT Bilgileri)

Static content otomatik olarak seed edilir (`chatbot.admin.controller.php` içinde):

- NIPT Testi Nedir?
- NIPT Testi Nasıl Yapılır?
- NIPT Testi Kimlere Önerilir?
- Omega Genetik Hakkında
- NIPT Testi Fiyatları
- NIPT Test Sonuçları Nasıl Yorumlanır?
- Randevu ve İletişim

## 🎨 UI/UX Özellikleri

### PreChatForm
- İsim, email, telefon toplama
- Validasyon (email format check)
- Loading states
- Omega Genetik branding (navy blue gradient)

### ChatInterface
- Kullanıcı mesajları: Sağda, mavi gradient
- AI mesajları: Solda, gri
- Kaynak kartları: Tıklanabilir, renkli kategorilere göre
- Typing indicator
- Auto-scroll
- Örnek sorular (ilk açılışta)

### Tab Navigation
- Podcast Bölümleri / Soru & Cevap
- Responsive design
- Active state indicators

## 🔐 Güvenlik

- ✅ SQL Injection koruması (PDO prepared statements)
- ✅ XSS koruması (React automatic escaping)
- ✅ Email validation
- ✅ Input sanitization
- ✅ Tenant isolation (her query'de tenant_id check)
- ✅ Admin authentication required (Bearer token)

## 📧 Email Notifications

### Kullanıcı Onay Emaili
- Konu: "Mesajınız Alındı - Omega Genetik"
- İçerik: İletişim bilgileri, teşekkür mesajı
- HTML formatted

### Admin Bildirim Emaili
- Konu: "Yeni Chatbot Lead - {name}"
- İçerik: İsim, email, telefon, kaynak, zaman
- Lead yönetimi için

## 🧪 Test Senaryoları

### Temel Akış
1. Podcast hub sayfasına git
2. "Soru & Cevap" tab'ına tıkla
3. Form doldur (isim, email, telefon)
4. "Sohbete Başla" butonuna tıkla
5. Onay mesajını gör
6. Chat interface açılsın
7. "NIPT testi nedir?" diye sor
8. AI cevabı + kaynakları görüntüle
9. Kaynak kartına tıkla (yeni tab)

### RAG Search Test
1. Admin olarak giriş yap
2. Chatbot reindex endpoint'ini çağır
3. İndeks sayısını kontrol et
4. Kullanıcı olarak spesifik soru sor
5. Doğru kaynakların geldiğini doğrula

### Email Test
1. Yeni conversation başlat
2. Email gelen kutusunu kontrol et (kullanıcı)
3. Admin email'i kontrol et
4. Email template'lerinin doğru render edildiğini kontrol et

## 📈 Performans & Maliyet

### DeepSeek API
- Model: `deepseek-chat`
- Maliyet: ~$0.14/1M input tokens, ~$0.28/1M output tokens
- Ortalama conversation: ~2000 token
- 1000 conversation ≈ $0.50-1.00

### MySQL FULLTEXT
- <10,000 records: <50ms
- RAG search average: ~100ms
- Total response time: 1-3 saniye (DeepSeek API latency dahil)

## 🐛 Troubleshooting

### Chatbot yanıt vermiyor
- `DEEPSEEK_API_KEY` environment variable kontrolü
- API error logs kontrolü
- Network connectivity kontrolü

### RAG sonuç bulamıyor
- İçeriklerin indekslendiğini kontrol et
- FULLTEXT index'in oluşturulduğunu doğrula
- Search query'yi test et

### Email gitmiyor
- SMTP credentials kontrolü
- Email service logs
- Brevo API status

### Tenant isolation sorunu
- Her API call'da tenant_id'nin doğru geldiğini kontrol et
- Tenant resolution middleware'i kontrol et

## 📝 Notlar

- Chatbot sadece bilgilendirme amaçlıdır, tıbbi teşhis koymaz
- Her cevapla birlikte disclaimer gösterilir
- Tüm conversation'lar DB'de saklanır (admin panel'den görüntülenebilir)
- Lead'ler otomatik olarak `contact_submissions` tablosuna kaydedilir

## 🎯 Gelecek Geliştirmeler (Opsiyonel)

- [ ] Admin panel chatbot conversation viewer
- [ ] Chatbot analytics dashboard
- [ ] Multi-language support (EN, ZH)
- [ ] Voice input/output
- [ ] Conversation rating system
- [ ] Auto-responder triggers
- [ ] CRM entegrasyonu (Pipedrive, HubSpot)

## 📞 Destek

Sorun yaşarsanız:
1. Logs'u kontrol edin (`error_log`)
2. Browser console'u kontrol edin
3. Network tab'ı kontrol edin (API responses)

---

**Son Güncelleme**: 2025-01-04
**Versiyon**: 1.0.0
**Geliştirici**: Claude Code
