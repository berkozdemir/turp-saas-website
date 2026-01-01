import React from 'react';
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Clock,
    ShieldCheck,
    Activity,
    ArrowRight,
    Dna,
    Calendar,
    Stethoscope,
    FileText,
    Microscope,
    Baby,
    ChevronDown,
    ChevronUp,
    AlertCircle
} from "lucide-react";
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';

export const MomGuardIntro = () => {
    const navigate = useNavigate();
    const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <NIPTHeader />

            {/* 1. Hero Section - GREEN THEME */}
            <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60" />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-sm font-bold mb-6">
                            LabGenomics Teknolojisi
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            Güvenilir Seçim: <br />
                            <span className="text-emerald-600">MomGuard NIPT</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Gebeliğin 9-10. haftasından itibaren, evinizden çıkmadan %99,8 doğrulukla genetik anomalileri tespit edin.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-emerald-100">
                                <CheckCircle2 className="text-emerald-500" />
                                <span className="font-semibold text-slate-700">%99.8 Doğruluk</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-emerald-100">
                                <Clock className="text-emerald-500" />
                                <span className="font-semibold text-slate-700">10-14 Gün Sonuç</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-emerald-100">
                                <ShieldCheck className="text-emerald-500" />
                                <span className="font-semibold text-slate-700">Risk Yok (İnvaziv Değil)</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/booking?test=momguard')}
                                className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                MomGuard Randevusu Al <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="/images/labgenomics_illumina_logo.png"
                                alt="Scientist in lab"
                                className="object-cover h-[500px] w-full"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                <p className="text-white font-medium">LabGenomics Laboratuvar Teknolojisi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. What is MomGuard? */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-emerald-100 rounded-3xl transform -rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2070&auto=format&fit=crop"
                            alt="Happy Mom"
                            className="relative rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">MomGuard NIPT Nedir?</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            MomGuard testi, LabGenomics firması tarafından geliştirilmiş modern bir prenatal tarama testidir.
                            Hamileliğin erken haftalarında (10. hafta itibariyle) bebeğinizin genetik sağlığı konusunda kesin bir cevap verir.
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            İleri yaş gebelikleri, tarama testi riskli çıkanlar veya sadece içinin rahat etmesini siteyen tüm anne adayları için
                            güvenli bir seçenektir. Amniyosentez gibi invaziv (girişimsel) işlemlerin aksine, bebeğe hiçbir zarar vermez.
                        </p>
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
                            <h4 className="font-bold text-emerald-800 mb-2">Nasıl Çalışır?</h4>
                            <p className="text-emerald-700 text-sm">
                                Hamilelik sırasında bebeğin DNA parçacıkları annenin kanına karışır (cffDNA). MomGuard, anneden alınan
                                basit bir kan örneğindeki bu DNA'yı analiz ederek kromozom sayılarını inceler.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Technology Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase">BİLİMSEL ALTYAPI</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">NGS Teknolojisi & Illumina</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Dna size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Yeni Nesil Sekanslama</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Kan örneğinden izole edilen DNA, Illumina cihazları kullanılarak Next Generation Sequencing (NGS) metodu ile
                                milyonlarca kez okunur ve analiz edilir.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Activity size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Biyoinformatik Analiz</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Elde edilen sekans verileri, LabGenomics'in gelişmiş algoritmaları ile taranır. Kromozom sayısal anomalileri
                                yapay zeka desteğiyle tespit edilir.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Microscope size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Yüksek Doğruluk</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Klinik validasyon çalışmaları, MomGuard'ın Trizomi 21 (Down Sendromu) tespitinde %99.8'in üzerinde
                                hassasiyete sahip olduğunu kanıtlamıştır.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Detection Scope */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">MomGuard Neleri Tespit Eder?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <div className="text-4xl font-black text-emerald-200 mb-4">21</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Trizomi 21</h3>
                            <p className="text-sm text-slate-600">Down Sendromu olarak bilinir. En sık görülen kromozom anomalisidir.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                            <div className="text-4xl font-black text-blue-200 mb-4">18</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Trizomi 18</h3>
                            <p className="text-sm text-slate-600">Edwards Sendromu. Ciddi gelişimsel sorunlara yol açar.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                            <div className="text-4xl font-black text-amber-200 mb-4">13</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Trizomi 13</h3>
                            <p className="text-sm text-slate-600">Patau Sendromu. Nadir görülen ancak ciddi bir anomalidir.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100">
                            <div className="text-4xl font-black text-pink-200 mb-4">XY</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Cinsiyet Anomalileri</h3>
                            <p className="text-sm text-slate-600">Turner, Klinefelter gibi cinsiyet kromozom bozuklukları.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Process Timeline */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">4 Adımda Kolay Süreç</h2>
                        <p className="text-slate-400">Yorulmadan, strese girmeden güvenilir sonuç.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/50">
                                <Calendar size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">1. Randevu Alın</h3>
                            <p className="text-sm text-slate-400">nipt.tr üzerinden size uygun saati seçin.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/50">
                                <Stethoscope size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">2. Evde Numune</h3>
                            <p className="text-sm text-slate-400">Omega Care hemşiresi adresinize gelsin.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/50">
                                <Dna size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">3. Analiz</h3>
                            <p className="text-sm text-slate-400">Numuneniz laboratuvarımızda incelenir (10-14 gün).</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/50">
                                <FileText size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">4. Sonuç</h3>
                            <p className="text-sm text-slate-400">Raporunuz uzman açıklama ile iletilir.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Comparison Table */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Neden MomGuard?</h2>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-bold text-slate-600">Özellik</th>
                                    <th className="p-4 font-bold text-slate-600">İkili/Üçlü Tarama</th>
                                    <th className="p-4 font-bold text-emerald-700 bg-emerald-50">MomGuard NIPT</th>
                                    <th className="p-4 font-bold text-slate-600">Amniyosentez</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Doğruluk Oranı</td>
                                    <td className="p-4 text-slate-500">%70 - %85</td>
                                    <td className="p-4 font-bold text-emerald-600 bg-emerald-50/30">%99.8</td>
                                    <td className="p-4 text-slate-500">%99.9</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Düşük Riski</td>
                                    <td className="p-4 text-green-600 font-medium">Yok</td>
                                    <td className="p-4 font-bold text-emerald-600 bg-emerald-50/30">Yok (Güvenli)</td>
                                    <td className="p-4 text-red-500 font-medium whitespace-nowrap">Var (1/200)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Uygulama Şekli</td>
                                    <td className="p-4 text-slate-500">Kan + Ultrason</td>
                                    <td className="p-4 font-bold text-emerald-600 bg-emerald-50/30">Sadece Anne Kanı</td>
                                    <td className="p-4 text-slate-500">Karına İğne</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Zamanlama</td>
                                    <td className="p-4 text-slate-500">11-14. Haftalar</td>
                                    <td className="p-4 font-bold text-emerald-600 bg-emerald-50/30">10. Haftadan İtibaren</td>
                                    <td className="p-4 text-slate-500">16+ Hafta</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 7. Who is it for? */}
            <section className="py-20 bg-emerald-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Kimler İçin Uygundur?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            "Tüm hamileler (İsteğe bağlı)",
                            "35 yaş ve üzeri anne adayları",
                            "Tarama testinde yüksek risk çıkanlar",
                            "Ultrasonda şüpheli bulgu olanlar",
                            "Daha önceki gebelikte anomali öyküsü",
                            "Tüp bebek (IVF) gebelikleri"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-5 rounded-xl text-slate-700 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                </div>
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Sıkça Sorulan Sorular</h2>

                    <div className="space-y-4">
                        {[
                            { q: "MomGuard tamamen güvenli mi?", a: "Evet. MomGuard invaziv olmayan bir testtir (NIPT). Sadece anneden alınan kan örneği ile çalışılır, bu nedenle bebek için hiçbir düşük riski taşımaz." },
                            { q: "Sonuç pozitif çıkarsa ne olur?", a: "Test sonucunun 'yüksek riskli' veya 'pozitif' çıkması, bebekte bir anomali olma ihtimalinin çok yüksek olduğunu gösterir. Bu durumda kesin tanı için doktorunuz amniyosentez önerebilir." },
                            { q: "İkiz gebeliklerde yapılabilir mi?", a: "Evet, MomGuard ikiz gebeliklerde de uygulanabilir ve kromozom anomalilerini başarıyla tarayabilir. Ancak ikizlerde cinsiyet tespiti sınırlı olabilir." },
                            { q: "Sonuçlar ne zaman çıkar?", a: "Kan örneği laboratuvara ulaştıktan sonra genellikle 10-14 gün içerisinde sonuçlarınız raporlanır." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                                >
                                    {faq.q}
                                    {openFaqIndex === i ? <ChevronUp className="text-emerald-600" /> : <ChevronDown className="text-slate-400" />}
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

            {/* 9. CTA */}
            <section className="py-20 bg-emerald-600 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Endişelerinizi Bugün Giderin</h2>
                    <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
                        Bebeğinizin sağlığı hakkında en doğru bilgiye, evinizin konforunda ulaşın.
                    </p>
                    <button
                        onClick={() => navigate('/booking?test=momguard')}
                        className="bg-white text-emerald-800 px-10 py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all"
                    >
                        Hemen Randevu Oluştur
                    </button>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};
