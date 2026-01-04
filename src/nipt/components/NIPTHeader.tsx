import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, FlaskConical, Headphones, HelpCircle, Info, Phone, Calendar } from 'lucide-react';

// ============================================
// UNIFIED NAVIGATION CONFIG
// ============================================
interface NavChild {
    label: string;
    href: string;
    description?: string;
}

interface NavItem {
    key: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
    {
        key: 'testler',
        label: 'Testler',
        href: '/testler',
        icon: <FlaskConical size={18} />,
        children: [
            { label: 'MomGuard', href: '/testler/momguard', description: 'Non-invaziv prenatal tarama' },
            { label: 'Verifi', href: '/testler/verifi', description: 'Yüksek doğruluk testi' },
            { label: 'Veritas', href: '/testler/veritas', description: 'Kapsamlı genetik analiz' },
        ]
    },
    { key: 'nasil-calisir', label: 'Nasıl Çalışır?', href: '/#nasil-calisir', icon: <HelpCircle size={18} /> },
    { key: 'sss', label: 'S.S.S.', href: '/#sss', icon: <HelpCircle size={18} /> },
    { key: 'podcast', label: 'Podcast', href: '/podcast', icon: <Headphones size={18} /> },
    { key: 'hakkimizda', label: 'Hakkımızda', href: '/hakkimizda', icon: <Info size={18} /> },
    { key: 'iletisim', label: 'İletişim', href: '/iletisim', icon: <Phone size={18} /> },
];

const CTA_BUTTON = {
    label: 'Randevu Al',
    href: '/booking',
    icon: <Calendar size={18} />,
};

// ============================================
// MAIN HEADER COMPONENT
// ============================================
export const NIPTHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Scroll detection for sticky shadow
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                setOpenDropdown(null);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Check if nav item is active
    const isActive = (item: NavItem): boolean => {
        const path = location.pathname;

        // For items with children (like Testler), check if any child route matches
        if (item.children) {
            return path.startsWith(item.href.replace('/#', '/'));
        }

        // For hash links, only active on homepage
        if (item.href.startsWith('/#')) {
            return path === '/' || path === '/nipt';
        }

        return path === item.href || path.startsWith(item.href + '/');
    };

    // Handle navigation
    const handleNav = (href: string) => {
        setIsMenuOpen(false);
        setOpenDropdown(null);
        setExpandedMobileItem(null);

        if (href.startsWith('/#')) {
            // Hash navigation - if on homepage, scroll; otherwise navigate then scroll
            const hash = href.substring(1);
            if (location.pathname === '/' || location.pathname === '/nipt') {
                const element = document.querySelector(hash);
                element?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                setTimeout(() => {
                    const element = document.querySelector(hash);
                    element?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            navigate(href);
        }
    };

    return (
        <>
            {/* Header */}
            <header
                className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled
                        ? 'shadow-md border-b border-transparent'
                        : 'shadow-none border-b border-slate-100'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <button
                            onClick={() => handleNav('/')}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <img
                                src="/images/omega_genetik_logo.png"
                                alt="Omega Genetik"
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
                            {NAV_ITEMS.map((item) => (
                                <div key={item.key} className="relative">
                                    {item.children ? (
                                        // Dropdown item
                                        <button
                                            onMouseEnter={() => setOpenDropdown(item.key)}
                                            onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${isActive(item)
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            {item.label}
                                            <ChevronDown size={14} className={`transition-transform ${openDropdown === item.key ? 'rotate-180' : ''}`} />
                                        </button>
                                    ) : (
                                        // Regular item
                                        <button
                                            onClick={() => handleNav(item.href)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item)
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    )}

                                    {/* Dropdown Menu (Megamenu style) */}
                                    {item.children && openDropdown === item.key && (
                                        <div
                                            className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                                            onMouseLeave={() => setOpenDropdown(null)}
                                        >
                                            <div className="p-2">
                                                {item.children.map((child) => (
                                                    <button
                                                        key={child.href}
                                                        onClick={() => handleNav(child.href)}
                                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                                                    >
                                                        <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                                                            {child.label}
                                                        </div>
                                                        {child.description && (
                                                            <div className="text-xs text-slate-500 mt-0.5">
                                                                {child.description}
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="border-t border-slate-100 p-2">
                                                <button
                                                    onClick={() => handleNav(item.href)}
                                                    className="w-full text-left px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    Tüm testleri gör →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* CTA Button (Desktop) */}
                            <button
                                onClick={() => handleNav(CTA_BUTTON.href)}
                                className="hidden md:inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-red-100 hover:shadow-red-200 hover:-translate-y-0.5 transition-all"
                            >
                                {CTA_BUTTON.icon}
                                {CTA_BUTTON.label}
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <img
                                src="/images/omega_genetik_logo.png"
                                alt="Omega Genetik"
                                className="h-8 w-auto object-contain"
                            />
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Navigation */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                            {NAV_ITEMS.map((item) => (
                                <div key={item.key}>
                                    {item.children ? (
                                        // Expandable item with children
                                        <>
                                            <button
                                                onClick={() => setExpandedMobileItem(
                                                    expandedMobileItem === item.key ? null : item.key
                                                )}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${isActive(item)
                                                        ? 'text-blue-600 bg-blue-50'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    {item.icon}
                                                    {item.label}
                                                </span>
                                                <ChevronRight
                                                    size={18}
                                                    className={`transition-transform ${expandedMobileItem === item.key ? 'rotate-90' : ''}`}
                                                />
                                            </button>

                                            {/* Expanded children */}
                                            {expandedMobileItem === item.key && (
                                                <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                                    {item.children.map((child) => (
                                                        <button
                                                            key={child.href}
                                                            onClick={() => handleNav(child.href)}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                            {child.label}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => handleNav(item.href)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                        Tüm testleri gör
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        // Regular item
                                        <button
                                            onClick={() => handleNav(item.href)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${isActive(item)
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Fixed CTA at Bottom */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={() => handleNav(CTA_BUTTON.href)}
                                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-full font-bold shadow-lg transition-all"
                            >
                                {CTA_BUTTON.icon}
                                {CTA_BUTTON.label}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NIPTHeader;
