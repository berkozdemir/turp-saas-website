import React from 'react';
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Award,
    Users,
    Building2,
    Microscope,
    Heart,
    Stethoscope,
    Activity
} from "lucide-react";
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';

export const About = () => {
    // navigate removed as it was unused

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <NIPTHeader />

            {/* 1. Hero Section - DARK BLUE THEME (Corporate/Trust) */}
            <section className="relative pt-20 pb-24 bg-slate-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/50 border border-blue-700 text-blue-200 text-sm font-bold mb-6">
                            <Building2 size={14} /> 30+ Yıllık Tecrübe
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Omega Genetik <br />
                            <span className="text-blue-400">Genetik Hastalıklar Değerlendirme Merkezi</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            Güven, bilim ve etik değerler ışığında, Türkiye'nin ilk ve en köklü ruhsatlı genetik laboratuvarlarından biri olarak
                            hizmet veriyoruz.
                        </p>

                        <div className="flex flex-wrap gap-6 mb-10 text-slate-300">
                            <div className="flex items-center gap-2">
                                <Award className="text-blue-400" /> <span>Sağlık Bakanlığı Ruhsatlı</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="text-blue-400" /> <span>Uzman Kadro</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                            alt="Modern Laboratory Building"
                            className="rounded-3xl shadow-2xl border-4 border-slate-700 opacity-90"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Mission & Vision */}
            <section className="py-20 bg-white -mt-10 relative z-20 rounded-t-[3rem]">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Misyonumuz</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Bilimsel doğruluktan ödün vermeden, en ileri genetik test teknolojilerini Türkiye'deki hastalarımıza ulaştırmak.
                                Her testin arkasında bir ailenin umudu olduğunu bilerek, etik ve şeffaf hizmet sunmak.
                            </p>
                        </div>
                        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-6">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Vizyonumuz</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Kişiselleştirilmiş genetik tıbbın öncüsü olmak ve toplum sağlığını korumada genetik biliminin gücünü
                                herkes için erişilebilir kılmak.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. License & Credentials */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Resmi Ruhsat & Yetkinlikler</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={18} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">T.C. Sağlık Bakanlığı Ruhsatı</h4>
                                        <p className="text-sm text-slate-500">Ruhsat No: GHDM-SM/06.21/01 - Genetik Hastalıklar Değerlendirme Merkezi</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={18} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">ISO Kalite Standartları</h4>
                                        <p className="text-sm text-slate-500">Uluslararası laboratuvar kalite standartlarına tam uyum.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={18} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">KVKK Uyumlu</h4>
                                        <p className="text-sm text-slate-500">Hasta verileriniz en üst düzey güvenlik protokolleri ile korunur.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full flex justify-center">
                            {/* License Certificate Placeholder */}
                            <div className="w-full max-w-sm aspect-[3/4] bg-slate-100 border-8 border-white shadow-xl rounded-sm flex flex-col items-center justify-center text-slate-400 p-8 text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                <Award size={64} className="mb-4 text-slate-300" />
                                <h3 className="font-serif text-xl text-slate-500 mb-2">T.C. SAĞLIK BAKANLIĞI</h3>
                                <p className="text-sm uppercase tracking-widest font-bold">Ruhsat Belgesi</p>
                                <div className="w-24 h-24 rounded-full border-4 border-red-100 mt-8 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full border-2 border-red-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Team Structure */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Uzman Kadromuz</h2>
                    <p className="text-slate-500 mb-16 max-w-2xl mx-auto">
                        Laboratuvarımızda Tıbbi Genetik Uzmanları, Moleküler Biyologlar, Biyoinformatik Uzmanları ve
                        Genetik Danışmanlar birlikte çalışmaktadır.
                    </p>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { role: "Tıbbi Genetik Uzmanı", icon: <Stethoscope size={32} /> },
                            { role: "Laboratuvar Direktörü", icon: <Microscope size={32} /> },
                            { role: "Biyoinformatik Uzmanı", icon: <Activity size={32} /> },
                            { role: "Genetik Danışman", icon: <Users size={32} /> },
                        ].map((role, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-slate-100 group">
                                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                                    {role.icon}
                                </div>
                                <h3 className="font-bold text-slate-800">{role.role}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Omega Care Integration */}
            <section className="py-20 bg-blue-50">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <img
                            src="/images/omega_genetik_building.png"
                            alt="Home Healthcare"
                            className="rounded-3xl shadow-xl border-4 border-white"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-xs mb-4">EVDE SAĞLIK HİZMETİ</div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Omega Care: Laboratuvar Kalitesi Evinizde</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Omega Genetik'in saha operasyon partneri olan Omega Care, Türkiye'nin 81 ilinde lisanslı hemşire ağı ile hizmet vermektedir.
                            Kan verme işlemi için hastaneye veya laboratuvara gitmenize gerek kalmadan, uzman hemşiremiz sizi evinizde ziyaret eder.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="text-slate-700">81 İlde Hizmet</span></li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="text-slate-700">Lisanslı & Deneyimli Hemşireler</span></li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="text-slate-700">Soğuk Zincir Lojistik</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};
