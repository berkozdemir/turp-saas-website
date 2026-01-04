/**
 * Page: App Root
 * Route: /
 * Tenant: All (Dynamic Resolution)
 * Description:
 *   - Main application entry point handling client-side routing.
 *   - Implements Multi-Tenant Logic via `useTenantSettings`.
 *   - Lazy loads page chunks for performance.
 * Related:
 *   - Context: TenantSettingsProvider, PodcastPlayerProvider
 */
import { useState, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getModuleContentTranslated } from "./data/content";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { detectLocationSettings } from "./utils/geo";
import { SEO } from "./components/SEO";

// IWRS App Import


// CRITICAL PATH - Load immediately
import { Home } from "./pages/Home";

// LAZY LOADED PAGES - Code splitting for better performance
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const PostDetail = lazy(() => import("./pages/PostDetail").then(m => ({ default: m.PostDetail })));
const ModuleDetail = lazy(() => import("./pages/ModuleDetail").then(m => ({ default: m.ModuleDetail })));
const Admin = lazy(() => import("./pages/Admin").then(m => ({ default: m.Admin })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const ROICalculator = lazy(() => import("./pages/ROICalculator").then(m => ({ default: m.ROICalculator })));
const RheumaCaseStudy = lazy(() => import("./pages/RheumaCaseStudy").then(m => ({ default: m.RheumaCaseStudy })));
const EducationCaseStudy = lazy(() => import("./pages/EducationCaseStudy").then(m => ({ default: m.EducationCaseStudy })));
const FaqPage = lazy(() => import("./pages/FaqPage").then(m => ({ default: m.FaqPage })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const LegalPage = lazy(() => import("./pages/LegalPage").then(m => ({ default: m.LegalPage })));
const EndUserLogin = lazy(() => import("./pages/EndUserLogin").then(m => ({ default: m.EndUserLogin })));
const EndUserSignup = lazy(() => import("./pages/EndUserSignup").then(m => ({ default: m.EndUserSignup })));
const EmailVerification = lazy(() => import("./pages/EmailVerification").then(m => ({ default: m.default })));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail").then(m => ({ default: m.default })));
const PodcastHub = lazy(() => import("./pages/PodcastHub").then(m => ({ default: m.PodcastHub })));
const PodcastDetail = lazy(() => import("./pages/PodcastDetail").then(m => ({ default: m.PodcastDetail })));

import { TenantSettingsProvider } from "./hooks/useTenantSettings";
import { EndUserAuthProvider } from "./hooks/useEndUserAuth";
import { fetchTenants } from "./hooks/useTenants";
import useAnalytics, { trackLanguageChange } from "./lib/analytics";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { initAnalytics } from "./utils/consent-analytics";
import { PodcastPlayerProvider } from "./context/PodcastPlayerContext";
import { GlobalPodcastPlayer } from "./components/GlobalPodcastPlayer";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

import { AppView, PostDetailView } from "./types/view";

// ... imports

export default function App() {


  // --- TURP APP LOGIC BELOW ---

  // --- STATE YÖNETİMİ ---
  const [view, setView] = useState<AppView>(() => {
    const path = window.location.pathname;
    const hostname = window.location.hostname;
    console.log('[DEBUG] App Init - Path:', path, 'Hostname:', hostname);

    // Domain based routing
    if (hostname.includes('iwrs.com.tr')) {
      if (path === '/auth' || path.startsWith('/auth/')) return 'admin';
      // Default to home but we could add IWRS specific home here if needed
    }

    // 1. Admin route check
    if (path === '/admin' || path.startsWith('/admin/') || path === '/auth' || path.startsWith('/auth/')) {
      return 'admin';
    }

    // 2. Contact page check
    if (path === '/iletisim' || path === '/contact') {
      return 'contact';
    }

    // 3. End-user login/signup check
    if (path === '/login') {
      return 'enduser-login';
    }
    if (path === '/signup') {
      return 'enduser-signup';
    }
    if (path === '/email-verification') {
      return 'email-verification';
    }
    if (path === '/verify-email') {
      return 'verify-email';
    }

    // 4. Podcast routes
    if (path === '/podcast') {
      return 'podcast-hub';
    }
    if (path.startsWith('/podcast/')) {
      const slug = path.replace('/podcast/', '');
      return { type: 'podcast-detail', slug };
    }

    // 3. Password reset check
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken && path.includes('reset-password')) {
      return { type: 'reset-password', token: resetToken };
    }

    return "home";
  });

  const [session, setSession] = useState<any | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState("TRY");
  // const [isScrolled, setIsScrolled] = useState(false);

  // i18n (Çeviri) Kurulumu
  const { t, i18n } = useTranslation();

  // Google Analytics
  useAnalytics();
  const languages = [
    { code: "tr", label: "TR" },
    { code: "en", label: "EN" },
    { code: "zh", label: "ZH" },
  ];

  // Modül listesini çek
  const rawModules = getModuleContentTranslated(t);
  const modules: Record<string, any> =
    rawModules && typeof rawModules === "object" ? rawModules : {};

  // Check URL routes (handled by lazy state init)
  useEffect(() => {
    // Only needed if we want to handle browser back/forward buttons strictly, 
    // but for initial load the lazy state above handles it.
  }, []);

  // --- BAŞLANGIÇ AYARLARI (EFFECTS) ---
  useEffect(() => {
    // 1. Scroll Dinleyicisi (Removed unused)
    // const handleScroll = () => setIsScrolled(window.scrollY > 20);
    // window.addEventListener("scroll", handleScroll);

    // 2. Konum ve Dil Algılama
    detectLocationSettings()
      .then(({ countryCode, defaultLanguage }) => {
        if (defaultLanguage) {
          changeLanguage(defaultLanguage);
        }
        setGlobalCurrency(countryCode === "TR" ? "TRY" : "USD");
      })
      .catch((err) => console.error("Geo detection error:", err));

    // Initialize analytics with consent check
    initAnalytics();

    // Preload tenant mapping for dynamic tenant resolution
    fetchTenants().catch(err => console.error('Failed to preload tenants:', err));

    return () => {
      // window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- YARDIMCI FONKSİYONLAR ---
  const handleLogout = () => {
    setSession(null);
    setView("home");
  };

  const changeLanguage = (lng: string) => {
    const oldLang = i18n.language;
    i18n.changeLanguage(lng);

    // Track language change
    if (window.gtag) {
      trackLanguageChange(oldLang, lng);
    }
  };

  // --- SAYFA YÖNLENDİRİCİSİ (ROUTER) ---
  const renderView = () => {
    console.log('[DEBUG] Rendering view:', view);
    if (typeof view === "string") {
      switch (view) {
        case "home":
          return <Home setView={setView} />;
        case "about":
          return <About setView={setView} />;
        case "blog":
          return <Blog setView={setView} />;
        case "roi":
          return <ROICalculator initialCurrency={globalCurrency} />;
        case "contact":
          return <Contact setView={setView} />;
        case "case-rheuma":
          return <RheumaCaseStudy setView={setView} />;
        case "case-education":
          return <EducationCaseStudy setView={setView} />;
        case "sss":
          return <FaqPage setView={setView} />;
        case "admin":
          // Ensure URL is /admin or /auth when rendering admin
          const isAdminPath = window.location.pathname.startsWith('/admin');
          const isAuthPath = window.location.pathname.startsWith('/auth');
          if (!isAdminPath && !isAuthPath) {
            window.history.pushState({}, '', '/admin');
          }
          return <Admin />;
        case "enduser-login":
          return <EndUserLogin setView={setView} />;
        case "enduser-signup":
          return <EndUserSignup setView={setView} />;
        case "email-verification":
          return <EmailVerification />;
        case "verify-email":
          return <VerifyEmail />;
        case "podcast-hub":
          return <PodcastHub />;
        default:
          return <Home setView={setView} />;
      }
    }

    if (typeof view === "object" && view !== null) {
      if (view.type === "home") {
        return <Home setView={setView} scrollTo={view.scrollTo} />;
      }
      if (view.type === "module") {
        return <ModuleDetail moduleId={view.id} setView={setView} />;
      }
      if (view.type === "detail") {
        return (
          <PostDetail post={view.post} setView={setView} />
        );
      }
      if (view.type === "roi") {
        return <ROICalculator initialCurrency={globalCurrency} />;
      }
      if (view.type === "reset-password") {
        return <ResetPassword token={view.token} setView={setView} />;
      }
      if (view.type === "legal") {
        return <LegalPage docKey={view.key} setView={setView} />;
      }
      if (view.type === "podcast-detail") {
        return <PodcastDetail />;
      }
    }

    return <Home setView={setView} />;
  };

  return (
    <PodcastPlayerProvider>
      <TenantSettingsProvider>
        <EndUserAuthProvider>
          <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
            {/* Skip to main content link for keyboard navigation */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
            >
              Ana içeriğe atla
            </a>

            <SEO view={view} post={(typeof view === 'object' && view !== null && view.type === 'detail') ? (view as PostDetailView).post : undefined} />

            {/* --- NAVBAR --- */}
            <Navigation
              view={view}
              setView={setView}
              session={session}
              handleLogout={handleLogout}
              i18n={i18n}
              changeLanguage={changeLanguage}
              languages={languages}
              modules={modules}
              t={t}
            />

            {/* --- ANA İÇERİK --- */}
            <main id="main-content" className="flex-1" role="main">
              <Suspense fallback={<PageLoader />}>
                {renderView()}
              </Suspense>
            </main>

            {/* --- FOOTER --- */}
            <Footer setView={setView} />

            {/* --- COOKIE CONSENT BANNER --- */}
            <CookieConsentBanner />

            {/* --- GLOBAL PODCAST PLAYER --- */}
            <GlobalPodcastPlayer />
          </div>
        </EndUserAuthProvider>
      </TenantSettingsProvider>
    </PodcastPlayerProvider>
  );
}