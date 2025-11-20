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
  MapPin, Phone, Linkedin, Twitter, Instagram, Send, ArrowLeft,
  Video, ClipboardList, Bell, HeartPulse, AlertTriangle, BookOpen
} from 'lucide-react';

// --- KURUMSAL BİLGİLER ---
const COMPANY_INFO = {
    address: "Cyberpark C Blok Kat: 1 No:146 Bilkent, Çankaya / Ankara",
    phone: "+90 312 426 77 22",
    email: "info@turp.app",
    copyright: "© 2025 Turp Sağlık Teknolojileri A.Ş. Tüm hakları saklıdır."
};

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Ortam Değişkenleri Tanımlı Değil! Lütfen Vercel'e ekleyin.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- MODÜL İÇERİK VERİTABANI (RESİMLER EKLENDİ) ---
const MODULE_CONTENT = {
  'survey': {
    title: "ePRO & Anket Modülü",
    icon: ClipboardList,
    color: "from-blue-600 to-indigo-600",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop", // Anket/Tablet görseli
    short: "Kağıt formları unutun. Veriyi kaynağında, hatasız yakalayın.",
    heroDesc: "Katılımcıların yaşam kalitesi ölçeklerini, günlük semptomlarını ve tedavi memnuniyetlerini mobil uygulama üzerinden anlık, güvenilir ve validasyon kuralları çerçevesinde toplayın.",
    details: [
      "Klinik araştırmalarda veri kalitesini düşüren en büyük etkenlerden biri 'Recall Bias' yani hatırlama yanılgısıdır. Turp Anket Modülü, veriyi olay anında yakalayarak bu sorunu ortadan kaldırır.",
      "FDA 21 CFR Part 11 uyumlu elektronik imza ve denetim izi (audit trail) özellikleri sayesinde, toplanan veriler regülatif kurumlar tarafından kabul gören standartlardadır.",
      "Dinamik dallanma mantığı (Branching Logic) sayesinde, hastalara sadece önceki cevaplarına göre ilgili sorular sorulur."
    ],
    features: [
      { t: "Dinamik Mantık", d: "Cevaba göre değişen akıllı soru setleri." },
      { t: "Zaman Damgası", d: "Verinin ne zaman girildiğine dair kesin kanıt." },
      { t: "Çoklu Dil", d: "Global çalışmalar için otomatik çeviri altyapısı." },
      { t: "Validasyon", d: "Hatalı veya eksik veri girişini engelleyen kurallar." }
    ]
  },
  'medication': {
    title: "İlaç Hatırlatma & Uyum",
    icon: Bell,
    color: "from-green-500 to-emerald-700",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop", // İlaç/Eczane görseli
    short: "Tedavi uyumunu şansa bırakmayın. Akıllı takip sistemi.",
    heroDesc: "İlaç, doğru zamanda ve doğru dozda alınmadığında araştırma verisi çöp olabilir. Akıllı bildirimler ve görsel teyit sistemleri ile 'Adherence' oranlarını %90'ın üzerine çıkarın.",
    details: [
      "Geleneksel yöntemlerde hastanın ilacı kullanıp kullanmadığı sadece beyana veya kutu sayımına dayanır. Turp, bunu dijital bir kesinliğe dönüştürür.",
      "Sistem, hastanın yaşam döngüsüne uyum sağlar. 'Şimdi müsait değilim' diyen bir hastaya, 15 dakika sonra veya eve vardığında tekrar hatırlatma yapar.",
      "Stok takibi özelliği, hastanın elindeki ilaç bitmeden hem hastayı hem de araştırma merkezini uyararak tedavi kesintilerini engeller."
    ],
    features: [
      { t: "Görsel Teyit", d: "İlacı alırken fotoğraf veya barkod ile doğrulama." },
      { t: "Akıllı Erteleme", d: "Hastanın konumuna ve durumuna göre hatırlatma." },
      { t: "Stok Takibi", d: "İlaç bitmeden otomatik lojistik uyarısı." },
      { t: "Oyunlaştırma", d: "Düzenli kullanımda hastayı motive eden rozetler." }
    ]
  },
  'vital': {
    title: "Vital Ölçüm & IoT",
    icon: HeartPulse,
    color: "from-rose-500 to-red-700",
    image: "https://images.unsplash.com/photo-1576091160550-21878bf72a5b?q=80&w=2070&auto=format&fit=crop", // Akıllı saat/Ölçüm görseli
    short: "Klinik dışında da kesintisiz hasta gözlemi.",
    heroDesc: "Hastanın tansiyon, şeker, nabız, kilo ve uyku verilerini Apple Health, Google Fit veya Bluetooth özellikli tıbbi cihazlar üzerinden otomatik ve hatasız çekin.",
    details: [
      "Sadece hastane vizitlerinde yapılan ölçümler, hastanın gerçek sağlık durumunu yansıtmayabilir ('Beyaz Önlük Hipertansiyonu' gibi).",
      "BYOD (Bring Your Own Device) stratejimiz sayesinde, hastalar kendi akıllı saatlerini veya tansiyon aletlerini sisteme entegre edebilirler.",
      "Sistem, belirlenen referans aralıklarının dışına çıkan (örn: Nabız > 120) değerlerde araştırmacıya anında 'Erken Uyarı' (Early Warning) gönderir."
    ],
    features: [
      { t: "Cihaz Entegrasyonu", d: "Bluetooth cihazlardan direkt veri aktarımı." },
      { t: "Trend Analizi", d: "Anlık sapmalarda doktora otomatik uyarı." },
      { t: "Apple/Google Health", d: "Mevcut sağlık ekosistemleriyle tam uyum." },
      { t: "Veri Temizliği", d: "Mantık dışı manuel girişlerin engellenmesi." }
    ]
  },
  'appointment': {
    title: "Randevu & Vizit Yönetimi",
    icon: Calendar,
    color: "from-purple-600 to-violet-800",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop", // Doktor/Takvim görseli
    short: "No-Show oranlarını minimize eden akıllı takvim.",
    heroDesc: "Karmaşık protokol takvimini hastanın cebine indirin. Saha ziyaretlerini, tele-vizitleri ve laboratuvar randevularını otomatik organize edin ve hatırlatın.",
    details: [
      "Hastaların çalışmadan ayrılmasının (Drop-out) en büyük nedenlerinden biri, lojistik zorluklar ve unutulan randevulardır.",
      "Turp, vizit pencerelerini (visit windows) otomatik hesaplar ve hastaya en uygun zamanı önerir.",
      "Navigasyon entegrasyonu sayesinde hasta, fiziksel vizitler için hastaneye tek tuşla yol tarifi alabilir."
    ],
    features: [
      { t: "Otomatik Hatırlatıcı", d: "Vizitten 1 gün ve 2 saat önce SMS/Push." },
      { t: "Takvim Senk.", d: "Hastanın telefon takvimine otomatik işleme." },
      { t: "Navigasyon", d: "Hastane konumu ve yol tarifi entegrasyonu." },
      { t: "Esnek Planlama", d: "Protokol sapmalarını önleyen tarih hesaplayıcı." }
    ]
  },
  'adverse': {
    title: "Yan Etki Bildirimi",
    icon: AlertTriangle,
    color: "from-orange-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop", // Hasta/Doktor konsültasyon
    short: "Farmakovijilans için en hızlı ve güvenli yol.",
    heroDesc: "Hastaların yaşadığı beklenmedik durumları anında bildirmesini sağlayan, araştırmacıyla hasta arasındaki 7/24 açık acil durum köprüsü.",
    details: [
      "Yan etkilerin geç bildirilmesi, hasta güvenliğini tehlikeye atar ve çalışmanın etik kurallara uygunluğunu zedeler.",
      "Hastalar, karmaşık tıbbi terimler yerine 'Başım dönüyor', 'Midem bulanıyor' gibi basit seçimlerle bildirim yapabilir.",
      "Ciddi Yan Etki (SAE) şüphesi durumunda sistem, sorumlu hekime ve sponsora anında yüksek öncelikli alarm gönderir."
    ],
    features: [
      { t: "Tek Tuşla Bildirim", d: "Acil durumlarda hızlı erişim butonu." },
      { t: "Görsel Kanıt", d: "Semptomun (örn: döküntü) fotoğrafını yükleme." },
      { t: "CTCAE Derecelendirme", d: "Semptom şiddetinin standartlaştırılması." },
      { t: "Anlık Alarm", d: "SAE durumunda hekime SMS ve Mail uyarısı." }
    ]
  },
  'education': {
    title: "Hasta Bilgilendirme",
    icon: BookOpen,
    color: "from-sky-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1576091160501-bbe574695a8d?q=80&w=2070&auto=format&fit=crop", // Tablet/Eğitim
    short: "Bilinçli hasta, başarılı ve etik bir araştırma demektir.",
    heroDesc: "Onam formlarını dijitalleştirin (eConsent) ve hastaları araştırma protokolü hakkında sıkıcı metinler yerine interaktif videolarla eğitin.",
    details: [
      "Hastaların çoğu imzaladıkları onam formunu tam olarak anlamaz. Turp, bu süreci interaktif bir deneyime dönüştürür.",
      "Video, animasyon ve quizler ile hastanın çalışmayı anladığından emin olunur.",
      "Hasta, aklına takılan 'Bunu yiyebilir miyim?', 'Spor yapabilir miyim?' gibi soruların cevabını uygulama içindeki kütüphanede bulabilir."
    ],
    features: [
      { t: "eConsent", d: "Biyometrik veya imza ile dijital onam alma." },
      { t: "Multimedya", d: "Protokolü anlatan animasyon ve videolar." },
      { t: "Bilgi Sınaması", d: "Onam öncesi hastanın anlayışını test etme." },
      { t: "Canlı Kütüphane", d: "7/24 erişilebilir protokol dokümanları." }
    ]
  },
  'webinar': {
    title: "Webinar & Tele-Vizit",
    icon: Video,
    color: "from-fuchsia-600 to-pink-600",
    image: "https://images.unsplash.com/photo-1616587845419-36f3a89933a3?q=80&w=2071&auto=format&fit=crop", // Video konferans
    short: "Mekan bağımsız, hibrit klinik araştırma altyapısı.",
    heroDesc: "Hastanın merkeze gelemediği durumlarda, uygulama üzerinden güvenli, şifreli ve KVKK uyumlu görüntülü görüşme yapın. Decentralized Clinical Trials (DCT) için ideal.",
    details: [
      "Zoom veya WhatsApp gibi güvensiz kanallar yerine, tıbbi verilerin korunması için özel olarak şifrelenmiş bir altyapı sunar.",
      "Görüşme sırasında doktor, hastanın ekranına laboratuvar sonuçlarını veya röntgen görüntülerini yansıtabilir.",
      "Sponsor denetimleri için görüşme süreleri ve katılımcı logları otomatik olarak tutulur (Görüşme içeriği KVKK gereği kaydedilmez)."
    ],
    features: [
      { t: "Uçtan Uca Şifreleme", d: "Tıbbi gizliliğe uygun güvenli altyapı." },
      { t: "Ekran Paylaşımı", d: "Doktorun hastaya veri gösterme imkanı." },
      { t: "Sanal Bekleme", d: "Randevu saati gelene kadar bilgilendirme." },
      { t: "Oturum Logları", d: "Denetim için görüşme zaman kayıtları." }
    ]
  }
};

// --- YARDIMCI BİLEŞEN: SSS (FAQ) ---
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

// --- MODÜL DETAY SAYFASI (GÜNCELLENDİ: BACKGROUND IMAGE & STYLE) ---
const ModuleDetail = ({ moduleId, setView }) => {
  const data = MODULE_CONTENT[moduleId];

  // Sayfa açılınca en tepeye kaydır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

  if (!data) return <div className="p-20 text-center">Modül bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
             <ArrowLeft size={20}/> Ana Sayfaya Dön
           </button>
           <button onClick={() => document.getElementById('contact-module').scrollIntoView({behavior: 'smooth'})} className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg">
             Bu Modülü Talep Et
           </button>
        </div>
      </div>

      {/* Hero Alanı - RESİMLİ ARKA PLAN */}
      <section className="relative py-32 px-6 overflow-hidden flex items-center justify-center min-h-[60vh]">
        {/* Arka Plan Resmi */}
        <div className="absolute inset-0 z-0">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover object-center animate-pulse-slow" />
            {/* Karartma Katmanı (Gradient) */}
            <div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-90 mix-blend-multiply`}></div>
            <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 text-white">
           <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8">
              {React.createElement(data.icon, { size: 48 })}
           </div>
           <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">{data.title}</h1>
           <p className="text-2xl text-white/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed">{data.short}</p>
        </div>
      </section>

      {/* Detaylı Açıklama ve Özellikler */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
         <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">Neden Bu Modül?</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium border-l-4 border-slate-900 pl-6">
                {data.heroDesc}
            </p>
            <div className="space-y-8">
                {data.details.map((detail, i) => (
                    <div key={i} className="flex gap-5">
                        <div className="mt-1.5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold shrink-0">{i+1}</div>
                        <p className="text-slate-600 leading-relaxed text-lg">{detail}</p>
                    </div>
                ))}
            </div>
         </div>
         
         <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-8 relative z-10">Teknik Özellikler</h3>
            <div className="grid gap-6 relative z-10">
                {data.features.map((feat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${data.color} text-white shrink-0 shadow-md`}>
                            <CheckCircle size={20}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg">{feat.t}</h4>
                            <p className="text-sm text-slate-500 mt-1">{feat.d}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Dekoratif Arka Plan */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${data.color} opacity-5 rounded-full blur-3xl -mr-20 -mt-20`}></div>
         </div>
      </section>

      {/* Alt CTA */}
      <section id="contact-module" className="py-24 bg-slate-900 text-white text-center px-6">
          <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-4xl font-bold mb-6">Bu Modülü Projenize Ekleyin</h2>
              <p className="text-slate-400 mb-10 text-lg">Turp ekosistemi modülerdir. Sadece ihtiyacınız olanı kullanın, maliyetleri optimize edin.</p>
              <button onClick={() => setView('home')} className="px-12 py-5 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl text-lg">
                  İletişime Geçin
              </button>
          </div>
      </section>
    </div>
  );
};

// --- BİLEŞEN: HOME (ANA SAYFA) ---
const Home = ({ setView }) => {
  const { t } = useTranslation();
  const [contactForm, setContactForm] = useState({ ad_soyad: '', email: '', sirket: '', ilgi_alani: '' });
  const [contactStatus, setContactStatus] = useState('idle'); 

  const handleContactSubmit = async (e) => {
      e.preventDefault(); setContactStatus('loading');
      const { error } = await supabase.from('leads').insert([contactForm]);
      if (error) { alert("Hata: " + error.message); setContactStatus('error'); } 
      else { setContactStatus('success'); setContactForm({ ad_soyad: '', email: '', sirket: '', ilgi_alani: '' }); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* 1. HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
           <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 blur-sm scale-105 animate-pulse-slow" />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-50"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-2xl tracking-wide uppercase">
            <ShieldCheck size={14}/> USBS Onaylı & e-Nabız Entegreli
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
             <span className="text-white">Tahminleri Değil,</span> <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">Gerçekleri Yönetin.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-rose-600 text-white font-bold rounded-xl shadow-xl shadow-rose-900/20 hover:bg-rose-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Demo Talep Et <ArrowRight size={18}/>
            </button>
            <button onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all">
              Platformu Keşfet
            </button>
          </div>
        </div>
      </section>

      {/* 2. PARTNERLER */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">GÜVENİLEN PARTNERLERİMİZ</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-2xl font-heading font-bold text-slate-800">PharmaCo</span>
                <span className="text-2xl font-heading font-bold text-slate-800">NovusBio</span>
                <span className="text-2xl font-heading font-bold text-slate-800">MED-DATA</span>
                <span className="text-2xl font-heading font-bold text-slate-800">GenHealth</span>
            </div>
        </div>
      </section>

      {/* 3. KARŞILAŞTIRMA */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">Geleneksel Yöntemler Yetersiz Kalıyor</h2>
                <p className="text-slate-500">Manuel süreçler veri güvenilirliğini düşürürken maliyetleri artırıyor.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-4 py-1 rounded-bl-2xl text-xs font-bold">Geleneksel</div>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Hasta beyanına dayalı, doğrulanmamış veri.</span></li>
                        <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Kağıt formlar ve manuel giriş hataları.</span></li>
                        <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Yüksek "Drop-out" oranları.</span></li>
                    </ul>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden transform md:scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold">Turp Yöntemi</div>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0"/> <span className="text-white font-medium">e-Nabız ile %100 dijital doğrulama.</span></li>
                        <li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0"/> <span className="text-white font-medium">Anlık veri akışı ve otomatik raporlama.</span></li>
                        <li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0"/> <span className="text-white font-medium">Akıllı bildirimlerle yüksek hasta uyumu.</span></li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* 4. BENTO GRID (MODÜLLER - DÜZELTME: CURSOR VE TIKLANABİLİRLİK) */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="mb-16"><h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Teknoloji ile Güçlendirilmiş Çözümler</h2><p className="text-lg text-slate-500">Detaylı bilgi için modüllere tıklayın.</p></div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            <div onClick={() => setView({ type: 'module', id: 'survey' })} className="cursor-pointer md:col-span-2 bg-gradient-to-br from-rose-600 to-purple-700 rounded-3xl p-10 text-white relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative z-10"><div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6"><ClipboardList size={24}/></div><h3 className="text-3xl font-heading font-bold mb-4">ePRO & Anket Modülü</h3><p className="text-rose-100 text-lg max-w-md">Kağıt formları unutun. Veriyi kaynağında, hatasız yakalayın.</p></div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <ArrowRight className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity"/>
            </div>
            
            <div onClick={() => setView({ type: 'module', id: 'medication' })} className="cursor-pointer bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group hover:border-green-400 duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><Bell size={24}/></div><h3 className="text-xl font-bold text-slate-900 mb-3">İlaç Hatırlatma</h3><p className="text-slate-500">Tedavi uyumunu şansa bırakmayın.</p>
            </div>
            
            <div onClick={() => setView({ type: 'module', id: 'vital' })} className="cursor-pointer bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group hover:border-rose-400 duration-300">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6"><HeartPulse size={24}/></div><h3 className="text-xl font-bold text-slate-900 mb-3">Vital Ölçüm & IoT</h3><p className="text-slate-500">Giyilebilir cihazlarla kesintisiz takip.</p>
            </div>

            <div onClick={() => setView({ type: 'module', id: 'appointment' })} className="cursor-pointer bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group hover:border-purple-400 duration-300">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6"><Calendar size={24}/></div><h3 className="text-xl font-bold text-slate-900 mb-3">Randevu Yönetimi</h3><p className="text-slate-500">No-Show oranlarını minimize edin.</p>
            </div>

            <div onClick={() => setView({ type: 'module', id: 'adverse' })} className="cursor-pointer bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group hover:border-orange-400 duration-300">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6"><AlertTriangle size={24}/></div><h3 className="text-xl font-bold text-slate-900 mb-3">Yan Etki Bildirimi</h3><p className="text-slate-500">Farmakovijilans için en hızlı yol.</p>
            </div>

            <div className="cursor-pointer md:col-span-2 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center gap-8 relative overflow-hidden hover:border-slate-700 hover:-translate-y-2 transition-all duration-300" onClick={() => setView({ type: 'module', id: 'education' })}>
                <div className="flex-1 relative z-10"><div className="flex gap-3 mb-4"><span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">eConsent</span><span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">Video</span></div><h3 className="text-2xl font-bold text-white mb-2">Eğitim & Webinar</h3><p className="text-slate-400">Hastaları interaktif içeriklerle eğitin, uzaktan görüşün.</p></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-sky-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-sky-900/50 z-10"><BookOpen size={40} className="text-white"/></div>
            </div>
         </div>
      </section>

      {/* 5. WORKFLOW */}
      <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                {[
                    {step:"01", title:"Kurulum", desc:"Sponsor paneli entegrasyonu."},
                    {step:"02", title:"Davet", desc:"Hastalara mobil uygulama linki."},
                    {step:"03", title:"Onay", desc:"Hasta e-Nabız onayı verir."},
                    {step:"04", title:"Akış", desc:"Gerçek zamanlı veri akışı başlar."}
                ].map((s,i)=>(
                    <div key={i}><div className="w-20 h-20 mx-auto bg-slate-50 border-4 border-white rounded-full flex items-center justify-center text-xl font-bold text-rose-600 mb-4 shadow-sm">{s.step}</div><h3 className="font-bold text-slate-900">{s.title}</h3><p className="text-xs text-slate-500 px-4">{s.desc}</p></div>
                ))}
            </div>
          </div>
      </section>

      {/* 6. STATS */}
      <section className="py-20 bg-rose-600 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[{val:"%45", label:"Daha Hızlı Hasta Alımı"}, {val:"%99.8", label:"Veri Doğruluğu"}, {val:"%30", label:"Maliyet Tasarrufu"}, {val:"7/24", label:"Gerçek Zamanlı İzleme"}].map((s,i)=>(
                  <div key={i}><div className="text-4xl md:text-5xl font-heading font-extrabold mb-2">{s.val}</div><div className="text-rose-200 text-sm font-medium uppercase tracking-wide">{s.label}</div></div>
              ))}
          </div>
      </section>

      {/* 7. FAQ & CONTACT FORM */}
      <section id="contact" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
                <h2 className="font-heading text-3xl font-bold text-slate-900 mb-8">Sıkça Sorulan Sorular</h2>
                <div className="space-y-2">
                    <FAQItem question="e-Nabız verisi için hasta onayı gerekiyor mu?" answer="Evet, KVKK gereği hastanın mobil uygulama üzerinden açık rıza vermesi ve e-Nabız şifresiyle onaylaması zorunludur." />
                    <FAQItem question="Mevcut EDC sistemimizle entegre olur mu?" answer="Turp, modern REST API altyapısı sayesinde mevcut Electronic Data Capture (EDC) sistemlerinizle sorunsuz haberleşir." />
                    <FAQItem question="Hangi verileri çekebiliyoruz?" answer="Hastanın tanıları, reçeteli ilaç geçmişi, radyoloji raporları ve tahlil sonuçları çekilebilir." />
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
                {contactStatus === 'success' ? (
                    <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} /></div>
                        <h3 className="font-heading text-3xl font-bold text-slate-900 mb-2">Başvurunuz Alındı!</h3>
                        <p className="text-slate-500 mb-8">Uzman ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecektir.</p>
                        <button onClick={() => setContactStatus('idle')} className="text-rose-600 font-bold hover:underline">Yeni bir talep oluştur</button>
                    </div>
                ) : (
                    <>
                        <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Araştırmanızı Başlatın</h3>
                        <p className="text-slate-500 mb-8 text-sm">Uzman ekibimiz size özel bir demo hazırlasın.</p>
                        
                        <form className="space-y-4" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Adınız" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" value={contactForm.ad_soyad} onChange={e=>setContactForm({...contactForm, ad_soyad: e.target.value})} required/>
                                <input type="text" placeholder="Şirket" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" value={contactForm.sirket} onChange={e=>setContactForm({...contactForm, sirket: e.target.value})}/>
                            </div>
                            <input type="email" placeholder="Kurumsal E-posta" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" value={contactForm.email} onChange={e=>setContactForm({...contactForm, email: e.target.value})} required/>
                            <select className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all ${contactForm.ilgi_alani===""?"text-slate-400":"text-slate-900"}`} value={contactForm.ilgi_alani} onChange={e=>setContactForm({...contactForm, ilgi_alani: e.target.value})} required>
                                <option value="" disabled>İlgilendiğiniz Alanı Seçiniz</option><option>RWE / Gözlemsel Çalışma</option><option>Faz Çalışması (III/IV)</option><option>Medikal Cihaz Takibi</option>
                            </select>
                            <button disabled={contactStatus === 'loading'} type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-rose-600 flex justify-center gap-2">{contactStatus === 'loading' ? <Loader2 className="animate-spin"/> : <>Gönder <Send size={18}/></>}</button>
                        </form>
                    </>
                )}
            </div>
        </div>
      </section>
    </div>
  );
};

// --- DİĞER BİLEŞENLER (Blog, Admin, Login, PostDetail) ---
const Login=()=>{const[e,sE]=useState('');const[p,sP]=useState('');const[l,sL]=useState(false);const[m,sM]=useState('login');const[msg,sMsg]=useState({t:'',txt:''});const hL=async(ev)=>{ev.preventDefault();sL(true);sMsg({t:'',txt:''});const{error}=await supabase.auth.signInWithPassword({email:e,password:p});if(error)sMsg({t:'error',txt:error.message});sL(false)};const hR=async(ev)=>{ev.preventDefault();sL(true);const{error}=await supabase.auth.resetPasswordForEmail(e,{redirectTo:window.location.origin});if(error)sMsg({t:'error',txt:error.message});else sMsg({t:'success',txt:'Link gönderildi.'});sL(false)};return(<div className="min-h-screen flex items-center justify-center bg-slate-50 px-6"><div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"><div className="text-center mb-8"><h2 className="font-heading text-3xl font-bold">{m==='login'?'Giriş':'Şifre Sıfırla'}</h2></div>{msg.txt&&<div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${msg.t==='error'?'bg-red-50 text-red-600':'bg-green-50 text-green-600'}`}>{msg.txt}</div>}<form onSubmit={m==='login'?hL:hR} className="space-y-5"><input type="email" className="w-full p-3 border-2 rounded-xl" placeholder="Email" value={e} onChange={x=>sE(x.target.value)} required/>{m==='login'&&<input type="password" className="w-full p-3 border-2 rounded-xl" placeholder="Şifre" value={p} onChange={x=>sP(x.target.value)} required/>}<button disabled={l} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">{l?'...':(m==='login'?'Giriş':'Gönder')}</button></form><div className="mt-6 text-center"><button onClick={()=>{sM(m==='login'?'reset':'login');sMsg({t:'',txt:''})}} className="text-sm text-slate-500 font-bold">Değiştir: {m==='login'?'Şifremi Unuttum':'Giriş Yap'}</button></div></div></div>)};
const PostDetail=({post,setView,onEdit})=>{if(!post)return null;return(<div className="max-w-4xl mx-auto px-6 py-20"><div className="flex justify-between mb-8"><button onClick={()=>setView('blog')} className="font-bold flex gap-2 items-center"><ArrowRight className="rotate-180" size={18}/> Dön</button><button onClick={()=>onEdit(post)} className="bg-slate-100 px-4 py-2 rounded-lg font-bold flex gap-2"><Edit3 size={16}/> Düzenle</button></div><article className="bg-white rounded-3xl shadow-xl overflow-hidden">{post.image_url&&<img src={post.image_url} className="w-full h-96 object-cover"/>}<div className="p-12"><h1 className="font-heading text-4xl font-extrabold mb-8">{post.title}</h1><div className="prose prose-lg"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div></div></article></div>)};
const Blog=({setView})=>{const{t}=useTranslation();const[p,sP]=useState([]);const[l,sL]=useState(true);useEffect(()=>{const f=async()=>{const{data}=await supabase.from('posts').select('*').order('created_at',{ascending:false});sP(data||[]);sL(false)};f()},[]);return(<div className="max-w-7xl mx-auto px-6 py-20"><h2 className="font-heading text-4xl font-extrabold text-center mb-16">{t("nav_blog")}</h2>{l?<div className="text-center">...</div>:<div className="grid md:grid-cols-3 gap-8">{p.map(x=>(<div key={x.id} onClick={()=>setView({type:'detail',post:x})} className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:-translate-y-2 transition-all"><div className="h-56 bg-slate-100 relative">{x.image_url&&<img src={x.image_url} className="w-full h-full object-cover"/>}</div><div className="p-8"><h3 className="font-bold text-xl mb-2">{x.title}</h3></div></div>))}</div>}</div>)};
const Admin=({editingPost,setEditingPost,setView,handleLogout})=>{const[f,sF]=useState({title:'',content:''});const[i,sI]=useState(null);const[u,sU]=useState(false);useEffect(()=>{if(editingPost)sF({title:editingPost.title,content:editingPost.content});else sF({title:'',content:''})},[editingPost]);const sub=async(e)=>{e.preventDefault();sU(true);try{let url=editingPost?editingPost.image_url:null;if(i){const n=`${Date.now()}-${i.name.replace(/\W/g,'')}`;await supabase.storage.from('blog-images').upload(n,i);const{data}=supabase.storage.from('blog-images').getPublicUrl(n);url=data.publicUrl}if(editingPost){await supabase.from('posts').update({title:f.title,content:f.content,image_url:url}).eq('id',editingPost.id);alert('Güncellendi');setEditingPost(null);setView('blog')}else{await supabase.from('posts').insert([{title:f.title,content:f.content,image_url:url}]);alert('Eklendi');sF({title:'',content:''});sI(null)}}catch(err){alert(err.message)}sU(false)};return(<div className="max-w-3xl mx-auto px-6 py-20"><div className="flex justify-between mb-8"><h2 className="font-heading text-3xl font-bold">Yönetim</h2><button onClick={handleLogout} className="text-red-600 font-bold flex gap-2"><LogOut size={16}/> Çıkış</button></div><div className="bg-white p-10 rounded-3xl shadow-xl"><form onSubmit={sub} className="space-y-6"><input className="w-full p-4 border-2 rounded-xl font-bold" value={f.title} onChange={e=>sF({...f,title:e.target.value})} placeholder="Başlık"/><textarea className="w-full p-4 border-2 rounded-xl min-h-[200px]" value={f.content} onChange={e=>sF({...f,content:e.target.value})} placeholder="İçerik (Markdown)"/><input type="file" onChange={e=>sI(e.target.files[0])}/><button disabled={u} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">{u?'...':'Kaydet'}</button></form></div></div>)};

// --- ANA UYGULAMA ---
export default function App() {
  const [view, setView] = useState('home');
  const [editingPost, setEditingPost] = useState(null);
  const [session, setSession] = useState(null);
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setView('home'); };
  const startEdit = (post) => { if (!session) { alert("Düzenleme yapmak için giriş yapmalısınız!"); setView('admin'); return; } setEditingPost(post); setView('admin'); };

  const renderView = () => {
    if (view === 'home') return <Home setView={setView} />;
    if (view === 'blog') return <Blog setView={setView} />;
    if (view === 'admin') return session ? <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} handleLogout={handleLogout} /> : <Login />;
    if (typeof view === 'object' && view.type === 'module') return <ModuleDetail moduleId={view.id} setView={setView} />;
    if (typeof view === 'object' && view.type === 'detail') return <PostDetail post={view.post} setView={setView} onEdit={startEdit} />;
    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group" onClick={()=>setView('home')}>
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform"><Activity size={22}/></div>
            <span className="tracking-tight text-slate-900">Turp</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_home")}</button>
              {/* MODÜLLER DROPDOWN (DÜZELTİLDİ: HASSASİYET SORUNU ÇÖZÜLDÜ) */}
              <div className="relative group h-full flex items-center">
                 <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">Modüller <ChevronDown size={14}/></button>
                 {/* Görünmez Köprü (Padding-Top) */}
                 <div className="absolute top-full left-0 w-64 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {Object.entries(MODULE_CONTENT).map(([key, val]) => (
                            <button key={key} onClick={() => setView({ type: 'module', id: key })} className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 border-b border-slate-50 last:border-0 transition-colors">
                                {val.title}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
              <button onClick={()=>setView('blog')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'blog' || view?.type === 'detail' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_blog")}</button>
              <button onClick={()=>setView('admin')} className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  {session ? <Lock size={14} className="text-green-400"/> : <Lock size={14}/>} {t("nav_admin")}
              </button>
            </div>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm"><Globe size={16} className="text-slate-400 ml-2 hidden md:block" />{languages.map((lang) => (<button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${i18n.language === lang.code ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}>{lang.label}</button>))}</div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{renderView()}</main>
      <Footer setView={setView} />
    </div>
  );
}
