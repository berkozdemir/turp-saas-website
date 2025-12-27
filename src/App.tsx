import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getModuleContentTranslated } from "./data/content";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { detectLocationSettings } from "./utils/geo";
import { SEO } from "./components/SEO";

// IWRS App Import


// SAYFALARI IMPORT ET
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { PostDetail } from "./pages/PostDetail";
import { ModuleDetail } from "./pages/ModuleDetail";
import { Admin } from "./pages/Admin";
import { ResetPassword } from "./pages/ResetPassword";
import { ROICalculator } from "./pages/ROICalculator";
import { RheumaCaseStudy } from "./pages/RheumaCaseStudy";
import { FaqPage } from "./pages/FaqPage";
import { LegalPage } from "./pages/LegalPage";
import useAnalytics, { trackLanguageChange } from "./lib/analytics";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { initAnalytics } from "./utils/consent-analytics";

export default function App() {


  // --- TURP APP LOGIC BELOW ---

  // --- STATE YÖNETİMİ ---
  const [view, setView] = useState<any>(() => {
    const path = window.location.pathname;

    // 1. Admin route check
    if (path === '/admin' || path.startsWith('/admin/')) {
      return 'admin';
    }

    // 2. Password reset check
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
        case "case-rheuma":
          return <RheumaCaseStudy setView={setView} />;
        case "sss":
          return <FaqPage setView={setView} />;
        case "admin":
          // Ensure URL is /admin when rendering admin
          if (window.location.pathname !== '/admin') {
            window.history.pushState({}, '', '/admin');
          }
          return <Admin />;
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
    }

    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      <SEO view={view} post={view?.type === 'detail' ? view.post : undefined} />

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
      <main className="flex-1">{renderView()}</main>

      {/* --- FOOTER --- */}
      <Footer setView={setView} />

      {/* --- COOKIE CONSENT BANNER --- */}
      <CookieConsentBanner />
    </div>
  );
}