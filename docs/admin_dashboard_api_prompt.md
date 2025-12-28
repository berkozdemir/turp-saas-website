# LOVABLE DESIGN PROMPT - ADMIN DASHBOARD & API INTEGRATION
## nipt.tr Admin Panel: Booking Management + Multi-Channel Notifications

---

## 🎯 PURPOSE

**Amaç:** Omega Genetik'in satış ekibi ve laboratuvar yöneticileri için, tüm NIPT randevularının yönetim panelini, **Twilio SMS**, **Brevo Email**, **AWS SES**, ve **Google Analytics** entegrasyon ile birlikte sağlamak.

**Key Features:**
- ✓ Real-time booking management
- ✓ Multi-channel notifications (SMS + Email)
- ✓ Sales rep performance tracking
- ✓ Referral code analytics
- ✓ Logistics scheduling (Omega Care coordination)
- ✓ Google Analytics event tracking
- ✓ Lab workflow management
- ✓ Patient result delivery tracking

---

## 📊 ADMIN DASHBOARD STRUCTURE

### 1. Login & Authentication
```
Login Page:
├─ Email/Username input
├─ Password input (masked)
├─ "Remember me" checkbox
├─ 2-Factor Authentication (optional, SMS-based)
└─ "Forgot Password?" link

Post-Login:
├─ Role-based access control (RBAC)
├─ Roles:
│  ├─ Admin (full access)
│  ├─ Sales Manager (sales reports, codes)
│  ├─ Lab Manager (results, quality control)
│  ├─ Logistics Manager (Omega Care scheduling)
│  └─ Support (patient inquiries, follow-up)
│
└─ Session timeout (30 min idle)
   └─ Auto-logout with warning
```

### 2. Main Dashboard (Home)
```
Layout: 3-column + full-width metrics

Left Column (Quick Stats):
┌────────────────────────────┐
│ 📊 TODAY'S OVERVIEW         │
├────────────────────────────┤
│ New Bookings:    12         │
│ Scheduled:       8          │
│ In Lab:          15         │
│ Results Ready:   5          │
│ Completed:       28         │
│                             │
│ 📈 This Week: +35%          │
└────────────────────────────┘

┌────────────────────────────┐
│ 💵 REVENUE SNAPSHOT         │
├────────────────────────────┤
│ Today:      ₺18,500         │
│ This Week:  ₺135,000        │
│ This Month: ₺420,000        │
│                             │
│ Avg. per Test: ₺1,850       │
└────────────────────────────┘

┌────────────────────────────┐
│ 👥 SALES TEAM              │
├────────────────────────────┤
│ Top Rep: Ali B. (24 tests)  │
│ Team Size: 15               │
│ Conversion: 34%             │
│                             │
│ 🎯 Target: 500/month        │
│ Current: 387 (77%)          │
└────────────────────────────┘

Center Column (Real-time Activity):
┌────────────────────────────┐
│ 📋 RECENT BOOKINGS          │
├────────────────────────────┤
│ 14:32 - Zeynep Y. (Verifi)  │
│         Istanbul, Kadiköy   │
│         Doktor: Dr. Ayşe    │
│         Status: ✓ Booked    │
│                             │
│ 14:15 - Aslı K. (MomGuard)  │
│         Ankara, Çankaya     │
│         Status: ⏳ Pending   │
│                             │
│ 14:02 - Figen T. (Veritas)  │
│         Izmir, Alsancak     │
│         Status: ✓ Booked    │
│                             │
│ [View All Recent] →         │
└────────────────────────────┘

Right Column (Alerts & Actions):
┌────────────────────────────┐
│ ⚠️ ALERTS & ACTIONS         │
├────────────────────────────┤
│ 🔴 3 Failed SMS sends       │
│    Action: Retry now        │
│                             │
│ 🟡 2 Unconfirmed bookings   │
│    Action: Send reminder    │
│                             │
│ 🟢 5 Results ready to send  │
│    Action: Batch email      │
│                             │
│ 📧 Brevo quota: 8,400/10k   │
│    (Daily limit: 80%)       │
│                             │
│ 📱 Twilio: $42.50 / month   │
│    (Budget OK)              │
└────────────────────────────┘

Full-Width Bottom Section:
┌────────────────────────────────────────────┐
│ 📅 TODAY'S SCHEDULE (Omega Care)           │
├────────────────────────────────────────────┤
│                                             │
│ 08:00 - Fatma Ş. (Ankara, Ümit Ev)        │
│ ✓ Confirmed | Hemşire: Selim | Route: 2   │
│                                             │
│ 10:15 - Merve K. (Ankara, Iş Merkezi)     │
│ ✓ Confirmed | Hemşire: Aylin | Route: 3   │
│                                             │
│ 13:45 - Eda B. (Ankara, Ev)               │
│ ⏳ Pending | [Assign Nurse] [Confirm]      │
│                                             │
│ 16:00 - Hülya D. (Ankara, Hastane)        │
│ ✗ Rescheduled | Yeni: 29 Ocak, 09:00      │
│                                             │
└────────────────────────────────────────────┘
```

---

## 📋 SECTION 1: BOOKINGS MANAGEMENT

### Bookings List Page (`/admin/bookings`)

```
Layout: Data table + filters + actions

FILTERS (Left Sidebar):
├─ Date Range Picker
│  ├─ Last 7 days
│  ├─ Last 30 days
│  ├─ Custom range
│  └─ Current: [Dec 1 - Dec 28]
│
├─ Status Filter (Multi-select):
│  ├─ New (unconfirmed)
│  ├─ Scheduled (confirmed)
│  ├─ In Lab (sample received)
│  ├─ Processing (analyzing)
│  ├─ Results Ready
│  └─ Completed
│
├─ Test Type (Multi-select):
│  ├─ ☑ MomGuard
│  ├─ ☑ Verifi
│  ├─ ☑ Veritas
│  └─ Current: All selected
│
├─ Referral Code:
│  ├─ With Code
│  ├─ Without Code
│  └─ Current: All
│
├─ Sales Rep (Multi-select):
│  ├─ Ali B.
│  ├─ Ayşe K.
│  ├─ [List all 15 reps]
│  └─ Current: All selected
│
├─ Omega Care Status:
│  ├─ Home Care (Scheduled)
│  ├─ Home Care (Pending)
│  ├─ Clinic (Assigned)
│  └─ Kit Delivery
│
└─ Payment Status:
   ├─ Pending
   ├─ Completed
   └─ Refunded

DATA TABLE (Main):
┌──────┬──────────┬──────────┬────────────┬───────────┬──────────┬──────────┐
│ ID   │ Patient  │ Test     │ Status     │ Booking   │ Rep      │ Actions  │
├──────┼──────────┼──────────┼────────────┼───────────┼──────────┼──────────┤
│ 1024 │ Zeynep Y.│ Verifi   │ ✓ Booked   │ Dec 5     │ Ali B.   │ [•••]    │
│      │ Istanbul │          │ 10:00      │ Dr. Ayşe  │ Discount:│          │
│      │          │          │ (5 days)   │ 5%        │ 5%       │          │
├──────┼──────────┼──────────┼────────────┼───────────┼──────────┼──────────┤
│ 1023 │ Aslı K.  │ MomGuard │ ⏳ Pending │ Dec 6     │ Ayşe K.  │ [•••]    │
│      │ Ankara   │          │ 14:30      │ No code   │ Discount:│          │
│      │          │          │ (Unconf.)  │ 0%        │ 0%       │          │
├──────┼──────────┼──────────┼────────────┼───────────┼──────────┼──────────┤
│ 1022 │ Figen T. │ Veritas  │ ✓ In Lab   │ Dec 1     │ Mert O.  │ [•••]    │
│      │ Izmir    │          │ Day 4/14   │ Dr. Ali   │ Discount:│          │
│      │          │          │            │ 10%       │ 10%      │          │
├──────┼──────────┼──────────┼────────────┼───────────┼──────────┼──────────┤
│ 1021 │ Hülya D. │ MomGuard │ ✓ Ready    │ Dec 21    │ Fatih O. │ [•••]    │
│      │ Ankara   │          │ Download!! │ No code   │ Discount:│          │
│      │          │          │            │ 0%        │ 0%       │          │
└──────┴──────────┴──────────┴────────────┴───────────┴──────────┴──────────┘

Pagination:
└─ Showing 1-20 of 387 bookings | Pages: [1] [2] [3]... [20] | Per page: [20 ▼]

ACTION MENU (Right-click or [•••] button per row):
┌───────────────────────────────┐
│ [👁] View Details             │
│ [✏️] Edit Booking             │
│ [📱] Send SMS Reminder        │
│ [📧] Send Email Reminder      │
│ [🚑] Assign to Omega Care     │
│ [🔬] Update Lab Status        │
│ [📥] Upload Result            │
│ [📤] Send Result to Patient   │
│ [💰] View Payment             │
│ [🎯] Update Referral Code     │
│ [📞] Call Patient             │
│ [❌] Cancel Booking           │
└───────────────────────────────┘
```

### Booking Detail View (Modal/Full Page)
```
Layout: Tabs + sidebar

TAB 1: PATIENT INFORMATION
├─ Name: Zeynep Yılmaz
├─ Phone: +90 (530) 123-4567 ← Click to call/SMS
├─ Email: zeynep@example.com ← Click to email
├─ Date of Birth: 1989-03-15 (Age: 35)
├─ Address: Istanbul, Kadıköy, [Full address]
├─ Ultrasound Date: 2024-12-20
├─ Current Week: Week 12
│
└─ NOTES Section (Expandable):
   ├─ Patient note: "Anxious, wants quick results"
   ├─ Doc note: "Serum risk 2.5%, recommend test"
   └─ [Add note] button

TAB 2: BOOKING DETAILS
├─ Booking ID: NIPT-20241228-ABC123
├─ Test Selected: Verifi (Premium)
├─ Microdelete Panel: YES (+₺500)
├─ Doctor: Dr. Ayşe Yılmaz
├─ Referral Code: DRALI10 (5% discount applied)
│  └─ Rep: Ali B. | Commission: ₺92.50
├─ Total Price: ₺1,850
├─ Discount: -₺92.50 (5%)
├─ Final Price: ₺1,757.50
├─ Payment Status: Pending
│  └─ [Mark Paid] [Request Payment]
├─ Booking Date: 2024-12-28
├─ Scheduled Date: 2025-01-05 (Sunday)
├─ Scheduled Time: 10:00 AM
│  └─ [Reschedule] button
│
└─ HISTORY:
   ├─ 14:32 - Booking created
   ├─ 14:35 - Confirmation SMS sent ✓
   ├─ 14:36 - Confirmation email sent ✓
   └─ [View full timeline]

TAB 3: OMEGA CARE (Logistics)
├─ Service Type: ☑ Home Care | ☐ Clinic | ☐ Kit
├─ Location: Istanbul, Kadıköy
│  └─ Omega Care Available: ✓ YES
├─ Status: ⏳ PENDING ASSIGNMENT
├─ [Assign to Nurse] button
│
├─ Assigned Nurse: (When assigned)
│  ├─ Name: [Nurse name]
│  ├─ Phone: +90 (XXX) XXX-XXXX
│  ├─ Experience: 8 years
│  └─ [Send route] [Confirm with nurse]
│
├─ Scheduled for: 2025-01-05, 10:00
├─ Estimated Duration: 15 minutes
├─ Special Requirements:
│  ├─ Language: Turkish (preferable)
│  ├─ Accessibility: Ground floor apartment
│  └─ Payment: Already confirmed
│
├─ STATUS TIMELINE:
│  ├─ Pending Assignment → [Assign]
│  ├─ Assigned (Waiting confirmation)
│  ├─ Confirmed (Route sent)
│  ├─ In Progress (Nurse on way)
│  ├─ Completed (Sample collected)
│  └─ Delivered to Lab
│
└─ [Send SMS to Omega Care] [Send Email to Omega Care]

TAB 4: LAB STATUS
├─ Sample Status: Not Received Yet
│  └─ Expected: 2025-01-05
├─ Analysis Status: N/A
├─ QC Status: Pending
├─ Result Status: Pending
│
├─ TIMELINE:
│  ├─ Sample Received: [Waiting]
│  ├─ DNA Extraction: [Waiting]
│  ├─ Sequencing: [Waiting]
│  ├─ Analysis: [Waiting]
│  ├─ QC Check: [Waiting]
│  ├─ Result Generated: [Waiting]
│  ├─ Doctor Review: [Waiting]
│  └─ Released to Patient: [Waiting]
│
└─ [Update Status] [Upload PDF Result]

TAB 5: COMMUNICATIONS
├─ SMS Log:
│  ├─ 14:35 - Confirmation sent ✓ (Twilio)
│  ├─ [View message content]
│  └─ [Resend SMS]
│
├─ Email Log:
│  ├─ 14:36 - Confirmation sent ✓ (Brevo)
│  ├─ [View email content]
│  └─ [Resend Email]
│
├─ Reminders:
│  ├─ Pre-Appointment (2 days before)
│  │  └─ [ ] SMS [ ] Email [Schedule]
│  ├─ Day Before
│  │  └─ [ ] SMS [ ] Email [Schedule]
│  └─ Day Of
│     └─ [ ] SMS [ ] Email [Schedule]
│
└─ Manual Actions:
   ├─ [Send Custom SMS]
   └─ [Send Custom Email]

SIDEBAR (Right):
┌──────────────────────┐
│ 📊 QUICK ACTIONS     │
├──────────────────────┤
│ [📱] Call Patient    │
│ [💬] Send SMS        │
│ [📧] Send Email      │
│ [🔔] Send Push Notif │
│ [🎫] Resend Booking  │
│ [✏️] Edit Details    │
│ [❌] Cancel Booking  │
│ [🔄] Reschedule      │
│ [💾] Save Changes    │
│ [🔗] Share Link      │
└──────────────────────┘

┌──────────────────────┐
│ 📈 ANALYTICS         │
├──────────────────────┤
│ Source: Website      │
│ Device: Mobile       │
│ Browser: Safari      │
│ Location: Istanbul   │
│ UTM: campaign=facebook
│                      │
│ [View GA Event]      │
└──────────────────────┘
```

---

## 📱 SECTION 2: SMS NOTIFICATIONS (Twilio Integration)

### SMS Configuration Page (`/admin/sms`)

```
TWILIO API SETUP:
├─ Account SID: [****hidden****]
├─ Auth Token: [****hidden****]
├─ Sender Phone: +1-XXX-XXX-XXXX
│  └─ Verified: ✓ YES
├─ Daily Limit: 1,000 SMS
│  └─ Current: 237/1000 (24% usage)
├─ Cost per SMS: $0.0075
├─ Monthly Budget: $75 (1,000 messages)
│  └─ Spent: $1.78 (2.4%)
│
└─ [Test SMS] [Show Logs]

SMS TEMPLATES:
┌─────────────────────────────┐
│ 🔔 Template 1: Booking      │
│    Confirmation             │
├─────────────────────────────┤
│ "Merhaba {{PATIENT_NAME}},  │
│                             │
│ {{TEST_NAME}} testi randevunuz │
│ {{DATE}}, saat {{TIME}}'de  │
│ doktor {{DOCTOR_NAME}} ile  │
│ alındı.                     │
│                             │
│ Ev ziyareti: {{LOCATION}}   │
│ Hemşire gelişine {{DAYS}}   │
│ gün kaldı.                  │
│                             │
│ Sorularınız: 0312 920 13 62 │
│                             │
│ Link: {{BOOKING_LINK}}"      │
│                             │
│ Preview: [Show]             │
│ [Edit Template]             │
│ [Test Send]                 │
│ [Send All Pending]          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🔔 Template 2: Reminder      │
│    (Day Before)             │
├─────────────────────────────┤
│ "{{PATIENT_NAME}},          │
│                             │
│ Yarın saat {{TIME}}'de      │
│ randevunuz var. Hazırlanmaya │
│ başlayın.                   │
│                             │
│ Sorularınız: 0312 920 13 62 │
│ WhatsApp: [Link]"           │
│                             │
│ [Edit] [Test] [Send All]    │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🔔 Template 3: Result       │
│    Ready                    │
├─────────────────────────────┤
│ "{{PATIENT_NAME}},          │
│                             │
│ {{TEST_NAME}} test sonuçları │
│ hazır! Portal'a giriş yapın:│
│                             │
│ {{RESULT_LINK}}             │
│                             │
│ Doktor: {{DOCTOR_NAME}}     │
│ Danışman: 0312 920 13 62"   │
│                             │
│ [Edit] [Test] [Send All]    │
└─────────────────────────────┘

SMS SENDING LOG:
┌──────┬────────────┬──────────┬────────┬────────┐
│ Time │ Patient    │ Template │ Status │ Action │
├──────┼────────────┼──────────┼────────┼────────┤
│14:35 │Zeynep Y.   │Confirm   │✓ Sent  │[View]  │
│14:30 │Aslı K.     │Confirm   │✗ Failed│[Retry] │
│14:25 │Figen T.    │Confirm   │✓ Sent  │[View]  │
└──────┴────────────┴──────────┴────────┴────────┘

[Search by phone] [Export log] [Clear old logs]
```

---

## 📧 SECTION 3: EMAIL NOTIFICATIONS (Brevo + AWS SES)

### Email Configuration Page (`/admin/email`)

```
BREVO API SETUP:
├─ API Key: [****hidden****]
├─ Sender Name: Omega Genetik
├─ Sender Email: info@nipt.tr
│  └─ Verified: ✓ YES
├─ Daily Limit: 10,000 emails
│  └─ Current: 856/10000 (8.6% usage)
├─ Cost Model: $20/month (up to 20k emails)
├─ Plan: Active (Renews: Jan 15, 2025)
│
└─ [Test Email] [Show Logs]

AWS SES SETUP (Backup):
├─ Access Key: [****hidden****]
├─ Secret Key: [****hidden****]
├─ Region: EU-CENTRAL-1 (Frankfurt)
├─ Status: Active
├─ Daily Limit: 50,000 emails
│  └─ Current: 0/50000 (0% usage)
├─ Cost: Pay per email ($0.00001 per email)
│
└─ [Test Email] [Show Logs]

EMAIL TEMPLATES:

┌─────────────────────────────────┐
│ 📧 Template 1: Booking          │
│    Confirmation                 │
├─────────────────────────────────┤
│ From: info@nipt.tr              │
│ Subject: "{{TEST_NAME}} Randevu  │
│           Onaylandı - #{{ID}}"   │
│                                 │
│ Body (HTML + plain text):       │
│ ├─ Greeting personalized        │
│ ├─ Booking details table        │
│ ├─ Appointment info             │
│ ├─ Omega Care info              │
│ ├─ Important notes              │
│ ├─ Doctor contact               │
│ ├─ Unsubscribe link             │
│ └─ Footer with company info     │
│                                 │
│ [Edit Template]                 │
│ [Preview HTML] [Preview Text]   │
│ [Test Send] [Send All Pending]  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📧 Template 2: Result Ready     │
├─────────────────────────────────┤
│ Subject: "Test Sonuçlarınız     │
│           Hazır - Başhekim      │
│           Harita İndir"         │
│                                 │
│ Features:                       │
│ ├─ Result summary (positive/neg)│
│ ├─ PDF attachment link          │
│ ├─ Doctor interpretation        │
│ ├─ Next steps                   │
│ ├─ Genetic counselor info       │
│ └─ FAQ link                     │
│                                 │
│ [Edit] [Preview] [Test] [Send]  │
└─────────────────────────────────┘

EMAIL SENDING LOG:
┌──────┬─────────────┬──────────┬────────┬────────┐
│ Time │ Patient     │ Template │ Status │ Action │
├──────┼─────────────┼──────────┼────────┼────────┤
│14:36 │Zeynep Y.    │Confirm   │✓ Brevo│[View]  │
│14:32 │Aslı K.     │Confirm   │✓ Brevo│[View]  │
│14:28 │Figen T.     │Confirm   │✓ SES  │[View]  │
│13:45 │Hülya D.     │Result    │✓ Brevo│[View]  │
└──────┴─────────────┴──────────┴────────┴────────┘

[Search] [Export] [Test Delivery] [Analytics]
```

---

## 📊 SECTION 4: ANALYTICS & REPORTING

### Google Analytics Integration (`/admin/analytics`)

```
GOOGLE ANALYTICS 4 SETUP:
├─ Property ID: G-XXXXXXXXXX
├─ Measurement ID: G-XXXXXXXXXX
├─ Connected: ✓ YES
├─ Data Collection: Active
├─ Consent Mode: v2 (GDPR)
├─ Last Updated: 2024-12-28 14:30
│
├─ Events Tracked:
│  ├─ page_view (all pages)
│  ├─ booking_started
│  ├─ booking_completed
│  ├─ test_selected (momguard/verifi/veritas)
│  ├─ referral_code_applied
│  ├─ sms_delivered
│  ├─ email_delivered
│  ├─ result_downloaded
│  ├─ result_shared_doctor
│  └─ support_contacted
│
└─ [Export Config] [Reset] [View Raw Events]

DASHBOARD METRICS (Real-time from GA4):

📈 TRAFFIC OVERVIEW (Last 30 Days):
├─ Total Users: 3,847
├─ New Users: 2,154 (56%)
├─ Total Sessions: 5,230
├─ Avg Session Duration: 4m 23s
├─ Bounce Rate: 28%
├─ Conversion Rate: 7.4% (booking completion)
│
└─ Trend: ↑ +12% vs previous month

📱 DEVICE BREAKDOWN:
├─ Mobile: 64% (2,460 users)
├─ Desktop: 32% (1,231 users)
├─ Tablet: 4% (156 users)
│
└─ Mobile conversion rate: 8.2% (higher engagement)

🌍 GEOGRAPHIC BREAKDOWN (Top 10):
├─ Istanbul: 1,243 users (32%)
├─ Ankara: 567 users (15%)
├─ Izmir: 432 users (11%)
├─ Bursa: 234 users (6%)
├─ Antalya: 198 users (5%)
├─ [Show all 81 provinces]
│
└─ Heatmap: [Istanbul > Ankara > Izmir]

🎯 BOOKING FUNNEL ANALYSIS:
├─ Step 1 (Home): 3,847 users
├─ Step 2 (Test Selection): 2,154 users (56% drop-off)
│  └─ Top choice: Verifi (45%)
│  └─ 2nd: MomGuard (38%)
│  └─ 3rd: Veritas (17%)
│
├─ Step 3 (Form Start): 1,432 users (66%)
├─ Step 4 (Form Complete): 892 users (62%)
├─ Step 5 (Payment): 567 users (64%)
├─ Step 6 (Confirmation): 543 users (96%)
│
└─ CONVERSION LOSS POINTS:
   ├─ Test Selection → Form: -722 users (33% drop)
   ├─ Form Complete → Payment: -325 users (36% drop)
   └─ [Action] Improve form UX, add trust signals

🔍 TOP TRAFFIC SOURCES:
├─ Direct: 1,232 users (32%)
├─ Google Organic: 1,456 users (38%)
├─ Facebook: 654 users (17%)
├─ Instagram: 345 users (9%)
├─ Other: 160 users (4%)
│
└─ ROI: Organic > Direct > Paid

📧 CAMPAIGN TRACKING:
├─ Campaign: "TÜM HAMILE KADINLAR" (Email)
│  └─ Conversions: 234 | Revenue: ₺433,890 | ROI: 15.3x
│
├─ Campaign: "VERİFİ AVANTAJLARI" (Facebook)
│  └─ Conversions: 87 | Revenue: ₺161,290 | ROI: 8.2x
│
├─ Campaign: "DOKTOR İNDİRİMLERİ" (Direct Mail)
│  └─ Conversions: 45 | Revenue: ₺83,250 | ROI: 2.1x
│
└─ [View all campaigns] [Edit campaign names]

💬 USER BEHAVIOR INSIGHTS:
├─ Most viewed page: /verifi (1,854 views)
├─ Avg time on /verifi: 3m 12s
├─ Click-through rate: CTA "Randevu Al": 34%
├─ Form abandonment rate: 36% (at location step)
├─ Mobile-specific issue: Form width too narrow
│
└─ [Recommendations for improvement]

EXPORT OPTIONS:
├─ [Download as PDF]
├─ [Export to Google Sheets]
├─ [Schedule Daily Email]
└─ [Share Report Link]
```

---

## 🔍 SECTION 5: SEO OPTIMIZATION & MONITORING

### SEO Management Console (`/admin/seo`)

```
SEO CONFIGURATION:

TECHNICAL SEO:
├─ Sitemap: https://nipt.tr/sitemap.xml ✓
│  └─ Pages indexed: 45 | Last updated: Dec 28, 2024
├─ robots.txt: ✓ Configured
├─ Mobile Friendly: ✓ PASS (100/100)
├─ Core Web Vitals: ✓ PASS
│  ├─ LCP: 1.8s (target: <2.5s)
│  ├─ FID: 45ms (target: <100ms)
│  └─ CLS: 0.08 (target: <0.1)
├─ SSL Certificate: ✓ Valid (expires: Dec 15, 2025)
├─ GZIP Compression: ✓ Enabled
├─ Cache Headers: ✓ Configured
│
└─ [Test Mobile Friendly] [Check Performance]

METADATA MANAGEMENT:

Page: HOME
├─ Title: "NIPT Testi - Hamilelikte Genetik Anomali 
           Taraması | Omega Genetik"
│  └─ Length: 78 chars (optimal: 50-60)
│  └─ Keyword focus: NIPT, Genetik, Hamilelik
├─ Meta Description: "Evinizden çıkmadan %99,9 doğruluk 
           ile genetik anomalileri tespit edin. 
           Sağlık Bakanlığı ruhsatlı Omega Genetik."
│  └─ Length: 156 chars (optimal: 150-160)
├─ Canonical: https://nipt.tr/ ✓
├─ OG Tags: ✓ Configured
├─ Schema Markup: ✓ Organization + Service
│  └─ Type: HealthAndBeautyBusiness + MedicalTest
│
└─ [Edit] [Preview SERP] [Validate]

Page: /VERIFI
├─ Title: "Verifi NIPT Test - %99,9 Doğruluk | 
           Omega Genetik"
│  └─ Status: ✓ Optimized
├─ Meta Description: "Dünyada milyonlar kullanan Verifi 
           test, %99,9 doğruluk ve en hızlı sonuç 
           ile doktor önerili seçim."
├─ H1: "Verifi - Dünyada Milyonlar Kullanan Test"
│  └─ Keyword density: 2.3% ✓
├─ H2s: 5 items (optimal)
├─ Internal Links: 12 (good)
├─ External Links: 3 (authoritative sources)
├─ Word Count: 2,850 words ✓
├─ Images: 8 (all with alt text)
├─ Mobile Rendering: ✓ Excellent
│
└─ [Edit Metadata] [SEO Score: 92/100]

KEYWORD TRACKING:

Primary Keywords (Volume / Difficulty):
├─ "NIPT testi" (1,200 / 32) → Rank: #3 📈
├─ "hamilelik genetik testi" (890 / 28) → Rank: #2 📈
├─ "Verifi test" (456 / 24) → Rank: #1 ⭐
├─ "prenatal screening Türkiye" (234 / 42) → Rank: #8 📉
├─ "genetik anomali taraması" (567 / 35) → Rank: #4 📈
├─ "Down sendromu testi" (789 / 31) → Rank: #5 📈
│
└─ [Add keyword] [View search volume] [Check rank]

BACKLINKS:

Referring Domains: 34
├─ High Authority (DA 50+): 8 domains
│  ├─ Sağlık Bakanlığı sitesi (ref)
│  ├─ Tıp Fakültesi (Ankara Üniversitesi)
│  ├─ Jinekoloji Derneği
│  └─ [Show all 8]
│
├─ Medium Authority (DA 30-50): 15 domains
├─ Low Authority: 11 domains
│
├─ Total Backlinks: 127
├─ New Backlinks (Last 30 days): 8 ✓
└─ Toxic Links: 0

[Add Backlink] [Disavow] [Link Building Strategy]

COMPETITOR ANALYSIS:

Competitor 1: nipttesti.com
├─ Domain Authority: 31
├─ Backlinks: 89
├─ Top Keyword: "NIPT testi" (Rank #2)
├─ Traffic Est: 2,400/month
├─ On-page SEO: 78/100
│
└─ [Compare in detail]

Competitor 2: prenataltest.com.tr
├─ Domain Authority: 28
├─ Backlinks: 65
├─ Top Keyword: "prenatal test" (Rank #4)
├─ Traffic Est: 1,800/month
├─ On-page SEO: 72/100
│
└─ [Compare in detail]

CONTENT STRATEGY:

Blog/Article Ideas (High Opportunity):
├─ "Down Sendromu Testi Hakkında Her Şey"
│  └─ Target keyword: "down sendromu" (2,340 vol, 28 diff)
│  └─ Projected ranking: Position 1-3 ✓
│  └─ Est. traffic: +340 users/month
│
├─ "NIPT vs Amniyosentez: Hangisi Seçmeliyim?"
│  └─ Target keyword: "amniyosentez" (567 vol, 24 diff)
│  └─ Projected ranking: Position 2-5
│  └─ Est. traffic: +120 users/month
│
├─ "Hamilelik Haftaları: Testi Ne Zaman Yaptırayım?"
│  └─ Target keyword: "hamilelik haftaları" (1,890 vol)
│  └─ Est. traffic: +280 users/month
│
└─ [Add to content calendar] [Assign writer]

CONTENT CALENDAR:

Jan 2025:
├─ Jan 5 - "Down Sendromu Testi" (Blog)
├─ Jan 12 - "NIPT vs Amniyosentez" (Blog)
├─ Jan 19 - "Hamilelik Haftaları" (Guide)
├─ Jan 26 - "Doktor Seçimi" (Blog)
│
└─ [Add content] [Publish schedule]

STRUCTURED DATA (Schema Markup):

✓ Organization Schema
├─ Name: Omega Genetik
├─ Type: HealthAndBeautyBusiness
├─ Address: Ankara, Turkey
├─ Phone: +90 (312) 920 13 62
├─ Email: info@omegagenetik.com
│
└─ [Edit schema]

✓ Service Schema (NIPT Tests)
├─ Service Name: "Verifi NIPT Test"
├─ Service Type: "Medical Test"
├─ Provider: "Omega Genetik"
├─ Price Range: "₺1,500 - ₺2,500"
├─ Description: "[Full description]"
│
└─ [Edit schema]

✓ LocalBusiness Schema
├─ Name: Omega Genetik
├─ Address: [Full address]
├─ Phone: [Phone number]
├─ Hours: "Mo-Fr 08:00-18:00"
├─ Service Area: "Turkey (all 81 provinces)"
│
└─ [Edit schema]

[Test Schema Markup] [View as structured data]

GOOGLE SEARCH CONSOLE:

Connected: ✓ YES
├─ Property: https://nipt.tr/
├─ Data Updated: Dec 28, 2024
├─ Site Health: ✓ Excellent
│
├─ Impressions (30 days): 12,340
├─ Clicks: 1,045 (8.5% CTR)
├─ Avg Position: 3.2
├─ Top Query: "NIPT testi" (Position 3)
│
├─ Indexing Issues: 0
├─ Mobile Usability Issues: 0
├─ Security Issues: 0
│
└─ [View full GSC] [Submit sitemap]

LOCAL SEO (Google My Business):

✓ Verified: YES
├─ Business Name: Omega Genetik
├─ Category: Genetic Testing Lab
├─ Address: Ankara, Turkey
├─ Phone: +90 (312) 920 13 62
├─ Website: nipt.tr
├─ Hours: Open
│
├─ Reviews: 4.8/5 (34 reviews)
├─ Photos: 12 uploaded
├─ Posts: 8 recent
├─ Q&A: 22 answered questions
│
└─ [Manage GMB] [Get link]

MONTHLY SEO REPORT:

Performance Summary:
├─ Organic Traffic: +18% vs last month (↑)
├─ Keyword Rankings (Top 20): 15 keywords
├─ New Backlinks: +8
├─ Domain Authority: 28 (stable)
├─ Core Web Vitals: ✓ PASS
│
└─ Overall SEO Health: ★★★★☆ (4/5)

Opportunities:
├─ 🟡 Add more long-tail keywords
├─ 🟡 Improve mobile CTR (target: +2%)
├─ 🟢 Continue link building
├─ 🟢 Publish blog articles (2x/month)
│
└─ [Generate Full Report] [Share with team]
```

---

## 🔧 SECTION 6: API INTEGRATION DOCUMENTATION

### API Architecture
```
ARCHITECTURE DIAGRAM:

nipt.tr (Frontend)
    ↓ (HTTPS)
API Gateway (Node.js/Express)
    ├─ /api/v1/bookings
    ├─ /api/v1/sms (Twilio)
    ├─ /api/v1/email (Brevo + AWS SES)
    ├─ /api/v1/analytics (GA4)
    ├─ /api/v1/auth
    └─ /api/v1/admin

BACKEND SERVICES:
├─ Database (PostgreSQL)
│  ├─ bookings table
│  ├─ users table
│  ├─ notifications table
│  ├─ referral_codes table
│  └─ analytics_events table
│
├─ Message Queue (RabbitMQ/Bull)
│  ├─ SMS queue (Twilio)
│  ├─ Email queue (Brevo/SES)
│  └─ Notification queue
│
├─ SMS Service (Twilio API)
├─ Email Service (Brevo API + AWS SES SDK)
├─ Analytics Service (GA4 Measurement Protocol)
└─ Cache (Redis) - for rate limiting

SECURITY LAYER:
├─ API Key validation
├─ CORS configuration
├─ Rate limiting (100 req/min per IP)
├─ Input validation & sanitization
├─ SQL injection protection
└─ Encryption (data in transit + at rest)
```

### API Endpoints

```
BOOKING ENDPOINTS:
POST /api/v1/bookings
├─ Body: { patient_name, test, date, location, referral_code, doctor }
├─ Response: { booking_id, confirmation_number, status }
├─ Triggers: SMS + Email + GA event
│
└─ Example: curl -X POST https://api.nipt.tr/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{ "patient_name": "Zeynep Y.", "test": "verifi", ... }'

GET /api/v1/bookings/:id
├─ Returns: Full booking details
└─ Response: { booking_id, patient, test, status, lab_status, omega_care }

PUT /api/v1/bookings/:id
├─ Update booking (reschedule, cancel, etc)
└─ Triggers: SMS notification to patient + Omega Care

SMS ENDPOINTS:
POST /api/v1/sms/send
├─ Body: { phone, template_id, variables }
├─ Response: { status, twilio_sid, timestamp }
├─ Twilio integration:
│  ├─ Account SID: process.env.TWILIO_ACCOUNT_SID
│  ├─ Auth Token: process.env.TWILIO_AUTH_TOKEN
│  └─ Phone: process.env.TWILIO_PHONE_NUMBER
│
└─ Error handling: Retry on failure (max 3 attempts)

GET /api/v1/sms/logs
├─ Filter by: date_range, status, patient_id
├─ Returns: SMS history with delivery status
└─ Twilio webhook updates status in real-time

EMAIL ENDPOINTS:
POST /api/v1/email/send
├─ Body: { email, template_id, variables, attachments }
├─ Response: { status, brevo_message_id, timestamp }
├─ Brevo integration:
│  ├─ API Key: process.env.BREVO_API_KEY
│  ├─ Sender: process.env.BREVO_SENDER_EMAIL
│  └─ List ID: process.env.BREVO_LIST_ID (for CRM)
│
├─ AWS SES fallback (if Brevo fails):
│  ├─ Access Key: process.env.AWS_SES_ACCESS_KEY
│  ├─ Secret Key: process.env.AWS_SES_SECRET_KEY
│  └─ Region: eu-central-1
│
└─ Template variables: {{PATIENT_NAME}}, {{DATE}}, etc.

ANALYTICS ENDPOINTS:
POST /api/v1/analytics/event
├─ Body: { event_name, user_id, parameters }
├─ GA4 Measurement Protocol:
│  ├─ Measurement ID: process.env.GA4_MEASUREMENT_ID
│  ├─ API Secret: process.env.GA4_API_SECRET
│  └─ Endpoint: https://www.google-analytics.com/mp/collect
│
├─ Tracked events:
│  ├─ booking_started: { test_type, location }
│  ├─ booking_completed: { test_type, total_price, coupon_code }
│  ├─ test_selected: { test_name, conversion }
│  ├─ sms_delivered: { delivery_status }
│  ├─ email_delivered: { delivery_status }
│  └─ result_downloaded: { test_name }
│
└─ Real-time: [See in GA4 dashboard within 2-3 seconds]

ADMIN ENDPOINTS:
GET /api/v1/admin/dashboard
├─ Requires: Bearer token (JWT)
├─ Returns: { today_stats, revenue, recent_bookings, alerts }
│
└─ Role-based: Only admin, sales_manager, lab_manager

GET /api/v1/admin/bookings
├─ Query params: { status, test_type, date_range, page }
├─ Returns: Paginated list with filters applied
│
└─ Caching: Cached for 5 minutes (Redis)

POST /api/v1/admin/bookings/:id/notify
├─ Body: { method: "sms"|"email", template_id }
├─ Manually trigger notification (for retries)
├─ Logs action in audit trail
│
└─ Response: { status, confirmation }
```

### Environment Variables

```
# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Brevo Email
BREVO_API_KEY=xkeysxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=info@nipt.tr
BREVO_LIST_ID=12345

# AWS SES (Fallback)
AWS_SES_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SES_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_SES_REGION=eu-central-1

# Google Analytics 4
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=xxxxxxxxxxxxxxx_xxxxxx
GA4_PROPERTY_ID=XXXXXXXXX

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nipt_db

# Redis (Caching)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=7d

# API
API_BASE_URL=https://api.nipt.tr
API_RATE_LIMIT=100
API_TIMEOUT=30000

# Plesk (Deployment)
PLESK_HOST=plesk.example.com
PLESK_LOGIN=admin
PLESK_PASSWORD=xxxxxxxx
```

---

## 🚀 DEPLOYMENT & MONITORING

### Server Architecture
```
Plesk Server (Current):
├─ Node.js API server (port 3000)
├─ PostgreSQL database
├─ Redis cache
├─ Nginx reverse proxy (port 80/443)
├─ SSL certificate (Let's Encrypt)
└─ Cron jobs:
   ├─ Daily backup (midnight UTC)
   ├─ SMS retry queue (every 5 min)
   ├─ Email retry queue (every 10 min)
   └─ Analytics sync (every hour)

MONITORING & ALERTS:
├─ Uptime monitoring (StatusPage.io)
│  └─ Alert: If API down > 5 min
│
├─ Error tracking (Sentry)
│  ├─ Track API errors
│  ├─ Track SMS failures
│  ├─ Track email delivery issues
│  └─ Alert: If error rate > 1%
│
├─ Performance monitoring (New Relic)
│  ├─ API response time (target: <200ms)
│  ├─ Database query time (target: <100ms)
│  ├─ Twilio API latency
│  ├─ Brevo API latency
│  └─ Alert: If response time > 500ms
│
├─ SMS monitoring (Twilio dashboard)
│  ├─ Delivery rate (target: >99%)
│  ├─ Cost tracking
│  └─ Alert: If delivery rate < 95%
│
├─ Email monitoring (Brevo + AWS)
│  ├─ Delivery rate (target: >98%)
│  ├─ Bounce rate (target: <0.5%)
│  ├─ Complaint rate (target: <0.1%)
│  └─ Alert: If delivery rate < 95%
│
└─ GA4 monitoring (Google Analytics)
   ├─ Track conversion rate (target: >7%)
   ├─ Monitor booking funnel
   └─ Alert: If conversion drops > 2%
```

---

## 📋 SECTION 7: BOOKING MANAGEMENT WORKFLOW

### State Machine Diagram
```
BOOKING STATES:

NEW (Initial)
    ↓
PENDING_CONFIRMATION (Awaiting patient validation)
    ↓
SCHEDULED (Patient confirmed)
    ├─→ OMEGA_CARE_ASSIGNED (Nurse assigned)
    │   └─→ OMEGA_CARE_COMPLETED (Sample collected)
    │       ↓
    └─→ CLINIC_ASSIGNED (Clinic alternative)
        └─→ CLINIC_COMPLETED (Sample collected)
    
    ↓
SAMPLE_RECEIVED (Lab received)
    ↓
PROCESSING (DNA analysis in progress)
    ├─→ QC_PASSED (Quality check OK)
    │   └─→ RESULT_GENERATED (Report created)
    │       └─→ RESULT_SENT (To doctor + patient)
    │           ↓
    │           COMPLETED ✓
    │
    └─→ QC_FAILED (Technical issue)
        └─→ RETEST_PENDING (New sample needed)
            └─→ [Back to PENDING_CONFIRMATION]

CANCELLATION PATHS:
├─ PENDING_CONFIRMATION → CANCELLED_BY_PATIENT
├─ SCHEDULED → CANCELLED_BY_PATIENT (refund issued)
└─ PROCESSING → CANCELLED_BY_ADMIN (partial refund)
```

---

## 📧 NOTIFICATION MATRIX

### When to Send What
```
BOOKING CREATED:
├─ SMS: "Booking Confirmation" template
├─ Email: "Booking Confirmation" template
├─ GA: event: "booking_completed"
└─ Omega Care: "New assignment available"

2 DAYS BEFORE APPOINTMENT:
├─ SMS: "Reminder - 2 Days" template
├─ Email: "Reminder - 2 Days" template
└─ GA: event: "reminder_sent" (tracking)

1 DAY BEFORE APPOINTMENT:
├─ SMS: "Reminder - 1 Day" template
├─ Email: "Reminder - 1 Day" template
└─ Omega Care: "Confirm route for tomorrow"

DAY OF APPOINTMENT:
├─ SMS: "Reminder - Today" template (9 AM)
├─ Email: "Reminder - Today" template (9 AM)
└─ Omega Care: "Status update from nurse"

AFTER OMEGA CARE COMPLETES:
├─ SMS: "Sample received in lab"
├─ Email: "Confirmation of sample receipt"
└─ Lab: "New sample in queue"

RESULTS READY:
├─ SMS: "Results Ready" template
├─ Email: "Results Ready" + PDF attachment
├─ GA: event: "result_ready"
└─ Doctor: Email with link to results

CANCELLATION:
├─ SMS: "Cancellation Confirmation"
├─ Email: "Refund details"
├─ Omega Care: "Booking cancelled"
└─ GA: event: "booking_cancelled"
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend Development
- [ ] Node.js/Express API setup
- [ ] Database schema (PostgreSQL)
- [ ] Authentication (JWT)
- [ ] Twilio SMS integration
- [ ] Brevo email integration
- [ ] AWS SES fallback setup
- [ ] GA4 Measurement Protocol integration
- [ ] Message queue (RabbitMQ/Bull)
- [ ] Error handling & logging (Sentry)
- [ ] Rate limiting & CORS
- [ ] Input validation
- [ ] API documentation (Swagger/OpenAPI)

### Frontend Integration
- [ ] Admin dashboard components (React)
- [ ] Booking list table (with filters & pagination)
- [ ] Booking detail modal/page
- [ ] SMS template editor
- [ ] Email template editor
- [ ] Analytics dashboard (GA4 data viz)
- [ ] SEO management interface
- [ ] Real-time notifications (WebSocket)
- [ ] Export/Report generation

### Testing
- [ ] Unit tests (API endpoints)
- [ ] Integration tests (Twilio, Brevo, GA4)
- [ ] Load testing (100+ concurrent bookings)
- [ ] SMS delivery testing
- [ ] Email delivery testing
- [ ] GA4 event validation
- [ ] Mobile responsiveness (admin dashboard)
- [ ] Security audit (OWASP)

### DevOps & Deployment
- [ ] Plesk server configuration
- [ ] SSL certificate setup
- [ ] Environment variables (Plesk vault)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Database backup strategy
- [ ] Monitoring & alerting setup
- [ ] Logging aggregation (ELK stack)
- [ ] Performance optimization
- [ ] Uptime monitoring

### Documentation
- [ ] API documentation (Swagger)
- [ ] SMS template guide
- [ ] Email template guide
- [ ] Admin user guide
- [ ] Troubleshooting guide
- [ ] API integration guide (for future third parties)

### Security
- [ ] API key rotation schedule
- [ ] Data encryption (SSL + DB encryption)
- [ ] KVKK compliance audit
- [ ] Regular security updates
- [ ] Penetration testing
- [ ] DDoS protection (Cloudflare)

---

## 🎯 SUCCESS METRICS

### Admin Dashboard KPIs
```
Weekly Targets:
├─ Booking completion rate: >90%
├─ SMS delivery rate: >99%
├─ Email delivery rate: >98%
├─ Average response time: <200ms
├─ System uptime: >99.9%
├─ Customer support response: <2 hours
└─ Referral code usage: >15%

Monthly Targets:
├─ Total bookings: 500+ (target)
├─ Revenue: ₺900,000+ (average price ₺1,800)
├─ Conversion rate: >7% (website to booking)
├─ Customer satisfaction: >4.5/5 stars
├─ Referral booking: >75 (15% of total)
└─ Repeat customer rate: >8%

Quarterly Targets:
├─ User growth: +50% new users
├─ Organic traffic growth: +30%
├─ SEO keyword rankings: 20+ keywords in top 10
├─ Backlink acquisition: +30 high-quality links
├─ Content published: 12 blog articles
└─ Domain authority increase: +2 points
```

---

## 📝 FINAL NOTES

### Database Tables (Schema)
```sql
-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  patient_name VARCHAR(100),
  patient_email VARCHAR(100),
  patient_phone VARCHAR(20),
  test_type VARCHAR(50), -- momguard, verifi, veritas
  booking_date TIMESTAMP,
  appointment_date DATE,
  appointment_time TIME,
  referral_code_id UUID FOREIGN KEY,
  sales_rep_id UUID FOREIGN KEY,
  total_price DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  payment_status VARCHAR(50), -- pending, completed, refunded
  booking_status VARCHAR(50), -- new, confirmed, scheduled, completed
  omega_care_assigned BOOLEAN,
  lab_status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Referral Codes
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE,
  doctor_name VARCHAR(100),
  doctor_email VARCHAR(100),
  sales_rep_id UUID FOREIGN KEY,
  discount_percent DECIMAL(5, 2),
  max_uses INT,
  usage_count INT,
  expiry_date DATE,
  is_active BOOLEAN,
  created_at TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  booking_id UUID FOREIGN KEY,
  notification_type VARCHAR(50), -- sms, email
  template_id VARCHAR(50),
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(100),
  status VARCHAR(50), -- pending, sent, failed
  sent_at TIMESTAMP,
  twilio_sid VARCHAR(100),
  brevo_message_id VARCHAR(100),
  error_message TEXT,
  created_at TIMESTAMP
);

-- Analytics Events (GA4 backup)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  event_name VARCHAR(100),
  user_id UUID,
  booking_id UUID FOREIGN KEY,
  event_data JSONB,
  timestamp TIMESTAMP,
  device_type VARCHAR(50),
  location VARCHAR(50)
);
```

---

**Document Version:** Admin Dashboard & API Integration 1.0
**Status:** Ready for backend development
**Estimated Dev Time:** 4-6 weeks (including testing)
**Critical APIs:** Twilio, Brevo, AWS SES, GA4
**Monitoring:** Sentry, New Relic, StatusPage, GA4
