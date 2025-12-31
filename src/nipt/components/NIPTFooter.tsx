import { MapPin, Phone, Mail } from "lucide-react";

export const NIPTFooter = () => {
    return (
        <footer id="iletisim" className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/images/omega_genetik_logo.png" alt="Omega Genetik" className="h-10 w-auto brightness-0 invert opacity-80" />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Omega Genetik güvencesiyle, anne ve bebek sağlığı için en ileri teknolojileri sunuyoruz.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Hızlı Erişim</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="/nipt#testler" className="hover:text-blue-400 transition-colors">NIPT Testleri</a></li>
                            <li><a href="/nipt#nasil-calisir" className="hover:text-blue-400 transition-colors">Süreç</a></li>
                            <li><a href="/nipt/booking" className="hover:text-blue-400 transition-colors">Randevu Al</a></li>
                            <li><a href="/iletisim" className="hover:text-blue-400 transition-colors">İletişim</a></li>
                            <li><a href="/nipt/about" className="hover:text-blue-400 transition-colors">Hakkımızda</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Kurumsal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">KVKK Aydınlatma</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Gizlilik Politikası</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Sertifikalarımız</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-blue-500" />
                                <span>Ankara, Beytepe</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-500" />
                                <span>+90 (312) 920 13 62</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500" />
                                <span>info@nipt.tr</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <div>&copy; 2025 Omega Genetik. Tüm hakları saklıdır.</div>
                    <div className="mt-4 md:mt-0 flex gap-6">
                        <a href="#" className="hover:text-white">Şartlar</a>
                        <a href="#" className="hover:text-white">Gizlilik</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
