import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Linkedin, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../data/content';

export const Footer = ({ setView }) => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-white mb-6"><Activity size={24} className="text-rose-500"/> Turp</div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Klinik araştırmalarda veriyi kaynağından doğrulayan, USBS onaylı yeni nesil dijital sağlık platformu.</p>
            <div className="flex gap-4"><Linkedin size={18} className="cursor-pointer hover:text-rose-500"/><Twitter size={18} className="cursor-pointer hover:text-rose-500"/><Instagram size={18} className="cursor-pointer hover:text-rose-500"/></div>
          </div>
          <div><h4 className="font-bold text-lg mb-6">Platform</h4><ul className="space-y-4 text-slate-400 text-sm"><li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Ana Sayfa</button></li><li><button onClick={() => setView('blog')} className="hover:text-white transition-colors">Blog & Haberler</button></li></ul></div>
          <div><h4 className="font-bold text-lg mb-6">Kurumsal</h4><ul className="space-y-4 text-slate-400 text-sm"><li><button onClick={() => setView('about')} className="hover:text-white transition-colors">Hakkımızda</button></li><li><button onClick={() => setView('admin')} className="hover:text-white transition-colors">Partner Girişi</button></li></ul></div>
          <div><h4 className="font-bold text-lg mb-6">İletişim</h4><ul className="space-y-4 text-slate-400 text-sm"><li className="flex items-start gap-3"><MapPin size={18} className="text-rose-500 shrink-0 mt-0.5"/><span>{COMPANY_INFO.address}</span></li><li className="flex items-center gap-3"><Phone size={18} className="text-rose-500 shrink-0"/><span>{COMPANY_INFO.phone}</span></li><li className="flex items-center gap-3"><Mail size={18} className="text-rose-500 shrink-0"/><span>{COMPANY_INFO.email}</span></li></ul></div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500"><p>{COMPANY_INFO.copyright}</p></div>
      </div>
    </footer>
  );
};
