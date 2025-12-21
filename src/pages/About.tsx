// @ts-nocheck
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, History, Microscope, Activity,
    Cpu, Signal, Database, ExternalLink
} from 'lucide-react';

export const About = ({ setView }) => {
    const { t } = useTranslation();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                        <ArrowLeft size={20} /> {t("about.back_home")}
                    </button>
                </div>
            </div>

            {/* HERO */}
            <section className="relative pt-20 pb-32 px-6 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="/uploads/collage-of-diverse-multiethnic-people-faces-smilin-2025-03-18-18-55-30-utc.jpg" className="w-full h-full object-cover" alt="Lab" />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
                        <History size={14} className="text-rose-500" /> {t("about.since")}
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        {t("about.hero_title_1")}<br /> <span className="text-rose-500">{t("about.hero_title_2")}</span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        {t("about.hero_desc")}
                    </p>
                </div>
            </section>

            {/* MANIFESTO */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">{t("about.manifesto_head_1")} <br /><span className="text-rose-600">{t("about.manifesto_head_2")}</span></h2>
                        <p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium border-l-4 border-slate-900 pl-4">"{t("about.manifesto_quote")}"</p>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            {t("about.manifesto_text")}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-[2rem] opacity-20 blur-xl"></div>
                        <img src="/uploads/i-always-notice-a-persons-smile-2025-04-06-05-17-54-utc.jpg" className="relative rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 grayscale hover:grayscale-0" alt="Research Team" />
                    </div>
                </div>
            </section>

            {/* EKOSİSTEM (GÜNCELLENEN BÖLÜM) */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl font-bold text-slate-900">{t("about.eco_title")}</h2>
                        <p className="text-slate-500 mt-4">{t("about.eco_sub")}</p>
                    </div>

                    {/* 4'lü Grid Yapısı: CRO, Care, Genetik, Turp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                        {/* 1. OMEGA CRO (LİNK EKLENDİ) */}
                        <a href="https://omega-cro.com.tr" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all group border border-slate-100 relative block">
                            <ExternalLink size={16} className="absolute top-6 right-6 text-slate-300 group-hover:text-rose-600 transition-colors" />
                            <div className="h-12 mb-6 flex items-center">
                                <img src="/omega_logo.png" alt="Omega CRO" className="h-full w-auto object-contain" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega CRO</h3>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">{t("about.card_cro_sub")}</p>
                            <p className="text-slate-600 text-sm leading-relaxed">{t("about.card_cro_desc")}</p>
                        </a>

                        {/* 2. OMEGA CARE (LİNK EKLENDİ) */}
                        <a href="https://omegacare.com.tr" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all group border border-slate-100 relative block">
                            <ExternalLink size={16} className="absolute top-6 right-6 text-slate-300 group-hover:text-rose-600 transition-colors" />
                            <div className="h-12 mb-6 flex items-center">
                                <img src="/omega_care_logo.png" alt="Omega Care" className="h-full w-auto object-contain" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega Care</h3>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">{t("about.card_care_sub")}</p>
                            <p className="text-slate-600 text-sm leading-relaxed">{t("about.card_care_desc")}</p>
                        </a>

                        {/* 3. OMEGA GENETİK (YENİ EKLENDİ) */}
                        <a href="https://omegagenetik.com" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all group border border-slate-100 relative block">
                            <ExternalLink size={16} className="absolute top-6 right-6 text-slate-300 group-hover:text-rose-600 transition-colors" />
                            <div className="h-12 mb-6 flex items-center">
                                <img src="/omega_genetik_logo.png" alt="Omega Genetik" className="h-full w-auto object-contain" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega Genetik</h3>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">{t("about.card_gene_sub")}</p>
                            <p className="text-slate-600 text-sm leading-relaxed">{t("about.card_gene_desc")}</p>
                        </a>

                        {/* 4. TURP (DIGITAL BRIDGE) */}
                        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600 rounded-full blur-3xl opacity-20"></div>
                            <div>
                                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-white relative z-10">
                                    <Activity size={32} />
                                </div>
                                <h3 className="font-heading text-xl font-bold text-white mb-2 relative z-10">Turp</h3>
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-4 relative z-10">{t("about.card_turp_sub")}</p>
                                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                                    {t("about.card_turp_desc")}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* METODOLOJİ & CTA */}
            <section className="py-20 px-6 max-w-5xl mx-auto text-center">
                <h2 className="font-heading text-3xl font-bold text-slate-900 mb-10">{t("about.method_title")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[{ i: Microscope, t: t("about.method_1_t"), d: t("about.method_1_d") }, { i: Cpu, t: t("about.method_2_t"), d: t("about.method_2_d") }, { i: Signal, t: t("about.method_3_t"), d: t("about.method_3_d") }, { i: Database, t: t("about.method_4_t"), d: t("about.method_4_d") }].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center group">
                            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-4">{React.createElement(item.i, { size: 24 })}</div>
                            <h4 className="font-bold text-slate-900">{item.t}</h4>
                            <p className="text-xs text-slate-500">{item.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-slate-900 text-center px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-6">{t("about.cta_title")}</h2>
                    <button onClick={() => {
                        setView('home');
                        setTimeout(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }), 100);
                    }} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
                        {t("about.cta_btn")}
                    </button>
                </div>
            </section>
        </div>
    );
};