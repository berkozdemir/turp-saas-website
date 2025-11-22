import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Linkedin, Twitter, Instagram, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { COMPANY_INFO } from '../data/content';

export const Footer = ({ setView }) => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo ve Slogan */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-white mb-6">
              <Activity size={24} className="text-rose-500"/> Turp
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Klinik araştırmalarda veriyi kaynağından doğrulayan, USBS onaylı yeni nesil dijital sağlık platformu.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-rose-600 transition-colors"><Linkedin size={18}/></a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-rose-600 transition-colors"><Twitter size={18}/></a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-rose-600 transition-colors"><Instagram size={18}/></a>
            </div>
          </div>
          
          {/* Platform Linkleri */}
          <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Ana Sayfa</button></li>
              <li><button onClick={() => setView('blog')} className="hover:text-white transition-colors">Blog & Haberler</button></li>
              <li><button onClick={() => setView('roi')} className="hover:text-white transition-colors">ROI Hesaplayıcı</button></li>
              <li><span className="text-slate-600 cursor-default">e-Nabız Entegrasyonu</span></li>
            </ul>
          </div>

          {/* Kurumsal & Yönetim Linkleri */}
          <div>
            <h4 className="font-bold text-lg mb-6">Kurumsal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">Hakkımızda</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">İletişim</a></li>
              
              {/* YÖNETİM GİRİŞİ BURAYA EKLENDİ */}
              <li className="pt-4">
                <button onClick={() => setView('admin')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold">
                    <Lock size={14}/> {t("nav_admin")}
                </button>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-bold text-lg mb-6">İletişim</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5"/>
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-rose-500 shrink-0"/>
                <span>{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-rose-500 shrink-0"/>
                <span>{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Telif */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>{COMPANY_INFO.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white">Kullanım Koşulları</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
