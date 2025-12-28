# REVISED LOVABLE DESIGN PROMPT - UNIFIED nipt.tr ARCHITECTURE
## Single Site, Dynamic Test Selection, Centralized Admin Panel

---

## 🎯 MISSION STATEMENT

**Amaç:** Omega Genetik altında **tek bir nipt.tr sitesi** kurarak, tüm NIPT testlerini (MomGuard, Verifi, Veritas) **dinamik, hasta-centric booking flow'da** sunmak.

**Key Principle:**
- ✓ Tek domain: **nipt.tr** (Omega Genetik proprietary)
- ✓ Hamile kadınlara sıcak, empati-odaklı tanıtım
- ✓ Test seçimi **booking form'da** yapılır (sonra)
- ✓ Admin merkezi yönetim (tüm testler bir dashboard'da)
- ✓ Türkiye'nin 81 ilinde Omega Care entegrasyonu
- ✓ SEO güçlü, conversion-optimized

---

## 🏗️ SITE ARCHITECTURE (UNIFIED)

### URL Structure
```
nipt.tr/
├─ / (HOME - Test intro + benefits)
├─ /nasil-calisir (Process explanation)
├─ /testler (All tests in one page - filterable)
├─ /testler/momguard (MomGuard detail)
├─ /testler/verifi (Verifi detail)
├─ /testler/veritas (Veritas detail)
├─ /hakkimizda (About Omega Genetik + Ruhsat)
├─ /booking (Smart booking form - test selection inside)
├─ /randevularim (Patient portal)
├─ /sonuclar (Result delivery portal)
├─ /iletisim (Contact)
├─ /sss (FAQ - all tests)
└─ /blog (Health articles)

ADMIN STRUCTURE:
├─ /admin/dashboard (Central hub - all tests)
├─ /admin/bookings (All bookings - test filter available)
├─ /admin/sms (SMS management)
├─ /admin/email (Email management)
├─ /admin/analytics (GA4 - unified metrics)
├─ /admin/seo (SEO console)
├─ /admin/testler (Test management - update prices, features)
└─ /admin/raporlar (Reports - test breakdown)
```

---

## 🏠 HOME PAGE (`/`) - UNIFIED FLOW

### Visual Strategy
```
Hero Section:
├─ Headline: "Hamileliğin 10. Haftasından Genetik Anomali 
│            Taraması - Evde, Risk-Free, %99+ Doğru"
├─ Subheadline: "Türkiye'nin Ruhsatlı Laboratuvarı.
│               Omega Genetik ile Evinizden Çıkmadan."
├─ Trust Badges: ✓ Ruhsatlı | ✓ 100,000+ Test | ✓ Ev Hizmeti
└─ Primary CTA: "Randevu Al" → `/booking`

Key Section 1: "3 Test Seçeneği - Hepsi Burada"
├─ NOT 3 separate cards with separate CTAs
├─ Instead: Unified comparison grid
│  ┌─────────────────────────────────────────┐
│  │ Feature      │ MomGuard │ Verifi │ Veritas│
│  ├─────────────────────────────────────────┤
│  │ Doğruluk     │ 99.8%    │ 99.9%  │ 100%   │
│  │ Sonuç Süresi │ 10-14d   │ 7-10d  │ 10-14d │
│  │ Fiyat        │ ₺1,200   │ ₺1,850 │ ₺2,200 │
│  │ En Hızlı     │          │ ⭐     │        │
│  │ En Ucuz      │ ⭐       │        │        │
│  │ En Kapsamlı  │          │        │ ⭐     │
│  └─────────────────────────────────────────┘
│
└─ Each row links to `/testler/[test-name]` for details

Key Section 2: "Nasıl Çalışır?"
├─ 4-step timeline (same for all tests)
└─ Visual: Booking → Kan Alma → Lab → Sonuç

Key Section 3: "Neden Omega Genetik?"
├─ Ruhsat badge (PROMINENT)
├─ Experience (30+ yıl)
├─ Teknoloji (Illumina)
├─ Omega Care (Evde hizmet)
└─ Support (24/7)

CTA Section:
├─ "Şimdi Randevu Al"
└─ → `/booking` (başında test seçmeyecek)
```

---

## 📄 TESTLER SAYFASI (`/testler`) - UNIFIED TEST OVERVIEW

### Layout
```
Page Title: "Tüm Test Seçenekleriniz"

Filter Section (Top):
├─ [MomGuard] [Verifi] [Veritas] (filter buttons)
├─ [Hepsi] (default: all shown)
└─ Sort: [En Hızlı] [En Ucuz] [En Kapsamlı]

Display: 3-Column Grid (Responsive)

CARD 1: MomGuard
┌──────────────────────────┐
│ Logo: LabGenomics        │
│ Title: MomGuard          │
│ Tagline: Fast & Reliable │
│                          │
│ 🔹 99.8% Doğruluk        │
│ ⏱️  10-14 Gün Sonuç       │
│ 💰 ₺1,200                │
│                          │
│ ✓ İkiz Hamilelik         │
│ ✓ Tek Plasentanız        │
│ ✓ Risk-Free              │
│                          │
│ [Detayları Gör]          │
│ [Randevu Al] → /booking  │
│ (test=momguard pre-selected)
│                          │
│ ⭐ En Ucuz Seçenek       │
└──────────────────────────┘

CARD 2: Verifi (FEATURED - Slightly larger)
┌──────────────────────────┐
│ Logo: Illumina + Verifi  │
│ Title: Verifi            │
│ Tagline: Premium Choice  │
│                          │
│ 🔹 99.9% Doğruluk        │
│ ⏱️  7-10 Gün Sonuç (Hızlı)│
│ 💰 ₺1,850                │
│                          │
│ ✓ Microdelete Panel      │
│ ✓ 60+ Üniversite Çalışma │
│ ✓ Dünyada En Çok Kullanılan│
│                          │
│ [Detayları Gör]          │
│ [Randevu Al] → /booking  │
│ (test=verifi pre-selected)
│                          │
│ ⭐ En Güvenilir Seçenek  │
└──────────────────────────┘

CARD 3: Veritas
┌──────────────────────────┐
│ Logo: Veritas            │
│ Title: Veritas           │
│ Tagline: Comprehensive   │
│                          │
│ 🔹 Tüm 23 Kromozom       │
│ ⏱️  10-14 Gün Sonuç       │
│ 💰 ₺2,200                │
│                          │
│ ✓ Kapsamlı Tarama        │
│ ✓ Genetik Danışmanlık    │
│ ✓ Detaylı Rapor          │
│                          │
│ [Detayları Gör]          │
│ [Randevu Al] → /booking  │
│ (test=veritas pre-selected)
│                          │
│ ⭐ En Kapsamlı Seçenek   │
└──────────────────────────┘

Mobile Adaptation:
├─ Stack vertically
├─ Full-width cards
└─ Swipeable carousel (optional)
```

---

## 🎯 TEST DETAIL PAGES (`/testler/[test-name]`)

### MomGuard Detail (`/testler/momguard`)
```
Layout: Same as original sub-pages prompt, but with modification:

All sections remain the same:
├─ Test Nedir?
├─ Teknoloji
├─ Ne Tespit Eder?
├─ Nasıl Çalışır?
├─ Diğerlerinden Farkı
├─ Kimler İçin Uygun?
├─ Sonuçlar
├─ FAQ
└─ Trust & Credentials

BUT - CTA Button Changes:
├─ PRIMARY CTA: "MomGuard İçin Randevu Al" → `/booking?test=momguard`
│  └─ Pre-selects MomGuard in booking form
│
└─ SECONDARY CTA: "Diğer Testleri Karşılaştır" → `/testler` (with Verifi/Veritas filters)
```

### Verifi Detail (`/testler/verifi`)
```
[Same structure as MomGuard]
CTA: "Verifi İçin Randevu Al" → `/booking?test=verifi`
```

### Veritas Detail (`/testler/veritas`)
```
[Same structure as MomGuard]
CTA: "Veritas İçin Randevu Al" → `/booking?test=veritas`
```

---

## 📋 SMART BOOKING FORM (`/booking`) - KEY CHANGE

### Flow Chart
```
STEP 1: Introduction (Test Selection)
├─ Headline: "Sizin İçin Uygun Testi Seçin"
├─ NOT mandatory at entry
├─ User can skip or enter with `?test=X` parameter
├─ Option 1: "Hepsi Uygun - Önerilen Testi Seçin" (Verifi default)
├─ Option 2: "Biliyorum - Seçtim" → [Dropdown]
│  ├─ MomGuard
│  ├─ Verifi
│  └─ Veritas
├─ Option 3: "Yardım Gerek" → Modal with comparison
│
└─ [Continue] button

STEP 2: Location & Service Type
├─ "Bulunduğunuz İl/İlçe?"
├─ "Omega Care Hizmeti Var mı?" (Auto-check)
├─ [Home Care] [Clinic] [Kit Delivery]
└─ Available appointment dates

STEP 3: Doctor & Referral Code
├─ "Doktorunuzun Adı?"
├─ "Doktor Kodu Var mı?" (Optional)
│  └─ Real-time validation → discount applies
├─ "Tavsiye Eden Doktor" (For analytics)
└─ Commission tracking (backend)

STEP 4: Personal Details
├─ Name, Email, Phone, DOB
├─ Address (for Omega Care routing)
├─ Ultrasound date (for medical history)
└─ Current pregnancy week

STEP 5: Consent & Confirmation
├─ KVKK checkbox
├─ Test conditions checkbox
├─ Contact preference (SMS/Email/WhatsApp)
├─ Review summary
└─ [Confirm Booking] → Submit

SUCCESS PAGE:
├─ Booking confirmation
├─ Test name (selected or default)
├─ Appointment date/time
├─ Omega Care assignment
├─ Contact info
└─ "Sonuçlarım" portal link
```

### URL Parameters
```
/booking               # No pre-selection (Verifi default offered)
/booking?test=momguard # MomGuard pre-selected
/booking?test=verifi   # Verifi pre-selected (default)
/booking?test=veritas  # Veritas pre-selected
/booking?ref=doctor_code # Populate doctor code field
```

---

## 🏥 HAKKIMIZDA SAYFASI (`/hakkimizda`) - UNCHANGED

```
[Use original sub-pages prompt structure]
Key Focus: Ruhsat prominently featured

┌─────────────────────────────┐
│ 🏥 SAĞLIK BAKANLIĞI RUHSATI  │
│ GHDM-SM/06.21/01            │
│ Omega Genetik               │
│ (Tüm testler bu ruhsat altında)
└─────────────────────────────┘
```

---

## 📊 ADMIN DASHBOARD (`/admin`) - UNIFIED MANAGEMENT

### Main Dashboard
```
[Same layout as original prompt, but:]

Left Column - Stats (All tests combined):
┌────────────────────────────┐
│ 📊 TODAY'S OVERVIEW         │
├────────────────────────────┤
│ New Bookings:    12         │
│ ├─ MomGuard: 4              │
│ ├─ Verifi: 6                │
│ └─ Veritas: 2               │
│                             │
│ Total Revenue: ₺22,100      │
│ Avg Test Price: ₺1,841      │
│                             │
│ 📈 This Week: +35%          │
└────────────────────────────┘

New Widget - Test Mix:
┌────────────────────────────┐
│ 🧬 TEST DISTRIBUTION        │
├────────────────────────────┤
│ Verifi: 52% (High value)   │
│ MomGuard: 32% (Volume)     │
│ Veritas: 16% (Premium)     │
│                             │
│ Trend: Verifi ↑ +5%         │
└────────────────────────────┘
```

### Bookings List (`/admin/bookings`)
```
[Same as original, but with test columns:]

DATA TABLE:
┌──────┬──────────┬──────────┬────────────┬─────────┐
│ ID   │ Patient  │ TEST     │ Status     │ Price   │
├──────┼──────────┼──────────┼────────────┼─────────┤
│ 1024 │ Zeynep Y.│ Verifi   │ ✓ Booked   │ ₺1,850  │
│ 1023 │ Aslı K.  │ MomGuard │ ⏳ Pending │ ₺1,200  │
│ 1022 │ Figen T. │ Veritas  │ ✓ In Lab   │ ₺2,200  │
└──────┴──────────┴──────────┴────────────┴─────────┘

Filters (Updated):
├─ Date Range
├─ Status
├─ TEST TYPE (NEW) ← Key filter
│  ├─ MomGuard
│  ├─ Verifi
│  ├─ Veritas
│  └─ All
├─ Sales Rep
├─ Omega Care Status
└─ Payment Status
```

### Test Management (`/admin/testler`) - NEW SECTION
```
Page: "Test Yönetimi"

TEST MANAGEMENT TABLE:
┌──────────┬─────────┬──────────┬──────┬──────────┐
│ Test     │ Price   │ Turnaround│ Accuracy│ Status │
├──────────┼─────────┼──────────┼──────┼──────────┤
│ MomGuard │ ₺1,200  │ 10-14d   │ 99.8%│ ✓ Active│
│ Verifi   │ ₺1,850  │ 7-10d    │ 99.9%│ ✓ Active│
│ Veritas  │ ₺2,200  │ 10-14d   │ 100% │ ✓ Active│
└──────────┴─────────┴──────────┴──────┴──────────┘

Per test: [Edit Price] [Update Availability] [View Stats]

Quick Stats:
├─ MomGuard: 154 bookings (32%)
├─ Verifi: 258 bookings (52%)
└─ Veritas: 78 bookings (16%)

Revenue by Test:
├─ MomGuard: ₺184,800
├─ Verifi: ₺477,300
└─ Veritas: ₺171,600
```

### Analytics Dashboard (`/admin/analytics`) - UNIFIED
```
[Same GA4 integration, but with test breakdown:]

NEW SECTION: Test Conversion by Type
┌─────────────────────────────────────┐
│ 📊 TEST SELECTION METRICS           │
├─────────────────────────────────────┤
│ MomGuard Conversion: 6.8%            │
│ Verifi Conversion: 8.2% ⭐ Highest   │
│ Veritas Conversion: 5.1%             │
│                                     │
│ Avg. time to select: 2m 15s         │
│ Most common path:                   │
│ Home → Testler → Verifi → Booking   │
└─────────────────────────────────────┘

GA4 Events (Updated):
├─ test_selected_momguard
├─ test_selected_verifi
├─ test_selected_veritas
├─ test_changed_in_form (user changed mind)
└─ booking_completed (with test_type param)
```

### Reports (`/admin/raporlar`) - NEW SECTION
```
Preset Reports:

1. TEST PERFORMANCE REPORT
   ├─ By test type
   ├─ Conversion rates per test
   ├─ Average price per test
   ├─ Turnaround times
   └─ Customer satisfaction (if available)

2. REVENUE REPORT
   ├─ Total by test
   ├─ Referral code breakdown
   ├─ Discount impact
   └─ Pricing optimization suggestions

3. BOOKING ANALYSIS
   ├─ Booking source by test
   ├─ Geographic distribution per test
   ├─ Seasonal trends
   └─ Test switching (did patient change test in form?)

4. SALES TEAM PERFORMANCE
   ├─ Bookings per rep (by test)
   ├─ Commission earned
   ├─ Referral codes used
   └─ Conversion rates

[Export as PDF/Excel] [Email Report] [Schedule]
```

---

## 💬 NOTIFICATION FLOW - UNIFIED

### SMS Templates (Unified)
```
Template 1: Booking Confirmation
"Merhaba {{PATIENT_NAME}},

{{TEST_NAME}} testi randevunuz 
{{DATE}}, saat {{TIME}}'de alındı.

Doktor: {{DOCTOR_NAME}}
Test: {{TEST_NAME}} (%{{ACCURACY}} doğru, {{TURNAROUND}} sonuç)

Ev ziyareti: {{LOCATION}}
Hemşire gelişine {{DAYS}} gün kaldı.

Sorularınız: 0312 920 13 62
Link: {{BOOKING_LINK}}"

[All other templates same, test_name variable included]
```

### Email Templates (Unified)
```
Template 1: Booking Confirmation
Subject: "{{TEST_NAME}} Randevunuz Onaylandı - #{{BOOKING_ID}}"

Features:
├─ Personalized greeting
├─ Test-specific information
│  ├─ Which test selected
│  ├─ Accuracy percentage
│  ├─ Expected turnaround
│  └─ What it detects
├─ Appointment details
├─ Omega Care info
├─ Doctor contact
└─ FAQ link (test-specific)

[All other templates same]
```

---

## 🔧 API ENDPOINTS - UNIFIED

### Updated Booking Endpoint
```javascript
POST /api/v1/bookings
├─ Body: { 
│  patient_name, 
│  test_type, // NEW: REQUIRED → momguard|verifi|veritas
│  date, 
│  location, 
│  referral_code, 
│  doctor 
│ }
├─ Response: { booking_id, test_name, confirmation_number, status }
├─ Triggers: SMS + Email + GA event (with test_type)
│
└─ Validation:
   ├─ test_type must be valid
   ├─ Auto-fetch test price & details
   └─ Calculate final price based on test + discount

GET /api/v1/tests
├─ Returns: [ { name, price, accuracy, turnaround } ]
└─ Used by booking form dropdown

GET /api/v1/bookings?test_filter=momguard
├─ Filter bookings by test type
└─ Used by admin dashboard

POST /api/v1/analytics/event
├─ event_name: "test_selected" (NEW specificity)
├─ parameters: { test_selected: "verifi", source_page: "/testler" }
└─ Track which test user selected and where from
```

---

## 📊 SEO STRATEGY - UNIFIED

### Keyword Strategy
```
Target Keywords (by test + general):

GENERAL (Home page focused):
├─ "NIPT testi" (2,100 search vol)
├─ "hamilelik genetik testi" (1,450 vol)
├─ "prenatal screening Türkiye" (890 vol)
└─ "Down sendromu testi" (1,200 vol)

TEST-SPECIFIC:
├─ MomGuard:
│  ├─ "MomGuard test" (180 vol)
│  ├─ "LabGenomics NIPT" (120 vol)
│  └─ "hızlı genetik test" (340 vol)
│
├─ Verifi:
│  ├─ "Verifi test" (890 vol)
│  ├─ "Illumina NIPT" (560 vol)
│  ├─ "SAFeR algoritması" (45 vol)
│  └─ "99.9% genetik test" (210 vol)
│
└─ Veritas:
   ├─ "Veritas test" (290 vol)
   ├─ "kapsamlı prenatal test" (410 vol)
   └─ "23 kromozom taraması" (180 vol)

Internal Linking Strategy:
├─ Home → Test pages (build authority)
├─ Test pages → Booking (conversion funnels)
├─ Blog articles → Relevant test pages
└─ Cross-linking tests on detail pages

Content Calendar:
├─ Month 1: General NIPT education (build traffic)
├─ Month 2: Test comparison blog (drive choices)
├─ Month 3: Specific test articles (deep dive)
└─ Ongoing: News/updates (engagement)
```

---

## 🎯 CONVERSION OPTIMIZATION - UNIFIED

### Funnel Analysis
```
Entry Point: Home page

Path 1 (Direct): Home → Booking
├─ Users who know they want test
├─ Conversion: ~12% (quick decision)

Path 2 (Comparison): Home → Testler → [Test Detail] → Booking
├─ Users who want to compare
├─ Conversion: ~8% (educational path)
├─ High quality conversions (informed choice)

Path 3 (Research): Home → Testler → Booking
├─ Quick filter & select
├─ Conversion: ~9%

OPTIMIZATION STRATEGIES:
├─ Default to Verifi (highest conversion)
├─ Show comparison table early
├─ Add trust signals on each test page
├─ Reduce form steps (max 5)
├─ Mobile-optimized booking
├─ Live chat for questions
└─ Social proof (testimonials per test)
```

---

## ✅ IMPLEMENTATION ROADMAP

### Phase 1: Site Architecture (Week 1-2)
- [ ] Migrate from 3 separate sites to unified nipt.tr
- [ ] Set up URL redirects (if any old URLs)
- [ ] Database consolidation (tests table with MomGuard, Verifi, Veritas)
- [ ] React component restructuring

### Phase 2: Booking Form Smart Selection (Week 2-3)
- [ ] Test selection step in booking form
- [ ] URL parameter handling (?test=X)
- [ ] Dynamic price calculation
- [ ] Test-specific validation

### Phase 3: Admin Unification (Week 3-4)
- [ ] Test management section
- [ ] Unified reports
- [ ] Test filtering in bookings list
- [ ] Analytics breakdown by test

### Phase 4: API Updates (Week 2-3)
- [ ] test_type parameter in booking endpoint
- [ ] New /api/v1/tests endpoint
- [ ] GA4 event enhancements
- [ ] Notification variable updates

### Phase 5: Content & SEO (Week 4-5)
- [ ] Rewrite home page for unified site
- [ ] Test detail pages (keep structure, update context)
- [ ] Internal linking strategy
- [ ] Schema markup updates

### Phase 6: Testing & Launch (Week 5-6)
- [ ] Full site testing
- [ ] Booking form testing (all test paths)
- [ ] Admin dashboard testing
- [ ] GA4 event validation
- [ ] Performance optimization
- [ ] Go live!

---

## 📈 SUCCESS METRICS

### Site-Level KPIs
```
Traffic:
├─ Total users: 5,000+ / month
├─ Organic traffic: 60%+ (growth focus)
├─ Mobile traffic: 65%+

Conversion:
├─ Home to Booking: 10%+
├─ Booking completion: 95%+
├─ Test selection distribution:
│  ├─ MomGuard: 30% (price-sensitive)
│  ├─ Verifi: 55% (trusted, balanced)
│  └─ Veritas: 15% (comprehensive)

Revenue:
├─ Average booking: ₺1,850
├─ Monthly revenue: ₺900,000+
├─ Referral code usage: 15%+

SEO:
├─ 20+ keywords in top 10
├─ Domain authority: 30+
├─ Organic traffic growth: +30% QoQ
```

---

## 🎨 DESIGN CONSISTENCY

### Key Principles
```
Single Brand Voice:
├─ Omega Genetik as parent brand
├─ Tests as product options (not competing brands)
├─ Unified color scheme (primary blue for CTAs)
└─ Consistent tone (warm, empathetic, professional)

Test Colors (Accent only):
├─ MomGuard: Green (trust, health)
├─ Verifi: Blue (confidence, premium)
├─ Veritas: Amber (comprehensive, complete)
└─ But: All CTAs use primary blue

Navigation Clarity:
├─ Clear path: Home → Testler → Details → Booking
├─ Comparison always available
├─ Test selection never forced before booking
└─ Return path always visible
```

---

## 📝 DATABASE SCHEMA UPDATES

### New/Updated Tables
```sql
-- Tests (New centralized table)
CREATE TABLE tests (
  id UUID PRIMARY KEY,
  slug VARCHAR(50) UNIQUE, -- momguard, verifi, veritas
  name VARCHAR(100),
  accuracy DECIMAL(5, 2), -- 99.8, 99.9, etc
  turnaround_min INT, -- days
  turnaround_max INT,
  price DECIMAL(10, 2),
  description TEXT,
  features JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bookings (Updated)
ALTER TABLE bookings ADD COLUMN test_id UUID FOREIGN KEY REFERENCES tests(id);
ALTER TABLE bookings ADD COLUMN test_slug VARCHAR(50); -- denormalized for quick lookup
-- Keep existing test_type column for backwards compatibility, but migrate to test_id

-- Referral Codes (Unchanged)
-- Can now track which test was booked when code used
ALTER TABLE referral_codes ADD COLUMN test_ids UUID[] (optional - track by test preference);
```

---

## 🚀 GO-LIVE CHECKLIST

- [ ] DNS/domain setup (nipt.tr only)
- [ ] SSL certificate active
- [ ] All 3 tests in database with correct prices
- [ ] Booking form test selection working
- [ ] SMS/Email templates updated (test_name variable)
- [ ] GA4 events firing correctly
- [ ] Admin dashboard fully functional
- [ ] Reports generating correctly
- [ ] Omega Care routing by test working
- [ ] Mobile responsiveness tested
- [ ] Load testing (500+ concurrent users)
- [ ] SEO sitemap updated
- [ ] Google Search Console updated
- [ ] Analytics tracking set up
- [ ] Monitoring & alerts active
- [ ] Team training completed
- [ ] Launch day comms ready

---

**Document Version:** Unified nipt.tr Architecture 1.0
**Migration Type:** Multi-site → Single unified site
**Tests Supported:** MomGuard, Verifi, Veritas
**Brand:** Omega Genetik (primary), tests as options
**Status:** Ready for refactoring & development
**Est. Implementation:** 6 weeks
