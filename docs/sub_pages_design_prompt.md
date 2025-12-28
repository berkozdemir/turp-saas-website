# LOVABLE DESIGN PROMPT - TEST DETAIL PAGES & ABOUT US
## nipt.tr Sub-Pages: MomGuard | Verifi | Veritas | About Omega Genetik

---

## 🎯 PURPOSE

**Amaç:** Ana sayfadaki 3 test kartından gelen ziyaretçileri, her testin **özgün içeriğine, teknolojisine, ve avantajlarına** dayanan, **Sağlık Bakanlığı ruhsatı önde tutarak**, profesyonel ve rahatlatıcı sayfalara yönlendirmek.

**Sayfa Ağacı:**
```
nipt.tr (HOME)
├─ /momguard (MomGuard - LabGenomics)
├─ /verifi (Verifi - Illumina)
├─ /veritas (Veritas - Kapsamlı Test)
├─ /about (Hakkımızda - Omega Genetik & Omega Care)
└─ /booking (Booking Form - Tüm testler için shared)
```

---

## 🏗️ SHARED STRUCTURE (Tüm Test Sayfaları İçin)

### Layout Pattern
```
1. Header (Sticky, test-brand colored)
2. Hero Section (Test özgü visual + headline)
3. "Test Nedir?" Section (Educational)
4. "Teknoloji" Section (Science-backed)
5. "Ne Tespit Eder?" Section (Key features as list/table)
6. "Nasıl Çalışır?" Section (4-step process)
7. "Diğer Testlerden Farkı?" Section (Comparison)
8. "Kimler İçin Uygun?" Section (Use cases)
9. "Sonuçlar & Interpretasyon" Section (Output format)
10. FAQ Accordion (5-7 test-specific questions)
11. Trust Section (Credentials, Omega Genetik ruhsat, etc)
12. CTA Section ("Randevu Al" - Primary)
13. Footer (Shared)
```

### Color Scheme Per Test
```
MomGuard (LabGenomics):
├─ Primary: #10B981 (Green - Trust, health)
├─ Secondary: #F3F4F6 (Light gray background)
└─ Accent: #059669 (Darker green for CTAs)

Verifi (Illumina) - FEATURED:
├─ Primary: #2563EB (Blue - Confidence, leader)
├─ Secondary: #EFF6FF (Light blue background)
└─ Accent: #1E40AF (Dark blue for CTAs)

Veritas (Comprehensive):
├─ Primary: #F59E0B (Amber - Comprehensive, complete)
├─ Secondary: #FFFBEB (Light amber background)
└─ Accent: #D97706 (Dark amber for CTAs)
```

---

## 📄 PAGE 1: MomGuard Testi (`/momguard`)

### Visual Brand
```
Logo: LabGenomics corporate logo (top)
Hero Tagline: "Gebeliğin 9-10. Haftasından Yapılabilen, 
             %99,8 Doğruluk ile Genetik Anomalileri 
             Tespit Eden Test"
Hero Color: Soft green gradient (#F0FDF4 to #DCFCE7)
```

### Section 1: "MomGuard NIPT Nedir?"
```
Headline: "MomGuard - LabGenomics Teknolojisi"
Subtext: "Hamileliğin 9-10. haftasından yapılabilen, 
         evinizden çıkmadan, sadece kan örneğiyle 
         yapılan, Down, Edwards ve Patau sendromlarını 
         %99,8 doğruluk ile tespit eden test."

Content Block (Paragraf + Illustration):
├─ "MomGuard testi LabGenomics firması tarafından 
│  geliştirilmiş modern bir prenatal tarama testidir.
│  Hamileliğin erken haftalarında bebeğinizin genetik 
│  sağlığı konusunda kesin bir cevap verir."
│
├─ Illustration: Hamile kadın + kan alma işlemi 
│  (minimalist, reassuring style)
│
└─ Key Stat Box:
   ├─ %99,8 Doğruluk
   ├─ 10-14 Gün Sonuç
   └─ Risk Yok ✓
```

### Section 2: "Teknoloji: NGS (Next Generation Sequencing)"
```
Headline: "İleri Teknoloji + Illumina Altyapısı"

Content:
├─ "MomGuard testi, Illumina cihazları kullanarak 
│  yeni nesil sekanslama (NGS) metodu ile çalışmaktadır."
│
├─ Process Diagram:
│  Hamilelik Kan Örneği 
│    ↓ (Laboratuvara gönderme)
│  DNA İzolasyonu 
│    ↓ (Biyokimyasal ayrıştırma)
│  Sekanslama (Illumina)
│    ↓ (İleri teknoloji analiz)
│  Biyoinformatik Analiz
│    ↓ (AI-assisted interpretation)
│  Sonuç Raporu
│
└─ Trust Badge: 
   "Illumina - Dünya Lideri DNA Sekanslama Teknolojisi"
```

### Section 3: "Ne Tespit Eder?"
```
Headline: "MomGuard Test Sonuçları"

Feature List (Cards):
┌─────────────────────────────────┐
│ 📊 Trizomi 21 (Down Sendromu)   │
│ ────────────────────────────    │
│ 21. kromozomun 3 kopyasının     │
│ tetiklediği genetik rahatsızlık │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📊 Trizomi 18 (Edwards Sendromu)│
│ ────────────────────────────    │
│ 18. kromozomun 3 kopyasının     │
│ tetiklediği genetik rahatsızlık │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📊 Trizomi 13 (Patau Sendromu)  │
│ ────────────────────────────    │
│ 13. kromozomun 3 kopyasının     │
│ tetiklediği genetik rahatsızlık │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🔬 Cinsiyet Kromozom Anomalileri│
│ ────────────────────────────    │
│ X ve Y kromozom bozuklukları     │
│ (Nadir durumlar)                │
└─────────────────────────────────┘
```

### Section 4: "MomGuard Nasıl Yapılır?" (4 Steps)
```
Step 1: Randevu Alın (nipt.tr'de)
├─ Icon: 📅 Calendar
├─ Time: "2 dakika"
└─ Description: "Online formda siz, doktor, tarih bilgileri"

Step 2: Kan Alma (Evde)
├─ Icon: 💉 Blood draw
├─ Time: "15 dakika"
└─ Description: "Omega Care hemşiresi evinize gelir, 
                 steril tüpe kan alır"

Step 3: Laboratuvar Analizi (Ruhsatlı Lab)
├─ Icon: 🧬 DNA Helix
├─ Time: "10-14 gün"
└─ Description: "Omega Genetik'te (Sağlık Bakanlığı ruhsatlı) 
                 Illumina teknolojisi ile sekanslama"

Step 4: Sonuç & Danışmanlık
├─ Icon: ✅ Checkmark
├─ Time: "1 gün"
└─ Description: "E-mail + hasta portalı + doktor paneliyle 
                 sonuç iletişimi. Genetik danışman desteği."
```

### Section 5: "Diğer Testlerden Farkı?"
```
Comparison Table:

┌──────────────────┬─────────┬──────────┬────────────┐
│ Özellik          │ Anne Kan│ Amniyoak │ MomGuard   │
├──────────────────┼─────────┼──────────┼────────────┤
│ Doğruluk         │ 70-90%  │ 99%+     │ 99.8% ✓    │
│ Risk             │ Bilinmiş│ 0.1-0.2% │ 0% ✓       │
│ Invazif          │ Hayır   │ Evet ⚠️  │ Hayır ✓    │
│ Gebelik Riski    │ Yok     │ Var      │ Yok ✓      │
│ Sonuç Süresi     │ 1-2 gün │ 2-3 gün  │ 10-14 gün  │
│ İkiz Uygun       │ Sınırlı │ Zor      │ Evet ✓     │
└──────────────────┴─────────┴──────────┴────────────┘

Summary Box:
"MomGuard: Yüksek doğruluk, sıfır risk, evde yapılan 
modern test. Tüm hamile kadınlar için güvenli seçim."
```

### Section 6: "Kimler İçin Uygun?"
```
Use Cases (Cards with icons):

✓ Tüm hamile kadınlar (İsteğe bağlı)
✓ İleri gebelik yaşı (35+)
✓ Anne kanı tarama sonucu riskli
✓ Ultrason bulgusu anormal
✓ Aile geçmişinde genetik hastalıklar
✓ Önceki hamileliğinde problem
✓ IVF gebelikleri
✓ İkiz hamilelikler (tek plasentanız varsa)
```

### Section 7: "Sonuçlar: Nasıl Yorumlanır?"
```
Result Types:

NEGATIF SONUÇ ✓
├─ "Anormal bulgu tespit edilmedi"
├─ Kromozom bozukluğu riski: <1 in 10,000
└─ Doktor: "Sağlıklı devam edebilir"

POZİTİF SONUÇ ⚠️
├─ "Kromozom bozukluğu tespit edildi"
├─ Örnek: "Trizomi 21 (Down Sendromu) tespit"
└─ Doktor: "Amniyosentez ve genetik danışma önerilir"

BELİRSİZ SONUÇ (Çok Nadir - <0.5%)
├─ "Yeniden test gereklidir"
├─ Teknik nedenler
└─ Doktor: "3-4 hafta sonra yeniden kan alma"

Rapor Format:
├─ Türkçe + İngilizce
├─ Detaylı analiz
├─ Doktor tavsiyesi
└─ Genetik danışman iletişi
```

### Section 8: FAQ - MomGuard Specific
```
Q1: "MomGuard Tamamen Güvenli mi?"
A: "Evet. Sadece kan örneğine ihtiyaç duyar. 
   Bebeğinize zarar vermez. Yüzde yüz güvenlidir."

Q2: "Hangi Haftada Yapılabilir?"
A: "Hamileliğin 9-10. haftasından sonra yapılabilir. 
   Erken yapı açılmaya hemen fayda sağlamaz."

Q3: "Sonuç Pozitif Çıkarsa Ne Olur?"
A: "Doktor ile görüşmelisini. Amniyosentez 
   (daha kesin test) önerilir. Ancak haber kötü değildir; 
   birçok durumda tedavi seçenekleri vardır."

Q4: "Doktor Kodu ile Ne Kadar İndirim Alırım?"
A: "Doktorunuz tarafından kodlanmışsa, 
   %5 indirim otomatik uygulanır."

Q5: "Omega Care Bölgemde Var mı?"
A: "Türkiye'nin 81 ilinde bulunmaktadır. 
   Şehir seçilince otomatik kontrol edilir."

Q6: "Sonuç Raporunu Kime Göstermeli?"
A: "Kadın Doğum hekiminize mutlaka göstermelisiniz. 
   Rapor Türkçe ve İngilizce dildir."

Q7: "İkiz Hamilelik Uygun mu?"
A: "Tek plasentanız varsa evet. İki plasentanız varsa 
   danışman önermeliyiz."
```

### Section 9: Trust & Credentials
```
Credential Box:
┌─────────────────────────────────────┐
│ 🏥 SAĞLIK BAKANLIĞI RUHSATLI         │
│ ─────────────────────────────────   │
│ Omega Genetik - Genetik Hastalıklar  │
│ Değerlendirme Merkezi                │
│ Ruhsat No: GHDM-SM/06.21/01          │
│ Geçerlilik: 2025 (Yıllık Yenileme)   │
│ Lab Adı: OMEGA-PRO                   │
│ Lokasyon: Ankara, Beytepe            │
└─────────────────────────────────────┘

Supporting Badges:
├─ "Illumina Certified Partner"
├─ "ISO Standartları Uyumlu"
├─ "KVKK Uyumlu - Hasta Verisi Şifreli"
└─ "30+ Yıllık Deneyim"
```

### Section 10: CTA Section
```
Headline: "MomGuard Testi İçin Randevu Alın"
Subtext: "Evinizden çıkmadan, 10-14 günde kesin cevap"

Primary Button: "Şimdi Randevu Al" → `/booking?test=momguard`
Secondary Link: "Daha Fazla Bilgi" → FAQ scroll
```

---

## 📄 PAGE 2: Verifi Testi (`/verifi`) - FEATURED PAGE

### Visual Brand
```
Logo: Illumina + Verifi joint branding
Hero Tagline: "Sektörün En Yüksek Doğruluk Oranı: %99,9
             Tüm Trizomiler + Mikrodeletsiyonlar"
Hero Color: Blue gradient (#F0F9FF to #E0F2FE)
Badge: ⭐ "VERIFI - EN DOĞRU SONUÇ"
```

### Section 1: "Verifi NIPT Nedir?"
```
Headline: "Verifi - Dünyada Milyonlar Kullanan Test"

Content:
"Verifi Prenatal Test, Illumina firması tarafından 
geliştirilen, dünyanın en gelişmiş NIPT (Non-Invasive 
Prenatal Test) teknolojisidir. %99,9 doğruluk oranı 
ve %0,1 başarısızlık oranı ile sektörde güvenilir 
seçenektir.

Verifi, yalnızca trizomi 21, 18, 13'ü değil, aynı 
zamanda cinsiyet kromozom anomalileri ve 5 farklı 
mikrodelesyon sendromunu tespit edebilir."

Key Stats Box:
├─ %99,9 Doğruluk (SEKTÖR EN YÜKSEK)
├─ %0,1 Başarısızlık Oranı (SEKTÖR EN DÜŞÜK)
├─ 7-10 Gün Sonuç (HIZLI)
├─ 60+ ABD Üniversitesi Çalışması (VALİDE)
└─ Risk Yok ✓
```

### Section 2: "Teknoloji: Illumina MPS + SAFeR™"
```
Headline: "Dünya Lideri Teknoloji: Massive Parallel Sequencing"

Content:
"Verifi testi, Illumina'nın kendi geliştirdiği 
Massive Parallel Sequencing (MPS) teknolojisini 
kullanmaktadır. Bu teknoloji, bebeğin DNA'sının 
milyonlarca kopyasını hızlı ve doğru bir şekilde 
analiz eder.

SAFeR™ Algoritması:
- Proprietary Illumina biyoinformatik algoritması
- %99,9'a kadar doğruluk
- Gürültü filtrasyonu (false positive'i minimalize eder)
- Sinyal-to-Noise Oranı en iyi sınıfta"

Process Diagram:
Anne Kanı 
  ↓ DNA Extraction
Çoğaltma (Amplification)
  ↓ Library Preparation
Illumina Massive Parallel Sequencing
  ↓ Milyarlar DNA Fragment Okuması
Hamartifacts Filtration (SAFeR™)
  ↓ Advanced Statistical Analysis
Cromozom Trisomi Taraması
  ↓ Microdelete Panel
Genetik Danışman Onayı
  ↓ Rapor Yayınlama

Trust Badge:
"Dünya'nın 60+ Prestijli Araştırma Kurumu 
Tarafından Valide Edilmiş"
```

### Section 3: "Ne Tespit Eder?" (Comprehensive)
```
Headline: "Verifi'nin Geniş Kapsamı"

PRIMARY DETECTION (Tüm Verifi'ler):
┌────────────────────────────────┐
│ Trizomi 21 (Down Sendromu)     │
│ Trizomi 18 (Edwards Sendromu)  │
│ Trizomi 13 (Patau Sendromu)    │
│ Cinsiyet Kromozom Anomalileri  │
│  - Monozomi X (Turner)         │
│  - XXX (Triple X)              │
│  - XXY (Klinefelter)           │
│  - XYY (Jacob's)               │
└────────────────────────────────┘

OPTIONAL: MICRODELETE PANEL
(Ek ücret, ancak önerilir):

1. 1p36 Delesyonu
   └─ Ciddi gelişim geriliği + anomaliler

2. 4p- (Wolf-Hirschhorn)
   └─ Karakteristik yüz özellikleri

3. 5p- (Cri-du-Chat)
   └─ "Kedi sesi"si ağlama karakteristik

4. 15q11 (Prader-Willi / Angelman)
   └─ Gelişim + davranış sorunları

5. 22q11.2 (Di George)
   └─ Kalp defektleri + immünoloji problemleri

Highlight Box:
"Verifi Microdelete Panel: Daha geniş tanı yelpazesi 
için tercih edilen seçenek. Riskli gebeliklerde 
önerilir."
```

### Section 4: "Verifi Nasıl Yapılır?" (Same as MomGuard but faster)
```
Step 1: Randevu Alın
├─ Time: "2 dakika"
└─ Description: "nipt.tr'de online form"

Step 2: Kan Alma (Evde)
├─ Time: "15 dakika"
└─ Description: "Omega Care hemşiresi, steril tüp"

Step 3: Laboratuvar Analizi (Illumina)
├─ Time: "7-10 GÜN (EN HIZLI)" ⚡
└─ Description: "Omega Genetik + Illumina teknoloji"

Step 4: Sonuç
├─ Time: "1 gün"
└─ Description: "Rapor + danışman"
```

### Section 5: "Neden Verifi Seçmeliyim?"
```
Comparison: Verifi vs Diğerleri

┌──────────────────────┬──────┬──────┬──────────┐
│ Özellik              │ İlk  │ Eski │ Verifi   │
├──────────────────────┼──────┼──────┼──────────┤
│ Doğruluk             │ 95%  │ 98%  │ 99,9% ✓  │
│ Başarısızlık         │ 5%   │ 2%   │ 0,1% ✓   │
│ Sonuç Süresi         │ 2-3w │ 14d  │ 7-10d ✓  │
│ Microdelete          │ Yok  │ Nadir│ 5 adet ✓ │
│ Validasyon Çalışma   │ Yok  │ 5+   │ 60+ ✓    │
│ Dünyadaki Kullanıcı  │ Az   │ Orta │ Milyonlar│
└──────────────────────┴──────┴──────┴──────────┘

Why Choose Verifi:
✓ Sektörün en yüksek doğruluk oranı
✓ En düşük başarısızlık
✓ En hızlı sonuç
✓ Geniş microdelete paneli
✓ Dünyada en çok tercih edilen
✓ Bilimsel olarak en çok çalışılmış
```

### Section 6: "Kimler İçin Önerilir?"
```
ÖNEMLÜ ÖNERENLER (Doctors):
✓ Serum tarama riski yüksek (2-3% üstü)
✓ Ultrason anormallikleri
✓ Aile geçmişinde genetik hastalık
✓ Önceki hamilelikte sorun

OPSİYONEL:
✓ Tüm hamile kadınlar (tercihi)
✓ Psikiyatrik bariyerler (endişeli anneler)
✓ Genetik hastalık taşıyıcılığı riski
```

### Section 7: FAQ - Verifi Specific
```
Q1: "Verifi vs MomGuard: Farkı Nedir?"
A: "Verifi daha yüksek doğruluk (%99.9 vs %99.8), 
   daha hızlı sonuç (7-10 vs 10-14 gün) ve 
   microdelete paneli (5 sendrom) içerir. 
   MomGuard de iyi bir test, ama Verifi 'premium' seçeneğidir."

Q2: "Microdelete Panel Almam Gerekli mi?"
A: "Zorunlu değil, ama önerilir. Özellikle 35+ yaş, 
   serum riski yüksek, ultrason anormal ise tercih edilir."

Q3: "Verifi'nin Başarısızlık Riski Nedir?"
A: "0,1% - Sektörde en düşük. Başarısızlık durumunda 
   yeniden test yapılır (ücret yok)."

Q4: "Verifi Sonuçları Doktor Tarafından Kabul Ediliyor mu?"
A: "Evet. Verifi, FDA tarafından approved, 60+ üniversite 
   tarafından validate edilmiş, yüzde yüz kabul görmüş test."

Q5: "Verifi Raporunu Paylaşabilirim?"
A: "Evet. Rapor Türkçe ve İngilizce dildir. 
   Genetik danışman açıklaması dahildir."
```

### Section 8: Trust Section
```
Same as MomGuard but with emphasis on:
├─ "Illumina - Dünyanın DNA Sekanslama Lideri"
├─ "60+ ABD Üniversitesi Validasyonu"
├─ "FDA Approved (USA)"
├─ "CE Certified (Europe)"
└─ "GHDM Ruhsat: GHDM-SM/06.21/01"
```

### Section 9: CTA
```
Headline: "Verifi - En Güvenilir Seçim"
Primary Button: "Verifi İçin Randevu Al" → `/booking?test=verifi`
```

---

## 📄 PAGE 3: Veritas Testi (`/veritas`)

### Visual Brand
```
Logo: Veritas corporate branding
Hero Tagline: "Tüm 23 Kromozom + Kapsamlı Prenatal Taraması"
Hero Color: Amber gradient (#FFFBEB to #FEF3C7)
```

### Section 1: "Veritas - Kapsamlı Prenatal Screening"
```
Headline: "Veritas: En Geniş Kapsamlı Test"

Content:
"Veritas Prenatal Test, tüm 22 otozomal kromozom 
ve cinsiyet kromozomunun kapsamlı taramasını yapan, 
genetik anomalileri tüyü titiz şekilde tespit eden 
modern prenatal testdir.

Veritas, standart NIPT'in tüm avantajlarına ek olarak, 
kapsamlı genetik rapor ve genetik danışman desteği 
sağlar."

Key Highlights:
├─ Tüm 23 Kromozom Taraması
├─ Kapsamlı Anomali Analizi
├─ Genetik Danışmanlık Included
├─ Türkçe + İngilizce Rapor
└─ Gelişmiş Biyoinformatik
```

### Section 2: "Teknoloji"
```
(Veritas specific tech details - sitelerinden alıp eklenecek)

Headline: "Veritas Teknoloji Platformu"

Content Placeholder:
"[Veritas sitesinden teknoloji detayları]"
```

### Section 3: "Ne Tespit Eder?"
```
Detection Scope:

Standart Trizomiler:
├─ Trizomi 21 (Down)
├─ Trizomi 18 (Edwards)
└─ Trizomi 13 (Patau)

Cinsiyet Kromozom Anomalileri:
├─ Monozomi X
├─ XXX
├─ XXY
└─ XYY

Tüm 22 Otozomal Kromozom:
└─ Herhangi bir imbalans

Opsiyonel Microdelete:
├─ 1p36
├─ 4p
├─ 5p
├─ 15q11
└─ 22q11.2

Advantage:
"Veritas: Hiçbir anomali test dışında kalmaz. 
En kapsamlı prenatal taraması."
```

### Section 4-9: Same structure as MomGuard/Verifi
```
- Nasıl Yapılır? (4 steps)
- Kimler İçin Uygun?
- Sonuçlar
- FAQ (5-7 questions)
- Trust & Credentials
- CTA
```

---

## 📄 PAGE 4: Hakkımızda (`/about`)

### Visual Strategy
```
Layout: Two-column (desktop), stacked (mobile)
Left: Text + history timeline
Right: Illustration of Omega Genetik team + lab building

Color Palette:
├─ Primary: #134252 (Dark Blue - Trust, authority)
├─ Accent: #2563EB (Bright Blue - Innovation)
└─ Background: #F9FAFB (Neutral)
```

### Section 1: Hero - Brand Story
```
Headline: "Omega Genetik: 30+ Yıllık Genetik Sağlık Liderliği"
Subheadline: "Türkiye'nin Ruhsatlı Genetik Laboratuvarı 
            + Omega Care Evde Sağlık Ekibi"

Hero Copy:
"Omega Genetik, son teknolojileri ve bilimsel gelişmeleri 
yakından takip ederek, Türkiye'nin İLK ve KÖKLÜ 
ruhsatlı Genetik Hastalıklar Değerlendirme Merkezlerinden 
biridir.

30+ yıldır:
✓ Hassas genetik testler
✓ Genetik danışmanlık
✓ Prenatal screening
✓ Yenidoğan taraması
✓ Evde sağlık hizmeti

Ruhsat No: GHDM-SM/06.21/01 (Sağlık Bakanlığı)"
```

### Section 2: "Misyon & Vizyon"
```
Layout: Side-by-side cards

MISYON KART:
Headline: "🎯 Misyon"
Content: "Türkiye'de genetik sağlık hizmetlerinde 
yüksek standar sağlamak. Hamile annelere, yenidoğunlara, 
ve ailelere, bilimsel rigordan ödün vermeyen 
testler sunmak."

VIZYON KART:
Headline: "🌟 Vizyon"
Content: "Genetik hastalıkların erken teşhis ve 
yönetiminde Türkiye'nin öncü kurumu olmak. 
İnovasyon ve erişilebilirlikle insanlık sağlığına 
katkı sunmak."
```

### Section 3: "Ruhsat & Akreditasyon"
```
SAĞLIK BAKANLIĞI RUHSATI (PROMINENT)

┌─────────────────────────────────────────┐
│ 🏥 T.C. SAĞLIK BAKANLIĞI RUHSATI        │
│ ─────────────────────────────────────   │
│ Unvan: ÖZEL OMEGA-PRO GENETİK           │
│        HASTALIKLAR DEĞERLENDİRME        │
│        MERKEZİ                          │
│                                         │
│ Ruhsat No: GHDM-SM/06.21/01             │
│ Veriliş Tarihi: 21 Haziran 2006         │
│ Geçerlilik: Yıllık Yenilenme            │
│ Son Yenileme: 2025                      │
│                                         │
│ Makam: T.C. Sağlık Bakanlığı            │
│        Halk Sağlığı Genel Müdürlüğü     │
│                                         │
│ Hizmetler:                              │
│ ✓ Sitogenetik Testler                  │
│ ✓ Moleküler Sitogenetik (FISH)         │
│ ✓ Moleküler Genetik                    │
│ ✓ Prenatal Screening (NIPT)            │
│ ✓ Yenidoğan Taraması                   │
│ ✓ Genetik Danışmanlık                  │
│ ✓ Yurt Dışı Materyal Transferi         │
└─────────────────────────────────────────┘

Ruhsat Anlamı:
"Sağlık Bakanlığı ruhsatı, laboratuvarımızın 
uluslararası standartları karşıladığını, 
kalite kontrol prosedürlerini takip ettiğini, 
genetik testlerde bilimsel doğruluğu sağladığını 
resmi olarak beyan eder."
```

### Section 4: "Ekibimiz"
```
Team Structure (Visual Org Chart):

Yönetici Direktör
├─ Lab Director (PhD Genetik)
├─ Clinical Geneticist (Tıp Doktoru)
├─ Molecular Biologists (2-3 adet)
├─ Cytogeneticists (Sitogenetikçi)
├─ Bioinformaticians (Biyoinformatik)
├─ Genetic Counselors (Genetik Danışmanlar)
└─ Omega Care Nurses (Hemşireler)

Team Quote Box:
"Alanlarında uzman, empati-odaklı profesyonellerden 
oluşan ekibimiz, her hasta için kişiselleştirilmiş 
hizmet sunar."

Images:
├─ Lab techs at work (microscope/sequencer)
├─ Genetic counselor with patient (empathy focus)
├─ Nurse drawing blood (Omega Care)
└─ Meeting room (team collaboration)
```

### Section 5: "Teknoloji & Altyapı"
```
Equipment & Systems (Grid layout):

ILLUMINA SEQUENCİNG SYSTEM
├─ Model: [Specific model]
├─ Capacity: [Samples/day]
└─ Teknoloji: Massive Parallel Sequencing (MPS)

FISH SISTEMLERI
├─ Otomatis Mikroskopi
├─ Prenatal & Karyotype Analizleri
└─ Sitogenetik Tests

CLOUD-BASED LIS
├─ Laboratory Information System
├─ Patient Tracking
├─ Secure Data Management (KVKK)
└─ Real-time Reporting

BIOINFORMATICS PLATFORM
├─ Custom Algorithms
├─ Quality Control
├─ Advanced Filtration (SAFeR™ equivalent)
└─ Statistical Analysis

SECURITY & COMPLIANCE
├─ SSL Encryption (HTTPS)
├─ Patient Data Encryption
├─ KVKK Compliance
├─ Regular Audits
└─ Backup Systems
```

### Section 6: "Omega Care - Evde Sağlık Hizmeti"
```
Headline: "Omega Care: Evde Kan Alma Hizmeti"

Content:
"Omega Genetik'in stratejik ortağı olan Omega Care, 
hamile annelerin evinde, işinde, veya seçtikleri 
konumda kan alma hizmeti sunan, lisanslı hemşireler 
aracılığıyla sağlık hizmeti sağlayıcısıdır.

OMEGA CARE'İN AVANTAJLARI:
✓ Türkiye'nin 81 ilinde hizmet
✓ Lisanslı hemşireler
✓ Steril prosedürler
✓ Esnek zaman planlama
✓ Profesyonel + sıcak yaklaşım
✓ Anında sonuç doğrulama

Integration:
Omega Genetik ↔ Omega Care ↔ Hasta
    (Lab)      (Preanalytic)  (Home)

Bu entegrasyon, hamile annelerin 'evde rahat' 
ile 'laboruvar kalitesi'ni birleştirir."

Omega Care Badge:
[Omega Care logo + "Licensed Home Healthcare Provider"]
```

### Section 7: "Tarihçe & Başarılar"
```
Timeline (Visual):

2000s
├─ Omega Genetik Kurulması (İlk ruhsatlı merkezlerden biri)
└─ Sitogenetik testler başlangıcı

2010s
├─ Moleküler Genetik Lab açılması
├─ FISH Teknolojisine geçiş
└─ Illumina Sekanslama Sistemi kurulum

2020s
├─ NIPT testlerinde liderlik
├─ Omega Care entegrasyonu
├─ 30.000+ NIPT test başarı
├─ Türkiye'de 3 NIPT test seçeneği sunuş
└─ nipt.tr platformu lansman

2025
├─ Multi-tenant NIPT platform (MomGuard, Verifi, Veritas)
├─ 100.000+ NIPT test kümülatif
└─ Türkiye'de en geniş kapsamlı NIPT hizmeti
```

### Section 8: "Başarı Göstergeleri" (Stats)
```
Stats Grid:

30+
Yıl Deneyim

100,000+
Başarılı NIPT Test

81
İl Hizmet Alanı

3
Farklı NIPT Seçeneği

1000+
Mutlu Anne (nerede?)

99.9%
Doğruluk (Verifi)

24/7
Müşteri Desteği
```

### Section 9: "Neden Bize Güvenebilirsiniz?"
```
Trust Pillar 1: RUHSATLı
├─ Sağlık Bakanlığı resmi izni
├─ Yıllık kontrol & yenilenme
└─ Kalite standartları

Trust Pillar 2: TECNOLOJİ
├─ Dünya lider Illumina cihazları
├─ Gelişmiş biyoinformatik
└─ Real-time quality control

Trust Pillar 3: DENEYIM
├─ 30+ yıl genetik sağlık
├─ 100,000+ test
└─ Türkiye'de ön saflar

Trust Pillar 4: GÜVENLIK
├─ KVKK uyumlu veri yönetimi
├─ SSL şifreleme
└─ Hastane-level prosedürler

Trust Pillar 5: DESTEK
├─ Genetik danışmanlar
├─ 24/7 telefon desteği
└─ WhatsApp iletişim

Trust Pillar 6: TÜM KAPSAMLI
├─ 3 test seçeneği
├─ Evde hizmet (Omega Care)
└─ Bütün Türkiye
```

### Section 10: "Sertifikalar & Üyelikler"
```
Display certificates/logos:

┌─────────────────┐  ┌────────────┐  ┌────────────┐
│ Sağlık          │  │ ISO        │  │ KVKK       │
│ Bakanlığı       │  │ Certified  │  │ Uyumlu     │
│ Ruhsatlı        │  │            │  │            │
└─────────────────┘  └────────────┘  └────────────┘

┌──────────────────────────────┐
│ Illumina Clinical Partner    │
└──────────────────────────────┘

External certifications (if any):
├─ CAP Accreditation (if applicable)
├─ College of American Pathologists
└─ ISO 15189 Medical Lab Standards
```

### Section 11: "İletişim & Ziyaret"
```
Contact Information:

Adres:
Piri Reis Caddesi
Beytepe Ankajob Sitesi No: 4
Beytepe Mahallesi / ANKARA

Telefon:
+90 (312) 920 13 62

E-mail:
info@omegagenetik.com

WhatsApp:
[WhatsApp Business button]

Çalışma Saatleri:
Pazartesi - Cuma: 08:00 - 18:00
Cumartesi: 09:00 - 14:00
Pazar: Kapalı

Ziyaret:
"Laboruvarımızı ziyaret edebilirsiniz. 
Önceden randevu önerilir: info@omegagenetik.com"

Map:
[Embedded Google Map - Ankara, Beytepe location]
```

### Section 12: FAQ - About Omega
```
Q: "Omega Genetik gerçekten ruhsatlı mı?"
A: "Evet. Sağlık Bakanlığı tarafından resmi olarak 
   ruhsatlandırılmış. Ruhsat No: GHDM-SM/06.21/01. 
   Yıllık kontrol ve yenilemedir."

Q: "Verilerim güvenli mi?"
A: "Evet. KVKK uyumlu, SSL şifreli, hasta verisi 
   hassas korunur. Hastane standartlarında güvenlik."

Q: "Hastaların sırrı korunur mu?"
A: "Evet. Tıbbi gizlilik kesinlikle korunur. 
   Rapor sadece hasta ve doktor tarafından erişilir."

Q: "Doktor seçebilir miyim?"
A: "Evet. Randevu sırasında kadın doğum doktor tercihini 
   belirtebilirsiniz."

Q: "Sonuç hızla mı gelir?"
A: "Teste bağlı olarak 7-14 gün. Verifi en hızlısıdır 
   (7-10 gün)."

Q: "Başka şehirde miyim, hizmet var mı?"
A: "Evet. 81 ilde Omega Care hemşireleri bulunmaktadır. 
   Lokasyon seçince kontrol edilir."
```

### Section 13: CTA - Hakkımızda
```
Headline: "Uzman Desteği İçin Bize Ulaşın"
Primary Button: "Randevu Al" → `/booking`
Secondary Link: "Direkt İletişim" → Contact section scroll
```

---

## 🎨 DESIGN CONSISTENCY ACROSS ALL PAGES

### Header (Shared across all pages)
```
Sticky Header:
├─ Left: Logo (nipt.tr)
├─ Center: Navigation
│  ├─ MomGuard
│  ├─ Verifi
│  ├─ Veritas
│  ├─ Hakkımızda
│  └─ Sağlık Bilgileri (future)
├─ Right: Primary CTA "Randevu Al"
└─ Color: White + soft shadow

Mobile: Hamburger menu (3-line icon)
```

### Color Consistency
```
Each page should reflect its test color while maintaining:
├─ Same typography (Geist)
├─ Same spacing scale (8px baseline)
├─ Same button styles (brand blue for primary CTAs)
├─ Same rounded corners (12px borders)
└─ Same hover/transition effects (200ms ease-out)

Exception:
├─ Hero section color per test (green, blue, amber)
├─ Accent colors for emphasis
└─ Credential box always uses blue (authority)
```

---

## 📱 RESPONSIVE BEHAVIOR

### Mobile Optimization (< 640px)
```
All Test Pages:
├─ Stack all sections vertically
├─ Full-width cards
├─ Text centered
├─ Buttons full-width, stacked
├─ Hero section reduced height
├─ Comparison table → horizontal scroll

About Page:
├─ Timeline becomes vertical
├─ Two-column becomes single-column
├─ Team section becomes carousel (swipeable)
├─ Contact info emphasized at top
```

---

## 🎯 CONVERSION PATHS

### MomGuard Path
1. Hero → "MomGuard Detaylarına Bak" CTA
2. Section 5 (Comparison) → "Şimdi Başlayın"
3. Section 10 (CTA) → "Şimdi Randevu Al" → `/booking?test=momguard`

### Verifi Path (FEATURED)
1. Hero → "Verifi İçin Randevu Al" CTA
2. Section 2 (Why) → "Premium Seçimini Yap"
3. Section 9 (CTA) → `/booking?test=verifi`

### Veritas Path
1. Hero → "Kapsamlı Tarama Al" CTA
2. Section 3 (Detection) → "Tüm Kapsamı Gör"
3. Section 8 (CTA) → `/booking?test=veritas`

### About Page Path
1. Hero → "Randevu Al" CTA
2. Credentials → "Hemen Başla" CTA
3. Contact section → Direct booking or inquiry

---

## ✅ IMPLEMENTATION CHECKLIST

### Content Phase
- [ ] MomGuard testi:Detaylı bilgiler + teknik specs
- [ ] Verifi testi: Detaylı bilgiler + SAFeR™ açıklaması
- [ ] Veritas testi: Detaylı bilgiler (siteden alınacak)
- [ ] About page: Ruhsat bilgileri, ekip, tarihçe
- [ ] FAQ answers: Test-specific questions cevapları
- [ ] Copy review: Tone & voice consistency

### Design Phase
- [ ] Wireframes (all pages, mobile + desktop)
- [ ] High-fidelity mockups (Figma)
- [ ] Color palette per page finalization
- [ ] Icon selection (medical, trust, process)
- [ ] Illustration specifications (hero visuals)
- [ ] Component library expansion (accordion, timeline, cards)

### Development Phase
- [ ] React page components (`/momguard`, `/verifi`, `/veritas`, `/about`)
- [ ] Shared layout components (header, footer)
- [ ] Page-specific color theming (CSS variables)
- [ ] Responsive mobile styling
- [ ] Accessibility audit (WCAG)
- [ ] SEO optimization (meta tags per page)

### Content Assets
- [ ] LabGenomics logo (SVG/PNG)
- [ ] Illumina + Verifi logos
- [ ] Veritas logo
- [ ] Omega Genetik logo + credentials
- [ ] Ruhsat certificate scan (high-res)
- [ ] Illustration: Hamile kadın + hemşire
- [ ] Illustration: DNA/lab visuals
- [ ] Team photos (professional)
- [ ] Lab equipment photos
- [ ] Building/office photos

### Testing & Launch
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsiveness (iOS + Android)
- [ ] Form integration testing (booking flow)
- [ ] Analytics setup (Google Analytics goals per page)
- [ ] Page load performance (< 3 seconds)
- [ ] SEO crawlability (sitemap, robots.txt)
- [ ] GDPR/KVKK compliance review

---

**Document Version:** Sub-Pages 1.0
**Target Pages:** 4 (MomGuard, Verifi, Veritas, About)
**Color Palette:** Green, Blue, Amber per test + Primary Blue for CTAs
**Typography:** Geist (consistent across all)
**Status:** Ready for Figma design mockups

---

## 📊 CONTENT SUMMARY (Word Count Target)

| Page | Hero | Sections | FAQ | Total |
|------|------|----------|-----|-------|
| MomGuard | 150w | 1000w | 600w | 1750w |
| Verifi | 150w | 1100w | 700w | 1950w |
| Veritas | 150w | 900w | 600w | 1650w |
| About | 200w | 1500w | 600w | 2300w |

**Total Needed: ~7,650 words**
**Language: Türkçe + Empathi-odaklı + Teknik doğru**

---

**Next Steps:**
1. ✅ Prompt yazılması tamamlandı
2. ⏳ Figma mockups
3. ⏳ React component development
4. ⏳ Content finalization (all test details)
5. ⏳ Plesk deployment
