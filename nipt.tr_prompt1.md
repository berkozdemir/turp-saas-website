# ANTIGRAVITY PROMPT (v2)
## nipt.tr Multi-Tenant NIPT Platform - Plesk Deployment

---

## 🎯 MISSION STATEMENT

**Hedef:** nipt.tr domain'inde, mevcut multi-tenant altyapısını kullanarak 3 NIPT testini (MomGuard, Verifi, Veritas) bağımsız kiracılar olarak sunacak bir uygulamayı geliştir. 

**Ana Konsept:** Single Portal → 3 Tenant Seçimi
- Giriş sayfasında 3 test kartı
- Her karta tıkla → O tenant'ın sayfasına git
- Tenant'lar bağımsız, merkezi backend

**Deployment:** GitHub → Plesk Sunucusu (mevcut altyapı)

---

## 🏗️ ARCHITECTURAL SPECIFICATION

### Overview (Mevcut Sisteminize Uygun)
```
nipt.tr (Ana Domain)
    ↓
┌───────────────────────────────────┐
│  Single Portal (Home Page)        │
│  - 3 Test Kartı Seçimi            │
│  - Unified Auth System            │
└───────────────────────────────────┘
    │
    ├─ /momguard → MomGuard Tenant
    ├─ /verifi → Verifi Tenant
    └─ /veritas → Veritas Tenant
    │
    ▼
┌───────────────────────────────────┐
│  Shared Backend (Node.js Express) │
│  - Multi-tenant Engine            │
│  - PostgreSQL (mevcut)            │
│  - JWT Auth (tenant_id bazlı)     │
└───────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────┐
│  Omega Genetik Lab API            │
│  (omegagenetik.com endpoints)     │
└───────────────────────────────────┘
```

**Plesk Ortamı:**
```
Plesk Sunucu
├─ Domain: nipt.tr
├─ Document Root: /var/www/nipt.tr/httpdocs
├─ Git Repository: /var/www/nipt.tr/repo
├─ Node.js Application
│  ├─ Frontend (React build)
│  ├─ Backend (Express server)
│  └─ Nginx reverse proxy
├─ PostgreSQL Database (mevcut)
└─ SSL Certificate (Let's Encrypt)
```

**Çalışma Modeli:** Metadata-driven routing
- Her tenant: Kendi `tenant_id`, CSS themesi, metin kütüphanesi
- Paylaşılan: Auth, API, Database (row-level security via tenant_id)
- Güvenlik: Row-level security (RLS) + Tenant ID validation

---

## 📋 TASK BREAKDOWN (Ajanlar İçin)

### AGENT 1: Architecture & Planning (Existing System Integration)
**Görev:** Mevcut multi-tenant sisteminizi nipt.tr'ye adapte etme spesifikasyonu oluştur

**Deliverables:**
1. **Migration Guide** (`MIGRATION.md`)
   - nipttesti.com → nipt.tr port mapping
   - Database schema (yeni alanlar var mı?)
   - Tenant configuration structure (tenants.json example)
   - Environment variables (.env.example for Plesk)

2. **API Spec** (`api-spec.yaml`)
   - Mevcut endpoints'e yeni tenant routes ekleme
   - Lab integration points (omegagenetik.com)
   - Authentication flow (JWT + tenant_id)

3. **Plesk Deployment Spec** (`PLESK_SETUP.md`)
   - Node.js app configuration (Plesk panel)
   - Environment variable setup
   - SSL/TLS configuration
   - Git webhook setup (auto-deploy on push)
   - Database backup strategy
   - PM2/Forever configuration (process manager)

4. **Security Checklist**
   - KVKK compliance for Plesk
   - Firewall rules
   - Tenant isolation verification
   - CORS policy for nipt.tr

**Hedef:** 2-3 gün

**Output Format:** Markdown + YAML files

---

### AGENT 2: Frontend Development (Plesk-Ready)
**Görev:** React frontend'i Plesk'e deploy edilebilir şekilde oluştur

#### 2.1 Home Page (nipt.tr/)
```
Yapı:
├─ Header (Logo + Navigation)
├─ Hero Section
│  └─ "3 NIPT Test Seçeneği"
├─ Test Cards (3 adet)
│  ├─ MomGuard
│  │  ├─ Logo
│  │  ├─ "LabGenomics Teknolojisi"
│  │  ├─ 5 feature bullet
│  │  └─ "Bu Testi Seç" → /momguard
│  │
│  ├─ Verifi
│  │  └─ [Aynı yapı]
│  │
│  └─ Veritas
│     └─ [Aynı yapı]
├─ FAQ Section
├─ Omega Genetik Trust Badge
└─ Footer

Bileşenler:
- TestCard.jsx (reusable component)
- HeroSection.jsx
- FAQSection.jsx
- Navigation.jsx
- Footer.jsx

Stil: Tailwind CSS (mobile-first, responsive)
```

**Hedef:** 2-3 gün

#### 2.2 Tenant Routing (Path-based)
```
Routes:
- /                    → Home page (3 test kartı)
- /momguard            → MomGuard intro + routing
- /momguard/hakkinda   → Test detayları
- /momguard/booking    → Randevu formu
- /momguard/results    → Sonuç portalı (authenticated)
- /verifi              → [Aynı yapı]
- /veritas             → [Aynı yapı]
- /auth/login          → Giriş formu (shared)
- /auth/register       → Kayıt formu (shared)
```

**Bileşenler:**
- TenantRouter.jsx (Dynamic tenant detection)
- TenantLayout.jsx (Tenant-specific theming)
- useTenantt.js hook (Context API)

**Hedef:** 2 gün

#### 2.3 Booking Form (Tenant-scoped)
`/[tenant]/booking`

```
Form:
1. Patient Info
   ├─ Ad-Soyad (required)
   ├─ Doğum Tarihi (required, date picker)
   ├─ Email (required, validation)
   └─ Telefon (required, +90 format validation)

2. Randevu Tercihi
   ├─ Tarih (date picker, Türkçe)
   ├─ Saat (time dropdown)
   └─ Örnek Toplama Yeri (radio: kuryeyle/klinik)

3. Onam
   ├─ KVKK (checkbox + modal)
   ├─ Test Şartları (checkbox)
   └─ Iletişim İzni (checkbox)

4. Submit
   └─ POST /api/v1/tenants/{tenantId}/bookings
      → Confirmation page
      → Email gönder (Türkçe)
      → SMS gönder (isteğe bağlı)

Bileşenler:
- BookingForm.jsx
- ConsentModal.jsx
- ConfirmationPage.jsx
- DatePicker.jsx (Türkçe locale)
```

**Hedef:** 2-3 gün

#### 2.4 Results Portal (Authenticated)
`/[tenant]/results`

```
Görünüm:
- Patient Dashboard
  ├─ "Hoş geldin, [Ad]"
  ├─ Active Tests (table)
  │  ├─ Test Date
  │  ├─ Status Badge (Pending/Ready/Reviewed)
  │  ├─ Download PDF Button
  │  └─ View Details Link
  ├─ Test History
  └─ Contact Support Link

Bileşenler:
- ResultsPortal.jsx
- TestTable.jsx
- StatusBadge.jsx
- PDFDownloader.jsx

API Call:
GET /api/v1/tenants/{tenantId}/results/{patientId}
Response: [{ test_id, date, status, pdf_url }, ...]
```

**Hedef:** 1-2 gün

#### 2.5 Build & Bundling (Plesk)
```
Package.json scripts:
├─ "dev" → Localhost development
├─ "build" → Production build (React)
├─ "start" → Node.js server start
└─ "deploy" → Git push trigger (GitHub Actions optional)

Output:
├─ /build folder (static React files)
├─ /server.js (Express, serving /build)
└─ /public (assets)

Plesk Ready:
- Single entry point (server.js)
- Environment variables from .env
- Port configurable (default: 3000)
```

**AGENT 2 Çıktı:**
- GitHub repo (frontend + backend in one project)
- Plesk deployment instructions
- Screenshots (home + 3 tenant pages)
- Local testing guide (npm start)

**Denetim:** Responsive test (mobile + desktop), routing test

---

### AGENT 3: Backend API Development (Plesk-Ready)
**Görev:** Node.js + Express backend (mevcut sisteminize uyarla)

#### 3.1 Express Server Setup
```
server.js:
├─ Require modules (express, cors, jwt, db)
├─ Load environment variables (.env)
├─ Database connection (PostgreSQL)
├─ Middleware setup
│  ├─ CORS (nipt.tr origin)
│  ├─ JSON parser
│  ├─ JWT verification
│  └─ Tenant extraction
├─ Route handlers
│  ├─ /api/v1/auth/*
│  ├─ /api/v1/tenants/*
│  └─ /api/v1/admin/*
├─ Static file serving (/build folder)
├─ Error handler
└─ Listen on PORT (env variable)

Port Strategy:
- Plesk can use 3000, 3001, 3002, etc
- OR use Unix socket (/tmp/nipt.sock)
- Nginx reverse proxy → :80 (nipt.tr)
```

**Hedef:** 1-2 gün

#### 3.2 Database Layer (Mevcut PostgreSQL)
```
Mevcut Schema Kontrol:
├─ tenants table (id, name, slug, logo_url, theme_color, lab_code)
├─ patients table (id, tenant_id, name, email, phone, dob)
├─ bookings table (id, tenant_id, patient_id, date, time, status)
├─ test_results table (id, tenant_id, patient_id, status, pdf_path)
└─ users table (id, email, password_hash, tenant_id) — eğer yoksa oluştur

Tenant Isolation:
├─ Mevcut: Row-level security (tenant_id checks)
├─ New: Add tenant_id validation middleware
└─ Verify: Cross-tenant query prevention
```

**SQL Scripts:**
```sql
-- Seed tenants if not exists
INSERT INTO tenants (id, name, slug, theme_color, lab_code) VALUES
  (uuid_generate_v4(), 'MomGuard', 'momguard', '#2563EB', 'MOMGUARD-001'),
  (uuid_generate_v4(), 'Verifi', 'verifi', '#10B981', 'VERIFI-001'),
  (uuid_generate_v4(), 'Veritas', 'veritas', '#F59E0B', 'VERITAS-001');
```

**Hedef:** 1 gün

#### 3.3 Authentication API
```
Routes:
POST /api/v1/auth/register
  ├─ Body: { email, password, name, tenant_slug }
  ├─ Validate: email format, password strength
  ├─ Hash password (bcrypt)
  ├─ Create user + tenant_id binding
  └─ Return: { token, user }

POST /api/v1/auth/login
  ├─ Body: { email, password }
  ├─ Verify password
  ├─ Get user + tenant_id
  └─ Return: JWT token + tenant info

POST /api/v1/auth/logout
  └─ Blacklist token (Redis optional)

GET /api/v1/auth/me
  ├─ Verify JWT
  └─ Return: { user, tenant }

Middleware:
├─ verifyToken() → Check JWT signature
├─ extractTenant() → Get tenant_id from token payload
└─ authRequired() → Combine above
```

**Hedef:** 1 gün

#### 3.4 Booking API
```
POST /api/v1/tenants/{tenantId}/bookings
  ├─ Extract tenant_id from middleware
  ├─ Validate tenant_id (auth middleware)
  ├─ Body: { patient_name, dob, email, phone, date, time, location }
  ├─ Create booking record
  ├─ Send confirmation email (Nodemailer)
  ├─ Send SMS (Twilio optional)
  └─ Return: { booking_id, confirmation # }

GET /api/v1/tenants/{tenantId}/bookings/{bookingId}
  ├─ Verify tenant_id + user ownership
  └─ Return: booking details

GET /api/v1/tenants/{tenantId}/bookings?email=xxx
  └─ Search by email (for results page)
```

**Hedef:** 1-2 gün

#### 3.5 Results API
```
GET /api/v1/tenants/{tenantId}/results/{patientId}
  ├─ Verify tenant_id + user ownership
  ├─ Query test_results table
  └─ Return: [{ test_id, date, status, pdf_url }]

GET /api/v1/tenants/{tenantId}/results/{patientId}/download/{testId}
  ├─ Verify access
  ├─ Fetch PDF from S3/local storage
  └─ Stream as attachment

POST /api/v1/tenants/{tenantId}/results (Lab only)
  ├─ Auth: Lab API key
  ├─ Body: { patient_email, test_data, pdf_file }
  ├─ Update test_results record
  ├─ Store PDF
  └─ Return: { success: true }
```

**Hedef:** 1-2 gün

#### 3.6 Lab Integration (omegagenetik.com API)
```
LabService.js:
├─ submitSample(bookingData)
│  └─ POST https://api.omegagenetik.com/samples
│     ├─ Headers: { Authorization: Bearer LAB_API_KEY }
│     ├─ Body: { patient_id, test_type, sample_date }
│     └─ Return: { lab_sample_id }
│
├─ getStatus(labSampleId)
│  └─ GET https://api.omegagenetik.com/samples/{id}/status
│
└─ getResult(labSampleId)
   └─ GET https://api.omegagenetik.com/samples/{id}/result
      └─ Returns: { pdf_data, findings }
```

**Mock Version:** JSONify responses (until real API available)

**Hedef:** 1-2 gün

#### 3.7 Environment Setup (.env)
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nipt_db
DB_USER=nipt_user
DB_PASSWORD=***

# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# JWT
JWT_SECRET=***
JWT_EXPIRY=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@nipt.tr
EMAIL_PASSWORD=***

# Lab API
LAB_API_URL=https://api.omegagenetik.com
LAB_API_KEY=***

# Frontend
FRONTEND_URL=https://nipt.tr
API_URL=https://nipt.tr/api

# Sentry (Error tracking)
SENTRY_DSN=***
```

**Plesk Note:** .env dosyasını Plesk panel'inden manage edersiniz

**AGENT 3 Çıktı:**
- Complete backend code (Node.js + Express)
- Database migration scripts
- API documentation (Swagger/OpenAPI)
- Postman collection (testing)
- .env.example (template)
- server.js entry point (Plesk-ready)

**Denetim:** API testing (Postman), tenant isolation verification

---

### AGENT 4: GitHub Integration & CI/CD
**Görev:** GitHub repo setup, deployment pipeline

#### 4.1 Repository Structure
```
nipt.tr repository structure:
├─ /frontend          (React source)
│  ├─ /src
│  ├─ /public
│  └─ package.json
│
├─ /server            (Express backend)
│  ├─ /routes
│  ├─ /middleware
│  ├─ /services
│  ├─ /db
│  └─ server.js
│
├─ /database          (PostgreSQL)
│  ├─ schema.sql
│  ├─ seed.sql
│  └─ migrations/
│
├─ .github/workflows/ (GitHub Actions)
│  └─ deploy.yml      (optional: auto-deploy on push)
│
├─ .gitignore         (node_modules, .env, etc)
├─ .env.example
├─ docker-compose.yml (local dev)
├─ package.json       (root, if monorepo setup)
├─ README.md          (Plesk setup instructions)
└─ DEPLOYMENT.md      (nipt.tr specific)
```

**Hedef:** 1 gün

#### 4.2 Deployment to Plesk
**Manual Workflow (No CI/CD):**
```
1. Local geliştirme: npm run dev
2. Test: npm test (if needed)
3. Git push: git push origin main
4. Plesk panel'de pull yapın: git pull origin main
5. Restart Node.js app
```

**OR Automated with GitHub Actions:**
```
.github/workflows/deploy.yml:
├─ Trigger: On push to main
├─ Jobs:
│  ├─ Test (ESLint, unit tests)
│  ├─ Build (npm run build)
│  └─ Deploy (SSH to Plesk, git pull + restart)
└─ Notifications: Slack/Email on success/failure

SSH Deploy Script:
  ssh user@nipt.tr "cd /var/www/nipt.tr && git pull && npm install && npm run build && systemctl restart nipt"
```

**Hedef:** 1-2 gün

**AGENT 4 Çıktı:**
- GitHub Actions workflow (.yml)
- Plesk deployment script (bash)
- README with step-by-step setup
- Video: Git push → Plesk deploy flow

**Denetim:** Successful test deployment to staging

---

### AGENT 5: Testing & Quality Assurance
**Görev:** E2E tests, security tests, Plesk compatibility

#### 5.1 Local Development Testing
```
Test Suite:
├─ Unit Tests (Jest)
│  ├─ Auth logic tests
│  ├─ Tenant isolation tests
│  └─ Database query tests
│
├─ Integration Tests (Supertest + Jest)
│  ├─ POST /api/v1/auth/register → creates user
│  ├─ POST /api/v1/tenants/{tenantId}/bookings → creates booking
│  └─ GET /api/v1/tenants/{tenantId}/results → returns correct data
│
├─ E2E Tests (Cypress)
│  ├─ User journey: Home → Booking → Confirmation
│  ├─ Tenant isolation: MomGuard user ≠ Verifi user data
│  ├─ Results download: PDF accessible
│  └─ Error handling: Invalid input → error message
│
└─ Security Tests
   ├─ SQL injection prevention
   ├─ XSS prevention
   ├─ CSRF token validation
   ├─ JWT signature validation
   └─ Tenant boundary enforcement
```

**Hedef:** 2-3 gün

#### 5.2 Plesk Compatibility Testing
```
Tests:
├─ Node.js version compatibility (14+, 16+, 18+)
├─ Environment variable loading (.env)
├─ Port binding (3000, 3001, etc)
├─ Database connection from Plesk
├─ SSL/TLS certificate verification (nipt.tr)
├─ Nginx reverse proxy routing
└─ Process manager (PM2 or Forever)
```

**Hedef:** 1 gün

#### 5.3 Performance Testing
```
Metrics:
├─ Page load time: Home page < 2 sec
├─ API response time: < 500ms (P95)
├─ Database query time: < 100ms
├─ Build size: Frontend bundle < 500KB (gzip)
└─ Memory usage: Node.js process < 150MB
```

**Hedef:** 1 gün

**AGENT 5 Çıktı:**
- Test report (coverage %, results)
- Performance benchmarks
- Plesk compatibility checklist
- Browser recording: Complete user flow
- Go-live readiness document

**Denetim:** QA sign-off, security review

---

## 🔐 SECURITY & COMPLIANCE (Plesk Context)

### KVKK Uyumluluğu
- ✓ Patient data encrypted at rest (AES-256 or database encryption)
- ✓ HTTPS/TLS in transit (nipt.tr SSL certificate)
- ✓ Consent forms (KVKK + Test Şartları)
- ✓ Audit logging (all data access, stored in database)
- ✓ Right to deletion endpoint (DELETE /api/v1/users/{userId})
- ✓ Plesk firewall rules (whitelist only necessary ports)

### Multi-Tenant Isolation (Verified)
- ✓ Row-level security (tenant_id checks in every query)
- ✓ JWT payload includes tenant_id (validated on every request)
- ✓ Database indexes on tenant_id (performance + isolation)
- ✓ Cross-tenant query prevention (middleware validation)
- ✓ Test: User A cannot access User B's data across tenants

### Plesk-Specific Security
- ✓ SSH keys for Git deployment (no password authentication)
- ✓ Database credentials in .env (not in code)
- ✓ API keys for omegagenetik.com (in .env)
- ✓ Firewall rules (port 3000 only from Nginx)
- ✓ Regular backups (daily, Plesk native)

---

## 📊 MONITORING & LOGGING (Plesk)

### Logging Setup
```
Application Logs:
├─ Winston logger → /var/www/nipt.tr/logs/
│  ├─ error.log (errors only)
│  ├─ combined.log (all levels)
│  └─ access.log (HTTP requests)
│
├─ Plesk Panel → View logs from UI
└─ Rotate logs (weekly, max 100MB)
```

### Monitoring
```
Metrics (optional):
├─ PM2+ or New Relic (error tracking)
├─ Plesk panel (CPU, memory, disk)
├─ Database performance (PostgreSQL slow query log)
└─ API monitoring (Postman checks optional)
```

### Alerting
```
Plesk Notifications:
├─ Email on disk space < 20%
├─ Email on Node.js process crash
└─ Email on high CPU usage > 80%
```

---

## 📋 DELIVERABLES CHECKLIST

### AGENT 1 (Architecture)
- [ ] `MIGRATION.md` (nipttesti.com → nipt.tr adaptation guide)
- [ ] `api-spec.yaml` (Complete OpenAPI specification)
- [ ] `PLESK_SETUP.md` (Node.js, PostgreSQL, Nginx setup)
- [ ] `.env.example` (All required environment variables)
- [ ] `SECURITY_CHECKLIST.md` (KVKK + tenant isolation)

### AGENT 2 (Frontend)
- [ ] React app (src/ folder)
- [ ] Tailwind CSS styling (responsive, mobile-first)
- [ ] Tenant routing (dynamic path-based routing)
- [ ] Components: TestCard, BookingForm, ResultsPortal, etc
- [ ] Build optimized for Plesk (npm run build)
- [ ] Screenshots (home + 3 tenant pages)

### AGENT 3 (Backend)
- [ ] server.js (Express entry point)
- [ ] Routes (auth, bookings, results, admin)
- [ ] Database service layer (queries)
- [ ] JWT middleware (tenant extraction)
- [ ] Lab integration service (LabIntegration class)
- [ ] Docker-compose.yml (local dev PostgreSQL)

### AGENT 4 (Deployment)
- [ ] GitHub repo (created and organized)
- [ ] .gitignore (node_modules, .env, logs/)
- [ ] GitHub Actions workflow (optional deploy)
- [ ] Plesk deployment script (bash)
- [ ] `DEPLOYMENT.md` (step-by-step instructions)
- [ ] SSH keys for Plesk access

### AGENT 5 (Testing)
- [ ] Jest unit tests (__tests__/ folder)
- [ ] Cypress E2E tests (cypress/e2e/)
- [ ] Test report (coverage %, pass/fail count)
- [ ] Security audit results
- [ ] Performance benchmarks
- [ ] Plesk compatibility checklist
- [ ] Browser recording (user journey)

---

## 🚀 EXECUTION TIMELINE (Plesk Context)

| Faz | AGENT 1 | AGENT 2 | AGENT 3 | AGENT 4 | AGENT 5 |
|-----|---------|---------|---------|---------|---------|
| **1** | MIGRATION + SPEC | Home + Routing | Express setup + DB | GitHub repo setup | Unit test setup |
| **2** | PLESK DOCS | Booking form | Auth + Booking API | Deploy script | Integration tests |
| **3** | Security review | Results portal | Results API + Lab | GitHub Actions | E2E tests |
| **4** | - | Polish + optimize | Test + optimize | Staging deployment | Go-live check |

**Critical Path:** AGENT 1 specs → AGENT 3 backend → AGENT 2 frontend → AGENT 4 deployment → AGENT 5 testing

**Timeline:** 4 hafta (MVP ready for Plesk)

---

## 🎯 SUCCESS CRITERIA

### Functional
- ✓ nipt.tr accessible from browser
- ✓ Home page shows 3 test cards (MomGuard, Verifi, Veritas)
- ✓ Clicking card → tenant page loads with correct branding
- ✓ Booking form → database entry → confirmation email
- ✓ Results portal → authenticated users see their results
- ✓ Tenant isolation verified (no cross-tenant data leakage)

### Non-Functional (Plesk)
- ✓ Page load time < 2 seconds
- ✓ API response time < 500ms (P95)
- ✓ Memory usage < 150MB (Node.js process)
- ✓ Uptime > 99.5%
- ✓ Automated backups (daily, Plesk)
- ✓ HTTPS/TLS (nipt.tr certificate)

### User Experience
- ✓ Mobile responsive (tested on iOS + Android)
- ✓ Türkçe UI (no English user-facing text)
- ✓ Booking flow < 5 minutes (simple + intuitive)
- ✓ Results downloadable as PDF (Türkçe)
- ✓ Error messages clear and actionable

### Deployment Readiness
- ✓ Single `git push origin main` → Plesk auto-updates (optional)
- ✓ OR manual `git pull` + restart from Plesk panel
- ✓ Environment variables secure (.env, not in code)
- ✓ Database backups automated
- ✓ Process manager configured (PM2 or Plesk native)
- ✓ Monitoring/logging enabled
- ✓ Documentation complete (README, DEPLOYMENT.md)

---

## 🛠️ FEEDBACK LOOPS

### Development Cycle
```
1. Local development (npm run dev)
2. Test locally (npm test)
3. Git push to main
4. GitHub Actions runs (if enabled)
5. Manual or auto-deploy to Plesk
6. Verify on nipt.tr
7. Monitor logs/alerts
```

### Code Review
- Pull requests (before main)
- Peer review (if team exists)
- Automated tests (CI/CD)

### Testing Phases
- Unit → Integration → E2E → Production

---

## 📞 MANUAL PLESK DEPLOYMENT STEPS

**When agents finish development:**

1. **SSH into Plesk:**
   ```bash
   ssh user@nipt.tr
   cd /var/www/nipt.tr
   ```

2. **Clone repo (if first time):**
   ```bash
   git clone https://github.com/your-org/nipt.git .
   ```

3. **Or pull latest (if exists):**
   ```bash
   git pull origin main
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Build React:**
   ```bash
   npm run build
   ```

6. **Set up environment (.env):**
   ```bash
   cp .env.example .env
   # Edit .env with actual values (DB credentials, API keys, etc)
   nano .env
   ```

7. **Restart Node.js app (Plesk panel):**
   - Plesk Dashboard → Applications → nipt.tr → Restart

8. **Verify SSL (Let's Encrypt):**
   - Plesk Dashboard → Domains → nipt.tr → SSL/TLS → Auto-renew enabled

9. **Test on browser:**
   - Open https://nipt.tr
   - Check home page loads
   - Test booking flow
   - Verify results portal

10. **Configure backups (Plesk):**
    - Scheduled daily backups
    - Test restore procedure

---

## 🔄 AUTOMATION (Optional GitHub Actions)

If you want auto-deployment on git push:

```yaml
name: Deploy to Plesk
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: nipt.tr
          username: plesk_user
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /var/www/nipt.tr
            git pull origin main
            npm install
            npm run build
            systemctl restart nipt (or pm2 restart)
```

---

## ❌ ANTIMATTER: Avoid These

❌ **Don't do:**
- Hard-code API keys in source code (use .env)
- Commit .env file to GitHub
- Use localhost URLs in production code
- Skip database backups
- Ignore Plesk security settings
- Mix tenant data in single schema row
- Use weak JWT secrets (< 32 characters)
- Deploy without HTTPS (Plesk handles this)
- Forget .gitignore (node_modules, logs/)
- Manual deployments (use Git + scripts)

✅ **Do:**
- Use environment variables (.env)
- Enable Plesk firewall
- Rotate API keys quarterly
- Test before deploying (npm test)
- Monitor logs (Plesk panel or terminal)
- Backup database regularly
- Document deployment steps
- Use strong JWT secrets (openssl rand -base64 32)
- Enforce HTTPS (Let's Encrypt on Plesk)
- Automate with CI/CD or simple bash scripts

---

## 🎬 FINAL CHECKLIST (Go-Live)

- [ ] All 5 agents completed tasks
- [ ] Code merged to main branch
- [ ] Tests passing (unit + integration + E2E)
- [ ] nipt.tr domain points to Plesk server (DNS)
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] .env configured with real values (DB, API keys)
- [ ] Database seeded with 3 tenants
- [ ] Backups enabled (daily, Plesk)
- [ ] Monitoring configured (logs, alerts)
- [ ] Documentation complete (README, DEPLOYMENT.md)
- [ ] Team trained on deployment procedure
- [ ] Go-live announcement ready

---

## 🏁 NEXT IMMEDIATE STEPS

**Before starting agents:**

1. ✅ Confirm: Mevcut multi-tenant sisteminiz nipt.tr'ye taşınacak mı?
   - Database: PostgreSQL (mevcut)?
   - Auth: JWT (mevcut)?
   - Backend: Node.js + Express (mevcut)?

2. ✅ Plesk server details:
   - Domain: nipt.tr ✓
   - IP address?
   - SSH user + password/key?
   - Node.js version available?

3. ✅ Tenant details:
   - MomGuard: Logo URL? Fiyat? Teknoloji açıklaması?
   - Verifi: Logo? Fiyat? Teknoloji?
   - Veritas: Logo? Fiyat? Teknoloji?

4. ✅ Lab integration:
   - omegagenetik.com API endpoint?
   - API key/authentication method?
   - Expected request/response format?

5. ✅ Email/SMS setup:
   - Booking confirmation email: From address?
   - SMS: Twilio account? Or skip SMS?

**Once above confirmed → AGENT 1 can start**

---

## 📝 PROMPT VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | Dec 28, 2025 | Initial (nipttesti.com SaaS) |
| **v2.0** | **Dec 28, 2025** | **Plesk deployment, mevcut sistem adaptation** |

---

**Ready to start agents?**
- Yes → Confirm above 5 items + proceed with AGENT 1
- No → Provide clarifications first

**Good luck! 🚀**