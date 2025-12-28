# WESTESTI.COM & TROMBOFILI.COM - BACKEND ARCHITECTURE
## Multi-Tenant Backend Structure (Shared Infrastructure)

---

## 🏗️ SYSTEM OVERVIEW

### Three Independent Sites, One Shared Backend

```
TENANT ARCHITECTURE:

┌─────────────────────────────────────┐
│ API Gateway (Node.js/Express)       │
│ - Authentication (JWT + RBAC)       │
│ - Tenant routing (domain-based)     │
│ - Rate limiting                     │
│ - CORS handling                     │
└─────────────────────────────────────┘
         ↓ (tenant_id header)
┌─────────────────────────────────────┐
│ Multi-Tenant Service Layer          │
├─────────────────────────────────────┤
│ ├─ Booking Service                  │
│ ├─ Notification Service (SMS/Email) │
│ ├─ Analytics Service (GA4)          │
│ ├─ Payment Service                  │
│ ├─ Lab Service                      │
│ └─ Omega Care Service               │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Shared Database (PostgreSQL)        │
│ - Row-level tenant isolation        │
│ - tenant_id on every table          │
│ - Indexes on (tenant_id, ...)       │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ External Services (Tenant-aware)    │
├─────────────────────────────────────┤
│ ├─ Twilio (SMS - per tenant config) │
│ ├─ Brevo (Email - per tenant config)│
│ ├─ AWS SES (Backup)                 │
│ ├─ GA4 (Per tenant measurement ID)  │
│ └─ Stripe (Payments)                │
└─────────────────────────────────────┘

TENANT CONFIGURATION:
┌─────────────────┬──────────────┬──────────────┐
│ Property        │ nipt.tr      │ westesti.com │ trombofili.com
├─────────────────┼──────────────┼──────────────┤
│ tenant_id       │ omega_nipt   │ west_nipt    │ tromb_screening
│ domain          │ nipt.tr      │ westesti.com │ trombofili.com
│ company_name    │ Omega Genetik│ Omega West   │ Omega Trombofili
│ phone           │ 0312 920...  │ 0232 xxx...  │ 0312 920...
│ region          │ National     │ West TR      │ National
│ tests           │ [3 tests]    │ [1 test]     │ [1 test]
│ twilio_sid      │ [sid1]       │ [sid2]       │ [sid3]
│ brevo_api_key   │ [key1]       │ [key2]       │ [key3]
│ ga4_meas_id     │ [id1]        │ [id2]        │ [id3]
│ stripe_key      │ [key1]       │ [key2]       │ [key3]
└─────────────────┴──────────────┴──────────────┘
```

---

## 📊 WESTESTI.COM - BACKEND STRUCTURE

### Site Overview
```
westesti.com
├─ Focuses on: NIPT testing in Western Turkey
├─ Region: İzmir, Manisa, Aydın, Denizli, etc.
├─ Main office: İzmir
├─ Omega Care availability: Limited to West region
├─ Tests offered: Verifi (primary), MomGuard (secondary)
├─ Payment: Stripe integration
├─ Integration: Omega Care West (different logistics team)
└─ Branding: "Batı Bölgesinin En İyi NIPT Testi"
```

### Database Schema (westesti.com specific)

```sql
-- Tenants table (shared)
INSERT INTO tenants (tenant_id, domain, company_name, region, is_active, created_at) 
VALUES ('west_nipt', 'westesti.com', 'Omega West', 'West Turkey', true, NOW());

-- Tests for westesti.com
INSERT INTO tests (tenant_id, slug, name, price, accuracy, turnaround_min, turnaround_max, is_active) 
VALUES 
  ('west_nipt', 'verifi', 'Verifi', 1850, 99.9, 7, 10, true),
  ('west_nipt', 'momguard', 'MomGuard', 1200, 99.8, 10, 14, true);

-- Locations (Omega Care West regions)
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  city VARCHAR(50), -- İzmir, Manisa, etc.
  district VARCHAR(50),
  omega_care_available BOOLEAN,
  coverage_radius_km INT,
  logistics_team_id UUID,
  created_at TIMESTAMP
);

INSERT INTO locations (tenant_id, city, district, omega_care_available, coverage_radius_km)
VALUES
  ('west_nipt', 'İzmir', 'Alsancak', true, 15),
  ('west_nipt', 'İzmir', 'Karşıyaka', true, 15),
  ('west_nipt', 'Manisa', 'Merkez', true, 20),
  ('west_nipt', 'Aydın', 'Merkez', false, 0), -- No home care in Aydın yet
  ('west_nipt', 'Denizli', 'Merkez', true, 25);

-- Sales reps (westesti.com specific)
CREATE TABLE sales_reps (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  region VARCHAR(50),
  commission_percent DECIMAL(5, 2),
  is_active BOOLEAN,
  created_at TIMESTAMP
);

INSERT INTO sales_reps (tenant_id, name, email, phone, region, commission_percent)
VALUES
  ('west_nipt', 'Yasin D.', 'yasin@westesti.com', '0232 123 4567', 'İzmir', 10),
  ('west_nipt', 'Elif K.', 'elif@westesti.com', '0232 234 5678', 'Manisa', 10),
  ('west_nipt', 'Mert Ş.', 'mert@westesti.com', '0232 345 6789', 'Denizli', 10);

-- Referral codes (westesti.com specific)
-- Example: Doctors in İzmir area
INSERT INTO referral_codes (tenant_id, code, doctor_name, discount_percent, is_active)
VALUES
  ('west_nipt', 'DRALI10', 'Dr. Ali Yılmaz', 10, true),
  ('west_nipt', 'DRFATIH15', 'Dr. Fatih Kaya', 15, true),
  ('west_nipt', 'DRZERRIN8', 'Dr. Zerrin Demir', 8, true);

-- Bookings (westesti.com - multi-tenant aware)
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id), -- KEY: Tenant isolation
  patient_name VARCHAR(100),
  patient_email VARCHAR(100),
  patient_phone VARCHAR(20),
  test_id UUID FOREIGN KEY REFERENCES tests(id),
  test_slug VARCHAR(50),
  location_id UUID FOREIGN KEY REFERENCES locations(id),
  booking_date TIMESTAMP,
  appointment_date DATE,
  appointment_time TIME,
  referral_code_id UUID,
  sales_rep_id UUID,
  total_price DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  payment_status VARCHAR(50), -- pending, completed, refunded
  booking_status VARCHAR(50), -- new, confirmed, scheduled, in_lab, completed
  payment_method VARCHAR(50), -- stripe, credit_card, bank_transfer
  stripe_payment_id VARCHAR(100),
  omega_care_assigned BOOLEAN,
  omega_care_nurse_id UUID,
  lab_status VARCHAR(50),
  result_pdf_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (tenant_id, created_at),
  INDEX (tenant_id, appointment_date),
  INDEX (tenant_id, booking_status)
);

-- Notifications (westesti.com - tenant-aware)
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  booking_id UUID FOREIGN KEY REFERENCES bookings(id),
  notification_type VARCHAR(50), -- sms, email, push
  template_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(100),
  status VARCHAR(50), -- pending, sent, failed, bounced
  sent_at TIMESTAMP,
  delivery_timestamp TIMESTAMP,
  provider_response_id VARCHAR(100),
  error_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP,
  INDEX (tenant_id, status),
  INDEX (tenant_id, created_at)
);

-- Lab Results (westesti.com)
CREATE TABLE lab_results (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  booking_id UUID FOREIGN KEY REFERENCES bookings(id),
  test_type VARCHAR(50),
  sample_received_date DATE,
  analysis_start_date DATE,
  analysis_complete_date DATE,
  qc_passed BOOLEAN,
  result_summary TEXT,
  pdf_url VARCHAR(255),
  doctor_notes TEXT,
  genetic_counselor_recommended BOOLEAN,
  released_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### API Endpoints (westesti.com)

```javascript
// BASE: https://api.westesti.com/v1/
// Tenant routing: tenant_id automatically detected from domain

// 1. BOOKING ENDPOINTS
POST /bookings
├─ Tenant isolation: tenant_id from middleware
├─ Body: {
│   patient_name,
│   patient_email,
│   patient_phone,
│   test_slug, // 'verifi' or 'momguard'
│   location_id, // İzmir, Manisa, etc.
│   appointment_date,
│   appointment_time,
│   referral_code (optional),
│   sales_rep_id (optional)
│ }
├─ Response: {
│   booking_id,
│   confirmation_number,
│   test_name,
│   total_price,
│   payment_url (Stripe checkout)
│ }
├─ Triggers:
│   ├─ SMS: Booking confirmation (Twilio)
│   ├─ Email: Booking details (Brevo)
│   ├─ GA4 event: booking_completed
│   ├─ Payment processing: Stripe
│   └─ Omega Care: Logistics assignment
│
└─ Error handling:
   ├─ Invalid location (not in West region)
   ├─ Omega Care unavailable (Aydın)
   ├─ Date unavailable
   └─ Payment failure

GET /bookings/:id
├─ Return full booking with current status
├─ Include payment status
├─ Include Omega Care assignment
└─ Tenant isolation applied

PUT /bookings/:id
├─ Update booking (reschedule, cancel, etc.)
├─ Available transitions:
│   ├─ new → confirmed (payment received)
│   ├─ confirmed → scheduled (appointment set)
│   ├─ scheduled → cancelled
│   └─ in_lab → completed
└─ Triggers notifications for status changes

GET /bookings?filters
├─ Status filter: [new, confirmed, scheduled, in_lab, completed, cancelled]
├─ Date range: From/To dates
├─ Test filter: [verifi, momguard]
├─ Location filter: [İzmir, Manisa, Denizli, etc.]
├─ Pagination: page, limit
└─ All filtered by tenant_id automatically

// 2. PAYMENT ENDPOINTS
POST /payments/create-checkout
├─ Body: { booking_id }
├─ Create Stripe payment session
├─ Includes:
│   ├─ Test price
│   ├─ Referral discount (if applicable)
│   └─ Tax (if applicable)
├─ Response: { checkout_url, session_id }
└─ Webhook: /webhooks/stripe-payment-success

POST /payments/webhook
├─ Stripe sends payment success
├─ Update booking: payment_status = completed
├─ Trigger SMS/Email confirmation
├─ Trigger Omega Care assignment
└─ Log transaction

// 3. LOCATION ENDPOINTS
GET /locations
├─ Return list of available cities/districts in West region
├─ Include omega_care_available flag
├─ Response: [
│   { city: 'İzmir', district: 'Alsancak', omega_care: true },
│   { city: 'İzmir', district: 'Karşıyaka', omega_care: true },
│   ...
│ ]
└─ Used by booking form for location selection

GET /locations/:id/omega-care-estimate
├─ Get estimated Omega Care visit time
├─ Parameters: appointment_date, appointment_time
├─ Response: {
│   available_time_slots: [...],
│   estimated_nurse_arrival,
│   service_fee (if any)
│ }
└─ Called when location + date selected

// 4. TEST ENDPOINTS
GET /tests
├─ Return tests available for westesti.com
├─ Response: [
│   { slug: 'verifi', name: 'Verifi', price: 1850, accuracy: 99.9, turnaround: '7-10 days' },
│   { slug: 'momguard', name: 'MomGuard', price: 1200, accuracy: 99.8, turnaround: '10-14 days' }
│ ]
└─ Used by booking form test selection

// 5. REFERRAL CODE ENDPOINTS
POST /referral-codes/validate
├─ Body: { code }
├─ Validate doctor referral code
├─ Response: {
│   valid: true,
│   doctor_name: 'Dr. Ali Yılmaz',
│   discount_percent: 10,
│   discount_amount: 185 (calculated from base price)
│ }
└─ Called in real-time during booking form

// 6. NOTIFICATIONS ENDPOINTS
POST /notifications/send-sms
├─ Manual trigger (admin only)
├─ Body: { booking_id, template_name }
├─ Twilio integration:
│   ├─ Account: westesti.com specific
│   ├─ Phone: +90 (232) xxx-xxxx (West region number)
│   └─ Template: westesti branded
├─ Response: { status, twilio_sid }
└─ Error handling: Retry on failure

POST /notifications/send-email
├─ Manual trigger (admin only)
├─ Body: { booking_id, template_name }
├─ Brevo integration:
│   ├─ Sender: info@westesti.com
│   ├─ API Key: westesti specific
│   └─ Template: westesti branded
├─ Response: { status, brevo_message_id }
└─ Include logo/branding for westesti.com

// 7. ANALYTICS ENDPOINTS
POST /analytics/event
├─ GA4 event tracking
├─ Body: { event_name, parameters }
├─ GA4 Measurement ID: westesti.com specific
├─ Events tracked:
│   ├─ page_view
│   ├─ booking_started
│   ├─ test_selected
│   ├─ booking_completed
│   ├─ payment_completed
│   └─ result_downloaded
├─ Endpoint: https://www.google-analytics.com/mp/collect
└─ Real-time tracking

GET /analytics/dashboard
├─ Return dashboard metrics
├─ Response: {
│   bookings_today: 5,
│   revenue_today: 9250,
│   conversion_rate: 8.2%,
│   top_test: 'Verifi',
│   locations: { İzmir: 3, Manisa: 2 }
│ }
└─ Used by admin dashboard

// 8. LAB ENDPOINTS
PUT /bookings/:id/lab-status
├─ Update lab processing status
├─ Body: { status, notes }
├─ Valid transitions:
│   ├─ scheduled → sample_received
│   ├─ sample_received → processing
│   ├─ processing → qc_check
│   ├─ qc_check → result_generated
│   └─ result_generated → completed
├─ Trigger: SMS/Email to patient on status change
└─ Response: { updated_status, notification_sent }

POST /bookings/:id/upload-result
├─ Upload PDF result
├─ Body: { pdf_file, summary }
├─ Store in cloud (AWS S3)
├─ Update: lab_results table
├─ Trigger: Email to patient with download link
└─ Response: { result_url, email_sent }

// 9. ADMIN ENDPOINTS
GET /admin/dashboard
├─ Admin only (requires role = admin)
├─ Return westesti.com specific metrics
├─ Response: {
│   total_bookings_month: 45,
│   revenue_month: 83250,
│   avg_price: 1850,
│   bookings_by_test: { verifi: 28, momguard: 17 },
│   bookings_by_location: { İzmir: 30, Manisa: 12, Denizli: 3 },
│   pending_payments: 2,
│   alerts: [ { type: 'no_omega_care', message: '3 bookings need assignment' } ]
│ }
└─ Used by admin portal

GET /admin/sales-performance
├─ Sales rep performance report
├─ Response: [
│   { rep_name: 'Yasin D.', bookings: 15, revenue: 27750, commission: 2775 },
│   { rep_name: 'Elif K.', bookings: 12, revenue: 22200, commission: 2220 },
│ ]
└─ Commission tracking
```

### Environment Variables (westesti.com)

```bash
# westesti.com specific config

# Tenant
TENANT_ID=west_nipt
DOMAIN=westesti.com
COMPANY_NAME="Omega West"

# Twilio (westesti.com account)
TWILIO_ACCOUNT_SID_WEST=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN_WEST=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER_WEST=+905321234567 (Turkey West number)

# Brevo (westesti.com account)
BREVO_API_KEY_WEST=xkeysxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL_WEST=info@westesti.com

# AWS SES (Backup)
AWS_SES_REGION_WEST=eu-central-1

# Google Analytics 4 (westesti.com)
GA4_MEASUREMENT_ID_WEST=G-XXXXXXXXXX
GA4_API_SECRET_WEST=xxxxxxxxxxxxxxx_xxxxxx

# Stripe (westesti.com)
STRIPE_PUBLIC_KEY_WEST=pk_live_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY_WEST=sk_live_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_WEST=whsec_xxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/multitenancy_db (shared)

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=7d

# Email branding
EMAIL_LOGO_URL_WEST=https://assets.westesti.com/logo.png
EMAIL_FOOTER_WEST="© 2025 Omega West. Tüm hakları saklıdır."
```

---

## 💉 TROMBOFILI.COM - BACKEND STRUCTURE

### Site Overview
```
trombofili.com
├─ Focuses on: Thrombophilia screening (blood clotting disorder testing)
├─ Target: Adults with family history of thrombosis, post-thrombosis patients
├─ Tests: 
│   ├─ Factor V Leiden
│   ├─ Prothrombin G20210A
│   ├─ MTHFR C677T
│   └─ Comprehensive Thrombophilia Panel
├─ Payment: Stripe integration
├─ Omega Care: National coverage (different patient profile)
├─ Branding: "Kan Pıhtılaşması Riski Tespit Edin"
├─ Labs: Ankara headquarters, distributed collection centers
└─ Different from nipt.tr/westesti.com: Medical/diagnostic focus, not prenatal
```

### Database Schema (trombofili.com specific)

```sql
-- Tenant registration
INSERT INTO tenants (tenant_id, domain, company_name, region, is_active, created_at) 
VALUES ('tromb_screening', 'trombofili.com', 'Omega Trombofili', 'National', true, NOW());

-- Tests for trombofili.com (Different from NIPT)
INSERT INTO tests (tenant_id, slug, name, price, description, turnaround_min, turnaround_max, is_active) 
VALUES 
  ('tromb_screening', 'f5l', 'Factor V Leiden', 500, 'Genetic mutation causing increased thrombosis risk', 5, 7, true),
  ('tromb_screening', 'pt', 'Prothrombin G20210A', 500, 'Mutation increasing blood clotting', 5, 7, true),
  ('tromb_screening', 'mthfr', 'MTHFR C677T', 500, 'Gene polymorphism affecting blood clotting', 5, 7, true),
  ('tromb_screening', 'panel', 'Comprehensive Thrombophilia Panel', 1500, 'Complete genetic screening for clotting disorders', 7, 10, true);

-- Patient demographics (Different from pregnant women)
CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  booking_id UUID FOREIGN KEY REFERENCES bookings(id),
  age INT,
  gender VARCHAR(20),
  medical_history TEXT, -- Previous thrombosis, DVT, PE, etc.
  family_history TEXT, -- Family history of clotting disorders
  medications TEXT, -- Blood thinners, contraceptives, etc.
  smoking_status VARCHAR(50),
  pregnancy_status VARCHAR(50), -- For women: none, planning, pregnant, postpartum
  created_at TIMESTAMP
);

-- Healthcare providers (Different: Hematologists, not OB/GYNs)
CREATE TABLE healthcare_providers (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  name VARCHAR(100),
  specialty VARCHAR(50), -- Hematology, Cardiology, Surgery, Internal Medicine
  email VARCHAR(100),
  phone VARCHAR(20),
  hospital_clinic VARCHAR(100),
  referral_code VARCHAR(50) UNIQUE,
  discount_percent DECIMAL(5, 2),
  is_active BOOLEAN,
  created_at TIMESTAMP
);

INSERT INTO healthcare_providers (tenant_id, name, specialty, hospital_clinic, discount_percent)
VALUES
  ('tromb_screening', 'Prof. Dr. Mehmet Akbaş', 'Hematology', 'Ankara Hematology Clinic', 15),
  ('tromb_screening', 'Dr. Ayşe Kara', 'Cardiology', 'Istanbul Cardiac Center', 10),
  ('tromb_screening', 'Dr. Ferhat Yıldız', 'Internal Medicine', 'Izmir Medical Center', 8);

-- Indications (Why patient needs test)
CREATE TABLE test_indications (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  booking_id UUID FOREIGN KEY REFERENCES bookings(id),
  indication_type VARCHAR(100), -- 'family_history_thrombosis', 'personal_thrombosis', 'planning_pregnancy', 'contraceptive_use', 'surgery_planned'
  details TEXT,
  urgency VARCHAR(50), -- routine, urgent, critical
  created_at TIMESTAMP
);

-- Bookings (trombofili.com - Different structure)
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  patient_name VARCHAR(100),
  patient_email VARCHAR(100),
  patient_phone VARCHAR(20),
  patient_age INT,
  patient_gender VARCHAR(20),
  test_id UUID FOREIGN KEY REFERENCES tests(id),
  test_slug VARCHAR(50),
  indication_id UUID FOREIGN KEY REFERENCES test_indications(id),
  collection_method VARCHAR(50), -- home_visit, clinic, lab
  collection_location VARCHAR(100),
  appointment_date DATE,
  appointment_time TIME,
  healthcare_provider_id UUID, -- Hematologist, not OB/GYN
  referral_code VARCHAR(50),
  total_price DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  payment_status VARCHAR(50),
  booking_status VARCHAR(50),
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(100),
  omega_care_assigned BOOLEAN,
  sample_collection_status VARCHAR(50), -- pending, collected, delivered_to_lab
  lab_status VARCHAR(50),
  result_pdf_url VARCHAR(255),
  genetic_counselor_url VARCHAR(255), -- Link to schedule counseling
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (tenant_id, created_at),
  INDEX (tenant_id, appointment_date)
);

-- Clinical reports (More detailed for hematology)
CREATE TABLE clinical_reports (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  booking_id UUID FOREIGN KEY REFERENCES bookings(id),
  test_type VARCHAR(50),
  sample_received_date DATE,
  analysis_start_date DATE,
  analysis_complete_date DATE,
  genetic_findings TEXT,
  risk_assessment VARCHAR(50), -- low, moderate, high, critical
  clinical_interpretation TEXT,
  recommendations TEXT,
  pdf_url VARCHAR(255),
  genetic_counselor_notes TEXT,
  hematologist_review_date DATE,
  follow_up_recommended BOOLEAN,
  follow_up_timeline VARCHAR(100), -- e.g., "3 months", "6 months"
  released_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Patient education (Specific to thrombophilia)
CREATE TABLE patient_resources (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) FOREIGN KEY REFERENCES tenants(tenant_id),
  booking_id UUID FOREIGN KEY REFERENCES bookings(id),
  resource_type VARCHAR(50), -- video, article, guide
  title VARCHAR(200),
  url VARCHAR(255),
  language VARCHAR(20), -- TR, EN
  viewed_at TIMESTAMP
);
```

### API Endpoints (trombofili.com)

```javascript
// BASE: https://api.trombofili.com/v1/
// Tenant routing: tenant_id automatically detected from domain

// 1. BOOKING ENDPOINTS
POST /bookings
├─ Tenant isolation: tenant_id = 'tromb_screening'
├─ Body: {
│   patient_name,
│   patient_email,
│   patient_phone,
│   patient_age,
│   patient_gender,
│   test_slug, // 'f5l', 'pt', 'mthfr', 'panel'
│   indication_type, // 'family_history_thrombosis', 'personal_thrombosis', etc.
│   collection_method, // 'home_visit', 'clinic', 'lab'
│   appointment_date,
│   healthcare_provider_id (optional),
│   referral_code (optional)
│ }
├─ Response: {
│   booking_id,
│   confirmation_number,
│   test_name,
│   risk_assessment_expected: 'Will be available in 7-10 days',
│   genetic_counseling_available: true,
│   payment_url (Stripe checkout)
│ }
├─ Different logic from NIPT:
│   ├─ Age validation (adults only)
│   ├─ Indication validation
│   ├─ Collection method options (not just home care + clinic)
│   └─ Provider type: Hematologist, not OB/GYN
│
└─ Triggers:
   ├─ SMS: Appointment confirmation
   ├─ Email: Collection instructions + medical history form
   ├─ GA4 event: booking_completed
   ├─ Payment processing: Stripe
   └─ Genetic counseling email (if indicated)

GET /bookings/:id
├─ Return booking with detailed clinical context
├─ Include indication details
├─ Include healthcare provider info
├─ Include risk assessment (when available)
└─ Tenant isolation applied

PUT /bookings/:id
├─ Update booking
├─ Possible status changes:
│   ├─ new → confirmed (payment received)
│   ├─ confirmed → sample_collected
│   ├─ sample_collected → analyzing
│   ├─ analyzing → genetic_counseling_offered
│   ├─ genetic_counseling_offered → completed
│   └─ Any → cancelled
├─ Different notifications (hematology-specific language)
└─ Include provider notifications (doctor gets copy of results)

// 2. TEST ENDPOINTS
GET /tests
├─ Return thrombophilia tests available
├─ Response: [
│   { 
│     slug: 'f5l', 
│     name: 'Factor V Leiden', 
│     price: 500, 
│     description: 'Genetic mutation...',
│     turnaround: '5-7 days',
│     clinical_significance: 'Increases thrombosis risk 5-10x'
│   },
│   ...
│ ]
└─ Include clinical details (different from NIPT)

GET /tests/:slug/clinical-info
├─ Get detailed clinical information
├─ Response: {
│   test_name: 'Factor V Leiden',
│   prevalence: '5-10% in European population',
│   inheritance: 'Autosomal dominant',
│   risk_factors: ['Homozygous: 50-80x thrombosis risk', 'Heterozygous: 5-10x'],
│   management: ['Anticoagulation if thrombosis', 'Screening in pregnancy'],
│   resources: [links to patient education]
│ }
└─ Used for patient education

// 3. HEALTHCARE PROVIDER ENDPOINTS
GET /healthcare-providers
├─ Get list of referring physicians
├─ Response: [
│   { name: 'Prof. Dr. Mehmet Akbaş', specialty: 'Hematology', discount: 15 },
│   ...
│ ]
└─ For patient to select their doctor

POST /healthcare-providers/validate-referral
├─ Body: { referral_code }
├─ Validate and get provider details
├─ Response: {
│   provider_name: 'Prof. Dr. Mehmet Akbaş',
│   specialty: 'Hematology',
│   discount_percent: 15,
│   can_receive_results: true
│ }
└─ Real-time validation in booking form

// 4. COLLECTION ENDPOINTS
GET /collection-locations
├─ Get available collection centers
├─ Filter by: method (home, clinic, lab), region
├─ Response: [
│   { city: 'Ankara', method: 'home_visit', available: true },
│   { city: 'Istanbul', method: 'clinic', available: true },
│   { city: 'Izmir', method: 'lab', address: 'Bornova Lab' }
│ ]
└─ Different from NIPT (not pregnancy-focused)

GET /collection-locations/:id/availability
├─ Get available time slots
├─ Parameters: date_range
├─ Response: [
│   { date: '2025-01-05', times: ['09:00', '10:30', '14:00'] },
│   ...
│ ]
└─ Called when location selected

// 5. PAYMENT ENDPOINTS
POST /payments/create-checkout
├─ Body: { booking_id }
├─ Create Stripe session
├─ Include test price + discount
├─ Response: { checkout_url, session_id }
└─ Webhook: /webhooks/stripe-payment-success

// 6. RESULTS ENDPOINTS
POST /bookings/:id/upload-result
├─ Upload clinical report
├─ Body: { pdf_file, risk_assessment, clinical_notes }
├─ Store PDF in AWS S3
├─ Update clinical_reports table
├─ Trigger:
│   ├─ Email to patient
│   ├─ Email to referring provider (with consent)
│   └─ GA4 event: result_released
├─ Response: { result_url, provider_notified }
└─ Different from NIPT: More clinical detail

GET /bookings/:id/results
├─ Return results with clinical context
├─ Include risk assessment
├─ Include recommendations
├─ Include genetic counselor contact info
├─ Response: {
│   test_name: 'Factor V Leiden',
│   result: 'Heterozygous mutation detected',
│   risk_level: 'Moderate',
│   clinical_significance: '...',
│   recommendations: ['...'],
│   genetic_counselor_available: true,
│   counseling_url: 'https://book.trombofili.com/counseling'
│ }
└─ Patient portal accessible with security

// 7. GENETIC COUNSELING ENDPOINTS
POST /genetic-counseling/request
├─ Book genetic counseling session
├─ Body: { booking_id }
├─ Available: Video call or in-person
├─ Response: { counselor_name, available_slots: [...] }
└─ Specialized genetic counselor for thrombophilia

POST /genetic-counseling/schedule
├─ Confirm counseling appointment
├─ Body: { booking_id, preferred_date, preferred_time, method }
├─ Trigger: Email + SMS with Zoom/meeting link
└─ Response: { appointment_id, meeting_link }

// 8. HEALTHCARE PROVIDER ENDPOINTS (Advanced)
GET /admin/providers/:id/patients
├─ Provider can view their referred patients (with consent)
├─ Authentication: Provider login (doctor email + password)
├─ Response: [
│   { patient_name: 'Zeynep Y.', test: 'Factor V Leiden', result: 'Positive', status: 'Completed' },
│   ...
│ ]
└─ Provider portal (different from admin)

POST /admin/providers/:id/share-result
├─ Provider requests result sharing
├─ Send secure link to patient
├─ Track who accessed what results
└─ Comply with medical privacy laws

// 9. ADMIN ENDPOINTS
GET /admin/dashboard
├─ Trombophilia-specific metrics
├─ Response: {
│   total_bookings_month: 32,
│   revenue_month: 14400,
│   avg_price: 450,
│   test_distribution: { 'f5l': 12, 'pt': 8, 'mthfr': 8, 'panel': 4 },
│   risk_distribution: { low: 8, moderate: 16, high: 8 },
│   genetic_counseling_requests: 6,
│   pending_collections: 3
│ }
└─ Different KPIs from NIPT

GET /admin/clinical-reports
├─ All clinical reports with filters
├─ Risk assessment breakdown
├─ Provider notification status
└─ Genetic counseling tracking

// 10. ANALYTICS ENDPOINTS
POST /analytics/event
├─ GA4 tracking (tenant-specific)
├─ Events:
│   ├─ page_view
│   ├─ booking_started
│   ├─ test_selected
│   ├─ indication_selected
│   ├─ booking_completed
│   ├─ result_released
│   ├─ genetic_counseling_requested
│   └─ provider_notified
└─ Measurement ID: trombofili.com specific
```

### Environment Variables (trombofili.com)

```bash
# trombofili.com specific config

# Tenant
TENANT_ID=tromb_screening
DOMAIN=trombofili.com
COMPANY_NAME="Omega Trombofili"

# Twilio
TWILIO_ACCOUNT_SID_TROMB=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN_TROMB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER_TROMB=+905321234567

# Brevo
BREVO_API_KEY_TROMB=xkeysxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL_TROMB=info@trombofili.com

# GA4
GA4_MEASUREMENT_ID_TROMB=G-XXXXXXXXXX
GA4_API_SECRET_TROMB=xxxxxxxxxxxxxxx_xxxxxx

# Stripe
STRIPE_PUBLIC_KEY_TROMB=pk_live_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY_TROMB=sk_live_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_TROMB=whsec_xxxxxxxxxxxxxxxx

# Genetic Counseling Integration
GENETIC_COUNSELOR_EMAIL=counselor@trombofili.com
GENETIC_COUNSELOR_BOOKING_URL=https://book.trombofili.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/multitenancy_db (shared)
```

---

## 🔧 MULTI-TENANT MIDDLEWARE

### Tenant Detection & Routing

```javascript
// middleware/tenant-detection.js

const tenantMapping = {
  'nipt.tr': { tenant_id: 'omega_nipt', company: 'Omega Genetik' },
  'westesti.com': { tenant_id: 'west_nipt', company: 'Omega West' },
  'trombofili.com': { tenant_id: 'tromb_screening', company: 'Omega Trombofili' }
};

// Middleware to detect tenant from domain
app.use((req, res, next) => {
  const host = req.get('host').split(':')[0]; // Remove port
  const tenantInfo = tenantMapping[host];

  if (!tenantInfo) {
    return res.status(403).json({ error: 'Unauthorized domain' });
  }

  // Attach to request
  req.tenant_id = tenantInfo.tenant_id;
  req.tenant_company = tenantInfo.company;
  req.tenant_domain = host;

  next();
});

// Example usage in route handler
app.get('/api/v1/bookings', (req, res) => {
  const { tenant_id } = req; // From middleware

  // All queries filtered by tenant_id
  const bookings = db.query(
    'SELECT * FROM bookings WHERE tenant_id = $1',
    [tenant_id]
  );

  res.json(bookings);
});
```

### Database Query Pattern (Tenant-Safe)

```javascript
// services/booking-service.js

class BookingService {
  
  // WRONG - Not tenant-safe
  // getBookings() {
  //   return db.query('SELECT * FROM bookings');
  // }

  // RIGHT - Always filter by tenant_id
  async getBookings(tenantId, filters = {}) {
    let query = 'SELECT * FROM bookings WHERE tenant_id = $1';
    const params = [tenantId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND booking_status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.date_from) {
      query += ` AND appointment_date >= $${paramIndex}`;
      params.push(filters.date_from);
      paramIndex++;
    }

    return db.query(query, params);
  }

  async createBooking(tenantId, bookingData) {
    // Validate test belongs to tenant
    const test = await this.validateTest(tenantId, bookingData.test_id);
    if (!test) throw new Error('Invalid test for this tenant');

    // Insert with tenant_id
    const booking = await db.query(
      `INSERT INTO bookings 
       (tenant_id, patient_name, patient_email, test_id, ...) 
       VALUES ($1, $2, $3, $4, ...)
       RETURNING *`,
      [tenantId, bookingData.patient_name, bookingData.patient_email, bookingData.test_id, ...]
    );

    return booking;
  }

  async validateTest(tenantId, testId) {
    // Ensure test belongs to tenant
    return db.query(
      'SELECT * FROM tests WHERE id = $1 AND tenant_id = $2',
      [testId, tenantId]
    );
  }
}

module.exports = new BookingService();
```

---

## 🔐 AUTHENTICATION & RBAC

### Multi-Tenant Authentication

```javascript
// services/auth-service.js

async function loginAdmin(tenantId, email, password) {
  // Find admin belonging to THIS tenant
  const admin = await db.query(
    'SELECT * FROM admins WHERE email = $1 AND tenant_id = $2',
    [email, tenantId]
  );

  if (!admin || !bcrypt.compare(password, admin.password_hash)) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT with tenant_id embedded
  const token = jwt.sign(
    {
      admin_id: admin.id,
      tenant_id: tenantId,
      role: admin.role // admin, sales_manager, lab_manager, support
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, admin };
}

// Verify JWT and extract tenant
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { admin_id, tenant_id, role }
  } catch (err) {
    throw new Error('Invalid token');
  }
}

// Authorization middleware
function requireRole(allowedRoles) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = verifyToken(token);
    
    // Verify token tenant matches request tenant
    if (decoded.tenant_id !== req.tenant_id) {
      return res.status(403).json({ error: 'Unauthorized for this tenant' });
    }

    // Verify role
    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Insufficient role' });
    }

    req.admin = decoded;
    next();
  };
}

// Usage in routes
app.post(
  '/api/v1/admin/bookings',
  requireRole(['admin', 'sales_manager']),
  (req, res) => {
    // Only admins or sales managers can access
  }
);
```

---

## 📊 SHARED DATABASE ISOLATION STRATEGY

### Key Principles

```
1. TENANT_ID ON EVERY TABLE
   └─ Primary key design: (tenant_id, entity_id) pattern

2. ROW-LEVEL SECURITY (PostgreSQL)
   └─ Enable RLS policies per tenant

3. QUERY FILTERING
   └─ ALWAYS include tenant_id in WHERE clause

4. INDEX OPTIMIZATION
   └─ Indexes on (tenant_id, other_columns)

5. BACKUP STRATEGY
   └─ Backup entire database (includes all tenants)
   └─ Recovery: Restore full DB, then verify tenant isolation

Example RLS Policy:
```sql
-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY bookings_tenant_isolation ON bookings
  USING (tenant_id = current_setting('app.current_tenant_id')::VARCHAR);

-- Before query, set tenant:
SET app.current_tenant_id = 'omega_nipt';
SELECT * FROM bookings; -- Only returns omega_nipt bookings
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Multi-Tenant Server Setup

```
┌─────────────────────────────────────┐
│ Nginx Reverse Proxy                 │
│ ├─ nipt.tr → :3001                  │
│ ├─ westesti.com → :3001 (same API)  │
│ └─ trombofili.com → :3001 (same API)│
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Node.js API Server (:3001)          │
│ - Tenant detection middleware       │
│ - Shared business logic             │
│ - Multi-tenant services             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ PostgreSQL Database                 │
│ - Shared, with tenant isolation     │
│ - One DB for all 3 tenants          │
│ - Row-level security enabled        │
└─────────────────────────────────────┘

DNS Setup:
nipt.tr          → 1.2.3.4 (Nginx)
westesti.com     → 1.2.3.4 (Nginx)
trombofili.com   → 1.2.3.4 (Nginx)

API Routing:
- All domains → :3001 API endpoint
- Tenant detection based on Host header
- Response includes tenant-specific branding
```

---

## 🔑 CONFIGURATION MANAGEMENT

### Centralized Tenant Config

```javascript
// config/tenants.js

const tenants = {
  omega_nipt: {
    domain: 'nipt.tr',
    company_name: 'Omega Genetik',
    region: 'National',
    email_sender: 'info@nipt.tr',
    phone: '0312 920 13 62',
    twilio_sid: process.env.TWILIO_ACCOUNT_SID_NIPT,
    brevo_key: process.env.BREVO_API_KEY_NIPT,
    ga4_measurement_id: process.env.GA4_MEASUREMENT_ID_NIPT,
    stripe_key: process.env.STRIPE_SECRET_KEY_NIPT,
    tests: ['verifi', 'momguard', 'veritas'],
    omega_care: { available: true, regions: 'all' },
    logo_url: 'https://assets.nipt.tr/logo.png'
  },
  
  west_nipt: {
    domain: 'westesti.com',
    company_name: 'Omega West',
    region: 'West Turkey',
    email_sender: 'info@westesti.com',
    phone: '0232 xxx xxxx',
    twilio_sid: process.env.TWILIO_ACCOUNT_SID_WEST,
    brevo_key: process.env.BREVO_API_KEY_WEST,
    ga4_measurement_id: process.env.GA4_MEASUREMENT_ID_WEST,
    stripe_key: process.env.STRIPE_SECRET_KEY_WEST,
    tests: ['verifi', 'momguard'],
    omega_care: { available: true, regions: ['İzmir', 'Manisa', 'Denizli'] },
    logo_url: 'https://assets.westesti.com/logo.png'
  },

  tromb_screening: {
    domain: 'trombofili.com',
    company_name: 'Omega Trombofili',
    region: 'National',
    email_sender: 'info@trombofili.com',
    phone: '0312 920 13 62',
    twilio_sid: process.env.TWILIO_ACCOUNT_SID_TROMB,
    brevo_key: process.env.BREVO_API_KEY_TROMB,
    ga4_measurement_id: process.env.GA4_MEASUREMENT_ID_TROMB,
    stripe_key: process.env.STRIPE_SECRET_KEY_TROMB,
    tests: ['f5l', 'pt', 'mthfr', 'panel'],
    omega_care: { available: true, regions: 'all' },
    logo_url: 'https://assets.trombofili.com/logo.png',
    genetic_counseling_available: true
  }
};

function getTenantConfig(tenantId) {
  const config = tenants[tenantId];
  if (!config) throw new Error(`Unknown tenant: ${tenantId}`);
  return config;
}

module.exports = { getTenantConfig, tenants };
```

---

## ✅ IMPLEMENTATION ROADMAP

### Backend Setup (Weeks 1-2)
- [ ] Create shared PostgreSQL database
- [ ] Design multi-tenant schema (with tenant_id on all tables)
- [ ] Set up tenant detection middleware
- [ ] Implement authentication & RBAC
- [ ] Create base API structure (Express)

### Database Migration (Week 2)
- [ ] Create tests table (with tests for all 3 tenants)
- [ ] Create bookings table (multi-tenant aware)
- [ ] Create notifications, locations, providers tables
- [ ] Set up Row-Level Security (RLS) policies
- [ ] Create indexes on (tenant_id, ...)

### API Development (Weeks 2-3)
- [ ] Booking endpoints (all 3 tenants)
- [ ] Payment integration (Stripe)
- [ ] Notification services (SMS/Email per tenant)
- [ ] Analytics integration (GA4 per tenant)
- [ ] Lab status tracking
- [ ] Admin endpoints

### External Services Configuration (Week 3)
- [ ] Twilio: 3 separate accounts (nipt, west, tromb)
- [ ] Brevo: 3 separate API keys
- [ ] Stripe: 3 separate merchant accounts
- [ ] GA4: 3 separate measurement IDs
- [ ] AWS SES: Single account, but tenant-specific sender addresses

### Testing (Week 3-4)
- [ ] Tenant isolation tests (verify data separation)
- [ ] Authentication/RBAC tests
- [ ] API integration tests
- [ ] Multi-tenant scenarios (simultaneous requests)
- [ ] Payment flow tests
- [ ] Notification delivery tests

### Deployment & Monitoring (Week 4)
- [ ] Docker containerization
- [ ] Plesk/server setup
- [ ] Monitoring setup (Sentry, New Relic)
- [ ] Backup strategy
- [ ] Health check endpoints
- [ ] Go-live checklist

---

## 📋 GO-LIVE CHECKLIST

**Backend**
- [ ] Database setup (multi-tenant schema)
- [ ] API endpoints tested & documented
- [ ] Tenant detection working
- [ ] Authentication & RBAC working
- [ ] Payment processing (Stripe) tested
- [ ] SMS/Email notifications tested
- [ ] GA4 events firing correctly
- [ ] Error handling & logging

**Tenant Configuration**
- [ ] nipt.tr: All Twilio/Brevo/GA4 configs set
- [ ] westesti.com: All Twilio/Brevo/GA4 configs set
- [ ] trombofili.com: All Twilio/Brevo/GA4 configs set
- [ ] Tenant switching tested (same API, different tenants)

**External Services**
- [ ] Stripe: 3 merchant accounts configured
- [ ] Twilio: 3 accounts tested
- [ ] Brevo: 3 API keys configured
- [ ] GA4: 3 properties created & tested
- [ ] AWS SES: Backup email configured

**Security**
- [ ] Row-level security (RLS) enabled
- [ ] JWT tokens working
- [ ] HTTPS configured
- [ ] Rate limiting enabled
- [ ] CORS configured per domain
- [ ] API keys secured (environment variables)

**Monitoring**
- [ ] Sentry error tracking active
- [ ] New Relic performance monitoring active
- [ ] Database backups configured
- [ ] Health check endpoints working
- [ ] Alerting configured

---

**Document Version:** Multi-Tenant Backend Architecture 1.0  
**Tenants Supported:** nipt.tr, westesti.com, trombofili.com  
**Database:** PostgreSQL (shared, tenant-isolated)  
**API:** Node.js/Express  
**External Services:** Twilio, Brevo, Stripe, GA4  
**Status:** Ready for backend development  
**Est. Implementation:** 4 weeks
