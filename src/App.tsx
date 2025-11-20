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

if (!supabaseUrl || !supabaseKey) {
  console.error("Ortam Değişkenleri Tanımlı Değil! Lütfen Vercel'e ekleyin.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

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

// --- BİLEŞEN: HOME (ANA SAYFA) ---
const Home = ({ setView }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* 1. HERO SECTION */}
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
        <div className="max-w-7xl mx-auto px-6">
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
                        <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Kağıt formlar ve manuel veri girişi hataları.</span></li>
                        <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0"/> <span>Yüksek "Drop-out" (Hasta kaybı) oranları.</span></li>
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

      {/* 4. BENTO GRID */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="mb-16">
             <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Teknoloji ile Güçlendirilmiş Çözümler</h2>
             <p className="text-lg text-slate-500">Araştırmanızın her aşaması için özel modüller.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div className="md:col-span-2 bg-gradient-to-br from-rose-600 to-purple-700 rounded-3xl p-10 text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6"><Database size={24}/></div>
                    <h3 className="text-3xl font-heading font-bold mb-4">e-Nabız Entegrasyonu</h3>
                    <p className="text-rose-100 text-lg max-w-md">Hastanın kullandığı diğer ilaçları (concomitant) ve geçmiş tanılarını tek tıkla, resmi kaynaklardan doğrulayın.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><Smartphone size={24}/></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Akıllı İlaç Takibi</h3>
                <p className="text-slate-500">Hastanız ilacını içti mi? Uygulama içi hatırlatıcı ve görsel teyit sistemi ile emin olun.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Globe size={24}/></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Saha Dışı (Remote)</h3>
                <p className="text-slate-500">Hastane vizitlerine sıkışıp kalmayın. Hastanın evinden gerçek yaşam verisi toplayın.</p>
            </div>
            <div className="md:col-span-2 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="flex-1 relative z-10">
                     <div className="flex gap-3 mb-4">
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">KVKK</span>
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">GDPR</span>
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">ISO 27001</span>
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-2">Global Uyumluluk Standartları</h3>
                     <p className="text-slate-400">Verileriniz banka düzeyinde şifreleme ile korunur ve Türkiye sunucularında saklanır.</p>
                </div>
                <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 z-10"><ShieldCheck size={40} className="text-white"/></div>
            </div>
         </div>
      </section>

      {/* 5. WORKFLOW */}
      <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16"><h2 className="font-heading text-3xl font-bold text-slate-900">Süreç Nasıl İşler?</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                {[
                    {step:"01", title:"Kurulum", desc:"Sponsor paneli entegrasyonu yapılır."},
                    {step:"02", title:"Davet", desc:"Hastalara mobil uygulama linki SMS ile gider."},
                    {step:"03", title:"Onay", desc:"Hasta e-Nabız üzerinden veri paylaşımını onaylar."},
                    {step:"04", title:"Akış", desc:"Gerçek zamanlı veri akışı ve analiz başlar."}
                ].map((s,i)=>(
                    <div key={i} className="text-center bg-white">
                        <div className="w-24 h-24 mx-auto bg-slate-50 border-4 border-white rounded-full flex items-center justify-center text-2xl font-bold text-slate-300 mb-6 shadow-sm shadow-slate-200 relative z-10"><span className="text-rose-600">{s.step}</span></div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                        <p className="text-sm text-slate-500 px-4">{s.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* 6. STATS */}
      <section className="py-20 bg-rose-600 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                  {val:"%45", label:"Daha Hızlı Hasta Alımı"}, {val:"%99.8", label:"Veri Doğruluğu"},
                  {val:"%30", label:"Maliyet Tasarrufu"}, {val:"7/24", label:"Gerçek Zamanlı İzleme"}
              ].map((s,i)=>(
                  <div key={i}><div className="text-4xl md:text-5xl font-heading font-extrabold mb-2">{s.val}</div><div className="text-rose-200 text-sm font-medium uppercase tracking-wide">{s.label}</div></div>
              ))}
          </div>
      </section>

      {/* 7. FAQ & CONTACT */}
      <section id="contact" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
                <h2 className="font-heading text-3xl font-bold text-slate-900 mb-8">Sıkça Sorulan Sorular</h2>
                <div className="space-y-2">
                    <FAQItem question="e-Nabız verisi için hasta onayı gerekiyor mu?" answer="Evet, KVKK gereği hastanın mobil uygulama üzerinden açık rıza vermesi ve e-Nabız şifresiyle onaylaması zorunludur." />
                    <FAQItem question="Mevcut EDC sistemimizle entegre olur mu?" answer="Turp, modern REST API altyapısı sayesinde mevcut Electronic Data Capture (EDC) sistemlerinizle sorunsuz haberleşir." />
                    <FAQItem question="Hangi verileri çekebiliyoruz?" answer="Hastanın tanıları, reçeteli ilaç geçmişi, radyoloji raporları ve tahlil sonuçları (hasta iznine bağlı olarak) çekilebilir." />
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Araştırmanızı Başlatın</h3>
                <p className="text-slate-500 mb-8 text-sm">Uzman ekibimiz size özel bir demo hazırlasın.</p>
                <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); alert("Talebiniz alındı! En kısa sürede dönüş yapacağız.");}}>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Adınız" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" required/>
                        <input type="text" placeholder="Soyadınız" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" required/>
                    </div>
                    <input type="email" placeholder="Kurumsal E-posta Adresiniz" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all" required/>
                    <input type="text" placeholder="Şirket / Kurum Adı" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all"/>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all text-slate-500">
                        <option>İlgilendiğiniz Alan</option><option>RWE / Gözlemsel Çalışma</option><option>Faz Çalışması (III/IV)</option><option>Medikal Cihaz Takibi</option>
                    </select>
                    <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg">Gönder</button>
                </form>
            </div>
        </div>
      </section>
    </div>
  );
};

// --- BİLEŞEN: LOGIN (Giriş Yap) ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage({ type: 'error', text: 'Giriş başarısız: ' + error.message }); } 
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) { setMessage({ type: 'error', text: error.message }); } 
    else { setMessage({ type: 'success', text: 'Şifre sıfırlama bağlantısı gönderildi.' }); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"><Lock size={24} /></div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">{mode === 'login' ? 'Yönetici Girişi' : 'Şifre Sıfırlama'}</h2>
        </div>
        {message.text && <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message.text}</div>}
        <form onSubmit={mode === 'login' ? handleLogin : handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">E-posta</label>
            <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="email" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
          </div>
          {mode === 'login' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Şifre</label>
              <div className="relative"><Key className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="password" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={password} onChange={(e) => setPassword(e.target.value)} required/></div>
            </div>
          )}
          <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Bağlantı Gönder')}</button>
        </form>
        <div className="mt-6 text-center"><button onClick={() => {setMode(mode === 'login' ? 'reset' : 'login'); setMessage({type:'',text:''});}} className="text-sm text-slate-500 hover:text-rose-600 font-medium">{mode === 'login' ? 'Şifremi Unuttum' : 'Giriş Ekranına Dön'}</button></div>
      </div>
    </div>
  );
};

// --- BİLEŞEN: POST DETAY ---
const PostDetail = ({ post, setView, onEdit }) => {
  if (!post) return null;
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setView('blog')} className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-heading font-semibold"><ArrowRight size={18} className="rotate-180" /> Listeye Dön</button>
        <button onClick={() => onEdit(post)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"><Edit3 size={16}/> Düzenle</button>
      </div>
      <article className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {post.image_url ? (<div className="h-[400px] w-full relative"><img src={post.image_url} alt={post.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div></div>) : (<div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300"><ImageIcon size={48}/></div>)}
        <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider"><Calendar size={16} />{new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">{post.title}</h1>
            <div className="blog-content text-lg text-slate-600 leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>
        </div>
      </article>
    </div>
  );
};

// --- BİLEŞEN: BLOG LİSTESİ ---
const Blog = ({ setView }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => { const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); setPosts(data || []); setLoading(false); }; fetchPosts();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-16 text-center">{t("nav_blog")}</h2>
      {loading ? <div className="text-center"><Loader2 className="animate-spin inline text-rose-600"/></div> : (
        <div className="grid md:grid-cols-3 gap-8">
          {posts.length === 0 && <div className="col-span-3 text-center py-20 text-slate-500">Henüz yazı yok.</div>}
          {posts.map(post => (
            <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="h-56 bg-slate-100 relative overflow-hidden">{post.image_url ? <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}</div>
              <div className="p-8"><h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors">{post.title}</h3><div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform">Devamını Oku <ArrowRight size={16} className="text-rose-600"/></div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- BİLEŞEN: ADMIN (YÖNETİM) ---
const Admin = ({ editingPost, setEditingPost, setView, handleLogout }) => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingPost) { setForm({ title: editingPost.title, content: editingPost.content }); } 
    else { setForm({ title: '', content: '' }); }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      let url = editingPost ? editingPost.image_url : null;
      if (image) {
        // Resim yükleme (Güvenli Dosya Adı)
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image);
        if (uploadError) throw new Error("Resim Yüklenemedi: " + uploadError.message);
        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        url = data.publicUrl;
      }
      if (editingPost) {
        await supabase.from('posts').update({ title: form.title, content: form.content, image_url: url }).eq('id', editingPost.id);
        alert("Yazı güncellendi!"); setEditingPost(null); setView('blog');
      } else {
        await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]);
        alert("Yazı eklendi!"); setForm({ title: '', content: '' }); setImage(null);
      }
    } catch (err) { alert("Hata: " + err.message); }
    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8">
         <h2 className="font-heading text-3xl font-bold text-slate-900">Yönetim Paneli</h2>
         <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut size={16}/> Çıkış Yap</button>
      </div>
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-10">
            <div><h2 className="font-heading text-2xl font-bold text-slate-900">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2><p className="text-slate-500">Markdown formatında içerik girebilirsiniz.</p></div>
            {editingPost && <button onClick={() => {setEditingPost(null); setForm({title:'',content:''});}} className="text-sm text-rose-600 font-bold hover:underline">İptal Et</button>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Başlık</label><input className="w-full p-4 border-2 border-slate-200 rounded-xl font-heading font-bold text-lg outline-none focus:border-rose-500" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">İçerik (Markdown)</label><textarea className="w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm min-h-[300px] outline-none focus:border-rose-500" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Görsel</label><div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors"><input type="file" onChange={e=>setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/><div className="flex flex-col items-center text-slate-400"><Upload size={24} className="mb-2"/><span className="text-sm font-medium">{image ? image.name : "Dosya seçmek için tıklayın"}</span></div></div></div>
          <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{uploading ? 'İşleniyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}</button>
        </form>
      </div>
    </div>
  );
};

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
    // Admin'e logout fonksiyonunu da gönderiyoruz
    if (view === 'admin') return session ? <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} handleLogout={handleLogout} /> : <Login />;
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
