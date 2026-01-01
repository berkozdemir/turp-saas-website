import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    Activity,
    Clock,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Calendar,
    Dna,
    UserCheck,
    Lock,
    Stethoscope,
    Award
} from "lucide-react";

import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import NIPTSEO from '../components/NIPTSEO';
import { useFaq } from '../../hooks/useFaq';

// Fallback FAQs - will be imported to backend on first load
const FALLBACK_FAQS = [
    { question: "NIPT Testi Ne Kadar Güvenli?", answer: "Tamamen güvenli ve risksiz (non-invaziv) bir testtir. Sadece anneden alınan kan örneği ile çalışılır, bebek için hiçbir risk oluşturmaz." },
    { question: "Sonuç Kaç Günde Gelir?", answer: "Seçtiğiniz teste göre değişmekle birlikte genellikle 7-14 gün içerisinde sonuçlarınız raporlanır." },
    { question: "Doktor Kodu Nedir?", answer: "Hekiminiz tarafından size verilen indirim kodudur. Randevu oluştururken bu kodu girerek indirimden faydalanabilirsiniz." },
    { question: "Hizmet Hangi İllerde Var?", answer: "Türkiye'nin 81 ilinde Omega Care hemşire ağımız ile evinizde veya iş yerinizde numune alımı yapabiliyoruz." },
    { question: "Sonuç Nasıl İletilir?", answer: "Sonuçlarınız hazır olduğunda SMS ve E-posta ile bilgilendirilirsiniz. Hasta portalından veya hekiminiz aracılığıyla raporunuza ulaşabilirsiniz." }
];

export const NIPTPortal = () => {
    const navigate = useNavigate();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Fetch FAQs from backend with auto-import fallback
    const { faqs } = useFaq({ pageSlug: 'nipt-home', fallbackFaqs: FALLBACK_FAQS });

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const tests = [
        {
            id: "momguard",
            name: "MomGuard",
            brand: "LabGenomics",
            tagline: "Güvenilir Seçim",
            accuracy: "%99.8",
            time: "10-14 Gün",
            features: ["%99.8 Doğruluk", "10-14 Gün Sonuç", "İkiz Gebelik Uygun", "Riskli Tarama Sonrası"],
            color: "emerald",
            accentColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            btnColor: "bg-emerald-600 hover:bg-emerald-700",
            lightBtnColor: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        },
        {
            id: "verifi",
            name: "Verifi",
            brand: "Illumina: Testin Yaratıcısından",
            tagline: "En Güvenilir",
            accuracy: "%99.9",
            time: "7-10 Gün",
            features: ["%99.9 Doğruluk (T21, T18, T13)", "En Hızlı Sonuç (7-10 Gün)", "Tüm Mikrodelesyonlar", "60+ Üniversite Çalışması"],
            color: "blue",
            accentColor: "text-blue-600",
            bgColor: "bg-blue-50",
            btnColor: "bg-blue-600 hover:bg-blue-700",
            lightBtnColor: "bg-blue-100 text-blue-700 hover:bg-blue-200",
            popular: true
        },
        {
            id: "veritas",
            name: "Veritas",
            brand: "Veritas Genetics",
            tagline: "Kapsamlı",
            accuracy: "%99.9",
            time: "10-14 Gün",
            features: ["Tüm 23 Kromozom Taraması", "Genetik Danışmanlık Dahil", "Detaylı Rapor (TR+EN)", "Bütün Anomalileri Kapsar"],
            color: "amber",
            accentColor: "text-amber-600",
            bgColor: "bg-amber-50",
            btnColor: "bg-amber-500 hover:bg-amber-600",
            lightBtnColor: "bg-amber-100 text-amber-700 hover:bg-amber-200"
        }
    ];

    const credentials = [
        { icon: <ShieldCheck size={28} />, title: "Sağlık Bakanlığı Ruhsatlı", desc: "Omega Genetik Laboratuvarı" },
        { icon: <Award size={28} />, title: "30+ Yıllık Deneyim", desc: "Türkiye'nin köklü kuruluşu" },
        { icon: <Stethoscope size={28} />, title: "Omega Care Ekibi", desc: "Lisanslı hemşireler ile evde hizmet" },
        { icon: <Dna size={28} />, title: "Illumina Teknolojisi", desc: "Yeni Nesil Sekanslama (NGS)" },
        { icon: <Lock size={28} />, title: "KVKK Uyumlu", desc: "Verileriniz güvende ve şifreli" },
        { icon: <UserCheck size={28} />, title: "Uzman Genetik Danışmanlar", desc: "Sonuç yorumlama desteği" },
    ];



    return (
        <div className="min-h-screen bg-[#FAFBFC] font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
            <NIPTSEO />
            <NIPTHeader />

            {/* 2. Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
                {/* Background Decorative */}
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-br from-blue-50/50 via-white to-pink-50/30 pointer-events-none -z-10" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70" />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="max-w-2xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Hamileliğin 10. Haftasından İtibaren
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                            Bebeğinizin Sağlığı Konusunda <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Kesin Bir Cevap.</span> <br />
                            <span className="text-slate-400 font-medium">Hiçbir Kaygı Yok.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                            Evinizden çıkmadan %99,9 doğrulukla genetik anomalileri tespit edin.
                            Türkiye'nin ruhsatlı laboratuvarı güvencesiyle, <img src="/images/omega_care_logo.png" alt="Omega Care" className="inline-block h-6 mx-1 align-middle" /> hemşiresi kapınıza gelsin.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Sağlık Bakanlığı Ruhsatlı</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> 1000+ Mutlu Anne</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Risk-Free (İnvaziv Değil)</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/booking')}
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                            >
                                Randevunuzu Alın <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => document.getElementById('sss')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                Sorularınız mı var?
                            </button>
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className="relative hidden md:block">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            {/* Real Image Placeholder - Replace with actual upbeat photo */}
                            <div className="bg-gradient-to-br from-pink-100 to-blue-50 h-[500px] w-full flex items-center justify-center relative">
                                <img
                                    src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2070&auto=format&fit=crop"
                                    alt="Happy pregnant woman"
                                    className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700"
                                />

                                {/* Floating Badge 1 */}
                                <div className="absolute top-10 left-6 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-lg border border-white/50 animate-bounce-slow">
                                    <div className="text-xs text-slate-500 font-semibold uppercase">Doğruluk</div>
                                    <div className="text-xl font-bold text-blue-600">%99.9</div>
                                </div>

                                {/* Floating Badge 2 */}
                                <div className="absolute bottom-20 right-10 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-lg border border-white/50 animate-bounce-delayed">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-full text-green-600"><Clock size={18} /></div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold">Sonuç Süresi</div>
                                            <div className="text-base font-bold text-slate-800">7-10 Gün</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background blob behind image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-pink-200 rounded-full blur-[80px] -z-10 transform scale-110 opacity-60"></div>
                    </div>
                </div>
            </section>

            {/* 3. Test Cards Section */}
            <section id="testler" className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bebeğiniz İçin En Doğru Testi Seçin</h2>
                        <p className="text-slate-500 text-lg">Tüm testlerimiz uluslararası standartlarda, yüksek doğruluk oranına sahiptir.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {tests.map(test => (
                            <div key={test.id} className={`relative group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col ${test.popular ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}>

                                {test.popular && (
                                    <div className="absolute top-0 inset-x-0 bg-blue-600 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider z-10">
                                        En Çok Tercih Edilen
                                    </div>
                                )}

                                <div className={`p-8 ${test.bgColor} border-b border-slate-100/50`}>
                                    <div className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-2">{test.brand}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{test.name}</h3>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/60 backdrop-blur-sm ${test.accentColor}`}>
                                        {test.tagline}
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex items-center gap-3">
                                            <Activity className={`${test.accentColor}`} size={20} />
                                            <span className="font-semibold text-slate-700">{test.accuracy} Doğruluk</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className={`${test.accentColor}`} size={20} />
                                            <span className="font-semibold text-slate-700">{test.time}</span>
                                        </div>
                                        <div className="h-px bg-slate-100 my-4" />
                                        {test.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                <CheckCircle2 size={16} className={`mt-0.5 text-green-500 shrink-0`} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/testler/${test.id}`)}
                                        className={`w-full py-4 rounded-xl font-bold transition-all ${test.lightBtnColor} group-hover:text-white group-hover:${test.bgColor.replace('50', '600')}`} // Note: simplified hover logic
                                        style={{}} // Specific hover class override below
                                    >
                                        {/* Simplified button styling for reliability */}
                                        <span className="group-hover:hidden">Detayları İncele</span>
                                        <span className="hidden group-hover:inline-flex items-center gap-2">
                                            Hemen Başvur <ArrowRight size={18} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Process Timeline */}
            <section id="nasil-calisir" className="py-24 bg-[#FAFBFC]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Nasıl Çalışır?</h2>
                        <p className="text-slate-500">4 adımda güvenilir sonuçlara ulaşın.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.25rem] left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-pink-100 to-amber-100 -z-10 rounded-full"></div>

                        {[
                            { title: "Randevu Alın", desc: "2 dakikada online rezervasyon yapın.", icon: <Calendar />, color: "bg-blue-500" },
                            { title: "Evde Numune", desc: "Omega Care hemşiresi adresinize gelsin.", icon: <Stethoscope />, color: "bg-pink-500" },
                            { title: "Laboratuvar Analizi", desc: "NGS teknolojisi ile genetik analiz.", icon: <Dna />, color: "bg-indigo-500" },
                            { title: "Sonuç & Destek", desc: "7-10 günde raporunuz hazır.", icon: <FileTextIcon />, color: "bg-green-500" }
                        ].map((step, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                <div className={`w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-lg shadow-slate-200 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-500 text-sm px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Credentials Grid */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Güven</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">Neden Bize Güvenebilirsiniz?</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {credentials.map((cred, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm border border-slate-100">
                                    {cred.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">{cred.title}</h4>
                                    <p className="text-sm text-slate-500 leading-snug">{cred.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ Section */}
            <section id="sss" className="py-24 bg-[#FAFBFC]">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Sıkça Sorulan Sorular</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={faq.id || i} className="bg-white border boundary-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-6 text-left font-semibold text-slate-800"
                                >
                                    {faq.question}
                                    {openFaqIndex === i ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-slate-400" />}
                                </button>
                                <div className={`px-6 pb-6 text-slate-600 leading-relaxed ${openFaqIndex === i ? 'block' : 'hidden'}`}>
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};

// Simple Icon Component for the timeline 'Result' step if needed
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
);
