// @ts-nocheck
import React, { useEffect } from 'react';
import { 
  ArrowLeft, History, Microscope, Award, Stethoscope, Activity, 
  Cpu, Signal, Database, Dna, ExternalLink 
} from 'lucide-react';

export const About = ({ setView }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                <ArrowLeft size={20}/> Ana Sayfaya Dön
            </button>
        </div>
      </div>

      {/* HERO */}
      <section className="relative pt-20 pb-32 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/doctor-and-patient-looking-at-x-ray-and-hand-in-do-2025-10-17-01-13-49-utc.jpg" className="w-full h-full object-cover" alt="Lab" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
                <History size={14} className="text-rose-500"/> 1997'den Beri
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                Türkiye'nin İlk CRO'su Olarak,<br/> <span className="text-rose-500">Geleceğin Kanıtını İnşa Ediyoruz.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Omega Araştırma deneyimiyle doğan Turp; yazılımı amaç olarak değil, bilimsel hakikate ulaşmak için bir araç olarak kullanır.
            </p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">Yazılım Odaklı Değil, <br/><span className="text-rose-600">Gönüllü Odaklıyız.</span></h2>
                <p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium border-l-4 border-slate-900 pl-4">"Kaliteli veri toplamak, kanıt düzeyini güçlendirir."</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                    Pek çok teknoloji firması klinik araştırmayı "öğrenmeye" çalışırken; biz <strong>1997'den beri</strong> bu süreçleri planlayan, yöneten ve dönüştüren ekibiz. Dijitalleşme ve IoT, <strong>ICH-GCP</strong> standartlarında veri toplamak için birer araçtır.
                </p>
            </div>
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-[2rem] opacity-20 blur-xl"></div>
                <img src="https://images.unsplash.com/photo-1579165466741-7f35e4755652?q=80&w=1000" className="relative rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 grayscale hover:grayscale-0" alt="Research Team" />
            </div>
        </div>
      </section>

      {/* EKOSİSTEM (GÜNCELLENEN BÖLÜM) */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="font-heading text-3xl font-bold text-slate-900">Gücümüzü Aldığımız Ekosistem</h2>
                <p className="text-slate-500 mt-4">Klinik araştırmanın her adımında, uçtan uca uzmanlık.</p>
            </div>
            
            {/* 4'lü Grid Yapısı: CRO, Care, Genetik, Turp */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* 1. OMEGA CRO (LİNK EKLENDİ) */}
                <a href="https://omega-cro.com.tr" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all group border border-slate-100 relative block">
                    <ExternalLink size={16} className="absolute top-6 right-6 text-slate-300 group-hover:text-rose-600 transition-colors"/>
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Award size={32} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega CRO</h3>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">Stratejik Akıl • 1997</p>
                    <p className="text-slate-600 text-sm leading-relaxed">Protokol tasarımı, etik kurul ve regülasyon yönetimi. Türkiye'nin ilk CRO'su olarak projenin yasal ve bilimsel omurgasını kuruyoruz.</p>
                </a>

                {/* 2. OMEGA CARE (LİNK EKLENDİ) */}
                <a href="https://omegacare.com.tr" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all group border border-slate-100 relative block">
                    <ExternalLink size={16} className="absolute top-6 right-6 text-slate-300 group-hover:text-rose-600 transition-colors"/>
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Stethoscope size={32} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega Care</h3>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">Saha Gücü • Evde Sağlık</p>
                    <p className="text-slate-600 text-sm leading-relaxed">Araştırma hemşireleri ile hastayı evinde ziyaret eden, numune alan ve ilacı uygulayan operasyonel güç.</p>
                </a>

                {/* 3. OMEGA GENETİK (YENİ EKLENDİ) */}
                <a href="https://omegagenetik.com" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all group border border-slate-100 relative block">
                    <ExternalLink size={16} className="absolute top-6 right-6 text-slate-300 group-hover:text-rose-600 transition-colors"/>
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Dna size={32} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega Genetik</h3>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">Laboratuvar • Ar-Ge</p>
                    <p className="text-slate-600 text-sm leading-relaxed">Kişiselleştirilmiş tıp, sitogenetik, moleküler ve farmakogenetik analizler ve biyobelirteç takibi ile tedavinin genetik altyapısını çözümlüyoruz.</p>
                </a>

                {/* 4. TURP (DIGITAL BRIDGE) */}
                <div className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600 rounded-full blur-3xl opacity-20"></div>
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-white relative z-10">
                            <Activity size={32} />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-white mb-2 relative z-10">Turp</h3>
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-4 relative z-10">Dijital Köprü</p>
                        <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                            Veriyi, hastayı ve araştırmacıyı birbirine bağlayan dijital platform. e-Nabız entegrasyonu ve yapay zeka destekli analiz.
                        </p>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* METODOLOJİ & CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-10">Metodolojimiz: Veriden Sinyale</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{i:Microscope, t:"ICH-GCP", d:"Uluslararası Standart"},{i:Cpu, t:"Data Science", d:"Gelişmiş Veri Analitiği"},{i:Signal, t:"Sinyal Üretme", d:"Anlık Klinik Uyarılar"},{i:Database, t:"RWE", d:"Gerçek Yaşam Verisi"}].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                    <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-4">{React.createElement(item.i, {size:24})}</div>
                    <h4 className="font-bold text-slate-900">{item.t}</h4>
                    <p className="text-xs text-slate-500">{item.d}</p>
                </div>
            ))}
        </div>
      </section>
      
      <section className="py-20 bg-slate-900 text-center px-6">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-6">Projelerinizde Deneyimin Gücünü Kullanın</h2>
            <button onClick={() => {
                setView('home');
                setTimeout(() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'}), 100);
            }} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
                Bize Ulaşın
            </button>
        </div>
      </section>
    </div>
  );
};
