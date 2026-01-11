import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, FlaskConical, HelpCircle, Phone } from 'lucide-react';

// ============================================
// NAVIGATION CONFIG
// ============================================
interface NavItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: Array<{ label: string; href: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'testler',
    label: 'Testler',
    href: '/testler',
    icon: <FlaskConical size={18} />,
    children: [
      { label: 'Yaşam Genetiği', href: '/yasam-genetigi' },
      { label: 'IMSPlus Yenidoğan Taraması', href: '/yenidogan-tarama' },
      { label: 'EnfantGuard 2.0', href: '/enfantguard-2-0' },
    ]
  },
  { key: 'hakkimizda', label: 'Hakkımızda', href: '/hakkimizda' },
  { key: 'sss', label: 'S.S.S.', href: '/#sss', icon: <HelpCircle size={18} /> },
  { key: 'iletisim', label: 'İletişim', href: '/iletisim', icon: <Phone size={18} /> },
];

const CTA_BUTTON = {
  label: 'Test Sipariş Ver',
  href: '/iletisim',
};

// ============================================
// MAIN HEADER COMPONENT
// ============================================
export const GNDHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  // Check if link is active
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer flex-shrink-0"
            onClick={() => handleNavClick('/')}
          >
            <img
              src="/public/images/Genlerim Ne Diyor Logo Final.jpg"
              alt="Genlerim Ne Diyor"
              className="h-10 md:h-12 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <div key={item.key} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className="text-slate-900 font-medium text-sm lg:text-base flex items-center gap-1 hover:text-red-500 transition py-2"
                      onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronDown size={16} className="group-hover:rotate-180 transition" />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      ref={dropdownRef}
                      className={`absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2`}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.href}
                          onClick={() => handleNavClick(child.href)}
                          className={`block w-full text-left px-6 py-3 text-sm transition ${
                            isActive(child.href)
                              ? 'text-red-500 font-semibold bg-red-50'
                              : 'text-slate-700 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center gap-1 text-sm lg:text-base font-medium transition py-2 ${
                      isActive(item.href)
                        ? 'text-red-500'
                        : 'text-slate-900 hover:text-red-500'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick(CTA_BUTTON.href)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition"
            >
              {CTA_BUTTON.label}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-slate-900" />
            ) : (
              <Menu size={24} className="text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.key}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                      className="w-full text-left px-4 py-3 text-slate-900 font-medium hover:bg-red-50 hover:text-red-500 transition flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition ${openDropdown === item.key ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    {openDropdown === item.key && (
                      <div className="bg-slate-50 pl-6 space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.href}
                            onClick={() => handleNavClick(child.href)}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:text-red-500 transition"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left px-4 py-3 text-slate-900 font-medium hover:bg-red-50 hover:text-red-500 transition flex items-center gap-2"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </div>
            ))}

            {/* Mobile CTA */}
            <button
              onClick={() => handleNavClick(CTA_BUTTON.href)}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {CTA_BUTTON.label}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default GNDHeader;
