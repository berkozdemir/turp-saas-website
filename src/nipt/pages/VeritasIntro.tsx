import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    ShieldCheck,
    Dna,
    Calendar,
    Stethoscope,
    FileText,
    Microscope,
    ChevronDown,
    ChevronUp,
    Layers,
    Search
} from "lucide-react";
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import { PodcastAIDisclaimer } from '../components/PodcastAIDisclaimer';

export const VeritasIntro = () => {
    const navigate = useNavigate();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <NIPTHeader />

            {/* 1. Hero Section - AMBER THEME (Comprehensive) */}
            <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60" />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold mb-6">
                            <Layers size={14} /> EN KAPSAMLI TEST
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            Tüm Genomu Tarayan Tek Güç: <br />
                            <span className="text-amber-600">Veritas NIPT</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Sadece belli kromozomları değil, bebeğinizin tüm 23 çift kromozomunu inceleyen, mikrodelesyonları kapsayan
                            en detaylı prenatal screening deneyimi.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-amber-100">
                                <CheckCircle2 className="text-amber-500" />
                                <span className="font-semibold text-slate-700">Tüm 23 Kromozom</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-amber-100">
                                <Search className="text-amber-500" />
                                <span className="font-semibold text-slate-700">Detaylı Analiz</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-amber-100">
                                <ShieldCheck className="text-amber-500" />
                                <span className="font-semibold text-slate-700">Genetik Danışmanlık</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Standart NIPT analizlerine ek olarak, tüm genom çapında kapsamlı tarama ile bebeğinizin sağlığına dair en detaylı bakış.
                            </p>
                            <button
                                onClick={() => navigate('/booking?test=veritas')}
                                className="bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-amber-200 hover:bg-amber-700 hover:scale-105 transition-all duration-300"
                            >
                                Veritas ile Tanışın
                            </button>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2576&auto=format&fit=crop"
                                alt="Genetic Research"
                                className="object-cover h-[500px] w-full"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                <p className="text-white font-medium flex items-center gap-2"><Dna className="text-amber-400" /> Whole Genome Sequencing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Podcast Audio Player */}
            <section className="py-8 bg-gradient-to-r from-amber-600 to-orange-700">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <Stethoscope size={32} className="text-white" />
                                </div>
                                <div className="text-white">
                                    <h3 className="font-bold text-lg">🎧 Bu Sayfayı Dinleyin</h3>
                                    <p className="text-amber-100 text-sm">Veritas testi hakkında sesli özet</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <audio
                                    controls
                                    className="w-full h-12 rounded-lg"
                                    style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                                >
                                    <source src="https://cdn.nipt.tr/nipt.tr/NIPT_Veritas.m4a" type="audio/mp4" />
                                    Tarayıcınız ses oynatıcıyı desteklemiyor.
                                </audio>
                                <PodcastAIDisclaimer variant="dark" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. What is Veritas? */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-amber-100 rounded-3xl transform -rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1516549655169-df83a092dd14?q=80&w=2070&auto=format&fit=crop"
                            alt="Medical Consultation"
                            className="relative rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Veritas: Sınırları Kaldırın</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Veritas, standart NIPT testlerinin ötesine geçerek, bebeğin genetiği hakkında mümkün olan en kapsamlı bilgiyi sunmayı hedefler.
                            "GenomeScreen" teknolojisi ile sadece belirli trizomilere değil, <strong>tüm otozomal kromozomlara</strong> bakar.
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Nadir görülen genetik dengesizlikleri, kopya sayısı değişimlerini (CNV) ve mikrodelesyonları tek bir testte tarayarak,
                            aileniz için en net tabloyu oluşturur.
                        </p>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
                            <h4 className="font-bold text-amber-800 mb-2">Kimler Tercih Etmeli?</h4>
                            <p className="text-amber-700 text-sm">
                                Özellikle detaycı ebeveynler, riskli gebelik geçmişi olanlar veya ultrasonda açıklanamayan bulguları olanlar için
                                en üst düzey tarama seçeneğidir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Technology Section - Whole Genome */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-amber-600 font-bold tracking-wider text-sm uppercase">TEKNOLOJİ</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">Tüm Genom Sekanslama (WGS)</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <Layers size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">22+XY Kromozom</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Standart testler sadece 3-5 kromozoma bakarken, Veritas teknolojisi insan vücudundaki tüm 23 çift kromozomu tarar ve
                                anormallikleri raporlar.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <Search size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">GenomeScreen™ Analizi</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                7 Mb üzerindeki tüm delesyon ve duplikasyonlar (genetik materyal kayıpları veya artışları) otomatik olarak taranır.
                                Gözden kaçan detay kalmaz.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <Microscope size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Genetik Uzman Desteği</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Bu kadar kapsamlı bir testin sonuçları, mutlaka uzman bir genetik danışman tarafından yorumlanarak ailenize iletilir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Detection Scope Comparison */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Tarama Kapsamı Karşılaştırması</h2>

                    <div className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
                        {/* Standard Scope */}
                        <div className="p-8 rounded-3xl border border-slate-200 opacity-60 grayscale-[0.5]">
                            <h3 className="text-xl font-bold text-slate-600 mb-6 text-center">Diğer Testler</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl text-center">Trizomi 21 (Down)</div>
                                <div className="p-4 bg-slate-50 rounded-xl text-center">Trizomi 18 (Edwards)</div>
                                <div className="p-4 bg-slate-50 rounded-xl text-center">Trizomi 13 (Patau)</div>
                                <div className="p-4 bg-slate-50 rounded-xl text-center">Cinsiyet Kromozomları</div>
                            </div>
                        </div>

                        {/* Veritas Scope */}
                        <div className="p-8 rounded-3xl bg-amber-50 border-2 border-amber-400 relative shadow-xl">
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">VERITAS FARKI</div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Veritas Kapsamı</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-xl text-center shadow-sm font-bold text-slate-800 border border-amber-100">
                                    Trizomi 21, 18, 13
                                </div>
                                <div className="p-4 bg-white rounded-xl text-center shadow-sm font-bold text-slate-800 border border-amber-100">
                                    Cinsiyet Kromozomları
                                </div>
                                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-center shadow-md font-bold text-lg animate-pulse-slow">
                                    + TÜM (1-22) OTOZOMAL KROMOZOMLAR
                                </div>
                                <div className="p-4 bg-white rounded-xl text-center shadow-sm font-bold text-slate-800 border border-amber-100">
                                    Tüm Kromozomlarda Delesyon/Duplikasyonlar (&gt;7Mb)
                                </div>
                                <div className="p-4 bg-white rounded-xl text-center shadow-sm font-bold text-slate-800 border border-amber-100">
                                    Opsiyonel Mikrodelesyon Paneli
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Process Timeline */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Veritas Süreci</h2>
                        <p className="text-slate-400">Kapsamlı analiz, detaylı raporlama.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/50">
                                <Calendar size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">1. Başvuru</h3>
                            <p className="text-sm text-slate-400">Online form ile kaydınızı oluşturun.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/50">
                                <Stethoscope size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">2. Kan Örneği</h3>
                            <p className="text-sm text-slate-400">Omega Care ekibi kanınızı alır.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/50">
                                <Search size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">3. WGS Analizi</h3>
                            <p className="text-sm text-slate-400">Tüm genom incelenir (10-14 gün).</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/50">
                                <FileText size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">4. Genetik Danışmanlık</h3>
                            <p className="text-sm text-slate-400">Sonuçlarınız uzmanımızca açıklanır.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Veritas Hakkında Sorular</h2>

                    <div className="space-y-4">
                        {[
                            { q: "Neden tüm kromozomlara bakmak önemli?", a: "Nadir görülen genetik hastalıkların birçoğu, standart testlerin bakmadığı diğer kromozomlardaki bozukluklardan kaynaklanabilir. Tüm kromozom taraması, bu nadir riskleri de ekarte etmenizi sağlar." },
                            { q: "GenomeScreen analizi nedir?", a: "Veritas'ın sadece trizomilere değil, kromozomlar üzerindeki yapısal bozukluklara (parça kopması veya artması) da baktığı gelişmiş analiz yöntemidir." },
                            { q: "Sonuç süresi neden farklı?", a: "Yapılan analiz çok daha kapsamlı ve veri boyutu çok daha büyük olduğu için, analiz süreci standart testlere göre 1-2 gün daha uzun sürebilir. Genellikle 10-14 gün içinde sonuçlanır." },
                            { q: "Fiyatı diğer testlerden neden farklı?", a: "Kullanılan teknoloji (Tüm Genom Sekanslama) ve analiz kapsamının genişliği nedeniyle maliyeti daha yüksektir, ancak sunduğu bilgi derinliği benzersizdir." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-amber-100 transition-colors"
                                >
                                    {faq.q}
                                    {openFaqIndex === i ? <ChevronUp className="text-amber-600" /> : <ChevronDown className="text-slate-400" />}
                                </button>
                                {openFaqIndex === i && (
                                    <div className="px-5 pb-5 pt-0 text-slate-600 leading-relaxed animate-fade-in">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CTA */}
            <section className="py-20 bg-amber-600 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Hiçbir Detayı Şansa Bırakmayın</h2>
                    <p className="text-amber-100 text-lg mb-10 max-w-2xl mx-auto">
                        Bebeğinizin genetik haritasını en kapsamlı şekilde inceletin.
                    </p>
                    <button
                        onClick={() => navigate('/booking?test=veritas')}
                        className="bg-white text-amber-800 px-10 py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-amber-50 hover:scale-105 transition-all"
                    >
                        Veritas Randevusu Al
                    </button>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};
