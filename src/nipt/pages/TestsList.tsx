import { useNavigate } from "react-router-dom";
import {
    Activity,
    Clock,
    CheckCircle2,
    ArrowRight,
    ArrowLeft
} from "lucide-react";
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import NIPTSEO from '../components/NIPTSEO';

export const TestsList = () => {
    const navigate = useNavigate();

    const tests = [
        {
            id: "momguard",
            name: "MomGuard",
            brand: "LabGenomics",
            tagline: "Güvenilir Seçim",
            accuracy: "%99.8",
            time: "10-14 Gün",
            price: "₺1.200'den başlayan fiyatlar",
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
            price: "₺1.850'den başlayan fiyatlar",
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
            price: "₺2.500'den başlayan fiyatlar",
            features: ["Tüm 23 Kromozom Taraması", "Genetik Danışmanlık Dahil", "Detaylı Rapor (TR+EN)", "Bütün Anomalileri Kapsar"],
            color: "amber",
            accentColor: "text-amber-600",
            bgColor: "bg-amber-50",
            btnColor: "bg-amber-500 hover:bg-amber-600",
            lightBtnColor: "bg-amber-100 text-amber-700 hover:bg-amber-200"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFC] font-sans text-slate-800">
            <NIPTSEO />
            <NIPTHeader />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-6">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors"
                    >
                        <ArrowLeft size={18} /> Ana Sayfaya Dön
                    </button>

                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">NIPT Test Seçenekleri</h1>
                        <p className="text-xl text-slate-600">
                            Bebeğinizin sağlığı için en uygun testi seçin. Tüm testlerimiz %99+ doğruluk oranına sahiptir ve Omega Care uzmanlığıyla sunulmaktadır.
                        </p>
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
                                    <div className="mb-6">
                                        <div className="text-sm text-slate-400 mb-1">Başlangıç Fiyatı</div>
                                        <div className="text-lg font-bold text-slate-900">{test.price}</div>
                                    </div>

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
                                        className={`w-full py-4 rounded-xl font-bold transition-all ${test.lightBtnColor} hover:bg-blue-600 hover:text-white`}
                                    >
                                        Detayları İncele
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 bg-blue-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Hangi testi seçeceğinize karar veremediniz mi?</h2>
                            <p className="text-lg text-slate-600">Uzman genetik danışmanlarımız size en uygun testi belirlemek için yardımcı olabilir.</p>
                        </div>
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all whitespace-nowrap"
                        >
                            Ücretsiz Danışmanlık Alın
                        </button>
                    </div>
                </div>
            </main>

            <NIPTFooter />
        </div>
    );
};
