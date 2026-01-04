# 🚀 TURP SaaS Platform

Multi-tenant SaaS platform built with **React + Vite + TypeScript** (Frontend) and **PHP** (Backend API)..

---

## Turp SaaS Website

> **See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed comprehensive documentation on Project Structure, Multi-Tenant Logic, and Key Modules.**

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     TURP MULTI-TENANT SAAS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ ct.turp.health │ │   nipt.tr    │ │ iwrs.com.tr │         │
│  │   (Turp CRO)   │ │ (Omega NIPT) │ │   (IWRS)    │         │
│  └───────┬────────┘ └───────┬──────┘ └──────┬──────┘         │
│          │                  │               │               │
│          └──────────────────┼───────────────┘               │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   React + Vite   │                      │
│                    │   (Frontend SPA) │                      │
│                    └────────┬─────────┘                      │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   PHP REST API   │                      │
│                    │ (Modular Backend)│                      │
│                    └────────┬─────────┘                      │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   MySQL + Plesk  │                      │
│                    │  (Row-level MT)  │                      │
│                    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **Vite 7** | Build Tool & Dev Server |
| **TypeScript** | Type Safety |
| **TailwindCSS** | Styling |
| **Radix UI + shadcn/ui** | Component Library |
| **TanStack Query** | Data Fetching & Caching |
| **i18next** | Internationalization (TR/EN/ZH) |
| **React Router DOM** | Routing |
| **Zod** | Schema Validation |

### Backend
| Technology | Purpose |
|------------|---------|
| **PHP 8+** | Server-Side Logic |
| **MySQL** | Database |
| **JWT** | Authentication |
| **Modular Architecture** | Scalable API Design |

---

## 📁 Project Structure

```
turp-saas-website/
├── 📂 api/                          # PHP Backend API
│   ├── 📂 config/
│   │   ├── cors.php                 # CORS configuration
│   │   └── db.php                   # Database connection
│   ├── 📂 core/
│   │   ├── 📂 auth/                 # JWT authentication
│   │   │   ├── auth.middleware.php
│   │   │   └── auth.service.php
│   │   ├── 📂 errors/               # Error handling
│   │   │   └── error.handler.php
│   │   └── 📂 tenant/               # Multi-tenant logic
│   │       └── tenant.service.php
│   ├── 📂 modules/                  # Feature Modules
│   │   ├── 📂 auth/                 # Admin authentication
│   │   ├── 📂 blog/                 # Blog posts (CRUD)
│   │   ├── 📂 branding/             # Tenant branding config
│   │   ├── 📂 consent/              # Cookie consent
│   │   ├── 📂 contact/              # Contact forms & config
│   │   ├── 📂 enduser_auth/         # End-user auth (patients)
│   │   ├── 📂 faq/                  # FAQ management
│   │   ├── 📂 iwrs/                 # IWRS module
│   │   ├── 📂 landing/              # Landing page config
│   │   ├── 📂 legal/                # Legal documents (KVKK, etc.)
│   │   ├── 📂 media/                # Media manager
│   │   ├── 📂 nipt/                 # NIPT bookings & doctors
│   │   ├── 📂 roi/                  # ROI calculator settings
│   │   ├── 📂 settings/             # Site settings
│   │   ├── 📂 translation/          # Translation API
│   │   └── 📂 user/                 # Admin user management
│   ├── 📂 routes/
│   │   ├── admin.routes.php         # Admin API routing
│   │   └── public.routes.php        # Public API routing
│   ├── 📂 schema/                   # SQL schema files
│   ├── 📂 uploads/                  # Uploaded media files
│   └── index.php                    # API Entry Point
│
├── 📂 src/                          # React Frontend
│   ├── App.tsx                      # Main App Component
│   ├── main.tsx                     # Entry Point
│   ├── i18n.ts                      # Internationalization config
│   ├── index.css                    # Global styles
│   ├── 📂 components/               # Reusable UI Components
│   │   ├── CookieConsentBanner.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── MediaPickerDialog.tsx
│   │   ├── Navigation.tsx
│   │   ├── NotificationProvider.tsx
│   │   ├── SEO.tsx
│   │   └── TenantSwitcher.tsx
│   ├── 📂 context/                  # React Context
│   ├── 📂 data/                     # Static data & content
│   ├── 📂 hooks/                    # Custom Hooks
│   │   ├── useBrandingConfig.tsx
│   │   ├── useContactConfig.ts
│   │   ├── useEndUserAuth.tsx
│   │   ├── useFaq.ts
│   │   ├── useLandingConfig.ts
│   │   └── useTenantSettings.tsx
│   ├── 📂 iwrs/                     # IWRS Tenant App
│   ├── 📂 lib/                      # Utility libraries
│   │   ├── analytics.ts
│   │   └── fetchAPI.ts
│   ├── 📂 nipt/                     # NIPT Tenant Pages
│   ├── 📂 pages/                    # Page Components
│   │   ├── About.tsx
│   │   ├── Admin.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   ├── FaqPage.tsx
│   │   ├── Home.tsx
│   │   ├── LegalPage.tsx
│   │   ├── Login.tsx
│   │   ├── PostDetail.tsx
│   │   ├── ROICalculator.tsx
│   │   └── 📂 admin/                # Admin Panel Pages
│   │       ├── AdminAnalyticsSeo.tsx
│   │       ├── AdminBlogEditor.tsx
│   │       ├── AdminBlogList.tsx
│   │       ├── AdminBrandingSettings.tsx
│   │       ├── AdminContactConfigEditor.tsx
│   │       ├── AdminFaqEditor.tsx
│   │       ├── AdminFaqList.tsx
│   │       ├── AdminLandingEditor.tsx
│   │       ├── AdminLegalEditor.tsx
│   │       ├── AdminMediaList.tsx
│   │       ├── AdminMessages.tsx
│   │       ├── AdminSettings.tsx
│   │       └── AdminUserList.tsx
│   ├── 📂 types/                    # TypeScript types
│   └── 📂 utils/                    # Utility functions
│       ├── consent-analytics.ts
│       └── geo.ts
│
├── 📂 public/                       # Static assets
├── 📂 docs/                         # Documentation
├── 📂 scripts/                      # Build & utility scripts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PHP 8+
- MySQL 8+
- Composer (optional, for PHP dependencies)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd turp-saas-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create `.env` file in project root:
```env
VITE_API_URL=http://localhost/api
VITE_ENVIRONMENT=development
```

Create `api/env.php` for backend:
```php
<?php
return [
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'turp_saas',
    'DB_USER' => 'root',
    'DB_PASS' => 'password',
    'JWT_SECRET' => 'your-secret-key',
];
```

### 4. Database Setup
```bash
# Import the main schema
mysql -u root -p turp_saas < api/schema/init.sql
```

### 5. Run Development Server
```bash
# Frontend (Vite)
npm run dev

# Backend (PHP built-in server)
cd api && php -S localhost:8080
```

---

## 🌐 Multi-Tenant System

### Tenant Configuration
Each tenant is identified by domain and has isolated data:

| Tenant ID | Domain | Description |
|-----------|--------|-------------|
| `turp` | ct.turp.health | Turp CRO Platform |
| `omega_nipt` | nipt.tr | Omega NIPT Testing |
| `iwrs` | iwrs.com.tr | IWRS System |

### How It Works
1. **Domain Detection**: Frontend detects tenant from `window.location.hostname`
2. **API Headers**: Tenant ID sent via `X-Tenant-ID` header
3. **Row-Level Isolation**: All database tables include `tenant_id` column
4. **Branding**: Dynamic logos, colors, and content per tenant

---

## 📡 API Endpoints

### Public Endpoints (No Auth Required)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `?action=get_blog_posts` | GET | List published blog posts |
| `?action=get_blog_post&id=X` | GET | Get single blog post |
| `?action=get_faq_items` | GET | List FAQ items |
| `?action=get_landing_config` | GET | Get landing page config |
| `?action=get_contact_config` | GET | Get contact page config |
| `?action=get_branding` | GET | Get tenant branding |
| `?action=submit_contact` | POST | Submit contact form |
| `?action=get_legal_doc&key=X` | GET | Get legal document |

### Admin Endpoints (JWT Required)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `?action=admin_login` | POST | Admin authentication |
| `?action=get_admin_posts` | GET | List all blog posts |
| `?action=create_post` | POST | Create blog post |
| `?action=update_post` | PUT | Update blog post |
| `?action=delete_post` | DELETE | Delete blog post |
| `?action=get_admin_faqs` | GET | List all FAQs |
| `?action=upload_media` | POST | Upload media file |
| `?action=get_media_list` | GET | List media files |

---

## 🎨 Frontend Features

### Pages
- **Home** - Hero, features, testimonials
- **Blog** - Multi-language blog with SEO
- **Contact** - Dynamic contact form with Google Maps
- **FAQ** - Accordion-style FAQ page
- **Legal** - KVKK, Privacy Policy, Terms
- **ROI Calculator** - Interactive ROI tool
- **Admin Panel** - Full content management

### Admin Panel Modules
- 📝 **Blog Management** - Create, edit, translate posts
- ❓ **FAQ Management** - Categorized Q&A
- 🖼️ **Media Manager** - Upload and organize images
- 📞 **Contact Config** - Edit contact page content
- 🎨 **Branding** - Tenant-specific logos & colors
- 📄 **Legal Docs** - KVKK, Privacy, Terms
- 🏠 **Landing Editor** - Hero sections, features
- ⚙️ **Settings** - Site-wide configuration
- 👥 **User Management** - Admin users

---

## 🌍 Internationalization

The platform supports multiple languages:
- 🇹🇷 **Turkish (tr)** - Primary
- 🇺🇸 **English (en)**
- 🇨🇳 **Chinese (zh)**

Translation is handled via `i18next` with translations in `src/i18n.ts`.

Scripts for auto-translation:
```bash
npm run translate       # Translate content
npm run translate:blog  # Translate blog posts
```

---

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

Output will be in `dist/` directory.

### Deployment (Plesk)
1. Push changes to Git repository
2. Plesk Git integration auto-deploys
3. Ensure `api/env.php` has production credentials
4. Run database migrations if needed

---

## 🔒 Security

- **JWT Authentication** for admin routes
- **Row-Level Tenant Isolation** in database
- **CORS Configuration** for API access
- **Input Validation** via Zod schemas
- **XSS Prevention** in React
- **HTTPS** enforced in production

---

## 📊 Analytics & SEO

- **Google Analytics 4** integration
- **Cookie Consent** GDPR/KVKK compliant
- **SEO Meta Tags** via react-helmet-async
- **Sitemap Generation**: `npm run sitemap`
- **Open Graph** for social sharing

---

## 🧪 Testing

```bash
# Run development server with hot reload
npm run dev

# Preview production build
npm run preview
```

---

## 📄 License

Private project - All rights reserved.

---

## 👥 Team

Built by **Turp Health** team.

---

## 📝 Changelog

### v1.0.0 (2026-01)
- ✅ Multi-tenant architecture
- ✅ Modular PHP API
- ✅ React + Vite frontend
- ✅ Admin panel with full CRUD
- ✅ Media manager
- ✅ Internationalization (TR/EN/ZH)
- ✅ SEO optimization
- ✅ Cookie consent (KVKK/GDPR)

