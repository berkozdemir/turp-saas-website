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

// --- MODÜL İÇERİK VERİTABANI ---
const MODULE_CONTENT = {
  'survey': {
    title: "ePRO & Anket Modülü",
    icon: ClipboardList,
    color: "from-blue-600 to-indigo-600",
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/appointment-consulting-doctor-visit-on-mobile-app-2024-11-26-02-03-22-utc.jpg",
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
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/a-pile-of-pills-in-blister-packs-close-up-2025-10-18-13-17-21-utc.jpg",
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
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/woman-taking-blood-pressure-test-on-smartwatches-2025-08-11-15-24-28-utc.jpg",
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
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/chairs-on-empty-building-2025-01-27-22-50-08-utc.jpg",
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
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/doctor-presenting-report-of-diagnosis-2025-01-09-06-41-33-utc.jpg",
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
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/senior-woman-eye-exam-and-vision-for-snellen-test-2025-04-06-12-48-50-utc.jpg",
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
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/virtual-doctor-working-from-home-on-a-video-call-2025-11-02-01-48-10-utc.jpg",
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

// --- YENİ BİLEŞEN: OPTİMİZE EDİLMİŞ RESİM ---
const OptimizedImage = ({ src, alt, width, height, className }) => {
  if (!src) return null;
  
  let optimizedSrc = src;
  // Sadece Supabase URL'lerini dönüştür
  if (src.includes('supabase.co') && src.includes('/storage/v1/object/public')) {
    optimizedSrc = src.replace('/storage/v1/object/public', '/storage/v1/render/image/public');
    const params = [];
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);
    params.push('quality=80');
    params.push('resize=contain'); // Gerekirse 'cover' yapılabilir
    optimizedSrc += `?${params.join('&')}`;
  }

  return (
    <img src={optimizedSrc} alt={alt} className={className} loading="lazy" />
  );
};

// --- YARDIMCI BİLEŞEN: SSS (FAQ) ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full py-6 text-left focus:outline-none group">
        <span className={`text-lg font-heading font-bold transition-colors ${isOpen ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>{question}</span>
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
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Klinik araştırmalarda veriyi kaynağından doğrulayan, USBS onaylı yeni nesil dijital sağlık platformu.</p>
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
              <li className="flex items-start gap-3"><MapPin size={18} className="text-rose-500 shrink-0 mt-0.5"/><span>{COMPANY_INFO.address}</span></li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-rose-500 shrink-0"/><span>{COMPANY_INFO.phone}</span></li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-rose-500 shrink-0"/><span>{COMPANY_INFO.email}</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>{COMPANY_INFO.copyright}</p>
          <div className="flex gap-6"><a href="#" className="hover:text-white">Gizlilik Politikası</a><a href="#" className="hover:text-white">Kullanım Koşulları</a></div>
        </div>
      </div>
    </footer>
  );
};

// --- MODÜL DETAY SAYFASI (OPTİMİZE RESİMLİ) ---
const ModuleDetail = ({ moduleId, setView }) => {
  const data = MODULE_CONTENT[moduleId];
  useEffect(() => { window.scrollTo(0, 0); }, [moduleId]);

  if (!data) return <div className="p-20 text-center">Modül bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"><ArrowLeft size={20}/> Ana Sayfaya Dön</button>
           <button onClick={() => document.getElementById('contact-module').scrollIntoView({behavior: 'smooth'})} className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg">Bu Modülü Talep Et</button>
        </div>
      </div>

      <section className={`relative py-24 px-6 overflow-hidden flex items-center justify-center min-h-[60vh]`}>
        <div className="absolute inset-0 z-0">
            <OptimizedImage src={data.image} alt={data.title} width={1200} className="w-full h-full object-cover object-center" />
            <div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-90 mix-blend-multiply`}></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 text-white">
           <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8">{React.createElement(data.icon, { size: 48 })}</div>
           <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">{data.title}</h1>
           <p className="text-2xl text-white/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed">{data.short}</p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
         <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">Neden Bu Modül?</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">{data.heroDesc}</p>
            <div className="space-y-6">{data.details.map((detail, i) => (<div key={i} className="flex gap-4"><div className="mt-1.5 w-2 h-2 rounded-full bg-slate-900 shrink-0"></div><p className="text-slate-600 leading-relaxed">{detail}</p></div>))}</div>
         </div>
         <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-8">Teknik Özellikler</h3>
            <div className="grid gap-6">{data.features.map((feat, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4"><div className={`p-2 rounded-lg bg-gradient-to-br ${data.color} text-white shrink-0`}><CheckCircle size={18}/></div><div><h4 className="font-bold text-slate-900">{feat.t}</h4><p className="text-sm text-slate-500">{feat.d}</p></div></div>))}</div>
         </div>
      </section>

      <section id="contact-module" className="py-24 bg-slate-900 text-white text-center px-6">
          <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-4xl font-bold mb-6">Bu Modülü Projenize Ekleyin</h2>
              <p className="text-slate-400 mb-10 text-lg">Turp ekosistemi modülerdir. Sadece ihtiyacınız olanı kullanın, maliyetleri optimize edin.</p>
              <button onClick={() => setView('home')} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">İletişime Geçin</button>
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
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
           <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 blur-sm scale-105 animate-pulse-slow" />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-50"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-2xl tracking-wide uppercase"><ShieldCheck size={14}/> USBS Onaylı & e-Nabız Entegreli</div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight"><span className="text-white">Tahminleri Değil,</span> <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">Gerçekleri Yönetin.</span></h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-rose-600 text-white font-bold rounded-xl shadow-xl hover:bg-rose-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">Demo Talep Et <ArrowRight size={18}/></button>
            <button onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all">Platformu Keşfet</button>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-slate-100"><div className="max-w-7xl mx-auto px-6 text-center"><p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">GÜVENİLEN PARTNERLERİMİZ</p><div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"><span className="text-2xl font-heading font-bold text-slate-800">PharmaCo</span><span className="text-2xl font-heading font-bold text-slate-800">NovusBio</span><span className="text-2xl font-heading font-bold text-slate-800">MED-DATA</span><span className="text-2xl font-heading font-bold text-slate-800">GenHealth</span></div></div></section>

      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"><div className="absolute top-0 right-0 bg-red-100 text-red-600 px-4 py-1 rounded-bl-2xl text-xs font-bold">Geleneksel</div><ul className="space-y-4 mt-4"><li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Hasta beyanına dayalı, doğrulanmamış veri.</span></li><li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Kağıt formlar ve manuel giriş hataları.</span></li><li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Yüksek "Drop-out" oranları.</span></li></ul></div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden transform md:scale-105 z-10"><div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold">Turp Yöntemi</div><ul className="space-y-4 mt-4"><li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0"/> <span className="text-white font-medium">e-Nabız ile %100 dijital doğrulama.</span></li><li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0"/> <span className="text-white font-medium">Anlık veri akışı ve otomatik raporlama.</span></li><li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0"/> <span className="text-white font-medium">Akıllı bildirimlerle yüksek hasta uyumu.</span></li></ul></div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="mb-16"><h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Teknoloji ile Güçlendirilmiş Çözümler</h2><p className="text-lg text-slate-500">Detaylı bilgi için modüllere tıklayın.</p></div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {Object.entries(MODULE_CONTENT).map(([key, val], i) => {
                const isBig = i === 0 || i === 6; 
                const colors = isBig ? 'md:col-span-2 bg-gradient-to-br from-rose-600 to-purple-700 text-white' : 'bg-white border border-slate-200 text-slate-900 shadow-lg hover:border-rose-400';
                return (
                    <div key={key} onClick={() => setView({ type: 'module', id: key })} className={`cursor-pointer ${colors} rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                        <div className="relative z-10">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isBig ? 'bg-white/20 backdrop-blur' : 'bg-green-100 text-green-600'}`}>
                                {React.createElement(val.icon, { size: 24 })}
                           </div>
                           <h3 className="text-2xl font-heading font-bold mb-3">{val.title}</h3>
                           <p className={`text-lg ${isBig ? 'text-rose-100' : 'text-slate-500'}`}>{val.short}</p>
                        </div>
                        {isBig && <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>}
                        <ArrowRight className={`absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity ${isBig ? 'text-white' : 'text-slate-900'}`}/>
                    </div>
                )
            })}
         </div>
      </section>

      <section className="py-24 bg-white border-y border-slate-100"><div className="max-w-7xl mx-auto px-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">{[{step:"01", title:"Kurulum", desc:"Sponsor paneli entegrasyonu."}, {step:"02", title:"Davet", desc:"Hastalara mobil uygulama linki."}, {step:"03", title:"Onay", desc:"Hasta e-Nabız onayı verir."}, {step:"04", title:"Akış", desc:"Gerçek zamanlı veri akışı başlar."}].map((s,i)=>(<div key={i}><div className="w-20 h-20 mx-auto bg-slate-50 border-4 border-white rounded-full flex items-center justify-center text-xl font-bold text-rose-600 mb-4 shadow-sm">{s.step}</div><h3 className="font-bold text-slate-900">{s.title}</h3><p className="text-xs text-slate-500 px-4">{s.desc}</p></div>))}</div></div></section>

      <section className="py-20 bg-rose-600 text-white"><div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">{[{val:"%45", label:"Daha Hızlı Hasta Alımı"}, {val:"%99.8", label:"Veri Doğruluğu"}, {val:"%30", label:"Maliyet Tasarrufu"}, {val:"7/24", label:"Gerçek Zamanlı İzleme"}].map((s,i)=>(<div key={i}><div className="text-4xl md:text-5xl font-heading font-extrabold mb-2">{s.val}</div><div className="text-rose-200 text-sm font-medium uppercase tracking-wide">{s.label}</div></div>))}</div></section>

      <section id="contact" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div><h2 className="font-heading text-3xl font-bold text-slate-900 mb-8">Sıkça Sorulan Sorular</h2><div className="space-y-2"><FAQItem question="e-Nabız verisi için hasta onayı gerekiyor mu?" answer="Evet, KVKK gereği hastanın mobil uygulama üzerinden açık rıza vermesi ve e-Nabız şifresiyle onaylaması zorunludur." /><FAQItem question="Mevcut EDC sistemimizle entegre olur mu?" answer="Turp, modern REST API altyapısı sayesinde mevcut Electronic Data Capture (EDC) sistemlerinizle sorunsuz haberleşir." /><FAQItem question="Hangi verileri çekebiliyoruz?" answer="Hastanın tanıları, reçeteli ilaç geçmişi, radyoloji raporları ve tahlil sonuçları çekilebilir." /></div></div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
                {contactStatus === 'success' ? (<div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} /></div><h3 className="font-heading text-3xl font-bold text-slate-900 mb-2">Başvurunuz Alındı!</h3><p className="text-slate-500 mb-8">Uzman ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecektir.</p><button onClick={() => setContactStatus('idle')} className="text-rose-600 font-bold hover:underline">Yeni bir talep oluştur</button></div>) : (<><h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Araştırmanızı Başlatın</h3><p className="text-slate-500 mb-8 text-sm">Uzman ekibimiz size özel bir demo hazırlasın.</p><form className="space-y-4" onSubmit={handleContactSubmit}><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Adınız" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" value={contactForm.ad_soyad} onChange={e=>setContactForm({...contactForm, ad_soyad: e.target.value})} required/><input type="text" placeholder="Şirket" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" value={contactForm.sirket} onChange={e=>setContactForm({...contactForm, sirket: e.target.value})}/></div><input type="email" placeholder="Kurumsal E-posta" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" value={contactForm.email} onChange={e=>setContactForm({...contactForm, email: e.target.value})} required/><select className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all ${contactForm.ilgi_alani===""?"text-slate-400":"text-slate-900"}`} value={contactForm.ilgi_alani} onChange={e=>setContactForm({...contactForm, ilgi_alani: e.target.value})} required><option value="" disabled>İlgilendiğiniz Alanı Seçiniz</option><option value="RWE / Gözlemsel Çalışma">RWE / Gözlemsel Çalışma</option><option value="Faz Çalışması (III/IV)">Faz Çalışması (III/IV)</option><option value="Medikal Cihaz Takibi">Medikal Cihaz Takibi</option></select><button disabled={contactStatus === 'loading'} type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg flex items-center justify-center gap-2">{contactStatus === 'loading' ? <Loader2 className="animate-spin"/> : <>Gönder <Send size={18}/></>}</button></form></>)}
            </div>
        </div>
      </section>
    </div>
  );
};

// --- BİLEŞEN: LOGIN (GİRİŞ) ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState({ type: '', text: '' });
  const handleLogin = async (e) => { e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' }); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { setMessage({ type: 'error', text: 'Giriş başarısız: ' + error.message }); } setLoading(false); };
  const handleResetPassword = async (e) => { e.preventDefault(); setLoading(true); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); if (error) { setMessage({ type: 'error', text: error.message }); } else { setMessage({ type: 'success', text: 'Şifre sıfırlama gönderildi.' }); } setLoading(false); };
  return ( <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20"> <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md animate-in fade-in zoom-in duration-500"> <div className="text-center mb-8"> <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"><Lock size={24} /></div> <h2 className="font-heading text-3xl font-bold text-slate-900">{mode === 'login' ? 'Yönetici Girişi' : 'Şifre Sıfırlama'}</h2> </div> {message.text && <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message.text}</div>} <form onSubmit={mode === 'login' ? handleLogin : handleResetPassword} className="space-y-5"> <div> <label className="block text-xs font-bold text-slate-500 uppercase mb-2">E-posta</label> <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="email" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={email} onChange={(e) => setEmail(e.target.value)} required/></div> </div> {mode === 'login' && ( <div> <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Şifre</label> <div className="relative"><Key className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="password" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={password} onChange={(e) => setPassword(e.target.value)} required/></div> </div> )} <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Bağlantı Gönder')}</button> </form> <div className="mt-6 text-center"><button onClick={() => {setMode(mode === 'login' ? 'reset' : 'login'); setMessage({type:'',text:''});}} className="text-sm text-slate-500 hover:text-rose-600 font-medium">{mode === 'login' ? 'Şifremi Unuttum' : 'Giriş Ekranına Dön'}</button></div> </div> </div> );
};

// --- BİLEŞEN: POST DETAY (OPTİMİZE RESİMLİ) ---
const PostDetail = ({ post, setView, onEdit }) => { if (!post) return null; return ( <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500"> <div className="flex justify-between items-center mb-8"> <button onClick={() => setView('blog')} className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-heading font-semibold"><ArrowRight size={18} className="rotate-180" /> Listeye Dön</button> <button onClick={() => onEdit(post)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"><Edit3 size={16}/> Düzenle</button> </div> <article className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"> {post.image_url ? (<div className="h-[400px] w-full relative"><OptimizedImage src={post.image_url} alt={post.title} width={1200} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div></div>) : (<div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300"><ImageIcon size={48}/></div>)} <div className="p-8 md:p-12"> <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider"><Calendar size={16} />{new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</div> <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">{post.title}</h1> <div className="blog-content text-lg text-slate-600 leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div> </div> </article> </div> ); };

// --- BİLEŞEN: BLOG LİSTESİ (OPTİMİZE RESİMLİ) ---
const Blog = ({ setView }) => { const { t } = useTranslation(); const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { const fetchPosts = async () => { const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); setPosts(data || []); setLoading(false); }; fetchPosts(); }, []); return ( <div className="max-w-7xl mx-auto px-6 py-20"> <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-16 text-center">{t("nav_blog")}</h2> {loading ? <div className="text-center"><Loader2 className="animate-spin inline text-rose-600"/></div> : ( <div className="grid md:grid-cols-3 gap-8"> {posts.length === 0 && <div className="col-span-3 text-center py-20 text-slate-500">Henüz yazı yok.</div>} {posts.map(post => ( <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"> <div className="h-56 bg-slate-100 relative overflow-hidden">{post.image_url ? <OptimizedImage src={post.image_url} width={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}</div> <div className="p-8"><h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors">{post.title}</h3><div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform">Devamını Oku <ArrowRight size={16} className="text-rose-600"/></div></div> </div> ))} </div> )} </div> ); };

// --- BİLEŞEN: ADMIN (YÖNETİM) ---
const Admin = ({ editingPost, setEditingPost, setView, handleLogout }) => { const [form, setForm] = useState({ title: '', content: '' }); const [image, setImage] = useState(null); const [uploading, setUploading] = useState(false); useEffect(() => { if (editingPost) { setForm({ title: editingPost.title, content: editingPost.content }); } else { setForm({ title: '', content: '' }); } }, [editingPost]); const handleSubmit = async (e) => { e.preventDefault(); setUploading(true); try { let url = editingPost ? editingPost.image_url : null; if (image) { const fileExt = image.name.split('.').pop(); const fileName = `${Date.now()}.${fileExt}`; const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image); if (uploadError) throw new Error("Resim Yüklenemedi: " + uploadError.message); const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName); url = data.publicUrl; } if (editingPost) { await supabase.from('posts').update({ title: form.title, content: form.content, image_url: url }).eq('id', editingPost.id); alert("Yazı güncellendi!"); setEditingPost(null); setView('blog'); } else { await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]); alert("Yazı eklendi!"); setForm({ title: '', content: '' }); setImage(null); } } catch (err) { alert("Hata: " + err.message); } setUploading(false); }; return ( <div className="max-w-3xl mx-auto px-6 py-20"> <div className="flex justify-between items-center mb-8"> <h2 className="font-heading text-3xl font-bold text-slate-900">Yönetim Paneli</h2> <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut size={16}/> Çıkış Yap</button> </div> <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200"> <div className="flex justify-between items-center mb-10"> <div><h2 className="font-heading text-2xl font-bold text-slate-900">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2><p className="text-slate-500">Markdown formatında içerik girebilirsiniz.</p></div> {editingPost && <button onClick={() => {setEditingPost(null); setForm({title:'',content:''});}} className="text-sm text-rose-600 font-bold hover:underline">İptal Et</button>} </div> <form onSubmit={handleSubmit} className="space-y-8"> <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Başlık</label><input className="w-full p-4 border-2 border-slate-200 rounded-xl font-heading font-bold text-lg outline-none focus:border-rose-500" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div> <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">İçerik (Markdown)</label><textarea className="w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm min-h-[300px] outline-none focus:border-rose-500" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required /></div> <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Görsel</label><input type="file" onChange={e=>setImage(e.target.files[0])} className="block w-full text-sm text-slate-500"/></div> <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{uploading ? 'İşleniyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}</button> </form> </div> </div> ); };

// --- ANA UYGULAMA ---
export default function App() {
  const [view, setView] = useState('home');
  const [editingPost, setEditingPost] = useState(null);
  const [session, setSession] = useState(null);
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const [isScrolled, setIsScrolled] = useState(false);
  const modules = MODULE_CONTENT; // Artık çeviri fonksiyonuna ihtiyaç yok, direkt obje

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
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group" onClick={()=>setView('home')}><div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform"><Activity size={22}/></div><span className="tracking-tight text-slate-900">Turp</span></div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_home")}</button>
              <div className="relative group h-full flex items-center">
                 <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">Modüller <ChevronDown size={14}/></button>
                 <div className="absolute top-full left-0 w-64 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {Object.entries(modules).map(([key, val]) => (
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
