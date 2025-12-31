# 📋 CONTACT PAGE (İLETİŞİM SAYFASI) - PROMPT & SPECIFICATION

---

## 🎯 PAGE OVERVIEW

**URL:** `/iletisim` (nipt.tr, westesti.com, trombofili.com)  
**Purpose:** Multi-channel contact hub + Quick inquiry form  
**User Intent:** Get in touch, ask questions, schedule calls  
**Conversion Goal:** Capture contact info for sales follow-up  

---

## 📐 PAGE STRUCTURE

```
┌─────────────────────────────────────────────┐
│ HERO SECTION                                │
│ "Bize Ulaşın" + Subtitle                    │
│ Background: Soft medical gradient            │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ 4-COLUMN CONTACT METHODS (Icon + Text)      │
│ ├─ Phone (direct call)                      │
│ ├─ Email (info@)                            │
│ ├─ WhatsApp (direct link)                   │
│ └─ Live Chat (widget integration)           │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ TWO-COLUMN LAYOUT (70/30)                   │
│ ├─ LEFT (70%): Contact Form                 │
│ │  ├─ Name (required)                       │
│ │  ├─ Email (required)                      │
│ │  ├─ Phone (required)                      │
│ │  ├─ Subject (dropdown: booking, question) │
│ │  ├─ Message (textarea)                    │
│ │  ├─ Consent checkbox                      │
│ │  └─ Submit button                         │
│ │                                           │
│ └─ RIGHT (30%): Company Info                │
│    ├─ Office Address                        │
│    ├─ Business Hours                        │
│    ├─ Response Time SLA                     │
│    └─ Social Media Links                    │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ EMBEDDED MAP (Google Maps)                  │
│ Show office location(s)                      │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ FAQ SECTION (Collapsed)                     │
│ "Sık Sorulan Sorular"                       │
│ Top 5 questions with answers                │
└─────────────────────────────────────────────┘
```

---

## 📝 COMPLETE HTML PROMPT

### For Frontend Developer:

```
BUILD A MODERN CONTACT PAGE WITH:

HERO SECTION:
- Large heading "Bize Ulaşın"
- Subheading "Sorularınız, kaygılarınız ve randevu talepleriniz için bize ulaşın"
- Background: Gradient (primary color to lighter shade)
- Text alignment: Center
- Padding: Large (60px top/bottom)

CONTACT METHODS (4 Cards):
- Phone: "0312 920 13 62" + Click to call button
- Email: "info@nipt.tr" + Click to email button
- WhatsApp: "+905121234567" + Click to WhatsApp button
- Live Chat: Widget button (integrate Zendesk/Intercom later)

Each card should have:
- Large icon (48x48px)
- Card background: Subtle (--color-secondary)
- Hover effect: Lift up slightly
- Text color: Primary
- Click action: Links to respective action

CONTACT FORM (Left column, 70%):
- Field 1: Name (text input, required, min 2 chars)
- Field 2: Email (email input, required, valid email)
- Field 3: Phone (tel input, required, +90 format)
- Field 4: Subject (select dropdown)
  Options:
  - "Randevu Talebi" (Booking)
  - "Genel Soru" (General Question)
  - "Test Bilgisi" (Test Information)
  - "Teknik Destek" (Technical Support)
  - "Geri Bildirim" (Feedback)
- Field 5: Message (textarea, required, min 20 chars)
- Field 6: Privacy consent (checkbox, required)
  Text: "Kişisel verilerimin [privacy policy] uyarınca işlenmesini onaylıyorum"
- Submit button: "Gönder" (blue, full width)
- Success message: "Teşekkürler! En kısa zamanda size dönüş yapacağız."
- Error handling: Show field-specific errors in red

COMPANY INFO (Right column, 30%):
- Box title: "İletişim Bilgileri"
- Content:
  Address:
  "Omega Genetik
  Kızılbey Mah. 18. Cad. No:12
  ANKARA 06100
  TÜRKİYE"

  Business Hours:
  "Pazartesi - Cuma: 08:00 - 18:00
  Cumartesi: 09:00 - 16:00
  Pazar: KAPAL"

  Response Time:
  "E-posta: 2 saat içinde
  Telefon: Hemen
  WhatsApp: 30 dakika içinde"

  Social Media:
  - Icons for: Facebook, Instagram, LinkedIn, Twitter
  - Links to company pages

EMBEDDED MAP:
- Google Maps API
- Show office location(s)
- Marker with office name
- Allow zoom/pan
- Height: 400px

FAQ SECTION:
- Title: "Sık Sorulan Sorular"
- Accordion style (collapsible)
- Questions:
  1. "Randevu almak için nereye iletişime geçmeliyim?"
  2. "Hafta sonları hizmet veriyorsanız mı?"
  3. "Acil durumlarda kim çağıracağım?"
  4. "Kişisel verilerim güvenli mi?"
  5. "Yurt dışından hizmet alabilir miyim?"
- Each answer: 2-3 sentences max

RESPONSIVE DESIGN:
- Desktop: 2-column (form + info)
- Tablet (768px): Stack vertically
- Mobile (375px): Full width form, then info
- All interactive elements: Mobile-friendly touch targets (48px min)

ACCESSIBILITY:
- All form fields have associated labels
- Error messages linked to fields (aria-describedby)
- Color contrast: 4.5:1 for text
- Focus indicators visible
- Form validation: Client-side + server-side

FORM SUBMISSION:
- On submit: Send to backend API (/api/v1/contact)
- Optimistic UI: Disable button, show loading
- Success: Show message, clear form
- Error: Show error message, keep form data
- After success: Redirect or show success modal (3 second delay)

TENANT-SPECIFIC VARIATIONS:
- nipt.tr: Full contact methods + map
- westesti.com: Replace address with West region office + map
- trombofili.com: Same format, different contact info

ANALYTICS TRACKING:
- Page view: "contact_page_viewed"
- Form started: "contact_form_started"
- Form submitted: "contact_form_submitted"
- Field error: "contact_form_error"
- Success: "contact_form_success"
```

---

## 💻 HTML/CSS/JS SKELETON

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bize Ulaşın - Omega Genetik</title>
  <meta name="description" content="Omega Genetik ile iletişime geçin: Tel: 0312 920 13 62, Email: info@nipt.tr, Whatsapp, canlı sohbet.">
  <link rel="stylesheet" href="/styles/contact.css">
</head>
<body>
  <!-- HERO SECTION -->
  <section class="hero hero--contact">
    <div class="container">
      <h1>Bize Ulaşın</h1>
      <p>Sorularınız, kaygılarınız ve randevu talepleriniz için bize ulaşın</p>
    </div>
  </section>

  <!-- CONTACT METHODS (4 CARDS) -->
  <section class="contact-methods">
    <div class="container">
      <div class="methods-grid">
        <!-- PHONE -->
        <div class="method-card">
          <div class="method-icon">📞</div>
          <h3>Telefon</h3>
          <p>0312 920 13 62</p>
          <a href="tel:+903129201362" class="btn btn--secondary">Ara</a>
        </div>

        <!-- EMAIL -->
        <div class="method-card">
          <div class="method-icon">✉️</div>
          <h3>E-posta</h3>
          <p>info@nipt.tr</p>
          <a href="mailto:info@nipt.tr" class="btn btn--secondary">Gönder</a>
        </div>

        <!-- WHATSAPP -->
        <div class="method-card">
          <div class="method-icon">💬</div>
          <h3>WhatsApp</h3>
          <p>+90 512 123 45 67</p>
          <a href="https://wa.me/905121234567" class="btn btn--secondary" target="_blank">Mesaj Gönder</a>
        </div>

        <!-- LIVE CHAT -->
        <div class="method-card">
          <div class="method-icon">💻</div>
          <h3>Canlı Sohbet</h3>
          <p>Hemen konuş</p>
          <button class="btn btn--secondary" onclick="openLiveChat()">Başla</button>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTACT FORM + INFO (2 COLUMN) -->
  <section class="contact-main">
    <div class="container">
      <div class="contact-grid">
        <!-- LEFT: FORM -->
        <div class="contact-form-wrapper">
          <h2>Bize Yazın</h2>
          <form id="contactForm" class="contact-form">
            <!-- Name -->
            <div class="form-group">
              <label for="name">Ad Soyad *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                minlength="2"
                placeholder="Adınız Soyadınız"
                aria-required="true"
              >
              <span class="error-message" id="nameError"></span>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">E-posta *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="ornek@example.com"
                aria-required="true"
              >
              <span class="error-message" id="emailError"></span>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone">Telefon *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required
                placeholder="+90 (312) 920-1362"
                pattern="^\+?90[0-9]{10}$"
                aria-required="true"
              >
              <span class="error-message" id="phoneError"></span>
            </div>

            <!-- Subject -->
            <div class="form-group">
              <label for="subject">Konu *</label>
              <select id="subject" name="subject" required aria-required="true">
                <option value="">-- Seçiniz --</option>
                <option value="booking">Randevu Talebi</option>
                <option value="question">Genel Soru</option>
                <option value="test_info">Test Bilgisi</option>
                <option value="technical">Teknik Destek</option>
                <option value="feedback">Geri Bildirim</option>
              </select>
              <span class="error-message" id="subjectError"></span>
            </div>

            <!-- Message -->
            <div class="form-group">
              <label for="message">Mesaj *</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                minlength="20"
                rows="5"
                placeholder="Detaylı mesajınızı yazın..."
                aria-required="true"
              ></textarea>
              <span class="error-message" id="messageError"></span>
            </div>

            <!-- Consent -->
            <div class="form-group checkbox">
              <input 
                type="checkbox" 
                id="consent" 
                name="consent" 
                required
                aria-required="true"
              >
              <label for="consent">
                Kişisel verilerimin <a href="/privacy">gizlilik politikası</a> uyarınca işlenmesini onaylıyorum *
              </label>
              <span class="error-message" id="consentError"></span>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn--primary btn--lg">Gönder</button>
            
            <!-- Success Message -->
            <div class="success-message hidden" id="successMessage">
              ✅ Teşekkürler! En kısa zamanda size dönüş yapacağız.
            </div>
          </form>
        </div>

        <!-- RIGHT: COMPANY INFO -->
        <div class="contact-info-wrapper">
          <div class="info-card">
            <h3>İletişim Bilgileri</h3>

            <!-- Address -->
            <div class="info-section">
              <h4>📍 Adres</h4>
              <address>
                Omega Genetik<br>
                Kızılbey Mah. 18. Cad. No:12<br>
                ANKARA 06100<br>
                TÜRKİYE
              </address>
            </div>

            <!-- Hours -->
            <div class="info-section">
              <h4>⏰ Çalışma Saatleri</h4>
              <p>
                <strong>Pazartesi - Cuma:</strong> 08:00 - 18:00<br>
                <strong>Cumartesi:</strong> 09:00 - 16:00<br>
                <strong>Pazar:</strong> Kapalı
              </p>
            </div>

            <!-- Response Time -->
            <div class="info-section">
              <h4>⚡ Yanıt Süresi</h4>
              <p>
                <strong>E-posta:</strong> 2 saat içinde<br>
                <strong>Telefon:</strong> Hemen<br>
                <strong>WhatsApp:</strong> 30 dakika içinde
              </p>
            </div>

            <!-- Social Media -->
            <div class="info-section">
              <h4>📱 Sosyal Medya</h4>
              <div class="social-links">
                <a href="https://facebook.com/ometagenetik" target="_blank" aria-label="Facebook">f</a>
                <a href="https://instagram.com/ometagenetik" target="_blank" aria-label="Instagram">📷</a>
                <a href="https://linkedin.com/company/ometagenetik" target="_blank" aria-label="LinkedIn">in</a>
                <a href="https://twitter.com/ometagenetik" target="_blank" aria-label="Twitter">𝕏</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- EMBEDDED MAP -->
  <section class="contact-map">
    <div class="container">
      <h2>Konumumuz</h2>
      <div id="map" style="height: 400px; border-radius: 8px;"></div>
    </div>
  </section>

  <!-- FAQ SECTION -->
  <section class="contact-faq">
    <div class="container">
      <h2>Sık Sorulan Sorular</h2>
      
      <div class="faq-list">
        <!-- FAQ Item 1 -->
        <div class="faq-item">
          <button class="faq-question" onclick="toggleFaq(this)">
            <span>Randevu almak için nereye iletişime geçmeliyim?</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-answer hidden">
            <p>Randevu almak için telefon, e-posta veya WhatsApp aracılığıyla bize ulaşabilirsiniz. İletişim formunu doldurarak da talebinizi iletebilirsiniz.</p>
          </div>
        </div>

        <!-- FAQ Item 2 -->
        <div class="faq-item">
          <button class="faq-question" onclick="toggleFaq(this)">
            <span>Hafta sonları hizmet veriyorsanız mı?</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-answer hidden">
            <p>Evet, Cumartesi günleri 09:00-16:00 saatleri arasında hizmet veriyoruz. Pazar günleri kapalıyız.</p>
          </div>
        </div>

        <!-- FAQ Item 3 -->
        <div class="faq-item">
          <button class="faq-question" onclick="toggleFaq(this)">
            <span>Acil durumlarda kim çağıracağım?</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-answer hidden">
            <p>Acil durumlarda lütfen direkt olarak 0312 920 13 62 numaradan bize ulaşın. Çalışma saatleri dışında mesaj bırakabilirsiniz.</p>
          </div>
        </div>

        <!-- FAQ Item 4 -->
        <div class="faq-item">
          <button class="faq-question" onclick="toggleFaq(this)">
            <span>Kişisel verilerim güvenli mi?</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-answer hidden">
            <p>Evet, tüm kişisel verileriniz KVKK (Kişisel Verileri Koruma Kanunu) uyarınca korunmaktadır. Detaylar için gizlilik politikamızı okuyunuz.</p>
          </div>
        </div>

        <!-- FAQ Item 5 -->
        <div class="faq-item">
          <button class="faq-question" onclick="toggleFaq(this)">
            <span>Yurt dışından hizmet alabilir miyim?</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-answer hidden">
            <p>Evet, yurt dışından da hizmet alabilirsiniz. Lütfen bize ulaşarak detayları konuşunuz.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SCRIPTS -->
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
  <script src="/scripts/contact.js"></script>
</body>
</html>
```

---

## 🎨 CSS STYLING

```css
/* HERO SECTION */
.hero--contact {
  background: linear-gradient(135deg, var(--color-primary), rgba(var(--color-primary-rgb), 0.1));
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero--contact h1 {
  font-size: 48px;
  margin-bottom: 16px;
  color: white;
}

.hero--contact p {
  font-size: 18px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* CONTACT METHODS */
.contact-methods {
  padding: 60px 20px;
  background: var(--color-background);
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.method-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.method-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
}

.method-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.method-card h3 {
  margin: 16px 0 8px;
  font-size: 20px;
}

.method-card p {
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

/* CONTACT MAIN (FORM + INFO) */
.contact-main {
  padding: 60px 20px;
  background: var(--color-background);
}

.contact-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* FORM STYLES */
.contact-form-wrapper h2 {
  font-size: 28px;
  margin-bottom: 24px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.form-group.checkbox {
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.form-group.checkbox input {
  margin-top: 4px;
  cursor: pointer;
}

.form-group.checkbox label {
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.error-message {
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
  display: none;
}

.error-message.show {
  display: block;
}

.form-group.error input,
.form-group.error textarea,
.form-group.error select {
  border-color: var(--color-error);
  background-color: rgba(var(--color-error-rgb), 0.05);
}

.success-message {
  background: rgba(var(--color-success-rgb), 0.1);
  color: var(--color-success);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--color-success);
}

.success-message.hidden {
  display: none;
}

/* CONTACT INFO */
.contact-info-wrapper {
  padding: 32px;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.info-card h3 {
  font-size: 22px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 16px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.info-section p,
.info-section address {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  font-style: normal;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-links a {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
  border-radius: 8px;
  color: var(--color-text);
  font-weight: 600;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

/* MAP */
.contact-map {
  padding: 60px 20px;
  background: var(--color-background);
}

.contact-map h2 {
  font-size: 28px;
  margin-bottom: 32px;
  text-align: center;
}

#map {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* FAQ */
.contact-faq {
  padding: 60px 20px;
  background: var(--color-surface);
}

.contact-faq h2 {
  font-size: 28px;
  margin-bottom: 40px;
  text-align: center;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  padding: 20px;
  background: var(--color-background);
  border: none;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: var(--color-secondary);
}

.faq-toggle {
  font-size: 24px;
  transition: transform 0.3s ease;
  color: var(--color-primary);
}

.faq-item.active .faq-toggle {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.faq-answer.hidden {
  display: none;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero--contact h1 {
    font-size: 36px;
  }

  .contact-info-wrapper {
    position: static;
  }

  .methods-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero--contact h1 {
    font-size: 28px;
  }

  .contact-form-wrapper h2,
  .contact-map h2,
  .contact-faq h2 {
    font-size: 22px;
  }

  .contact-main {
    padding: 40px 20px;
  }
}
```

---

## 🔧 JAVASCRIPT FUNCTIONALITY

```javascript
// contact.js

// Form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Track event
  gtag('event', 'contact_form_submitted', {
    'subject': document.getElementById('subject').value
  });

  // Validate form
  if (!validateForm()) return;

  // Disable button
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Gönderiliyor...';

  // Prepare data
  const formData = new FormData(document.getElementById('contactForm'));
  const data = Object.fromEntries(formData);

  try {
    // Send to API
    const response = await fetch('/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // Show success
      document.getElementById('contactForm').style.display = 'none';
      document.getElementById('successMessage').classList.remove('hidden');

      // Reset after 3 seconds
      setTimeout(() => {
        location.reload();
      }, 3000);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    // Show error
    alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gönder';
  }
});

// Form validation
function validateForm() {
  const fields = {
    name: { id: 'name', min: 2 },
    email: { id: 'email', type: 'email' },
    phone: { id: 'phone', pattern: /^\+?90[0-9]{10}$/ },
    subject: { id: 'subject' },
    message: { id: 'message', min: 20 },
    consent: { id: 'consent', type: 'checkbox' }
  };

  let isValid = true;

  for (const [key, config] of Object.entries(fields)) {
    const field = document.getElementById(config.id);
    const errorEl = document.getElementById(`${config.id}Error`);
    let error = '';

    if (config.type === 'checkbox') {
      if (!field.checked) error = 'Bu alanı onaylamanız gerekir';
    } else if (config.type === 'email') {
      if (!field.value.includes('@')) error = 'Geçerli bir e-posta adresi girin';
    } else if (config.pattern) {
      if (!config.pattern.test(field.value)) error = 'Geçerli bir telefon numarası girin';
    } else if (config.min) {
      if (field.value.length < config.min) error = `En az ${config.min} karakter girin`;
    } else if (!field.value) {
      error = 'Bu alan zorunludur';
    }

    if (error) {
      errorEl.textContent = error;
      errorEl.classList.add('show');
      field.parentElement.classList.add('error');
      isValid = false;
    } else {
      errorEl.classList.remove('show');
      field.parentElement.classList.remove('error');
    }
  }

  return isValid;
}

// Real-time validation
document.querySelectorAll('input, textarea, select').forEach(field => {
  field.addEventListener('blur', () => {
    const errorEl = document.getElementById(`${field.id}Error`);
    if (errorEl && errorEl.textContent) {
      validateForm();
    }
  });
});

// FAQ toggle
function toggleFaq(button) {
  const faqItem = button.parentElement;
  const faqAnswer = faqItem.querySelector('.faq-answer');
  const toggle = button.querySelector('.faq-toggle');

  // Close others
  document.querySelectorAll('.faq-item.active').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
      item.querySelector('.faq-answer').classList.add('hidden');
    }
  });

  // Toggle current
  faqItem.classList.toggle('active');
  faqAnswer.classList.toggle('hidden');
}

// Google Maps initialization
function initMap() {
  const officeLat = 39.9334;  // Ankara
  const officeLng = 32.8597;
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: officeLat, lng: officeLng },
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] }
    ]
  });

  new google.maps.Marker({
    position: { lat: officeLat, lng: officeLng },
    map: map,
    title: 'Omega Genetik'
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initMap();
});

// Open live chat
function openLiveChat() {
  // Initialize Zendesk/Intercom widget
  if (window.zE) {
    window.zE('messenger', 'open');
  }
}

// Track page view
gtag('event', 'page_view', {
  'page_title': 'Contact',
  'page_path': '/iletisim'
});
```

---

## 📧 BACKEND API ENDPOINT

```javascript
// POST /api/v1/contact
app.post('/api/v1/contact', async (req, res) => {
  const { name, email, phone, subject, message, consent } = req.body;

  // Validation
  if (!name || !email || !phone || !subject || !message || !consent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Save to database
    const contact = await db.query(
      `INSERT INTO contact_submissions 
       (name, email, phone, subject, message, tenant_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [name, email, phone, subject, message, req.tenant_id]
    );

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Bize Ulaştığınız İçin Teşekkürler',
      template: 'contact-confirmation',
      data: { name }
    });

    // Send internal notification
    await sendEmail({
      to: 'support@nipt.tr',
      subject: `Yeni İletişim Formu: ${subject}`,
      template: 'contact-admin',
      data: { name, email, phone, subject, message }
    });

    res.json({ success: true, id: contact.rows[0].id });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});
```

---

## 🎯 IMPLEMENTATION CHECKLIST

- [ ] HTML structure created
- [ ] CSS styling applied (responsive)
- [ ] JavaScript validation working
- [ ] Form submission to backend
- [ ] Email notifications setup (Brevo)
- [ ] Google Maps API configured
- [ ] Live chat widget integrated (Zendesk/Intercom)
- [ ] Analytics events configured (GA4)
- [ ] Mobile responsiveness tested
- [ ] Accessibility verified (WCAG 2.1)
- [ ] SEO meta tags added
- [ ] Performance optimized

---

**Contact Page Specification Version:** 1.0  
**Status:** Ready for Implementation  
**Updated:** Dec 28, 2025
