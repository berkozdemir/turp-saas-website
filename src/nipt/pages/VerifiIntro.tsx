import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    ShieldCheck,
    Activity,
    Dna,
    Stethoscope,
    Microscope,
    ChevronDown,
    ChevronUp,
    Award,
    Zap,
    Star,
    AlertCircle
} from "lucide-react";
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';

export const VerifiIntro = () => {
    const navigate = useNavigate();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <NIPTHeader />

            {/* 1. Hero Section - BLUE THEME (Premium) */}
            <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60" />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold mb-6 shadow-md shadow-blue-200">
                            <Star size={14} fill="currentColor" /> PREMIUM SEÇENEK
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            Dünyanın En Çok Güvendiği Test: <br />
                            <span className="text-blue-600">Verifi NIPT</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Illumina teknolojisi ile geliştirilen, %99,9 doğruluk oranı ve sektördeki en düşük başarısızlık oranı (%0.1) ile
                            en güvenilir sonuçlara ulaşın.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <CheckCircle2 className="text-blue-500" />
                                <span className="font-semibold text-slate-700">%99.9 Doğruluk</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <Zap className="text-blue-500" />
                                <span className="font-semibold text-slate-700">7-10 Gün (Hızlı)</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <ShieldCheck className="text-blue-500" />
                                <span className="font-semibold text-slate-700">60+ Validasyon</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                NIPT teknolojisinin yaratıcısı Illumina güvencesi ile en düşük hata payı ve en kapsamlı sonuçlar.
                            </p>
                            <button
                                onClick={() => navigate('/booking?test=verifi')}
                                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                            >
                                Verifi ile Güvende Olun
                            </button>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1579165466741-7f35a4755657?q=80&w=2070&auto=format&fit=crop"
                                alt="DNA Sequencing"
                                className="object-cover h-[500px] w-full"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                <p className="text-white font-medium flex items-center gap-2"><Award className="text-yellow-400" /> Illumina Liderliği</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. What is Verifi? */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-3xl transform -rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1631557993077-8fa050c93a86?q=80&w=2070&auto=format&fit=crop"
                            alt="Doctor explaining"
                            className="relative rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Verifi: Illumina Güvencesi</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Verifi Prenatal Test, DNA sekanslama teknolojisinin mucidi ve dünya lideri <strong>Illumina</strong> firması tarafından geliştirilmiştir.
                            Milyonlarca hamile kadın tarafından tercih edilen ve 60'tan fazla bağımsız bilimsel çalışma ile doğruluğu kanıtlanmış bir testtir.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="block text-2xl font-bold text-blue-600 mb-1">%0.1</span>
                                <span className="text-sm text-slate-500">En Düşük Başarısızlık Oranı</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="block text-2xl font-bold text-blue-600 mb-1">60+</span>
                                <span className="text-sm text-slate-500">Klinik Validasyon Çalışması</span>
                            </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Sadece trizomileri değil, aynı zamanda cinsiyet kromozom anomalilerini ve opsiyonel panel ile mikrodelesyon sendromlarını da
                            en yüksek hassasiyetle tarar.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Technology Section - SAFeR Algorithm */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">ÜSTÜN TEKNOLOJİ</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">Massive Parallel Sequencing & SAFeR™</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">1</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Massive Parallel Sequencing (MPS)</h3>
                                    <p className="text-slate-600">
                                        Bebeğin DNA'sının milyonlarca kopyası aynı anda, paralel olarak analiz edilir. Bu yöntem, geleneksel
                                        yöntemlere göre çok daha derinlemesine bir okuma sağlar.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">2</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">SAFeR™ Algoritması</h3>
                                    <p className="text-slate-600">
                                        Illumina'nın patentli biyoinformatik algoritmasıdır. Gürültüyü (noise) filtreleyerek, testin yanlış pozitif
                                        verme ihtimalini minimize eder ve en temiz sonucu sunar.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">3</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Sıfıra Yakın Tekrar Gereksinimi</h3>
                                    <p className="text-slate-600">
                                        Diğer testlerde %2-5 oranında görülen "sonuç verememe" durumu, Verifi'nin üstün teknolojisi sayesinde %0.1'e indirilmiştir.
                                        Tekrar kan verme stresinden kurtulursunuz.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Dna size={120} />
                            </div>
                            <h4 className="font-bold text-lg mb-6">İşlem Süreci</h4>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <Stethoscope size={18} className="text-blue-500" />
                                    <span>Anne kolundan kan alımı</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <Activity size={18} className="text-blue-500" />
                                    <span>DNA İzolasyonu & Kütüphane Hazırlama</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <Microscope size={18} className="text-blue-500" />
                                    <span>Illumina Sekanslama (Milyarlarca okuma)</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50/80 border border-green-100 rounded-lg">
                                    <CheckCircle2 size={18} className="text-green-500" />
                                    <span className="font-semibold text-green-800">SAFeR™ ile Yüksek Doğruluklu Sonuç</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Detection Scope & Microdeletions */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Geniş Kapsamlı Tarama</h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Standard Panel */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
                            <div className="inline-block px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-xs mb-4">STANDART PANEL</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Temel Kromozomlar</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="font-medium">Trizomi 21 (Down Sendromu)</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="font-medium">Trizomi 18 (Edwards Sendromu)</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="font-medium">Trizomi 13 (Patau Sendromu)</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20} /> <span className="font-medium">Cinsiyet Kromozomları (XO, XXY, XXX, XYY)</span></li>
                            </ul>
                        </div>

                        {/* Microdeletions Panel */}
                        <div className="p-8 rounded-3xl bg-blue-600 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-4 border border-white/30">OPSİYONEL PANEL</div>
                            <h3 className="text-2xl font-bold mb-6">Mikrodelesyon Paneli</h3>
                            <p className="text-blue-100 mb-6 text-sm">
                                Kromozomların küçük parça kayıplarını tarayan bu panel, standart testlerden daha geniş bir bakış açısı sunar.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-200" size={20} /> <span>1p36 Delesyonu</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-200" size={20} /> <span>4p- (Wolf-Hirschhorn)</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-200" size={20} /> <span>5p- (Cri-du-chat)</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-200" size={20} /> <span>15q11 (Prader-Willi/Angelman)</span></li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-200" size={20} /> <span>22q11.2 (DiGeorge)</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                        <AlertCircle className="text-amber-600 shrink-0" size={32} />
                        <div className="text-sm text-amber-800">
                            <strong className="block text-lg mb-1 text-amber-900">Neden Mikrodelesyon Paneli?</strong>
                            Mikrodelesyonlar annenin yaşına bağlı olmadan gelişebilir. Özellikle ultrasonda bulgu saptanamayan ancak genetik risk taşıyan durumlar için
                            bu panelin eklenmesi, test kapsamını önemli ölçüde artırır.
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Comparison Table */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Neden Verifi En İyisi?</h2>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-bold text-slate-600">Özellik</th>
                                    <th className="p-4 font-bold text-slate-400">Geleneksel NIPT</th>
                                    <th className="p-4 font-bold text-blue-700 bg-blue-50">Verifi Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Teknoloji Sahibi</td>
                                    <td className="p-4 text-slate-500">Çeşitli</td>
                                    <td className="p-4 font-bold text-blue-600 bg-blue-50/30">Illumina (Sektör Lideri)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Başarısızlık Oranı (No-Call)</td>
                                    <td className="p-4 text-slate-500">%2 - %5</td>
                                    <td className="p-4 font-bold text-blue-600 bg-blue-50/30">%0.1 (En Düşük)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Sonuç Süresi</td>
                                    <td className="p-4 text-slate-500">10-14 Gün</td>
                                    <td className="p-4 font-bold text-blue-600 bg-blue-50/30">7-10 Gün (En Hızlı)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700">Validasyon</td>
                                    <td className="p-4 text-slate-500">Sınırlı</td>
                                    <td className="p-4 font-bold text-blue-600 bg-blue-50/30">60+ Klinik Çalışma</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>


            {/* 6. FAQ */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Verifi Hakkında Sorular</h2>

                    <div className="space-y-4">
                        {[
                            { q: "Verifi ile MomGuard arasındaki fark nedir?", a: "Verifi, %99.9 doğruluk oranı, daha hızlı sonuç süresi (7-10 gün) ve Illumina'nın özel SAFeR teknolojisi ile 'Premium' seçeneğimizdir. Ayrıca opsiyonel olarak daha geniş bir mikrodelesyon paneli sunar." },
                            { q: "Mikrodelesyon paneli yaptırmalı mıyım?", a: "Mikrodelesyonlar (küçük kromozom kayıpları) yaşa bağlı değildir ve standart taramalarda gözden kaçabilir. Daha kapsamlı bir bilgi isteyen aileler için önerilir." },
                            { q: "Verifi testinin başarısız olma ihtimali var mı?", a: "%0.1 oranıyla sektördeki en düşük başarısızlık (no-call) oranına sahiptir. Nadiren de olsa sonuç alınamazsa, ücretsiz tekrar testi yapılır." },
                            { q: "Test sonuçlarını doktorum kabul edecek mi?", a: "Evet. Verifi, tüm dünyada altın standart olarak kabul edilen Illumina teknolojisini kullanır ve sonuç raporları uluslararası geçerliliğe sahiptir." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white border boundary-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                                >
                                    {faq.q}
                                    {openFaqIndex === i ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-slate-400" />}
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
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
                <div className="container mx-auto px-6">
                    <div className="inline-block px-4 py-1 rounded-full bg-white/20 font-bold text-sm mb-6 border border-white/30 backdrop-blur">
                        EN GÜVENİLİR SEÇİM
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Hamileliğinizi Güvenle Sürdürün</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                        Dünyanın en gelişmiş teknolojisi ile bebeğinizin sağlığından emin olun.
                    </p>
                    <button
                        onClick={() => navigate('/booking?test=verifi')}
                        className="bg-white text-blue-800 px-10 py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all"
                    >
                        Verifi İçin Randevu Al
                    </button>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};
