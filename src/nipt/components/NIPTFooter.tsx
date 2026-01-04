import { useNavigate, useLocation } from 'react-router-dom';
import { FlaskConical, HelpCircle, Building2, Phone, Calendar } from 'lucide-react';

// ============================================
// FOOTER CONFIG
// ============================================
const FOOTER_COLUMNS = [
    {
        title: 'Testler',
        icon: <FlaskConical size={16} />,
        links: [
            { label: 'Tüm Testler', href: '/testler' },
            { label: 'MomGuard', href: '/testler/momguard' },
            { label: 'Verifi', href: '/testler/verifi' },
            { label: 'Veritas', href: '/testler/veritas' },
        ]
    },
    {
        title: 'Bilgi & Kaynaklar',
        icon: <HelpCircle size={16} />,
        links: [
            { label: 'Nasıl Çalışır?', href: '/#nasil-calisir' },
            { label: 'S.S.S.', href: '/#sss' },
            { label: 'Podcast', href: '/podcast' },
        ]
    },
    {
        title: 'Kurumsal & İletişim',
        icon: <Building2 size={16} />,
        links: [
            { label: 'Hakkımızda', href: '/hakkimizda' },
            { label: 'İletişim', href: '/iletisim' },
            { label: 'Randevu Al', href: '/booking' },
        ]
    }
];

const LEGAL_LINKS = [
    { label: 'Site Kullanım Koşulları', href: '/legal/kullanim-kosullari' },
    { label: 'Kişisel Verilerin Korunması', href: '/legal/kvkk' },
    { label: 'Çerez Politikası', href: '/legal/cerez-politikasi' },
    { label: 'Bilgi Güvenliği Politikası', href: '/legal/bilgi-guvenligi' },
];

// ============================================
// FOOTER COMPONENT
// ============================================
export const NIPTFooter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    const handleNav = (href: string) => {
        if (href.startsWith('/#')) {
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
        <footer className="bg-slate-100 border-t border-slate-200">
            {/* Main Footer */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Logo & Legal Disclaimers */}
                    <div className="lg:col-span-1">
                        <button
                            onClick={() => handleNav('/')}
                            className="flex items-center gap-2 mb-6"
                        >
                            <img
                                src="/images/omega_genetik_logo.png"
                                alt="Omega Genetik"
                                className="h-10 w-auto object-contain"
                            />
                        </button>

                        {/* Legal Disclaimer 1: Genel bilgilendirme */}
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            Bu sitede yer alan tüm içerikler, <strong>genel bilgilendirme</strong> amacı taşımaktadır.
                            Tanı ve tedavi önerisi niteliğinde değildir ve kişisel tıbbi değerlendirme yerine geçmez.
                            Sağlık durumunuzla ilgili her konuda mutlaka hekiminize başvurunuz.
                        </p>

                        {/* Legal Disclaimer 2: Reklam değil */}
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            Buradaki bilgiler, Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik
                            hükümleri çerçevesinde, talep oluşturmaya yönelik reklam amacı gütmeksizin hazırlanmıştır.
                            Herhangi bir sonuç veya başarı garantisi içermez.
                        </p>

                        {/* Legal Disclaimer 3: Ulusal hedef kitle */}
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Bu internet sitesi, Türkiye'de yaşayan kişiler nezdinde talep oluşturmaya yönelik reklam amacı
                            taşımadan, yalnızca bilgilendirme sağlayacak şekilde düzenlenmiştir.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    {FOOTER_COLUMNS.map((column) => (
                        <div key={column.title}>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                                {column.icon}
                                {column.title}
                            </h3>
                            <ul className="space-y-2">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <button
                                            onClick={() => handleNav(link.href)}
                                            className="text-slate-600 hover:text-blue-600 transition-colors text-sm"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Quick Info */}
                <div className="mt-10 pt-8 border-t border-slate-200">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                        <a href="tel:03129201362" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Phone size={16} />
                            0312 920 13 62
                        </a>
                        <button
                            onClick={() => handleNav('/booking')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
                        >
                            <Calendar size={16} />
                            Randevu Al
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Legal Links */}
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        {/* Copyright */}
                        <p>© {currentYear} Omega Genetik / Nipt.tr. Tüm hakları saklıdır.</p>

                        {/* Legal Links */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {LEGAL_LINKS.map((link, index) => (
                                <span key={link.href} className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleNav(link.href)}
                                        className="hover:text-blue-600 hover:underline transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                    {index < LEGAL_LINKS.length - 1 && (
                                        <span className="text-slate-300">|</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default NIPTFooter;
