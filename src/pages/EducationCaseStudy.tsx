import React, { useEffect } from 'react';
import {
    ArrowLeft, BookOpen, Video, ShieldCheck,
    CheckCircle, Users, FileCheck, Library, Bell, Lock
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export const EducationCaseStudy = ({ setView }: { setView: any }) => {
    const { t } = useTranslation();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                        <ArrowLeft size={20} /> {t("case_edu.back_home")}
                    </button>
                </div>
            </div>

            {/* Hero */}
            <section className="relative py-32 px-6 bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="/uploads/chairs-on-empty-building-2025-01-27-22-50-08-utc.jpg" className="w-full h-full object-cover" alt="Education" />
                </div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider shadow-lg">
                        <ShieldCheck size={14} /> {t("case_edu.badge")}
                    </div>
                    <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-8 leading-tight">{t("case_edu.title")}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        {t("case_edu.desc")}
                    </p>
                </div>
            </section>

            {/* Sorun / Çözüm */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">{t("case_edu.problem_title")}</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0"><BookOpen size={20} /></div>
                                <div><h4 className="font-bold text-slate-900">{t("case_edu.problem_1_t")}</h4><p className="text-slate-600 text-sm">{t("case_edu.problem_1_d")}</p></div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0"><FileCheck size={20} /></div>
                                <div><h4 className="font-bold text-slate-900">{t("case_edu.problem_2_t")}</h4><p className="text-slate-600 text-sm">{t("case_edu.problem_2_d")}</p></div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 bg-sky-600 px-4 py-1 rounded-bl-xl font-bold text-xs">{t("case_edu.solution_badge")}</div>
                        <h3 className="font-heading text-2xl font-bold mb-6">{t("case_edu.solution_title")}</h3>
                        <p className="text-slate-400 mb-8">{t("case_edu.solution_desc")}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-full"></div></div>
                            <span className="text-sm font-bold text-green-400">{t("case_edu.solution_metric")}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Akış Diyagramı */}
            <section className="py-24 bg-slate-50 px-6 border-y border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-16">{t("case_edu.flow_title")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-1 bg-slate-200 -z-0"></div>

                        {[
                            { icon: Video, title: t("case_edu.flow_1_t"), desc: t("case_edu.flow_1_d") },
                            { icon: CheckCircle, title: t("case_edu.flow_2_t"), desc: t("case_edu.flow_2_d") },
                            { icon: FileCheck, title: t("case_edu.flow_3_t"), desc: t("case_edu.flow_3_d") },
                            { icon: Library, title: t("case_edu.flow_4_t"), desc: t("case_edu.flow_4_d") }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 text-center group">
                                <div className="w-20 h-20 mx-auto bg-white border-4 border-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    {React.createElement(step.icon, { size: 32 })}
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                                <p className="text-xs text-slate-500 px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nasıl Alacaklar? (Delivery Flow) */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Eğitim Nasıl Ulaştırılır?</h2>
                    <p className="text-slate-500">Süreç tamamen dijital ve otomatiktir.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-sky-50 rounded-3xl border border-sky-100">
                        <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Bell size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-3">1. Anlık Bildirim</h4>
                        <p className="text-sm text-slate-600">Hastaya SMS veya E-posta yoluyla "Size yeni bir eğitim atandı" bildirimi ve güvenli erişim linki gider.</p>
                    </div>
                    <div className="p-8 bg-sky-50 rounded-3xl border border-sky-100">
                        <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Lock size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-3">2. Güvenli Erişim</h4>
                        <p className="text-sm text-slate-600">Hasta şifresiz/magic link ile portalına giriş yapar. Sadece kendine atanan materyalleri görür.</p>
                    </div>
                    <div className="p-8 bg-sky-50 rounded-3xl border border-sky-100">
                        <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Video size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-3">3. İnteraktif İzleme</h4>
                        <p className="text-sm text-slate-600">Hasta videoları izlerken sistem ilerlemeyi kaydeder. Videoyu bitirmeden onam aşamasına geçemez.</p>
                    </div>
                </div>
            </section>

            {/* Kazanımlar */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-12">{t("case_edu.stats_title")}</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Grafik 1: Hasta Tutma */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><Users size={20} /> {t("case_edu.stat_retention_title")}</h4>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>{t("case_edu.stat_retention_trad")}</span></div>
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 w-[70%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-900 mb-2"><span>{t("case_edu.stat_retention_turp")}</span></div>
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-sky-500 w-[92%]"></div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-slate-500">{t("case_edu.stat_retention_desc")}</p>
                    </div>

                    {/* Grafik 2: Uyumluluk */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><ShieldCheck size={20} /> {t("case_edu.stat_compliance_title")}</h4>
                        <div className="flex items-end gap-4 h-32">
                            <div className="w-1/2 bg-slate-100 rounded-t-xl relative group h-[85%]">
                                <div className="absolute bottom-2 w-full text-center text-xs font-bold text-slate-500">{t("case_edu.stat_compliance_paper")}</div>
                            </div>
                            <div className="w-1/2 bg-sky-100 rounded-t-xl relative group h-[100%]">
                                <div className="absolute bottom-2 w-full text-center text-xs font-bold text-sky-700">{t("case_edu.stat_compliance_turp")}</div>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-slate-500">{t("case_edu.stat_compliance_desc")}</p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-900 text-center px-6">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">{t("case_edu.cta_title")}</h2>
                <button onClick={() => setView({ type: 'home', scrollTo: 'contact' })} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
                    {t("case_edu.cta_btn")}
                </button>
            </section>
        </div>
    );
};
