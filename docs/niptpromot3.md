# ANTIGRAVITY PROMPT (v3)
## nipt.tr Multi-Tenant Platform - "Home Care First" Strategy

---

## 🎯 MISSION STATEMENT

**Hedef:** nipt.tr domain'inde, 3 NIPT testini (MomGuard, Verifi, Veritas) sunan, **lojistik ve saha operasyonunu (Omega Care) merkeze alan** bir platform geliştir.

**Stratejik Odak:**
1. **Evde Hizmet:** Rakip firmaların "Hekim Payı" bariyerini, "Hasta Konforu" (evde kan alma) ile aşmak.
2. **Referans Sistemi:** Hekimlere tanımlanacak "İndirim Kodları" ile satış ekibinin (15 kişi) sahada elini güçlendirmek.
3. **Multi-Tenant:** Single portal girişinden 3 farklı test markasına yönlendirme.

**Deployment:** GitHub → Plesk Sunucusu (Mevcut Altyapı)

---

## 🏗️ ARCHITECTURAL SPECIFICATION

### Business Logic Flow
```
HASTA (Web Sitesi)
   │
   ├─ 1. Test Seçimi (MomGuard/Verifi/Veritas)
   ├─ 2. Lokasyon Kontrolü (İl/İlçe)
   │     ├─ Omega Care Kapsamı Var mı?
   │     │  └─ EVET: "Evde Hizmet" (Default)
   │     └─ HAYIR: "En Yakın Klinik"
   │
   ├─ 3. Hekim/Referans Kodu Girişi
   │     └─ İndirim Uygula + Hekimi Kaydet
   │
   ▼
BACKEND API
   │
   ├─ Booking Oluştur
   ├─ Omega Care Ekibine Bildirim (Lojistik)
   └─ Laboratuvara Pre-Registration
```

---

## 📋 TASK BREAKDOWN (Ajanlar İçin)

### AGENT 1: Architecture & Planning (Logistics Aware)
**Görev:** Mevcut sistemi "Lojistik" ve "Referans" modülleriyle güncelle.

**Deliverables:**
1. **Database Schema Update**
   - `referral_codes` (code, doctor_name, sales_rep_id, discount_percent, usage_count)
   - `service_regions` (city, district, is_active_for_home_care)
   - `logistics_tasks` (booking_id, status, assigned_team)
   
2. **API Spec Update**
   - `/api/v1/referrals/validate`
   - `/api/v1/logistics/regions`
   
3. **Migration Guide:** nipttesti.com datasını bu yeni yapıya taşıma planı.

---

### AGENT 2: Frontend Development (Conversion & Booking Focused)
**Görev:** Hastayı "Evde Hizmet" almaya ikna eden ve randevuyu kolaylaştıran arayüz.

#### 2.1 Hero & Landing Strategy
- **Headline:** "Hamilelikte Sıra Beklemeyin. NIPT Testiniz İçin Biz Size Gelelim."
- **Sub-head:** "Türkiye'nin 81 ilinde, Omega Care güvencesiyle evinizde numune alımı."
- **Trust Badges:** "150.000+ Mutlu Anne", "Sağlık Bakanlığı Ruhsatlı Lab", "Temassız İşlem".

#### 2.2 Smart Booking Form (`/[tenant]/booking`)
**Adım 1: Lokasyon & Hizmet Tipi**
- İl/İlçe Seçimi (Dropdown)
- Sistem `check-availability` yapar.
- Eğer bölge uygunsa: **"Ücretsiz Evde Kan Alma Hizmeti Tanımlandı"** (Yeşil Checkmark)
- Tarih ve Saat Seçimi.

**Adım 2: Hekim Referansı**
- Input: "Doktorunuzun İndirim Kodu Var mı?"
- Action: Kodu girince anlık fiyat düşer (Örn: 10.000 TL -> 9.500 TL).
- Feedback: "Dr. Ayşe Yılmaz referansıyla %5 indirim uygulandı."

**Adım 3: Kişisel Bilgiler & Onam**
- Standart form alanları (KVKK dahil).

**Bileşenler:**
- `LocationChecker.jsx` (API call for region)
- `ReferralInput.jsx` (Discount logic)
- `BookingWizard.jsx` (Multi-step form)

---

### AGENT 3: Backend API (Referral & Logistics Engine)
**Görev:** Satış ekibini ve saha ekibini destekleyen backend mantığı.

#### 3.1 Referral System API
```javascript
// POST /api/v1/referrals/validate
// Body: { code: "DRALI10" }
// Response: { valid: true, discount_percent: 5, doctor_name: "Dr. Ali Veli" }

// Logic:
// - Kod aktif mi?
// - Son kullanım tarihi geçti mi?
// - Booking tablosuna 'referral_id' olarak kaydet (Raporlama için kritik).
```

#### 3.2 Logistics API
```javascript
// GET /api/v1/logistics/availability?city=Istanbul&district=Kadikoy
// Response: { home_care: true, earliest_slot: "2023-10-28 09:00" }

// Logic:
// - Omega Care veritabanından veya statik config'den bölge kontrolü.
```

#### 3.3 Notification System (Multi-Channel)
- **Hasta:** "Randevunuz alındı. Ekibimiz [Tarih] saatinde evinizde olacak." (SMS/Email)
- **Omega Care Ekibi:** "YENİ GÖREV: [Adres], [Test Tipi], [Hasta Adı]." (Email/Slack/Webhook)
- **Satış Temsilcisi:** "Bölgenizdeki Dr. Ali Veli'nin referansıyla yeni bir satış gerçekleşti." (Opsiyonel - Motivasyon için)

---

### AGENT 4: Deployment & Operations (Plesk)
**Görev:** Mevcut Plesk sunucusuna sorunsuz geçiş.

- **Environment Config:**
  - `OMEGA_CARE_API_KEY` (Eğer varsa)
  - `SMS_PROVIDER_KEY` (İletimerkezi / Twilio)
  - `EMAIL_SMTP_CONFIG`
  
- **Database Seeding:**
  - Örnek `referral_codes` verisi ekle (Test için: 'DEMO10', 'DRTEST').
  - Türkiye'nin 81 ili ve büyük ilçelerini `service_regions` tablosuna ekle.

---

### AGENT 5: Testing (Scenario Based)

#### Critical Test Scenarios:
1. **The "Home Comfort" Flow:**
   - Hasta İstanbul/Kadıköy seçer → Sistem "Evde Hizmet" önerir → Randevu tamamlanır.
   
2. **The "Remote City" Flow:**
   - Hasta hizmet verilmeyen bir ilçe seçer → Sistem "Anlaşmalı Klinik" veya "Kurye Kiti" önerir.
   
3. **The "Discount" Flow:**
   - Hasta geçersiz kod girer → Hata mesajı.
   - Hasta geçerli kod girer → Fiyat düşer → Booking 'referral_code' ile kaydedilir.

---

## 🚀 EXECUTION PLAN

1. **Setup Phase:** Plesk'te DB ve Repo kurulumu.
2. **Core Dev:** Home page, Tenant pages, Basic Booking.
3. **Strategy Dev:** Referral Code logic, Location logic.
4. **Integration:** Omega Genetik Lab API bağlantısı.
5. **Launch:** nipt.tr canlıya alınır.

---

## ❌ ANTIMATTER (What NOT to do)

- **Hekime "Rüşvet" Modülü Yapma:** Kod sistemi şeffaf bir "İndirim/Referans" sistemi olmalı. Arka plandaki ticari ilişki sistem dışında (muhasebede) yönetilmeli. Sistemde sadece "Hangi doktor kaç hasta yolladı" raporu olmalı.
- **Sadece İstanbul Odaklı Olma:** Omega Care her yerde kan alabiliyorsa, sistem 81 ili kapsamalı.
- **Karmaşık Fiyatlandırma:** Hasta son fiyatı net görmeli. Gizli kurye ücreti vb. olmamalı (Fiyata dahil stratejisi önerilir).

---

**HAZIRLIK SORULARI (Sizin İçin):**
1. Doktorlara vereceğimiz kod formatı nasıl olsun? (Örn: DRADIsoyadı)
2. İndirim oranı sabit mi? (Örn: %5)
3. Hangi illerde "Kesinlikle" evde hizmet var? (Database seed için gerekli)

---
