import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Lock ikonunu import listesinden çıkardım (artık kullanılmıyor)
import { Activity, Globe, ChevronDown, FileText } from "lucide-react";
import { supabase } from "./lib/supabase";
import { getModuleContentTranslated } from "./data/content";
import { Footer } from "./components/Footer";
import { detectLocationSettings } from "./utils/geo";
import { SEO } from "./components/SEO";

// SAYFALARI IMPORT ET
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { PostDetail } from "./pages/PostDetail";
import { ModuleDetail } from "./pages/ModuleDetail";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { ROICalculator } from "./pages/ROICalculator";
import { RheumaCaseStudy } from "./pages/RheumaCaseStudy";

export default function App() {
  // --- STATE YÖNETİMİ ---
  const [view, setView] = useState<any>("home"); 
  const [editingPost, setEditingPost] = useState<any | null>(null); 
  const [session, setSession] = useState<any | null>(null); 
  const [globalCurrency, setGlobalCurrency] = useState("TRY"); 
  const [isScrolled, setIsScrolled] = useState(false); 

  // i18n (Çeviri) Kurulumu
  const { t, i18n } = useTranslation();
  const languages = [
    { code: "tr", label: "TR" },
    { code: "en", label: "EN" },
    { code: "zh", label: "ZH" },
  ];

  // Modül listesini çek
  const rawModules = getModuleContentTranslated(t);
  const modules: Record<string, any> =
    rawModules && typeof rawModules === "object" ? rawModules : {};

  // --- BAŞLANGIÇ AYARLARI (EFFECTS) ---
  useEffect(() => {
    // 1. Oturum Kontrolü
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((err) => {
        console.error("Supabase session error:", err);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 2. Scroll Dinleyicisi
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // 3. Konum ve Dil Algılama
    const initLocalization = async () => {
      try {
        const settings = await detectLocationSettings();
        if (!settings) return;

        if (settings.lang && i18n.language !== settings.lang) {
          i18n.changeLanguage(settings.lang);
        }

        if (settings.currency) {
          setGlobalCurrency(settings.currency);
        }
      } catch (err) {
        console.error("Localization error:", err);
      }
    };

    initLocalization();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- YARDIMCI FONKSİYONLAR ---
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setView("home");
  };

  const startEdit = (post: any) => {
    if (!session) {
      alert("Giriş yapmalısınız!");
      setView("admin");
      return;
    }
    setEditingPost(post);
    setView("admin");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
          return <ROICalculator initialCurrency={globalCurrency} setView={setView} />;
        case "case-rheuma":
          return <RheumaCaseStudy setView={setView} />;
        case "admin":
          return session ? (
            <Admin
              editingPost={editingPost}
              setEditingPost={setEditingPost}
              setView={setView}
              handleLogout={handleLogout}
            />
          ) : (
            <Login />
          );
        default:
          return <Home setView={setView} />;
      }
    }

    if (typeof view === "object" && view !== null) {
      if (view.type === "module") {
        return <ModuleDetail moduleId={view.id} setView={setView} />;
      }
      if (view.type === "detail") {
        return (
          <PostDetail post={view.post} setView={setView} onEdit={startEdit} />
        );
      }
      if (view.type === "roi") {
        return <ROICalculator initialCurrency={globalCurrency} setView={setView} />;
      }
    }

    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      <SEO view={view} />

      {/* --- NAVBAR --- */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group"
            onClick={() => setView("home")}
          >
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform">
              <Activity size={22} />
            </div>
            <span className="tracking-tight text-slate-900">Turp</span>
          </div>

          {/* Menü Linkleri */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button
                onClick={() => setView("home")}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  view === "home"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {t("nav_home")}
              </button>

              {/* Modüller Dropdown */}
              <div className="relative group h-full flex items-center">
                <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">
                  {t("nav_modules")} <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 w-64 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    {Object.entries(modules ?? {}).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setView({ type: "module", id: key })}
                        className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        {val?.title ?? key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diğer Linkler */}
              <button
                onClick={() => setView("roi")}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  view === "roi" || (typeof view === 'object' && view.type === 'roi')
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                ROI
              </button>

              <button
                onClick={() => setView("case-rheuma")}
                className={`hidden lg:flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  view === "case-rheuma"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <FileText size={14} /> Senaryolar
              </button>

              <button
                onClick={() => setView("blog")}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  view === "blog"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {t("nav_blog")}
              </button>

              <button
                onClick={() => setView("about")}
                className={`hidden md:block px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  view === "about"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Hakkımızda
              </button>

              {/* Yönetim butonu buradan kaldırıldı */}
            </div>

            {/* Dil Değiştirici */}
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <Globe size={16} className="text-slate-400 ml-2 hidden md:block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    i18n.language === lang.code
                      ? "bg-rose-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* --- ANA İÇERİK --- */}
      <main className="flex-1">{renderView()}</main>

      {/* --- FOOTER --- */}
      <Footer setView={setView} />
    </div>
  );
}