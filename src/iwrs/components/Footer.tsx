import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

// Logoyu import ediyoruz
import OmegaLogo from "../assets/omegalogo28.png";

// Arka plan resim URL'si (Placeholder)
const CTA_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1517486804599-bfb772ae817a?q=80&w=2070&auto=format&fit=crop";

// --- 1. CALL TO ACTION (CTA) BİLEŞENİ ---
const GlobalCallToAction = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-cover bg-center bg-no-repeat shadow-lg"
      style={{ backgroundImage: `url(${CTA_BACKGROUND_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-600/80 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto text-center max-w-4xl">
        <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight animate-fade-in-up">
          {t("footer.cta_title")}
        </h2>
        <p className="text-xl text-white/90 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
          {t("footer.cta_description")}
        </p>
        <div className="flex justify-center animate-fade-in-up animation-delay-400">
          <Link to="/contact">
            <Button
              size="lg"
              // HATA DÜZELTME: text-primary-foreground yerine text-primary kullanıldı
              // (Beyaz buton üzerinde Kırmızı yazı)
              className="bg-white text-primary hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl px-10 py-7 rounded-full text-lg font-semibold"
            >
              {t("footer.cta_button")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};


// --- 2. ANA FOOTER BİLEŞENİ ---
export function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const changeLanguage = (lng: string) => {
    try {
      i18n.changeLanguage(lng);
    } catch (e) {
      console.error("Language change error:", e);
    }
  };

  return (
    <>
      <GlobalCallToAction />

      <footer className="bg-gradient-to-br from-gray-900 to-black text-gray-200 mt-auto">
        <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700">
          {/* Bölüm 1: Logo ve Kısa Açıklama */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white text-2xl font-bold">
              {/* Logo buraya geldi */}
              <img src={OmegaLogo} alt="Omega CRO Logo" className="h-8 w-auto" />
              <span>Omega CRO</span>
            </Link>
            <p className="text-sm text-gray-400">
              {t("footer.slogan")}
            </p>

            {/* SOSYAL MEDYA LİNKLERİ */}
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/omega-cro/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Bölüm 2: Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("footer.quick_links")}</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">{t("header.blog")}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">{t("header.contact")}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">{t("header.faq")}</Link></li>
            </ul>
          </div>

          {/* Bölüm 3: Yasal ve Yardımcı Linkler */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("footer.legal_help")}</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">{t("footer.privacy_policy")}</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">{t("footer.terms_of_service")}</Link></li>
              <li><Link to="/security-policy" className="text-gray-400 hover:text-white transition-colors text-sm">{t("footer.security_policy")}</Link></li>
              <li><Link to="/personal-data-notice" className="text-gray-400 hover:text-white transition-colors text-sm">{t("footer.personal_data_notice")}</Link></li>
            </ul>
          </div>

          {/* Bölüm 4: Sadece İletişim Bilgileri (Bülten Çıkarıldı) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("footer.contact_info")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Button className="bg-primary hover:bg-primary/90 text-white w-full">{t("footer.cta_button")}</Button>
              </li>
            </ul>

            <div className="mt-8">
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Piri Reis Caddesi No: 2/4, Beytepe, Çankaya, Ankara, Türkiye</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>+90 312 426 77 22</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>info@omega-cro.com.tr</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="container mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Omega CRO. {t("footer.all_rights_reserved")}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button onClick={() => changeLanguage('tr')} className={`hover:text-white ${i18n.language === 'tr' ? 'text-white font-semibold' : ''}`}>Türkçe</button>
            <button onClick={() => changeLanguage('en')} className={`hover:text-white ${i18n.language === 'en' ? 'text-white font-semibold' : ''}`}>English</button>
            <button onClick={() => changeLanguage('zh')} className={`hover:text-white ${i18n.language === 'zh' ? 'text-white font-semibold' : ''}`}>中文</button>
          </div>
        </div>
      </footer>
    </>
  );
}