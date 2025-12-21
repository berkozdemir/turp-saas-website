import React, { useEffect } from 'react';
import {
   ArrowLeft, Activity, Clock, Smartphone, ClipboardList,
   Cpu, Stethoscope, FileBarChart
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

// Özel Brain İkonu (Lucide'da bazen olmayabiliyor veya özel tasarım istenmişti)
const Brain = ({ size }: { size: number }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
   </svg>
);

export const RheumaCaseStudy = ({ setView }: { setView: any }) => {
   const { t } = useTranslation();
   useEffect(() => { window.scrollTo(0, 0); }, []);

   return (
      <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
               <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                  <ArrowLeft size={20} /> {t("case_rheuma.back_home")}
               </button>
            </div>
         </div>

         {/* Hero */}
         <section className="relative py-32 px-6 bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20">
               <img src="/uploads/doctor-and-patient-looking-at-x-ray-and-hand-in-do-2025-10-17-01-13-49-utc.jpg" className="w-full h-full object-cover" alt="Rheumatology" />
            </div>
            <div className="max-w-5xl mx-auto relative z-10 text-center">
               <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider shadow-lg">
                  <Activity size={14} /> {t("case_rheuma.badge")}
               </div>
               <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-8 leading-tight">{t("case_rheuma.title")}</h1>
               <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  {t("case_rheuma.desc")}
               </p>
            </div>
         </section>

         {/* Sorun / Çözüm */}
         <section className="py-24 px-6 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">{t("case_rheuma.problem_title")}</h2>
                  <ul className="space-y-6">
                     <li className="flex gap-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0"><Clock size={20} /></div>
                        <div><h4 className="font-bold text-slate-900">{t("case_rheuma.problem_1_t")}</h4><p className="text-slate-600 text-sm">{t("case_rheuma.problem_1_d")}</p></div>
                     </li>
                     <li className="flex gap-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0"><Brain size={20} /></div>
                        <div><h4 className="font-bold text-slate-900">{t("case_rheuma.problem_2_t")}</h4><p className="text-slate-600 text-sm">{t("case_rheuma.problem_2_d")}</p></div>
                     </li>
                  </ul>
               </div>
               <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 bg-blue-600 px-4 py-1 rounded-bl-xl font-bold text-xs">{t("case_rheuma.solution_badge")}</div>
                  <h3 className="font-heading text-2xl font-bold mb-6">{t("case_rheuma.solution_title")}</h3>
                  <p className="text-slate-400 mb-8">{t("case_rheuma.solution_desc")}</p>
                  <div className="flex items-center gap-4">
                     <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-3/4"></div></div>
                     <span className="text-sm font-bold text-green-400">{t("case_rheuma.solution_metric")}</span>
                  </div>
               </div>
            </div>
         </section>

         {/* Akış Diyagramı (İnfografik) */}
         <section className="py-24 bg-slate-50 px-6 border-y border-slate-200">
            <div className="max-w-7xl mx-auto">
               <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-16">{t("case_rheuma.flow_title")}</h2>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {/* Bağlantı Çizgisi (Desktop) */}
                  <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-1 bg-slate-200 -z-0"></div>

                  {[
                     { icon: Smartphone, title: t("case_rheuma.flow_1_t"), desc: t("case_rheuma.flow_1_d") },
                     { icon: ClipboardList, title: t("case_rheuma.flow_2_t"), desc: t("case_rheuma.flow_2_d") },
                     { icon: Cpu, title: t("case_rheuma.flow_3_t"), desc: t("case_rheuma.flow_3_d") },
                     { icon: Stethoscope, title: t("case_rheuma.flow_4_t"), desc: t("case_rheuma.flow_4_d") }
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
            <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-12">{t("case_rheuma.stats_title")}</h2>
            <div className="grid md:grid-cols-2 gap-12">
               {/* Grafik 1: Süre */}
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                  <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><Clock size={20} /> {t("case_rheuma.stat_time_title")}</h4>
                  <div className="space-y-6">
                     <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>{t("case_rheuma.stat_time_trad")}</span><span>{t("case_rheuma.stat_time_trad_input")}</span></div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                           <div className="h-full bg-red-400 w-[75%]"></div>
                           <div className="h-full bg-slate-300 w-[25%]"></div>
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold text-slate-900 mb-2"><span>{t("case_rheuma.stat_time_turp")}</span><span className="text-green-600">{t("case_rheuma.stat_time_turp_input")}</span></div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                           <div className="h-full bg-green-500 w-[35%]"></div>
                        </div>
                     </div>
                  </div>
                  <p className="mt-6 text-sm text-slate-500">{t("case_rheuma.stat_time_desc")}</p>
               </div>

               {/* Grafik 2: Veri Kalitesi */}
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                  <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><FileBarChart size={20} /> {t("case_rheuma.stat_data_title")}</h4>
                  <div className="flex items-end gap-4 h-32">
                     <div className="w-1/2 bg-slate-100 rounded-t-xl relative group h-[70%]">
                        <div className="absolute bottom-2 w-full text-center text-xs font-bold text-slate-500">{t("case_rheuma.stat_data_paper")}</div>
                     </div>
                     <div className="w-1/2 bg-green-100 rounded-t-xl relative group h-[98%]">
                        <div className="absolute bottom-2 w-full text-center text-xs font-bold text-green-700">{t("case_rheuma.stat_data_turp")}</div>
                     </div>
                  </div>
                  <p className="mt-6 text-sm text-slate-500">{t("case_rheuma.stat_data_desc")}</p>
               </div>
            </div>
         </section>

         <section className="py-20 bg-slate-900 text-center px-6">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">{t("case_rheuma.cta_title")}</h2>
            <button onClick={() => setView('roi')} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
               {t("case_rheuma.cta_btn")}
            </button>
         </section>
      </div>
   );
};