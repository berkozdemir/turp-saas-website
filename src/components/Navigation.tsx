import { useState, useEffect, useRef } from "react";
import { useEndUserAuth } from "../hooks/useEndUserAuth";
import { Globe, ChevronDown, FileText, Lock, Menu, X, BookOpen, Mic } from "lucide-react";

import { AppView } from "../types/view";

interface NavigationProps {
    view: AppView;
    setView: (view: AppView) => void;
    session: any;
    handleLogout: () => void;
    i18n: any;
    changeLanguage: (lang: string) => void;
    languages: Array<{ code: string; label: string }>;
    modules: Record<string, any>;
    t: (key: string) => string;
}

export function Navigation({
    view,
    setView,
    session,
    handleLogout,
    i18n,
    changeLanguage,
    languages,
    modules,
    t,
}: NavigationProps) {
    const { user, isAuthenticated, logout } = useEndUserAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false);
    const [isMobileModulesExpanded, setIsMobileModulesExpanded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Scroll detection for sticky shadow
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsMobileMenuOpen(false);
                setIsModulesDropdownOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsModulesDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle navigation and close mobile menu
    const handleNavigation = (target: any) => {
        setView(target);
        setIsMobileMenuOpen(false);
        setIsMobileModulesExpanded(false);
    };

    return (
        <>
            {/* Desktop & Mobile Nav Bar */}
            <nav
                className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${isScrolled ? "shadow-md" : "border-b border-slate-100"
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Omega Byline */}
                        <div className="flex flex-col items-start leading-none">
                            <div className="flex items-center gap-1.5 mb-0.5 opacity-80">
                                <img src="/omega_logo.png" alt="Omega CRO" className="h-3 w-auto opacity-70 grayscale" />
                                <span className="text-[10px] font-bold text-slate-400 tracking-wider">by OMEGA CRO</span>
                            </div>
                            <button
                                onClick={() => handleNavigation("home")}
                                className="flex items-center gap-2 text-xl font-black text-slate-900 hover:opacity-80 transition-opacity"
                            >
                                <img src="/logo.png" alt="TURP" className="h-9 w-auto" />
                            </button>
                        </div>

                        {/* Desktop Menu (hidden on mobile) */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Modüller Dropdown */}
                            <div className="relative group" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsModulesDropdownOpen(!isModulesDropdownOpen)}
                                    className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-all"
                                >
                                    {t("nav_modules")} <ChevronDown size={14} />
                                </button>
                                {isModulesDropdownOpen && (
                                    <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                                            {Object.entries(modules ?? {}).map(([key, val]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => {
                                                        handleNavigation({ type: "module", id: key });
                                                        setIsModulesDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 border-b border-slate-50 last:border-0 transition-colors"
                                                >
                                                    {val?.title ?? key}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ROI */}
                            <button
                                onClick={() => handleNavigation("roi")}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "roi" || (typeof view === "object" && view.type === "roi")
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                ROI
                            </button>

                            {/* Senaryolar */}
                            <div className="hidden lg:flex items-center gap-2">
                                <button
                                    onClick={() => handleNavigation("case-rheuma")}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "case-rheuma"
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    <FileText size={14} /> Romatoloji
                                </button>
                                <button
                                    onClick={() => handleNavigation("case-education")}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "case-education"
                                        ? "bg-sky-600 text-white shadow-md"
                                        : "text-sky-600 hover:bg-sky-50"
                                        }`}
                                >
                                    <BookOpen size={14} /> {t("mod_edu_title")}
                                </button>
                            </div>

                            {/* Blog */}
                            <button
                                onClick={() => handleNavigation("blog")}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "blog"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {t("nav_blog")}
                            </button>

                            <button
                                onClick={() => handleNavigation("contact")}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "contact"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {t("nav_contact")}
                            </button>

                            {/* Podcast */}
                            <button
                                onClick={() => handleNavigation("podcast-hub")}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${view === "podcast-hub"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                <Mic size={16} /> Podcast
                            </button>

                            {/* FAQ (SSS) */}
                            <button
                                onClick={() => handleNavigation("sss")}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "sss"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {t("nav_faq")}
                            </button>

                            {/* Hakkımızda */}
                            <button
                                onClick={() => handleNavigation("about")}
                                className={`hidden md:block px-4 py-2 rounded-full text-sm font-bold transition-all ${view === "about"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {t("nav_about")}
                            </button>

                            {/* Admin */}
                            <button
                                onClick={() => handleNavigation("admin")}
                                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-all"
                                title="Admin Panel"
                            >
                                <Lock size={18} />
                            </button>

                            {/* End User Auth (Desktop) */}
                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                                {isAuthenticated && user ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-600 hidden xl:block">
                                            {user.name}
                                        </span>
                                        <button
                                            onClick={logout}
                                            className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200"
                                        >
                                            Çıkış
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleNavigation("enduser-login")}
                                            className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                        >
                                            Giriş
                                        </button>
                                        <button
                                            onClick={() => handleNavigation("enduser-signup")}
                                            className="px-4 py-2 rounded-full text-sm font-bold bg-rose-600 text-white shadow-md hover:bg-rose-700 hover:shadow-lg transition-all"
                                        >
                                            Kayıt Ol
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Language Selector (Desktop) */}
                        <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
                            <Globe size={16} className="text-slate-400 ml-2" />
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${i18n.language === lang.code
                                        ? "bg-rose-600 text-white shadow-md"
                                        : "text-slate-400 hover:bg-slate-200"
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* Hamburger Icon (Mobile only) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav >

            {/* Mobile Menu Overlay */}
            {
                isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )
            }

            {/* Mobile Menu Slide-in Panel */}
            <div
                ref={mobileMenuRef}
                className={`fixed inset-0 top-16 bg-white z-50 md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-4"
                    }`}
                style={{ height: 'calc(100vh - 64px)' }} // Ensure it takes full available height below header
            >
                {/* Mobile Menu Items - Full Height Scrollable */}
                <div className="flex flex-col h-full overflow-y-auto pb-20">
                    <div className="flex flex-col p-4 space-y-2">
                        {/* Home */}
                        <button
                            onClick={() => handleNavigation("home")}
                            className="text-left px-4 py-3 rounded-lg text-lg font-bold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                        >
                            🏠 {t("nav_home") || "Ana Sayfa"}
                        </button>

                        {/* Modüller (Accordion) */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setIsMobileModulesExpanded(!isMobileModulesExpanded)}
                                className="w-full flex items-center justify-between px-4 py-3 text-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <span>📦 {t("nav_modules")}</span>
                                <ChevronDown
                                    size={20}
                                    className={`transform transition-transform ${isMobileModulesExpanded ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {isMobileModulesExpanded && (
                                <div className="bg-slate-50 border-t border-slate-200">
                                    {Object.entries(modules ?? {}).map(([key, val]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleNavigation({ type: "module", id: key })}
                                            className="block w-full text-left px-6 py-3 text-base text-slate-600 hover:text-rose-600 hover:bg-white transition-colors border-b border-slate-100 last:border-0"
                                        >
                                            • {val?.title ?? key}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Other Mobile Nav Items */}
                        <button
                            onClick={() => handleNavigation("roi")}
                            className="text-left px-4 py-3 rounded-lg text-lg font-bold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                        >
                            💰 ROI
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleNavigation("case-rheuma")}
                                className={`text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${view === "case-rheuma" ? "bg-slate-900 text-white" : "text-slate-700 bg-slate-50 hover:bg-slate-100"}`}
                            >
                                📊 Romatoloji
                            </button>
                            <button
                                onClick={() => handleNavigation("case-education")}
                                className={`text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${view === "case-education" ? "bg-sky-600 text-white" : "text-sky-600 bg-sky-50 hover:bg-sky-100"}`}
                            >
                                📚 {t("mod_edu_title")}
                            </button>
                        </div>

                        <button
                            onClick={() => handleNavigation("blog")}
                            className="text-left px-4 py-3 rounded-lg text-lg font-bold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                        >
                            📝 {t("nav_blog")}
                        </button>

                        <button
                            onClick={() => handleNavigation("sss")}
                            className={`text-left px-4 py-3 rounded-lg text-lg font-bold transition-colors ${view === "sss" ? "bg-slate-100 text-rose-600" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                            ❓ {t("nav_faq")}
                        </button>

                        <button
                            onClick={() => handleNavigation("podcast-hub")}
                            className={`text-left px-4 py-3 rounded-lg text-lg font-bold transition-colors flex items-center gap-2 ${view === "podcast-hub" ? "bg-slate-100 text-purple-600" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                            <Mic size={20} /> Podcast
                        </button>

                        <button
                            onClick={() => handleNavigation("contact")}
                            className={`text-left px-4 py-3 rounded-lg text-lg font-bold transition-colors ${view === "contact" ? "bg-slate-100 text-rose-600" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                            📞 {t("nav_contact")}
                        </button>

                        <button
                            onClick={() => handleNavigation("about")}
                            className="text-left px-4 py-3 rounded-lg text-lg font-bold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                        >
                            ℹ️ {t("nav_about")}
                        </button>

                        <button
                            onClick={() => handleNavigation("admin")}
                            className="text-left px-4 py-3 rounded-lg text-lg font-bold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                        >
                            🔒 Admin
                        </button>

                        {/* End User Auth (Mobile) */}
                        <div className="pt-4 mt-4 border-t border-slate-200">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-slate-500 font-bold">
                                        👋 {user.name}
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Çıkış Yap
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 p-2">
                                    <button
                                        onClick={() => handleNavigation("enduser-login")}
                                        className="w-full py-3 rounded-lg text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                                    >
                                        Giriş Yap
                                    </button>
                                    <button
                                        onClick={() => handleNavigation("enduser-signup")}
                                        className="w-full py-3 rounded-lg text-base font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
                                    >
                                        Kayıt Ol
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Language Selector (Mobile - Spaced out) */}
                        <div className="pt-6 pb-12 flex justify-center gap-4">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-12 h-12 rounded-full text-base font-bold flex items-center justify-center transition-all ${i18n.language === lang.code
                                        ? "bg-rose-600 text-white shadow-lg"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
