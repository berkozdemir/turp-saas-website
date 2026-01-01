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
    AlertCircle,
    Users,
    Clock,
    X,
    ZoomIn,
    Headphones
} from "lucide-react";
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';

export const VerifiIntro = () => {
    const navigate = useNavigate();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [showInfographic, setShowInfographic] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <NIPTHeader />

            {/* 1. Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60" />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold mb-6 shadow-md shadow-blue-200">
                            <Star size={14} fill="currentColor" /> PREMIUM SEÇENEK
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            Verifi Prenatal Test <br />
                            <span className="text-blue-600">Hizmetleri</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Bebeğinizin sağlığı hakkında erken bilgi almanızı sağlayan, güvenli ve ağrısız tarama testleri.
                            Gebeliğinizin 10. haftasından itibaren sadece tek bir kan örneği ile en yaygın kromozom farklılıklarını tespit edin.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <CheckCircle2 className="text-blue-500" />
                                <span className="font-semibold text-slate-700">%99.9 Doğruluk</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <Zap className="text-blue-500" />
                                <span className="font-semibold text-slate-700">7-10 Gün</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <ShieldCheck className="text-blue-500" />
                                <span className="font-semibold text-slate-700">%0.1 Başarısızlık</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/booking?test=verifi')}
                            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                        >
                            Verifi ile Güvende Olun
                        </button>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500 bg-white p-8">
                            <img
                                src="/images/illumina_logo_orange.png"
                                alt="Illumina Logo"
                                className="object-contain h-[400px] w-full"
                            />
                            <div className="text-center mt-4">
                                <p className="text-slate-600 font-medium">NIPT Teknolojisinin Yaratıcısı</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Podcast Audio Player - Temporarily disabled
            <section className="py-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <Headphones size={32} className="text-white" />
                                </div>
                                <div className="text-white">
                                    <h3 className="font-bold text-lg">🎧 Bu Sayfayı Dinleyin</h3>
                                    <p className="text-blue-100 text-sm">Verifi testi hakkında sesli özet</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <audio 
                                    controls 
                                    className="w-full h-12 rounded-lg"
                                    style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                                >
                                    <source src="https://nipt.tr/nipt.tr/NIPT_Verifi.m4a" type="audio/mp4" />
                                    Tarayıcınız ses oynatıcıyı desteklemiyor.
                                </audio>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            */}

            {/* 2. Verifi ve Verifi Plus Nedir? */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Verifi ve Verifi Plus Prenatal Testler Nedir?</h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
                            Verifi ve Verifi Plus Prenatal Testler, bebeğinizin sağlığı hakkında erken bilgi almanızı sağlayan,
                            güvenli ve ağrısız tarama testleridir. Gebeliğinizin 10. haftasından itibaren sadece anne adayından
                            alınan tek bir kan örneği ile en yaygın kromozom farklılıklarını tespit edebilir.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <Clock className="text-blue-600 mb-4" size={32} />
                            <h3 className="font-bold text-slate-900 mb-2">Hızlı Sonuç</h3>
                            <p className="text-slate-600 text-sm">7-10 gün içinde sonuçlarınız hazır</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                            <ShieldCheck className="text-green-600 mb-4" size={32} />
                            <h3 className="font-bold text-slate-900 mb-2">Yüksek Güvenilirlik</h3>
                            <p className="text-slate-600 text-sm">Daha az yanlış alarm, daha doğru sonuçlar</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <Award className="text-amber-600 mb-4" size={32} />
                            <h3 className="font-bold text-slate-900 mb-2">En Düşük Başarısızlık</h3>
                            <p className="text-slate-600 text-sm">Sektördeki en düşük oran: %0.1</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Verifi Prenatal Test */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-4">VERİFİ PRENATAL TEST</div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Verifi Prenatal Test</h2>
                            <p className="text-slate-600 leading-relaxed mb-8">
                                Verifi Prenatal Test, hem tek bebek hem de ikiz gebeliklerde en yaygın kromozom farklılıklarını
                                ve bebeğin cinsiyetiyle ilgili kromozom durumlarını tarar. Tamamen güvenli, ağrısız ve non-invaziv
                                (ameliyatsız) bir testtir.
                            </p>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-6">
                                <h3 className="font-bold text-slate-900 mb-4">Neden Verifi?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-blue-500 mt-0.5 shrink-0" size={20} />
                                        <span className="text-slate-600">Klasik tarama testlerinden daha güvenilir (daha az yanlış pozitif)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-blue-500 mt-0.5 shrink-0" size={20} />
                                        <span className="text-slate-600">Hızlı sonuç (7-10 gün)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-blue-500 mt-0.5 shrink-0" size={20} />
                                        <span className="text-slate-600">Yüksek doğruluk oranı ve düşük başarısızlık riski</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users className="text-blue-600" size={20} />
                                    Kimler İçin Uygundur?
                                </h3>
                                <ul className="space-y-3 text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        35 yaş ve üzeri anne adayları
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Serum tarama testi pozitif çıkan anneler
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Ultrason bulgularında anormallik saptanan gebeler
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Ailesinde kromozom hastalığı öyküsü olanlar
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Düşük riskli olsa bile endişe duyan tüm anne adayları
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-600 p-6 rounded-2xl text-white">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Dna size={20} />
                                    Hangi Durumları Tarar?
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        Trizomi 21 (Down sendromu)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        Trizomi 18 (Edwards sendromu)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        Trizomi 13 (Patau sendromu)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        Cinsiyet kromozomu farklılıkları
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infographic Section */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Verifi Testleri: Bir Bakışta Karşılaştırma</h2>
                        <p className="text-slate-600">Resme tıklayarak büyütebilirsiniz</p>
                    </div>
                    <div
                        className="max-w-4xl mx-auto cursor-pointer group relative"
                        onClick={() => setShowInfographic(true)}
                    >
                        <img
                            src="/images/verifi_infographic.jpg"
                            alt="Verifi Doğum Öncesi Testleri Karşılaştırma İnfografiği"
                            className="w-full rounded-2xl shadow-xl border border-slate-200 transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-opacity">
                                <ZoomIn size={20} className="text-blue-600" />
                                <span className="font-semibold text-slate-700">Büyütmek için tıklayın</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Verifi Plus Prenatal Test */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm mb-4">
                                VERİFİ PLUS PRENATAL TEST
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Verifi Plus Prenatal Test</h2>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                                Verifi Plus Prenatal Test, Verifi Prenatal Test'in tüm özelliklerini içerir ve ek olarak daha geniş tarama seçenekleri sunar.
                                Kromozom farklılıklarının yanı sıra bazı küçük kromozom eksikliklerini (mikrodelesyonlar) ve tüm kromozomları tarayabilir.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200 mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <AlertCircle className="text-blue-600" size={28} />
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Verifi Plus'ın Farkı Nedir?</h3>
                                    <p className="text-slate-600">Ultrason bulgularında anormallik olmasına rağmen invaziv (amniyosentez gibi) işlem yaptırmak istemeyen anne adayları için ideal bir seçenektir.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Cinsiyet Kromozomu */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4">Cinsiyet Kromozomu Farklılıkları</h3>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-500" />
                                        Monozomi X (Turner sendromu)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-500" />
                                        XXX (Triple X sendromu)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-500" />
                                        XXY (Klinefelter sendromu)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-500" />
                                        XYY (Jacobs sendromu)
                                    </li>
                                </ul>
                            </div>

                            {/* Mikrodelesyon */}
                            <div className="bg-blue-600 p-6 rounded-2xl text-white">
                                <h3 className="font-bold mb-4">Mikrodelesyon Sendromları</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        1p36 silinmesi
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        4p- (Wolf-Hirschhorn)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        5p- (Cri-du-chat)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        15q11 (Prader-Willi/Angelman)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-200" />
                                        22q11 (DiGeorge)
                                    </li>
                                </ul>
                            </div>

                            {/* Genişletilmiş */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl text-white">
                                <h3 className="font-bold mb-4">Genişletilmiş Tarama</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <Microscope size={40} className="text-indigo-200" />
                                    <div>
                                        <p className="text-indigo-100 text-sm">Tüm 23 Kromozomun</p>
                                        <p className="font-bold text-xl">Tam Taraması</p>
                                    </div>
                                </div>
                                <p className="text-indigo-100 text-sm">
                                    En kapsamlı genetik tarama seçeneği ile her türlü kromozomal anomaliyi tespit edin.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Technology Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">ÜSTÜN TEKNOLOJİ</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">Illumina Teknolojisi</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">1</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Massive Parallel Sequencing (MPS)</h3>
                                    <p className="text-slate-600">
                                        Bebeğin DNA'sının milyonlarca kopyası aynı anda, paralel olarak analiz edilir.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">2</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">SAFeR™ Algoritması</h3>
                                    <p className="text-slate-600">
                                        Illumina'nın patentli biyoinformatik algoritması, yanlış pozitif verme ihtimalini minimize eder.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">3</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Sıfıra Yakın Tekrar Gereksinimi</h3>
                                    <p className="text-slate-600">
                                        Diğer testlerde %2-5 olan "sonuç verememe" durumu, Verifi'de %0.1'e indirilmiştir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
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
                                    <span>Illumina Sekanslama</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                                    <CheckCircle2 size={18} className="text-green-500" />
                                    <span className="font-semibold text-green-800">SAFeR™ ile Yüksek Doğruluklu Sonuç</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Sıkça Sorulan Sorular</h2>

                    <div className="space-y-4">
                        {[
                            { q: "Verifi ile MomGuard arasındaki fark nedir?", a: "Verifi, %99.9 doğruluk oranı, daha hızlı sonuç süresi (7-10 gün) ve Illumina'nın özel SAFeR teknolojisi ile 'Premium' seçeneğimizdir. Ayrıca opsiyonel olarak daha geniş bir mikrodelesyon paneli sunar." },
                            { q: "Mikrodelesyon paneli yaptırmalı mıyım?", a: "Mikrodelesyonlar (küçük kromozom kayıpları) yaşa bağlı değildir ve standart taramalarda gözden kaçabilir. Daha kapsamlı bir bilgi isteyen aileler için önerilir." },
                            { q: "Verifi testinin başarısız olma ihtimali var mı?", a: "%0.1 oranıyla sektördeki en düşük başarısızlık (no-call) oranına sahiptir. Nadiren de olsa sonuç alınamazsa, ücretsiz tekrar testi yapılır." },
                            { q: "Test sonuçlarını doktorum kabul edecek mi?", a: "Evet. Verifi, tüm dünyada altın standart olarak kabul edilen Illumina teknolojisini kullanır ve sonuç raporları uluslararası geçerliliğe sahiptir." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                                >
                                    {faq.q}
                                    {openFaqIndex === i ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-slate-400" />}
                                </button>
                                {openFaqIndex === i && (
                                    <div className="px-5 pb-5 pt-0 text-slate-600 leading-relaxed">
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

            {/* Infographic Modal/Lightbox */}
            {showInfographic && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setShowInfographic(false)}
                >
                    <button
                        className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                        onClick={() => setShowInfographic(false)}
                    >
                        <X size={28} />
                    </button>
                    <img
                        src="/images/verifi_infographic.jpg"
                        alt="Verifi Doğum Öncesi Testleri Karşılaştırma İnfografiği"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};
