// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, 
  ShieldCheck, Globe, Edit3, Lock, LogOut, Mail, Key, CheckCircle, 
  XCircle, Zap, Database, Smartphone, FileText, ChevronDown, ChevronUp, 
  MapPin, Phone, Linkedin, Twitter, Instagram 
} from 'lucide-react';

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) { console.error("Supabase Key Eksik!"); }
const supabase = createClient(supabaseUrl, supabaseKey);

// --- BİLEŞEN: SSS (FAQ) ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full py-6 text-left focus:outline-none group"
      >
        <span className={`text-lg font-heading font-bold transition-colors ${isOpen ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
          {question}
        </span>
        {isOpen ? <ChevronUp className="text-rose-600"/> : <ChevronDown className="text-slate-400"/>}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

// --- BİLEŞEN: FOOTER ---
const Footer = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
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
          
          <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Ana Sayfa</button></li>
              <li><button onClick={() => setView('blog')} className="hover:text-white transition-colors">Blog & Haberler</button></li>
              <li><a href="#" className="hover:text-white transition-colors">e-Nabız Entegrasyonu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Güvenlik & KVKK</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Kurumsal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
              <li><button onClick={() => setView('admin')} className="hover:text-white transition-colors">Partner Girişi</button></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">İletişim</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5"/>
                <span>Maslak Mah. Büyükdere Cad. No:123<br/>Sarıyer, İstanbul</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-rose-500 shrink-0"/>
                <span>+90 (212) 555 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-rose-500 shrink-0"/>
                <span>hello@turp.com.tr</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2025 Turp Sağlık Teknolojileri A.Ş. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white">Kullanım Koşulları</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- BİLEŞEN: HOME (Gelişmiş Modüler Yapı) ---
const Home = ({ setView }) => {
  const
