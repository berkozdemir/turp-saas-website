import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Activity, Clock, Smartphone, ClipboardList, 
  Cpu, Stethoscope, FileBarChart 
} from 'lucide-react';

// Özel Brain İkonu (Lucide'da bazen olmayabiliyor veya özel tasarım istenmişti)
const Brain = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

export const RheumaCaseStudy = ({ setView }: { setView: any }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
           <div className="max-w-7xl mx-auto flex justify-between items-center">
               <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                   <ArrowLeft size={20}/> Ana Sayfaya Dön
               </button>
           </div>
       </div>
       
       {/* Hero */}
       <section className="relative py-32 px-6 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070" className="w-full h-full object-cover" alt="Rheumatology" />
          </div>
          <div className="max-w-5xl mx-auto relative z-10 text-center">
             <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider shadow-lg">
                 <Activity size={14}/> Romatoloji Hibrit Model
             </div>
             <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-8 leading-tight">Rheuma-Link Projesi</h1>
             <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                 Romatoid Artrit (RA) ve Ankilozan Spondilit (AS) hastalarında, hastane vizitlerini dijitalleştirerek hekim zamanından %35 tasarruf sağlayan hibrit izlem modeli.
             </p>
          </div>
       </section>

       {/* Sorun / Çözüm */}
       <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">Mevcut Sorun</h2>
                <ul className="space-y-6">
                   <li className="flex gap-4">
                       <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0"><Clock size={20}/></div>
                       <div><h4 className="font-bold text-slate-900">Kısıtlı Poliklinik Süresi</h4><p className="text-slate-600 text-sm">Hekimler, 15 dakikalık vizit süresinin büyük kısmını anket doldurmaya (HAQ, BASDAI) harcıyor.</p></div>
                   </li>
                   <li className="flex gap-4">
                       <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0"><Brain size={20}/></div>
                       <div><h4 className="font-bold text-slate-900">Recall Bias (Hatırlama Yanılgısı)</h4><p className="text-slate-600 text-sm">Hasta, doktora o anki durumunu anlatıyor; iki hafta önceki ağrısını hatırlayamıyor.</p></div>
                   </li>
                </ul>
             </div>
             <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 bg-blue-600 px-4 py-1 rounded-bl-xl font-bold text-xs">Turp Çözümü</div>
                <h3 className="font-heading text-2xl font-bold mb-6">Dijital Entegrasyon</h3>
                <p className="text-slate-400 mb-8">Hasta hastaneye gelmeden 48 saat önce tüm ölçekleri evinden doldurur. Hekim, hasta odaya girdiğinde veriyi hazır bulur.</p>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-3/4"></div></div>
                    <span className="text-sm font-bold text-green-400">%75 Daha Hızlı</span>
                </div>
             </div>
          </div>
       </section>

       {/* Akış Diyagramı (İnfografik) */}
       <section className="py-24 bg-slate-50 px-6 border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
             <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-16">Hibrit Vizit Akışı</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Bağlantı Çizgisi (Desktop) */}
                <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-1 bg-slate-200 -z-0"></div>
                
                {[
                    { icon: Smartphone, title: "1. Evde Başlangıç", desc: "T-48 Saat kala hastaya anket bildirimi gider." },
                    { icon: ClipboardList, title: "2. ePRO Veri Girişi", desc: "Hasta HAQ, BASDAI gibi ölçekleri evinde doldurur." },
                    { icon: Cpu, title: "3. Sinyal Analizi", desc: "Sistem skorları hesaplar, risk varsa hekimi uyarır." },
                    { icon: Stethoscope, title: "4. Odaklı Vizit", desc: "Hekim sadece fizik muayeneye odaklanır." }
                ].map((step, i) => (
                    <div key={i} className="relative z-10 text-center group">
                        <div className="w-20 h-20 mx-auto bg-white border-4 border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                            {React.createElement(step.icon, { size: 32 })}
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                        <p className="text-xs text-slate-500 px-4">{step.desc}</p>
                    </div>
                ))}
             </div>
          </div>
       </section>

       {/* Kazanımlar (Grafiksel) */}
       <section className="py-24 px-6 max-w-5xl mx-auto">
          <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-12">Ölçümlenen Değer</h2>
          <div className="grid md:grid-cols-2 gap-12">
             {/* Grafik 1: Süre */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><Clock size={20}/> Hekim Zaman Kullanımı</h4>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>Geleneksel (20 dk)</span><span>Veri Girişi: 15dk</span></div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                         <div className="h-full bg-red-400 w-[75%]"></div>
                         <div className="h-full bg-slate-300 w-[25%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-900 mb-2"><span>Turp Modeli (7 dk)</span><span className="text-green-600">Veri Girişi: 0dk</span></div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                         <div className="h-full bg-green-500 w-[35%]"></div>
                      </div>
                   </div>
                </div>
                <p className="mt-6 text-sm text-slate-500">Anket yükü kalktığı için vizit süresi %65 azalır.</p>
             </div>

             {/* Grafik 2: Veri Kalitesi */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><FileBarChart size={20}/> Veri Doğruluğu</h4>
                <div className="flex items-end gap-4 h-32">
                   <div className="w-1/2 bg-slate-100 rounded-t-xl relative group h-[70%]">
                      <div className="absolute bottom-2 w-full text-center text-xs font-bold text-slate-500">Kağıt (%70)</div>
                   </div>
                   <div className="w-1/2 bg-green-100 rounded-t-xl relative group h-[98%]">
                      <div className="absolute bottom-2 w-full text-center text-xs font-bold text-green-700">Turp (%98)</div>
                   </div>
                </div>
                <p className="mt-6 text-sm text-slate-500">Dijital validasyon sayesinde hatalı veri girişi engellenir.</p>
             </div>
          </div>
       </section>

       <section className="py-20 bg-slate-900 text-center px-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">Bu Modeli Çalışmanızda Uygulayın</h2>
          <button onClick={() => setView('roi')} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
              Maliyet Analizi Yap
          </button>
      </section>
    </div>
  );
};
