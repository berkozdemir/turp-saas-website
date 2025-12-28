# ANTIGRAVITY PROMPT (v3.1)
## nipt.tr Multi-Tenant Platform - "Home Care First" Strategy (Real Content)

---

## 🎯 MISSION STATEMENT

**Hedef:** nipt.tr domain'inde, 3 NIPT testini (MomGuard, Verifi, Veritas) sunan, **lojistik ve saha operasyonunu (Omega Care) merkeze alan** bir platform geliştir.

**Stratejik Odak:**
1. **Evde Hizmet:** Rakip firmaların "Hekim Payı" bariyerini, "Hasta Konforu" (evde kan alma) ile aşmak.
2. **Referans Sistemi:** Hekimlere tanımlanacak "İndirim Kodları" ile satış ekibinin (15 kişi) sahada elini güçlendirmek.
3. **Multi-Tenant:** Single portal girişinden 3 farklı test markasına yönlendirme (Gerçek İçerik + Görseller).

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

### AGENT 2: Frontend Development (Conversion & Booking Focused) - REAL CONTENT
**Görev:** Hastayı "Evde Hizmet" almaya ikna eden ve randevuyu kolaylaştıran arayüz.

#### 2.1 Hero & Landing Strategy
- **Headline:** "Hamilelikte Sıra Beklemeyin. NIPT Testiniz İçin Biz Size Gelelim."
- **Sub-head:** "Türkiye'nin 81 ilinde, Omega Care güvencesiyle evinizde numune alımı."
- **Trust Badges:** "150.000+ Mutlu Anne", "Sağlık Bakanlığı Ruhsatlı Lab", "Temassız İşlem".
- **Hero Visual:** Evinde konforlu oturan hamile kadın + Güler yüzlü Omega Care hemşiresi (kan alma işlemi yapıyor)

#### 2.1.1 Test Kartları (3 Adet) - REAL CONTENT

**KART 1: MomGuard (LabGenomics)**
- **Logo:** LabGenomics kurumsal logotu (SVG)
- **Başlık:** "MomGuard - LabGenomics Teknolojisi"
- **Tagline:** "Gebeliğin 9-10. haftasından yapılabilen, %99,8 doğruluk ile Down, Edwards ve Patau sendromlarını tespit eden test."
- **Teknoloji Badge:** "Next Generation Sequencing (NGS) - Illumina Altyapısı"
- **Özellikleri (5 Bullet):**
  * %99,8 doğruluk (T21, T18, T13)
  * 10-14 gün sonuç
  * Tek, ikiz, IVF gebelikleri uygun
  * İnvaziv olmayan kan testi (güvenli)
  * Cinsiyet kromozom anomalileri
- **CTA Button:** "MomGuard Detayları" (Yeşil) → `/momguard`

**KART 2: Verifi (Illumina)**
- **Logo:** Illumina + Verifi joint branding logotu
- **Başlık:** "Verifi - Illumina MPS Teknolojisi"
- **Tagline:** "%99,9 doğruluk oranı ile tüm trizomi ve cinsiyet kromozom anomalilerini en hızlı şekilde tespit eden test."
- **Teknoloji Badge:** "Massive Parallel Sequencing (MPS) + SAFeR™ Biyoinformatik"
- **Özellikleri (5 Bullet):**
  * %99,9 doğruluk oranı (sektör en yüksek)
  * %0,1 test başarısızlık (sektör en düşük)
  * 7-10 gün sonuç (EN HIZLI)
  * 10. gebelik haftasından uygulanabilir
  * Tüm 23 kromozom + mikrodelesyon seçeneği (1p36, 4p, 5p, 15q11, 22q11.2)
- **Validation Badge:** "60+ ABD Araştırma Kurumu Tarafından Valide Edilmiş"
- **CTA Button:** "Verifi Detayları" (Mavi) → `/verifi`

**KART 3: Veritas**
- **Logo:** Veritas Test kurumsal logotu
- **Başlık:** "Veritas - Kapsamlı Prenatal Screening"
- **Tagline:** "Tüm 22 otozomal kromozom + cinsiyet kromozomu bozukluklarını kapsamlı olarak taraması yapan en geniş kapsamlı test."
- **Teknoloji Badge:** "[Veritas teknoloji - sitelerden alınacak]"
- **Özellikleri (5 Bullet):**
  * Tüm 23 kromozom taraması
  * Kapsamlı genetik anomali analizi
  * Genetik danışmanlık desteği included
  * Mikrodelesyon analizi
  * Detaylı prenatal rapor (Türkçe + İngilizce)
- **CTA Button:** "Veritas Detayları" (Turuncu) → `/veritas`

#### 2.2 Smart Booking Form (`/[tenant]/booking`) - DETAILED FLOW

**Adım 1: Lokasyon & Hizmet Tipi (Location Checker)**
```
Sayfada:
├─ Sorı: "Bulunduğunuz İl/İlçe?"
├─ Input: Dropdown (Türkiye 81 ili + büyük ilçeler)
├─ Sistem "GET /api/v1/logistics/availability" çağrısı yapar
└─ Yanıt:
   ├─ Eğer Omega Care var ➜ "✓ Evde Kan Alma Hizmeti Tanımlandı" (Yeşil Checkmark)
   │  ├─ Tarih Seçimi (Datetime Picker - Türkçe)
   │  └─ Saat Seçimi (08:00 - 18:00 aralığında 30 dk araları)
   │
   └─ Eğer Omega Care yok ➜ "Anlaşmalı Klinik Listesi" (Sarı Alert)
      └─ "Numune Alma Kiti İstensin mi?" (Checkbox)
```

**Adım 2: Hekim Referansı (Referral Code Input)**
```
Sayfada:
├─ Input: "Doktorunuzun İndirim Kodu Var mı?"
├─ Helper Text: "(İsteğe bağlı - Dr. tarafından sağlandığında kullanın)"
├─ Kod girincesonra:
│  ├─ Real-time validation: POST /api/v1/referrals/validate
│  ├─ Eğer geçerli ➜
│  │  ├─ Fiyat otomatik güncelleme (Örn: 10.000 TL → 9.500 TL)
│  │  ├─ Yeşil checkmark "Kod Geçerli"
│  │  ├─ Doktor adı gösterme: "Dr. Ayşe Yılmaz referansıyla %5 indirim"
│  │  └─ Booking table'ında 'referral_code_id' kaydetme
│  │
│  └─ Eğer geçersiz ➜
│     ├─ Kırmızı hata: "Kod geçerli değil veya süresi dolmuş"
│     └─ Doktor kodu güncellemesi için destek linki
```

**Adım 3: Kişisel Bilgiler & Onam**
```
Form Alanları:
├─ Adı-Soyadı (required)
├─ Doğum Tarihi (required, date picker)
│  └─ Validation: Yaş >= 18
├─ Email (required)
│  └─ Validation: Email format + double check
├─ Telefon (required, +90 format)
│  └─ Input mask: "+90 (___) ___ __ __"
├─ Adres (required, multiline)
├─ İstenen Randevu Tarihi (already selected in Adım 1)
├─ Onam Checkboxes:
│  ├─ "KVKK Aydınlatma Metnini Okudum" (modal popup link)
│  ├─ "Test Şartlarını Kabul Ediyorum" (modal popup link)
│  └─ "İletişim için Telefon/SMS'e İzin Veriyorum" (checkbox)
├─ Submit Button: "Randevunuzu Tamamlayın"
└─ Form Validasyon (Client-side):
   └─ Tüm required alanlar dolu mu?
   └─ Checkboxes checked mi?
   └─ Email format doğru mu?
   └─ Telefon format doğru mu?
```

**Adım 4: Confirmation Page (After Submit)**
```
Success Screen:
├─ "✓ Randevunuz Alındı!"
├─ Confirmation Number: "NIPT-20250104-ABC123"
├─ Özet:
│  ├─ Test: "MomGuard NIPT"
│  ├─ Tarih: "5 Ocak 2025 - 10:00"
│  ├─ Hizmet: "Evde Kan Alma (Omega Care)"
│  ├─ Toplam Ücret: "9.500 TL" (indirim uygulanmışsa göster)
│  └─ İndirim: "-500 TL (Dr. Ayşe Yılmaz Kodu)"
│
├─ "Sonraki Adımlar:"
│  ├─ "Ödeme Linki" (Stripe/Iyzico - opsiyonel)
│  ├─ "Ekibimiz Sizi Arayacak"
│  └─ "Randevu Detayları E-mailinize Gönderildi"
│
├─ "Soru mu var?"
│  └─ WhatsApp Chat / Canlı Destek Linki
│
└─ CTA: "Anasayfaya Dön" / "Başka Test Seç"
```

**Bileşenler:**
- `LocationChecker.jsx` (Dropdown + API call)
- `ReferralCodeInput.jsx` (Real-time validation)
- `PriceCalculator.jsx` (Dynamic pricing)
- `BookingWizard.jsx` (Multi-step form container)
- `ConfirmationPage.jsx` (Success screen)
- `ConsentModal.jsx` (KVKK, Test Şartları)

#### 2.3 Tenant Intro Pages (Detailed Content)
Örn: `/momguard/intro`, `/verifi/intro`, `/veritas/intro`

**MomGuard Sayfası (`/momguard`)**
```
Layout:
├─ Header (MomGuard Logo + "LabGenomics Teknolojisi" subtitle)
├─ Section 1: "MomGuard Nedir?"
│  └─ Metin: "MomGuard testi LabGenomics firması tarafından geliştirilmiş bir testtir. 
│            Hamile kadınların kanındaki, bebeğin genetik bilgisini (DNA) analiz etmeye 
│            yarayan bir testtir. %99,8 keskinlik ile kromozomal anomaliliğini tespit 
│            edebilmektedir. Down sendromunu (21. kromozom), Edward sendromunu (18. kromozom), 
│            Patau sendromunu (13. kromozom) ve cinsiyet kromozomundaki anomaliliklerini 
│            hamile annenin kanından tespit edebilmektedir."
│
├─ Section 2: "Teknoloji"
│  └─ "MomGuard testi, yeni nesil sekanslama (Next Generation Sequencing-NGS) metodu ile 
│     Illumina altyapısını kullanmaktadır."
│  └─ Diagram: Kan alma → Laboratory → DNA Analiz → Sonuç
│
├─ Section 3: "Nasıl Yapılır?"
│  └─ Adımlar:
│     1. Gebeliğin 9-10. haftasında sonra özel bir tüpe kan alma işlemi
│     2. Hiçbir özel şart (açlık vb.) aranmamaktadır
│     3. Yapılan analizler laboratuvara ulaştıktan sonra 10-14 günde sonuçlanır
│
├─ Section 4: "Diğer Testlerden Farkı Nedir?"
│  └─ Comparison Table:
│     ├─ Anne Kanından İkili/Üçlü Tarama: %70-90 doğruluk, RISK YÜKSEK
│     ├─ Amniyosentez: %99+ doğruluk, RISK 0,5-2%
│     └─ MomGuard (NIPT): %99,8 doğruluk, RISK YOK ✓
│
├─ Section 5: "Kimler İçin Uygun?"
│  └─ Bullet Points:
│     • İleri gebelik yaşı (>35)
│     • Serum tarama sonuçları riskli
│     • Ultrason anomalileri
│     • Aile geçmişinde genetik rahatsızlıklar
│     • Tüm hamile kadınlar (isteme bağlı)
│
├─ Section 6: "Ne Tespit Eder?"
│  └─ Başlıklar:
│     ├─ Down Sendromu (Trizomi 21)
│     ├─ Edwards Sendromu (Trizomi 18)
│     ├─ Patau Sendromu (Trizomi 13)
│     └─ Cinsiyet Kromozom Anomalileri
│
├─ Section 7: "Sonuçlar"
│  └─ Timeline: "10-14 gün içinde doktorunuza ulaşır"
│  └─ Sonuç Tipi:
│     • Negatif: Kromozom bozukluğu tespit edilmedi ✓
│     • Pozitif: Kromozom bozukluğu tespit edildi (ileri testler önerilir)
│     • Belirsiz (Very Rare): Yeniden test gerekli
│
├─ Section 8: "Sıkça Sorulan Sorular (FAQ)"
│  └─ 5-6 adet soru-cevap (Accordion component)
│
├─ Section 9: "CTA - Randevu Al"
│  └─ Buton: "Şimdi MomGuard Testi Yaptırayım" → `/momguard/booking`
│
└─ Footer: Iletişim / Soru & Cevap Form
```

**Verifi Sayfası (`/verifi`) - REAL CONTENT**
```
Same structure with Verifi-specific content:

Section 1: "Verifi Prenatal Test Nedir?"
└─ "Verifi Prenatal Test, bebeğinizin gelecekte sağlığını etkileyebilecek 
   kromozom bozukluklarını tespit eden, gebeliğinizin 10. haftasından itibaren 
   yapılabilen bir tarama testidir. Amniyosentez ve koryonik villus örneklemesi 
   (CVS) gibi girişimsel yöntemlerin aksine bir risk oluşturmayıp, sadece sizden 
   alınan bir tüp kan örneği ile test yapılmaktadır."

Highlights:
• %99,9 Tespit Edebilme
• Düşük riski bulunmaz
• 10. haftadan yapılabilir
• 7-10 gün sonuç

Section 2: "Teknoloji: Massive Parallel Sequencing (MPS)"
└─ "Verifi Prenatal Test Illumina'nın kendi geliştirdiği ve sektörün hemen hemen 
   tamamı tarafından kullanılan yeni nesil DNA dizileme cihazlarını kullanarak, 
   'Massively Parallel Sequencing-MPS' teknolojisi ile size ve bebeğinize ait 
   genetik materyali (DNA) analiz eder."

Key Features:
• SAFeR™ Patentli Biyoinformatik Algoritması
• 60+ ABD Araştırma Kurumu Çalışması (Valide)
• Sektörün Yüksek Doğruluk Standı

Section 3: "Ne Tespit Eder?" (Kapsamlı Liste)
• Trizomi 21 (Down Sendromu)
• Trizomi 18 (Edwards Sendromu)
• Trizomi 13 (Patau Sendromu)
• Cinsiyet Kromozom Anöploidileri
  - Monozomi X (Turner Sendromu)
  - XXX (Triple X Sendromu)
  - XXY (Klinefelter Sendromu)
  - XYY (Jacobs Sendromu)
• 22 çift kromozom anöploidileri
• Opsiyonel Mikrodelesyon Taraması:
  - 1p36 delesyonu
  - 4p- (Wolf Hirschhorn)
  - 5p- (Cri-du-Chat)
  - 15q11 (Prader-Willi/Angelman)
  - 22q11.2 (Di George)

Section 4: "Neden Verifi Seçmeliyim?"
• %99,9 doğruluk (sektör en yüksek)
• %0,1 başarısızlık oranı (sektör en düşük)
• Risk olmayan invazif olmayan test
• 1 tüp kan yeterli
• 7-10 gün sonuç (hızlı)
• Dünya çapında hekimler tarafından kullanılıyor

Section 5: "Sonuç Yorumu"
• Negatif: Normal kronozom sayısı
• Pozitif: Kromozom bozukluğu tespit edildi (tanı testi önerilir)

Section 6: "Güven ve Validasyon"
• 60+ ABD Araştırma Kurumu katılımı
• Obstetri/Jinekoloji literatüründe yayınlanmış
• Klinik performans çalışmaları

Section 7: FAQ & Contact
```

**Veritas Sayfası (`/veritas`)**
```
[Veritas sitesinden alınan içerik - henüz tam veri yok, placeholder]

Section 1: "Veritas Prenatal Test Nedir?"
├─ Kapsamlı prenatal screening testi
├─ Tüm 23 kromozom taraması
└─ Genetik anomali analizi

Section 2: "Teknoloji ve Özellikleri"
Section 3: "Ne Tespit Eder?"
Section 4: "Sonuçlar ve Interpretasyon"
Section 5: "Sıkça Sorulan Sorular"
```

#### 2.4 Results Portal (Authenticated)
`/[tenant]/results` - MomGuard, Verifi, Veritas tümünün unified view'ı

```
Patient Dashboard:
├─ Welcome: "Hoş geldiniz, Zeynep!"
├─ Active Tests Table:
│  ├─ Columns: Test Adı | Tarih | Durum | İşlemler
│  ├─ Row 1: "MomGuard NIPT" | "3 Ocak 2025" | "HAZIR ✓" | [Download PDF] [Detaylar]
│  ├─ Row 2: "Verifi NIPT" | "1 Ocak 2025" | "BEKLEMEDe ⏳" | [Detaylar]
│  └─ Row 3: "Eski Test" | "1 Kasım 2024" | "TAMAMLANDI" | [Download]
│
├─ Status Badge Types:
│  ├─ "BEKLEME" (Sarı) - Numune alındı, laboratuvarda
│  ├─ "İŞLENİYOR" (Turuncu) - DNA analiz sürüyor
│  ├─ "HAZIR" (Yeşil) - Sonuç hazır, download edebilir
│  └─ "TAMAMLANDI" (Gri) - Eski test
│
├─ PDF Download:
│  ├─ Format: Türkçe + İngilizce
│  ├─ İçerik: Hasta özeti + Genetik bulgular + Hekim önerileri
│  └─ Güvenlik: Direct link + şifreli (patient email verification)
│
├─ Timeline View (Optional):
│  ├─ "5 Ocak - Numune Alındı"
│  ├─ "6 Ocak - Laboratuvara Gönderildi"
│  ├─ "10 Ocak - Analiz Tamamlandı"
│  ├─ "12 Ocak - Sonuç Hazır"
│  └─ "12 Ocak - Doktor Bilgilendirildi"
│
└─ "Soru mu var?" → Chat / Phone / Email Support
```

---

### AGENT 3: Backend API (Referral & Logistics Engine)
**Görev:** Satış ekibini ve saha ekibini destekleyen backend mantığı.

#### 3.1 Referral System API
```javascript
// POST /api/v1/referrals/validate
// Body: { code: "DRALI10" }
// Response: { 
//   valid: true, 
//   discount_percent: 5, 
//   doctor_name: "Dr. Ali Veli",
//   usage_count: 42,
//   last_used: "2025-01-04"
// }

// Logic:
// - Kod aktif mi? (is_active = true)
// - Son kullanım tarihi geçti mi? (expiry_date > now())
// - Booking tablosuna 'referral_id' olarak kaydet (Raporlama için kritik)
// - Doktor performans analytics (satış temsilcisine rapor)
```

#### 3.2 Logistics API
```javascript
// GET /api/v1/logistics/availability?city=Istanbul&district=Kadikoy
// Response: { 
//   home_care: true, 
//   earliest_slot: "2025-01-06 09:00",
//   available_slots: [
//     "2025-01-06 09:00",
//     "2025-01-06 10:00",
//     "2025-01-06 14:00",
//     ...
//   ]
// }

// Logic:
// - Omega Care veritabanından veya statik config'den bölge kontrolü
// - Disponibilite (capacity) kontrolü
```

#### 3.3 Notification System (Multi-Channel)
- **Hasta:** "Randevunuz alındı. Ekibimiz 5 Ocak 2025 saat 10:00'de evinizde olacak." (SMS/Email)
- **Omega Care Ekibi:** "YENİ GÖREV: Istanbul/Kadıköy, MomGuard NIPT, Zeynep Yılmaz, Ödeme: Beklemede" (Email/Slack/Webhook)
- **Satış Temsilcisi:** "BAŞARILI SATIŞ: Dr. Ali Veli (DRALI10) referansı ile MomGuard testi satışı gerçekleşti. Komisyon: 250 TL" (Motivasyon)

---

### AGENT 4: Deployment & Operations (Plesk)
**Görev:** Mevcut Plesk sunucusuna sorunsuz geçiş.

- **Environment Config:**
  - `OMEGA_CARE_API_KEY` (Eğer varsa)
  - `SMS_PROVIDER_KEY` (İletimerkezi / Twilio)
  - `EMAIL_SMTP_CONFIG`
  
- **Database Seeding:**
  - Örnek `referral_codes` verisi ekle (Test için: 'DEMO10', 'DRTEST', 'DRALI10', 'DRAYSE05')
  - Türkiye'nin 81 ili ve büyük ilçelerini `service_regions` tablosuna ekle.
  - 3 test tenant datası: MomGuard, Verifi, Veritas

---

### AGENT 5: Testing (Scenario Based) - REAL FLOWS

#### Critical Test Scenarios:
1. **The "Home Comfort" Flow (MomGuard):**
   - Hasta sitenin anasayfasına gelir
   - "MomGuard" kartına tıklar → `/momguard` introya gider
   - "Randevu Al" butonuna tıklar → `/momguard/booking` formuna gider
   - İstanbul/Kadıköy seçer → Sistem "✓ Evde Hizmet Tanımlandı" gösterir
   - Tarih seçer, "DRALI10" kodunu girer → %5 indirim uygulanır
   - Bilgileri doldurur, KVKK onaylar → Submit
   - "✓ Randevunuz Alındı!" success page'i
   - Confirmation email alır
   - Omega Care SMS ile "Yarın 10:00'de geliyor" bilgisi alır
   
2. **The "Remote City" Flow (Verifi):**
   - Hasta Verifi testini seçer
   - Rize/Pazar gibi hizmet verilmeyen bölge seçer
   - Sistem "Anlaşmalı Klinik" uyarısı gösterir
   - Kurye kit seçeneği sunulur
   - Booking tamamlanır
   
3. **The "Discount" Flow (Veritas):**
   - Hasta hatalı kod girer ("YANLISOD") → "Kod geçerli değil" hatası
   - Doktor kodu güncelle linki gösterilir
   - Doğru kod girer ("DRTEST") → Fiyat düşer, yeşil checkmark
   - Booking 'referral_code_id' ile kaydedilir
   - Satış ekibi raporlama panelinden "Dr. Test'ten 1 satış" raporu görür

4. **The "Results Download" Flow:**
   - Hasta results page'ine giriş yapar
   - "MomGuard NIPT" status "HAZIR" gösterir
   - "PDF İndir" butonuna tıklar
   - Türkçe + İngilizce rapor indirilir
   - Doktora paylaşılabilecek format (KVKK uyumlu)

---

## 🚀 EXECUTION PLAN

1. **Setup Phase:** Plesk'te DB ve Repo kurulumu.
2. **Core Dev:** Home page (3 test kartı), Tenant pages (MomGuard, Verifi, Veritas content).
3. **Strategy Dev:** Referral Code logic, Location logic, Price calculation.
4. **Integration:** Omega Care notification, Lab API, Email/SMS.
5. **Testing:** All 4 flows above (real content validation).
6. **Launch:** nipt.tr canlıya alınır.

---

## ❌ ANTIMATTER (What NOT to do)

- **Hekime "Rüşvet" Modülü Yapma:** Kod sistemi şeffaf bir "İndirim/Referans" sistemi olmalı. Arka plandaki ticari ilişki sistem dışında (muhasebede) yönetilmeli. Sistemde sadece "Hangi doktor kaç hasta yolladı" raporu olmalı.
- **Sadece İstanbul Odaklı Olma:** Omega Care her yerde kan alabiliyorsa, sistem 81 ili kapsamalı.
- **Karmaşık Fiyatlandırma:** Hasta son fiyatı net görmeli. Gizli kurye ücreti vb. olmamalı (Fiyata dahil stratejisi önerilir).
- **İçerik Eksikliği:** Her testin gerçek bilgisi (MomGuard LabGenomics, Verifi Illumina) site'de görülmeli.

---

## 📋 CONTENT MAPPING (Sitelerdenbilgiler)

### MomGuard (LabGenomics)
**Kaynak:** https://nipttesti.com/momguard-lab-genomics/
- Teknoloji: NGS + Illumina Altyapısı
- Doğruluk: %99,8
- Sonuç: 10-14 gün
- Uygun: Tek, ikiz, IVF gebelikleri
- Tespit: T21, T18, T13, Sex chromosome anomalies

### Verifi (Illumina)
**Kaynak:** https://nipttesti.com/verifi-illumina-2/
- Teknoloji: MPS + SAFeR™ Algoritması
- Doğruluk: %99,9 (en yüksek)
- Başarısızlık: %0,1 (en düşük)
- Sonuç: 7-10 gün (en hızlı)
- Tespit: T21, T18, T13, Sex chromosomes, Microdelates (1p36, 4p, 5p, 15q11, 22q11.2)
- Validasyon: 60+ ABD kurumu

### Veritas
**Kaynak:** https://nipttesti.com/veritas-testi/
- [Siteden tam veri çekilerek güncellenecek]
- Kapsamlı tarama
- Detaylı prenatal rapor

---

**HAZIRLIK SORULARI (Sizin İçin):**
1. ✅ 3 test içeriği site'den çekildi (MomGuard, Verifi)
2. ✅ Veritas sitesi URL'i doğru mu?
3. ⏳ Doktor kodları formatı: "DRALI10", "DRAYSE05" gibi mi?
4. ⏳ İndirim oranı: Sabit %5 mi, değişken mi?
5. ⏳ Hangi illerde "Kesinlikle" evde hizmet var? (Database seed)

---

**Prompt Version:** 3.1 (Real Content Integrated)
**Last Updated:** Dec 28, 2025, 2:30 AM
**Status:** Ready for AGENT 1 Start
