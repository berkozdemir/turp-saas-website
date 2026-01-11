import React from 'react';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';

export const GNDFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Genlerim Ne Diyor?</h3>
            <p className="text-gray-300 text-sm mb-6">
              Omega Araştırma bünyesinde 2018'den beri ruhsatlı genetik laboratuvarı olarak faaliyet göstermekteyiz.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={18} className="text-red-500 flex-shrink-0" />
                <a href="tel:+903129201362" className="hover:text-red-500 transition">
                  +90 312 920 1 362
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={18} className="text-red-500 flex-shrink-0" />
                <a href="mailto:nipttesti@omega-gen.com" className="hover:text-red-500 transition">
                  nipttesti@omega-gen.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Piri Reis Caddesi No:2/4</p>
                  <p>AnkaJob Beytepe/Çankaya/Ankara</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testler */}
          <div>
            <h4 className="text-lg font-bold mb-4">Testler</h4>
            <ul className="space-y-2">
              <li>
                <a href="/yasam-genetigi" className="text-gray-300 hover:text-red-500 transition text-sm">
                  Yaşam Genetiği
                </a>
              </li>
              <li>
                <a href="/yenidogan-tarama" className="text-gray-300 hover:text-red-500 transition text-sm">
                  Yenidoğan Taraması
                </a>
              </li>
              <li>
                <a href="/enfantguard-2-0" className="text-gray-300 hover:text-red-500 transition text-sm">
                  EnfantGuard 2.0
                </a>
              </li>
              <li>
                <a href="/#sss" className="text-gray-300 hover:text-red-500 transition text-sm">
                  S.S.S.
                </a>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Kurumsal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/hakkimizda" className="text-gray-300 hover:text-red-500 transition text-sm">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/iletisim" className="text-gray-300 hover:text-red-500 transition text-sm">
                  İletişim
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-red-500 transition text-sm">
                  Ana Sayfa
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4">Hukuki</h4>
            <ul className="space-y-2 mb-8">
              <li>
                <a href="/" className="text-gray-300 hover:text-red-500 transition text-sm">
                  KVKK Politikası
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-red-500 transition text-sm">
                  Kullanım Koşulları
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-red-500 transition text-sm">
                  Bilgi Güvenliği
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <h4 className="text-lg font-bold mb-4">Bizi Takip Edin</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/nipttesti"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/903129201362"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </a>
              <a
                href="/"
                className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Disclaimer */}
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-white mb-2">Sağlık Uyarısı</p>
              <p>
                Bu sitede yer alan bilgiler tamamen eğitim amaçlıdır. Herhangi bir genetik test yapılmadan
                tıbbi kararlar alınmamalıdır. Lütfen kararlarınız için bir sağlık profesyoneline danışınız.
              </p>
            </div>

            {/* Company Info */}
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-white mb-2">Omega Araştırma</p>
              <p>
                Sağlık Bakanlığı ruhsatlı genetik laboratuvarı. Tüm testlerimiz uluslararası standartlarda
                yapılmaktadır. KVKK uyumlu bilgi güvenliği protokolü uygulanmaktadır.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                &copy; {currentYear} Genlerim Ne Diyor? Tüm hakları saklıdır. Omega Araştırma tarafından
                sunulmaktadır.
              </p>
              <p className="text-sm text-gray-400">
                Tasarım ve geliştirme: <span className="text-red-500">Omega Teknik</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GNDFooter;
