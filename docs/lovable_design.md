# LOVABLE DESIGN PROMPT
## nipt.tr Home Page - "Peace of Mind for Expecting Mothers"

---

## 🎯 DESIGN MISSION

**Amaç:** Hamile kadınlara (9-40 yaş arası, ilk kez kişi gebe olanlar + multipar) güven veren, kaygı giderici, profesyonel ve sıcak bir ana sayfa tasarımı yapmak.

**Lovable Style Özellikleri:**
- ✓ Sıcak, insani, erişilebilir tasarım
- ✓ Minimal ama anlamlı detaylar
- ✓ Empati odaklı kopywriting
- ✓ Güven sinyalleri (sertifika, ruhsat, uzman)
- ✓ Mobil-first responsive design
- ✓ Hızlı, temiz interaksiyonlar

---

## 📐 TECHNICAL STACK

**Frontend Framework:** React + Next.js 14
**Styling:** Tailwind CSS + Custom Components (Lovable preset)
**UI Library:** Shadcn/ui (Lovable-optimized)
**Typography:** Geist (Lovable default font)
**Color Palette:** Soft, warm tones + confidence blues
**Animation:** Framer Motion (subtle, not distracting)

---

## 🎨 DESIGN SYSTEM (Lovable Theme)

### Color Palette
```
Primary:    #2563EB (Trust Blue)     - CTA, confidence
Secondary:  #EC4899 (Warm Pink)      - Pregnancy care, warmth
Accent:     #F59E0B (Warm Amber)     - Highlights, support
Background: #FAFBFC (Cream White)    - Soft, safe feeling
Text:       #1F2937 (Dark Gray)      - Readability, authority
Muted:      #9CA3AF (Gray)           - Secondary info
Success:    #10B981 (Green)          - Validation, trust
Alert:      #F87171 (Soft Red)       - Important info (not scary)
```

### Typography
```
Font Family: Geist (sans-serif)
Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

H1: 48px, 700, Semibold (Hero headline)
H2: 36px, 600, Semibold (Section titles)
H3: 28px, 600, Medium (Subsection)
Body Large: 18px, 400 (Featured text)
Body: 16px, 400 (Standard)
Small: 14px, 400 (Secondary info)
```

### Spacing (8px baseline)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px

---

## 🏠 HOME PAGE STRUCTURE

### 1. Navigation & Header
```
Sticky Header (Desktop):
├─ Left: Logo (nipt.tr + tagline)
├─ Center: Navigation
│  ├─ Testler
│  ├─ Hakkımızda
│  ├─ Sağlık Bilgileri
│  └─ İletişim
└─ Right: CTA Button "Randevu Al" (Primary Blue)

Mobile Header:
├─ Logo (smaller)
├─ Hamburger Menu
└─ CTA Button (full width below header)

Color: White background with soft shadow
```

---

### 2. HERO SECTION (Above Fold - 100vh)

**Visual Strategy:** Warm, human, not clinical

**Hero Composition:**
```
Background:
├─ Soft gradient: Cream (#FAFBFC) → Light Blue (#EBF8FF)
├─ OR Subtle pattern: Soft dots/waves (20% opacity)
└─ NO stock photos initially (load custom illustrations)

Left Side (Text - 50%):
├─ Eyebrow: "Hamileliğin 10. Haftasından"
├─ Main Headline (H1): 
│  "Bebeğinizin Sağlığı Konusunda Kesin Bir Cevap.
│   Hiçbir Kaygı Yok."
│
├─ Subheadline (18px, Gray):
│  "Evinizden çıkmadan %99,9 doğrulukla genetik 
│   anomalileri tespit edin. Türkiye'nin ruhsatlı 
│   laboratuvarından. Omega Care hemşiresi evinize gelir."
│
├─ Trust Badges (Horizontal):
│  • "✓ Sağlık Bakanlığı Ruhsatlı"
│  • "✓ 1000+ Mutlu Anne"
│  • "✓ Risk-Free (İnvazif Değil)"
│
├─ CTA Buttons (2):
│  • Primary: "Randevunuzu Alın" (Blue, Bold)
│  • Secondary: "Sorularınız mı var?" (Link style)
│
└─ Bottom: Scroll indicator (arrow animation)

Right Side (Visual - 50%):
├─ Illustration: Evinde oturan hamile kadın
│  (Comfortable, peaceful expression)
│  + Omega Care hemşiresi (warm smile, holding tablet)
│  + Blood draw visualization (minimalist, not scary)
│
├─ Floating Elements:
│  ├─ "10. Hafta" (badge)
│  ├─ "%99,9 Doğruluk" (badge)
│  └─ "Süresi: 7-10 gün" (badge)
│
└─ Animation: Gentle float/pulse effect

Mobile Adaptation:
├─ Stack vertically
├─ Hero image smaller but prominent
├─ Text centered
└─ Buttons full-width
```

---

### 3. THREE TEST CARDS SECTION

**Section Title:** "Bebeğiniz İçin En Doğru Testi Seçin"

**Layout:** 3-column grid (desktop), stack (mobile)

```
CARD 1: MomGuard (LabGenomics)
┌─────────────────────────────────┐
│  Logo: LabGenomics              │
│  ──────────────────────────────  │
│  Title: "MomGuard - Hızlı Test"  │
│  ──────────────────────────────  │
│  Tagline: "Gebeliğin 9-10.       │
│           haftasından yapılır"   │
│  ──────────────────────────────  │
│  Key Features (4 bullets):       │
│  • %99,8 Doğruluk               │
│  • 10-14 Gün Sonuç              │
│  • İkiz Gebelik Uygun           │
│  • Riskli Tarama Sonrası        │
│  ──────────────────────────────  │
│  Price: [Dynamic] TL            │
│  ──────────────────────────────  │
│  CTA: "MomGuard Detaylarına Bak"│
│  (Button: Green tint)            │
└─────────────────────────────────┘

CARD 2: Verifi (Illumina) ⭐ FEATURED
┌─────────────────────────────────┐
│  Badge: "En Doğru Sonuç"        │
│  Logo: Illumina + Verifi         │
│  ──────────────────────────────  │
│  Title: "Verifi - En Güvenilir"  │
│  ──────────────────────────────  │
│  Tagline: "Dünyada %99,9         │
│           kullanan test"         │
│  ──────────────────────────────  │
│  Key Features (4 bullets):       │
│  • %99,9 Doğruluk (En Yüksek)   │
│  • 7-10 Gün Sonuç (En Hızlı)    │
│  • Mikrodelesyon (Bonus)         │
│  • 60+ Üniversite Çalışması      │
│  ──────────────────────────────  │
│  Price: [Dynamic] TL            │
│  ──────────────────────────────  │
│  CTA: "Verifi Hakkında Bilgi"   │
│  (Button: Blue, slightly raised)  │
└─────────────────────────────────┘

CARD 3: Veritas (Comprehensive)
┌─────────────────────────────────┐
│  Logo: Veritas                   │
│  ──────────────────────────────  │
│  Title: "Veritas - Kapsamlı"     │
│  ──────────────────────────────  │
│  Tagline: "Tüm 23 Kromozom       │
│           Taraması"              │
│  ──────────────────────────────  │
│  Key Features (4 bullets):       │
│  • Kapsamlı Tarama               │
│  • Genetik Danışmanlık Included  │
│  • Detaylı Rapor (TR+EN)         │
│  • Bütün Anomalileri Kapsar      │
│  ──────────────────────────────  │
│  Price: [Dynamic] TL            │
│  ──────────────────────────────  │
│  CTA: "Veritas Hakkında Oku"    │
│  (Button: Amber tint)            │
└─────────────────────────────────┘

Card Visual Enhancements:
├─ Subtle shadow on hover (elevation effect)
├─ Smooth gradient bg (white → 1% color)
├─ Border: 1px solid gray-200
├─ Border-radius: lg (12px)
├─ Transition: 200ms ease-out

Mobile Adaptation:
├─ Full-width cards, stacked
├─ Featured card same size (not bigger)
└─ Swipeable carousel option (optional)
```

---

### 4. PROCESS SECTION ("Nasıl Çalışır?")

**Visual:** Timeline view

```
Timeline Layout (4 Steps):

Step 1: "Randevu Alın"
├─ Icon: Calendar icon (animated)
├─ Text: "nipt.tr'de 2 dakika da 
│        randevu rezervasyonu yapın"
├─ Details: "İl/ilçe seçin, doktor 
│           kodunuz varsa kullanın, 
│           tarih belirleyin"
└─ Time estimate: "2-3 dakika"

Step 2: "Evde Numune Alma"
├─ Icon: Nurse with tablet (illustrated)
├─ Text: "Omega Care hemşiresi 
│        evinize gelir, kan alır"
├─ Details: "Steril, profesyonel, 
│           hızlı. Bebek için hiçbir 
│           risk."
└─ Time estimate: "15 dakika"

Step 3: "Laboratuvarda Analiz"
├─ Icon: DNA helix (animated)
├─ Text: "Ruhsatlı lab, İleri 
│        teknoloji DNA sekanslama"
├─ Details: "Omega Genetik'te 
│           profesyonel analiz"
└─ Time estimate: "7-14 gün"

Step 4: "Sonuç & Destek"
├─ Icon: Checkmark (celebration animation)
├─ Text: "Sonuç doktorunuza ve size 
│        iletilir"
├─ Details: "Genetik danışman 
│           desteği mevcuttur"
└─ Time estimate: "1 gün"

Connecting Lines:
├─ Horizontal lines between steps
├─ Color: Gradient (Blue → Pink → Amber)
└─ Animation: Draw on scroll

Mobile: Vertical timeline (steps under each other)
```

---

### 5. OMEGA CREDENTIALS SECTION

**Title:** "Neden Bize Güvenebilirsiniz?"

**Layout:** Grid of trust indicators

```
CREDENTIAL 1: Lab Certificate
┌──────────────────────────────┐
│ 🏥 Sağlık Bakanlığı Ruhsatlı  │
│ ──────────────────────────    │
│ Omega Genetik - Molecular     │
│ Cytogenetics Laboratory       │
│ Ruhsat No: [XXXXX]            │
│ Geçerlilik: [2025]            │
└──────────────────────────────┘

CREDENTIAL 2: Experience
┌──────────────────────────────┐
│ 📊 30+ Yıllık Deneyim          │
│ ──────────────────────────    │
│ Omega Genetik & Omega Care    │
│ Türkiye'nin en eski ruhsatlı   │
│ laboratuvarlarından biri       │
└──────────────────────────────┘

CREDENTIAL 3: Omega Care
┌──────────────────────────────┐
│ 👩‍⚕️ Omega Care Ekibi          │
│ ──────────────────────────    │
│ Lisanslı hemşireler           │
│ Evde sağlık hizmeti           │
│ Profesyonel & Güvenilir       │
└──────────────────────────────┘

CREDENTIAL 4: Technology
┌──────────────────────────────┐
│ 🧬 Illumina Teknolojisi        │
│ ──────────────────────────    │
│ NextGen Sequencing (NGS)      │
│ Massive Parallel Seq (MPS)    │
│ %99,9 Doğruluk Oranı          │
└──────────────────────────────┘

CREDENTIAL 5: Data Security
┌──────────────────────────────┐
│ 🔐 KVKK Uyumlu                │
│ ──────────────────────────    │
│ Hasta Verisi Şifreli          │
│ Gizlilik Garantili            │
│ SSL Sertifikalı               │
└──────────────────────────────┘

CREDENTIAL 6: Support
┌──────────────────────────────┐
│ 💬 24/7 Destek                │
│ ──────────────────────────    │
│ Soru-Cevap Desteği            │
│ Genetik Danışman              │
│ WhatsApp Destek               │
└──────────────────────────────┘

Visual Style:
├─ Each box: Card with icon (40px) + text
├─ Icon color: Matches primary palette
├─ Border: Subtle, light gray
├─ Hover: Slight lift + shadow
└─ Background: Light tinted (color-specific)
```

---

### 6. FAQ SECTION

**Title:** "Sıkça Sorulan Sorular"

**Layout:** Accordion

```
Question 1: "NIPT Testi Ne Kadar Güvenli?"
Answer: "Tamamen güvenli ve riskfrei bir 
        invazif olmayan test. Sadece kan 
        örneğine ihtiyaç duyar. Hamile 
        kalma riski yoktur."

Question 2: "Sonuç Kaç Günde Gelir?"
Answer: "Teste bağlı olarak 7-14 gün. 
        Verifi (7-10 gün), MomGuard 
        (10-14 gün) sonuç verir."

Question 3: "Doktor Kodu Nedir?"
Answer: "Doktorunuzdan aldığınız özel kod 
        ile %5 indirim alabilirsiniz. 
        Booking formunda 'Doktor Kodu' 
        alanına yazın."

Question 4: "Hizmet Hangi İllerde Var?"
Answer: "Türkiye'nin 81 ilinde Omega Care 
        hemşireleri bulunmaktadır. Şehir 
        seçtikten sonra hizmet uygunluğunu 
        görebilirsiniz."

Question 5: "Sonuç Nasıl İletilir?"
Answer: "E-mail, hasta portalı ve doktor 
        paneli üzerinden. Genetik danışman 
        sonucu açıklamaya hazırdır."

Accordion Behavior:
├─ One open at a time
├─ Smooth expand/collapse animation
├─ Arrow icon rotation
└─ Highlight active item

Mobile: Full-width, stacked
```

---

### 7. TESTIMONIALS SECTION (Optional)

**Title:** "Hamile Annelerden Gelen Yorum"

```
Testimonial 1:
Profile Image: [Avatar]
Name: "Ayşe K. - 34 yaş"
Location: "Istanbul"
Quote: "Evimde test olmak çok rahat oldu. 
       Doktor endişeli, ama Omega Care 
       hemşiresi çok profesyonel ve güler 
       yüzlüydü. 10 günde sonuç geldi, 
       rahatladık."
Rating: ⭐⭐⭐⭐⭐
```

---

### 8. CTA SECTION (Before Footer)

**Layout:** Large emphasis box

```
Centered Content:
├─ Headline: "Endişelerinizi Bugün Giderin"
├─ Subtext: "Evinizden çıkmadan, profesyonel 
│           destek ile"
├─ Primary CTA: "Şimdi Randevu Alın" 
│  (Large button, Blue, hover → darker blue)
├─ Secondary CTA: "Daha Fazla Bilgi Gör" 
│  (Link style)
└─ Visual: Subtle background gradient 
           (Blue → Pink)

Mobile: Full-width buttons, stacked
```

---

### 9. FOOTER

```
Footer Content (4 Columns):

Column 1: Brand
├─ Logo
├─ "nipt.tr - Hamilelik Tanı Testi"
└─ Social Icons (Facebook, Instagram, YouTube)

Column 2: Quick Links
├─ Testler
├─ Nasıl Çalışır?
├─ Sağlık Bilgileri
└─ İletişim

Column 3: Information
├─ Hakkımızda
├─ KVKK & Gizlilik
├─ Şartlar & Koşullar
└─ Sertifikalar

Column 4: Contact
├─ Email: info@nipt.tr
├─ Phone: +90 (312) 920 13 62
├─ Address: Ankara, Beytepe
└─ WhatsApp Chat

Footer Bottom:
├─ Copyright © 2025 Omega Genetik
├─ "Powered by Omega Genetik & Omega Care"
└─ Accessibility info

Color: Dark background (#1F2937) + White text
```

---

## 🎬 ANIMATIONS & INTERACTIONS

### Micro-interactions
```
1. Scroll Fade-In
   └─ Elements fade in as they enter viewport
   └─ Duration: 600ms, ease-out
   └─ Delay: Staggered (100ms per element)

2. Button Hover
   └─ Lift effect: translateY(-2px)
   └─ Shadow increase
   └─ Duration: 200ms
   └─ Cursor: pointer

3. Card Hover
   └─ Subtle scale (1.02x)
   └─ Shadow increase
   └─ Border color change
   └─ Duration: 300ms

4. Accordion Open/Close
   └─ Height animation
   └─ Icon rotation (arrow)
   └─ Duration: 300ms

5. Form Input Focus
   └─ Border color: blue
   └─ Shadow: blue glow
   └─ Label lift (if floating)
   └─ Duration: 200ms

6. CTA Section
   └─ Floating animation (pulse)
   └─ Gradient animation
   └─ Continuous, slow (3s cycle)
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px

Mobile-First Approach:
├─ Stack all sections vertically
├─ Full-width cards & buttons
├─ Larger touch targets (44px min)
├─ Simplified navigation (hamburger)
└─ Font sizes: Larger for readability

Tablet:
├─ 2-column grid for cards
├─ Side navigation possible
└─ Optimized spacing

Desktop:
├─ Full 3-column layouts
├─ Horizontal sections
└─ Hover effects enabled
```

---

## 🎯 CONTENT GUIDELINES

### Tone & Voice
```
DO:
✓ Empathetic, warm, understanding
✓ Professional but not cold
✓ Reassuring ("Hiçbir kaygı yok")
✓ Clear, jargon-free explanations
✓ Action-oriented CTAs

DON'T:
✗ Scary, clinical language
✗ Confusing medical jargon
✗ Too casual, unprofessional
✗ Vague or uncertain promises
✗ Multiple conflicting CTAs
```

### Color Usage
```
Blue (#2563EB):   Trust, safety, medical
Pink (#EC4899):   Care, warmth, pregnancy
Amber (#F59E0B):  Support, guidance
Green (#10B981):  Success, validation, reassurance
Red (#F87171):    Important info (soft, not alarming)
```

---

## 🔒 TRUST & SECURITY

### Visual Trust Signals
- ✓ Sertifika badges (top of page)
- ✓ Professional photography/illustration
- ✓ Clear credentials (Omega Genetik, Omega Care)
- ✓ Testimonials (real images, specific details)
- ✓ KVKK & Data security mentions
- ✓ Contact info visible

### Copy Trust Signals
- ✓ "Sağlık Bakanlığı Ruhsatlı"
- ✓ "30+ Yıllık Deneyim"
- ✓ "%99,9 Doğruluk" (science-backed)
- ✓ "Genetik Danışman Desteği"
- ✓ "24/7 Müşteri Desteği"

---

## 📊 CONVERSION OPTIMIZATION

### Primary Goal: Booking Form Entry
```
Path to CTA:
1. Hero Section (Main CTA)
2. Cards Section (Card CTAs)
3. Process Section (Process CTA)
4. Testimonials (Proof CTAs)
5. Final CTA Section (Last chance)

CTA Principles:
- Clear, benefit-focused button text
- High contrast colors
- Strategic placement
- Multiple entry points
- No friction (direct to form)

Form Simplification:
- Max 5 fields on first screen
- Progressive disclosure
- Smart defaults (location-based)
- Real-time validation
- Confidence messages
```

---

## 🎨 LOVABLE DESIGN PRINCIPLES APPLIED

1. **Human-Centered:** Focus on the mother's emotional journey, not clinical details
2. **Warmth:** Soft colors, human illustrations, empathetic copy
3. **Clarity:** Simple language, clear hierarchy, no jargon
4. **Confidence:** Professional credentials, data-backed claims, social proof
5. **Accessibility:** High contrast, readable fonts, keyboard navigation
6. **Delight:** Subtle animations, smooth interactions, pleasant surprises
7. **Efficiency:** Fast form, clear process, quick bookings

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Structure
- [ ] Wireframes (mobile + desktop)
- [ ] Navigation flow
- [ ] Form field mapping
- [ ] API integration points

### Phase 2: Design
- [ ] High-fidelity mockups (Figma)
- [ ] Component library
- [ ] Animation specs
- [ ] Responsive layouts

### Phase 3: Development
- [ ] React components (Shadcn/ui based)
- [ ] Tailwind CSS styling
- [ ] Framer Motion animations
- [ ] Form integration

### Phase 4: Content
- [ ] Copy finalization
- [ ] Image/illustration sourcing
- [ ] Testimonial collection
- [ ] SEO optimization

### Phase 5: Testing
- [ ] Responsive design testing
- [ ] Form submission testing
- [ ] Accessibility audit (WCAG)
- [ ] Performance optimization

### Phase 6: Launch
- [ ] Plesk deployment
- [ ] Analytics setup (Google Analytics)
- [ ] Monitoring & alerts
- [ ] Post-launch optimization

---

## 🎬 PROTOTYPE PRIORITIES

**MVP (Week 1-2):**
- Hero section + 3 cards
- Process timeline
- Basic footer
- Mobile responsive

**v1.1 (Week 3):**
- FAQ section
- Credentials section
- Final CTA section
- Testimonials (if available)

**v1.2 (Week 4+):**
- Advanced animations
- Form integration
- Payment integration
- Analytics

---

**Design Version:** Lovable 1.0
**Target Audience:** Expecting mothers (hamile kadınlar)
**Tone:** Empathetic, professional, reassuring
**Color Palette:** Blue-Pink-Amber (trust + warmth + support)
**Status:** Ready for React component development
