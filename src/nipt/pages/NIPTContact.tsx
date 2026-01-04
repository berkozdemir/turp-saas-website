import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import { useState, useEffect } from 'react';
import {
    Phone, Mail, MessageCircle, MapPin, Clock, Zap, ChevronDown, CheckCircle2, Send
} from 'lucide-react';

// Contact page specific to NIPT - uses hardcoded Turkish content instead of i18n
export const NIPTContact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consent: false
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const tenantInfo = {
        name: "Omega Genetik",
        address: "Beytepe, Piri Reis Cd. No:2, 06800 Çankaya/Ankara",
        phone: "0312 920 13 62",
        email: "info@nipt.tr",
        whatsapp: "+905121234567",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3062.4006888171143!2d32.7149779768172!3d39.86526178901753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d338a78e430393%3A0x4c487482bb230c3!2sBeytepe%2C%20Piri%20Reis%20Cd.%20No%3A2%2C%2006800%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1766942085088!5m2!1str!2str"
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
        }, 1500);
    };

    const faqs = [
        { q: "Randevu almak için nereye iletişime geçmeliyim?", a: "Randevu almak için telefon, e-posta veya WhatsApp aracılığıyla bize ulaşabilirsiniz. İletişim formunu doldurarak da talebinizi iletebilirsiniz." },
        { q: "Hafta sonları hizmet veriyor musunuz?", a: "Evet, Cumartesi günleri 09:00-16:00 saatleri arasında hizmet veriyoruz. Pazar günleri kapalıyız." },
        { q: "Acil durumlarda kime ulaşabilirim?", a: "Acil durumlarda lütfen direkt olarak 0312 920 13 62 numaradan bize ulaşın. Çalışma saatleri dışında mesaj bırakabilirsiniz." },
        { q: "Kişisel verilerim güvenli mi?", a: "Evet, tüm kişisel verileriniz KVKK uyarınca korunmaktadır." },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <NIPTHeader />

            {/* Hero Section */}
            <section className="relative py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/dna-pattern.svg')] opacity-5" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Bizimle İletişime Geçin</h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        Sorularınız için 7/24 hizmetinizdeyiz. Size en kısa sürede dönüş yapacağız.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-12 px-6 -mt-10 relative z-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContactCard
                        icon={<Phone className="text-blue-600" />}
                        title="Telefon"
                        value={tenantInfo.phone}
                        link={`tel:${tenantInfo.phone.replace(/\s/g, '')}`}
                        btnText="Hemen Ara"
                    />
                    <ContactCard
                        icon={<Mail className="text-blue-600" />}
                        title="E-posta"
                        value={tenantInfo.email}
                        link={`mailto:${tenantInfo.email}`}
                        btnText="E-posta Gönder"
                    />
                    <ContactCard
                        icon={<MessageCircle className="text-green-600" />}
                        title="WhatsApp"
                        value={tenantInfo.whatsapp}
                        link={`https://wa.me/${tenantInfo.whatsapp.replace(/\+/g, '')}`}
                        btnText="Mesaj Gönder"
                        isGreen
                    />
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-6 max-w-5xl mx-auto flex-1">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">İletişim Formu</h2>

                        {status === 'success' ? (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Mesajınız Alındı!</h3>
                                <p className="text-slate-500">En kısa sürede size dönüş yapacağız.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Adınız Soyadınız"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <input
                                        type="email"
                                        placeholder="E-posta Adresiniz"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Telefon Numaranız"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="">Konu Seçiniz</option>
                                    <option value="randevu">Randevu Talebi</option>
                                    <option value="bilgi">Bilgi Almak İstiyorum</option>
                                    <option value="sonuc">Sonuç Sorgulama</option>
                                    <option value="diger">Diğer</option>
                                </select>
                                <textarea
                                    placeholder="Mesajınız"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                                />
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.consent}
                                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                        required
                                        className="mt-1 w-5 h-5 rounded border-slate-300"
                                    />
                                    <span className="text-sm text-slate-600">
                                        KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
                                    </span>
                                </label>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === 'sending' ? 'Gönderiliyor...' : (
                                        <>
                                            <Send size={18} />
                                            Mesaj Gönder
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info & FAQ */}
                    <div className="space-y-8">
                        {/* Address */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-blue-600" />
                                Adresimiz
                            </h3>
                            <p className="text-slate-600 mb-4">{tenantInfo.address}</p>
                            <div className="aspect-video rounded-xl overflow-hidden">
                                <iframe
                                    src={tenantInfo.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-blue-600" />
                                Çalışma Saatleri
                            </h3>
                            <div className="space-y-2 text-slate-600">
                                <div className="flex justify-between">
                                    <span>Pazartesi - Cuma</span>
                                    <span className="font-medium">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cumartesi</span>
                                    <span className="font-medium">09:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Pazar</span>
                                    <span>Kapalı</span>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-blue-600" />
                                Sık Sorulan Sorular
                            </h3>
                            <div className="space-y-2">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="border-b border-slate-100 last:border-0">
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            className="w-full py-3 flex justify-between items-center text-left"
                                        >
                                            <span className="text-slate-700 font-medium">{faq.q}</span>
                                            <ChevronDown className={`text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} size={18} />
                                        </button>
                                        {activeFaq === i && (
                                            <p className="pb-3 text-sm text-slate-500">{faq.a}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};

// Helper Component
const ContactCard = ({ icon, title, value, link, btnText, isGreen, onClick }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-500 text-sm mb-4">{value}</p>
        <a
            href={link}
            onClick={onClick}
            className={`inline-block px-6 py-2.5 rounded-full font-semibold transition-all ${isGreen
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
        >
            {btnText}
        </a>
    </div>
);

export default NIPTContact;
