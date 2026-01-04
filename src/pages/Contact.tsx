import React, { useState, useEffect } from 'react';
import {
    Phone, Mail, MessageCircle, MessageSquare,
    MapPin, Clock, Zap, ChevronDown, CheckCircle2,
    Facebook, Instagram, Linkedin, Twitter, ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../lib/contentApi';

export const Contact = ({ setView }: { setView: any }) => {
    const { t, i18n } = useTranslation();
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

    // Tenant Detection
    const hostname = window.location.hostname;
    const isWestesti = hostname.includes('westesti.com');
    const isTrombofili = hostname.includes('trombofili.com');

    // nipt.tr is default per user request "nipt.tr için yapacağız"
    const [tenantInfo, setTenantInfo] = useState({
        name: isWestesti ? "Westesti" : (isTrombofili ? "Trombofili" : "Omega Genetik"),
        address: isWestesti ? "İzmir Teknoloji Bölgesi, No:45 İZMİR" : (isTrombofili ? "İstanbul Sağlık Kompleksi, No:88 İSTANBUL" : "Beytepe, Piri Reis Cd. No:2, 06800 Çankaya/Ankara"),
        phone: "0312 920 13 62",
        email: isWestesti ? "info@westesti.com" : (isTrombofili ? "info@trombofili.com" : "info@nipt.tr"),
        whatsapp: "+905121234567",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3062.4006888171143!2d32.7149779768172!3d39.86526178901753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d338a78e430393%3A0x4c487482bb230c3!2sBeytepe%2C%20Piri%20Reis%20Cd.%20No%3A2%2C%2006800%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1766942085088!5m2!1str!2str"
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadConfig = async () => {
            const lang = (i18n.language || 'tr').split('-')[0];
            const tenantCode = isWestesti ? 'westesti' : (isTrombofili ? 'trombofili' : 'nipt');
            try {
                const data = await fetchAPI('get_contact_config_public', { language: lang, tenant_code: tenantCode });
                if (data && data.success && data.data) {
                    const config = data.data;
                    setTenantInfo(prev => ({
                        ...prev,
                        name: config.contact_title || prev.name,
                        address: config.address_line1 + (config.city ? `, ${config.city}` : '') || prev.address,
                        phone: config.phone || prev.phone,
                        email: config.email || prev.email,
                    }));
                }
            } catch (err) {
                console.error("Failed to load contact config:", err);
            }
        };
        loadConfig();
    }, [i18n.language]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage(null);

        try {
            const response = await fetchAPI('submit_contact_message', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            }, 'POST');

            if (response.success) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
            } else {
                setStatus('error');
                setErrorMessage(response.error || 'Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyiniz.');
            }
        } catch (error: any) {
            console.error('Contact form error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
        }
    };

    const faqs = [
        { q: t("contact.faq_1", "Randevu almak için nereye iletişime geçmeliyim?"), a: t("contact.faq_1_a", "Randevu almak için telefon, e-posta veya WhatsApp aracılığıyla bize ulaşabilirsiniz. İletişim formunu doldurarak da talebinizi iletebilirsiniz.") },
        { q: t("contact.faq_2", "Hafta sonları hizmet veriyor musunuz?"), a: t("contact.faq_2_a", "Evet, Cumartesi günleri 09:00-16:00 saatleri arasında hizmet veriyoruz. Pazar günleri kapalıyız.") },
        { q: t("contact.faq_3", "Acil durumlarda kime ulaşabilirim?"), a: t("contact.faq_3_a", "Acil durumlarda lütfen direkt olarak 0312 920 13 62 numaradan bize ulaşın. Çalışma saatleri dışında mesaj bırakabilirsiniz.") },
        { q: t("contact.faq_4", "Kişisel verilerim güvenli mi?"), a: t("contact.faq_4_a", "Evet, tüm kişisel verileriniz KVKK (Kişisel Verileri Koruma Kanunu) uyarınca korunmaktadır. Detaylar için gizlilik politikamızı okuyunuz.") },
        { q: t("contact.faq_5", "Yurt dışından hizmet alabilir miyim?"), a: t("contact.faq_5_a", "Evet, yurt dışından da hizmet alabilirsiniz. Lütfen bize ulaşarak detayları konuşunuz.") }
    ];

    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                        <ArrowLeft size={20} /> {t("case_edu.back_home")}
                    </button>
                    <div className="text-sm font-bold text-sky-600 uppercase tracking-widest">{tenantInfo.name}</div>
                </div>
            </div>

            {/* Hero Section - Podcast Style with Image */}
            <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-16 md:py-24 px-4 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                                <Mail size={16} />
                                <span>İletişim</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                NIPT ile ilgili sorularınızda yanınızdayız
                            </h1>

                            <p className="text-lg text-white/80 mb-8 leading-relaxed">
                                NIPT testi, gebelik haftanız, sonuçların değerlendirilmesi veya randevu süreçleri hakkında
                                sorularınız olduğunda, Nipt.tr ekibiyle güvenle iletişime geçebilirsiniz.
                            </p>

                            {/* Key Points - Pill Style */}
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-white/10 rounded-full text-sm flex items-center gap-2">
                                    <Zap size={14} className="text-green-400" />
                                    Hızlı geri dönüş
                                </span>
                                <span className="px-4 py-2 bg-white/10 rounded-full text-sm flex items-center gap-2">
                                    <MessageSquare size={14} className="text-sky-400" />
                                    Uzman ekip
                                </span>
                                <span className="px-4 py-2 bg-white/10 rounded-full text-sm flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-purple-400" />
                                    Güvenli veri iletişimi
                                </span>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="hidden md:block relative">
                            <div className="aspect-square max-w-md mx-auto relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl transform rotate-3"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-3xl transform -rotate-3"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 flex flex-col items-center justify-center h-full">
                                    <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                                        <Phone size={48} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">7/24 Destek</h3>
                                    <p className="text-white/60 text-center text-sm">
                                        Uzman kadromuz sorularınız için her zaman hazır
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-12 px-6 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MethodCard
                        icon={<Phone className="text-sky-600" />}
                        title={t("contact.method_phone")}
                        value={tenantInfo.phone}
                        btnText={t("contact.method_phone_btn")}
                        link={`tel:${tenantInfo.phone.replace(/\s/g, '')}`}
                    />
                    <MethodCard
                        icon={<Mail className="text-sky-600" />}
                        title={t("contact.method_email")}
                        value={tenantInfo.email}
                        btnText={t("contact.method_email_btn")}
                        link={`mailto:${tenantInfo.email}`}
                    />
                    <MethodCard
                        icon={<MessageCircle className="text-green-600" />}
                        title={t("contact.method_whatsapp")}
                        value={tenantInfo.whatsapp}
                        btnText={t("contact.method_whatsapp_btn")}
                        link={`https://wa.me/${tenantInfo.whatsapp.replace(/\+/g, '')}`}
                        isGreen
                    />
                    <MethodCard
                        icon={<MessageSquare className="text-sky-600" />}
                        title={t("contact.method_chat")}
                        value={t("contact.method_chat_desc")}
                        btnText={t("contact.method_chat_btn")}
                        onClick={() => alert('Live Chat starting...')}
                    />
                </div>
            </section>

            {/* Main Content: Info Left + Form Right - Podcast Style */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left: Contact Info Card (40%) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                İletişim Bilgilerimiz
                            </h3>

                            <div className="space-y-6">
                                <InfoItem
                                    icon={<Phone />}
                                    title="Telefon"
                                    content={
                                        <a href={`tel:${tenantInfo.phone.replace(/\s/g, '')}`} className="hover:text-purple-600 transition-colors">
                                            {tenantInfo.phone}
                                        </a>
                                    }
                                />
                                <InfoItem
                                    icon={<Mail />}
                                    title="E-posta"
                                    content={
                                        <a href={`mailto:${tenantInfo.email}`} className="hover:text-purple-600 transition-colors">
                                            {tenantInfo.email}
                                        </a>
                                    }
                                />
                                <InfoItem
                                    icon={<MapPin />}
                                    title="Adres"
                                    content={tenantInfo.address}
                                />
                                <InfoItem
                                    icon={<Clock />}
                                    title="Çalışma Saatleri"
                                    content={
                                        <div className="text-sm space-y-1">
                                            <div>Pazartesi - Cuma: 08:00 - 18:00</div>
                                            <div>Cumartesi: 09:00 - 16:00</div>
                                            <div className="text-red-500">Pazar: Kapalı</div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        {/* Quick Action Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 md:p-8 rounded-2xl text-white">
                            <h4 className="font-bold text-lg mb-3">WhatsApp ile Ulaşın</h4>
                            <p className="text-white/80 text-sm mb-4">
                                Hızlı bir şekilde sorularınıza yanıt almak için WhatsApp üzerinden bize yazabilirsiniz.
                            </p>
                            <a
                                href={`https://wa.me/${tenantInfo.whatsapp.replace(/\+/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors"
                            >
                                <MessageCircle size={18} />
                                WhatsApp'ta Yaz
                            </a>
                        </div>
                    </div>

                    {/* Right: Form Card (60%) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Bize Ulaşın</h2>
                            <p className="text-slate-500 text-sm mb-8">
                                Aşağıdaki formu doldurarak NIPT testi ve süreçleri hakkında sorunuzu iletebilirsiniz.
                            </p>

                            {status === 'success' ? (
                                <div className="py-12 text-center animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Mesajınız bize ulaştı!</h3>
                                    <p className="text-slate-600 mb-6">En kısa sürede sizinle iletişime geçeceğiz.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-purple-600 font-bold hover:underline"
                                    >
                                        Yeni bir mesaj gönder
                                    </button>
                                </div>
                            ) : status === 'error' ? (
                                <div className="py-12 text-center animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl">⚠️</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Bir hata oluştu</h3>
                                    <p className="text-slate-600 mb-6">{errorMessage || 'Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyiniz.'}</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-purple-600 font-bold hover:underline"
                                    >
                                        Tekrar dene
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormGroup
                                            label={t("contact.form_name")}
                                            id="name"
                                            type="text"
                                            placeholder={t("contact.form_name_ph")}
                                            value={formData.name}
                                            onChange={(v: string) => setFormData({ ...formData, name: v })}
                                            required
                                        />
                                        <FormGroup
                                            label={t("contact.form_email")}
                                            id="email"
                                            type="email"
                                            placeholder={t("contact.form_email_ph")}
                                            value={formData.email}
                                            onChange={(v: string) => setFormData({ ...formData, email: v })}
                                            required
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormGroup
                                            label={t("contact.form_phone")}
                                            id="phone"
                                            type="tel"
                                            placeholder={t("contact.form_phone_ph")}
                                            value={formData.phone}
                                            onChange={(v: string) => setFormData({ ...formData, phone: v })}
                                            required
                                        />
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-slate-700">{t("contact.form_subject")}</label>
                                            <select
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none appearance-none"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                            >
                                                <option value="">{t("contact.form_subject_ph")}</option>
                                                <option value="booking">{t("contact.form_subject_booking")}</option>
                                                <option value="question">{t("contact.form_subject_question")}</option>
                                                <option value="test_info">{t("contact.form_subject_test_info")}</option>
                                                <option value="technical">{t("contact.form_subject_technical")}</option>
                                                <option value="feedback">{t("contact.form_subject_feedback")}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700">{t("contact.form_message")}</label>
                                        <textarea
                                            rows={5}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none resize-none"
                                            placeholder={t("contact.form_message_ph")}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex items-start gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            id="consent"
                                            className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                            checked={formData.consent}
                                            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                            required
                                        />
                                        <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                            {t("contact.form_consent")}
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    >
                                        {status === 'sending' ? t("contact.form_sending") : t("contact.form_submit")}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right: Company Info (30%) */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">{t("contact.info_title")}</h3>

                            <div className="space-y-8">
                                <InfoItem icon={<MapPin />} title={t("contact.info_address")} content={tenantInfo.address} />
                                <InfoItem
                                    icon={<Clock />}
                                    title={t("contact.info_hours")}
                                    content={
                                        <div className="text-sm">
                                            <div className="flex justify-between mb-1"><span>{t("contact.info_hours_mon_fri")}:</span> <span>08:00 - 18:00</span></div>
                                            <div className="flex justify-between mb-1"><span>{t("contact.info_hours_sat")}:</span> <span>09:00 - 16:00</span></div>
                                            <div className="flex justify-between text-red-500"><span>{t("contact.info_hours_sun")}:</span> <span>{t("contact.info_hours_closed")}</span></div>
                                        </div>
                                    }
                                />
                                <InfoItem
                                    icon={<Zap />}
                                    title={t("contact.info_response")}
                                    content={
                                        <div className="text-sm space-y-1">
                                            <p>{t("contact.info_response_email")}</p>
                                            <p>{t("contact.info_response_phone")}</p>
                                            <p>{t("contact.info_response_whatsapp")}</p>
                                        </div>
                                    }
                                />
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t("contact.info_social")}</h4>
                                <div className="flex gap-4">
                                    <SocialLink icon={<Facebook size={20} />} href="https://facebook.com" />
                                    <SocialLink icon={<Instagram size={20} />} href="https://instagram.com" />
                                    <SocialLink icon={<Linkedin size={20} />} href="https://linkedin.com" />
                                    <SocialLink icon={<Twitter size={20} />} href="https://twitter.com" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Quote / Widget placeholders */}
                        <div className="bg-gradient-to-br from-indigo-600 to-sky-700 p-8 rounded-[2rem] text-white shadow-xl">
                            <h4 className="font-bold text-xl mb-4">Hızlı Teklif Alın</h4>
                            <p className="text-sky-100 text-sm mb-6 leading-relaxed">Laboratuvarınız için toplu test fiyatlarını merak ediyor musunuz?</p>
                            <button className="w-full py-4 bg-white text-sky-700 font-bold rounded-xl hover:bg-sky-50 transition-colors">Teklif Talep Et</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Embedded Map */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-12">{t("contact.map_title")}</h2>
                    <div className="h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                        <iframe
                            src={tenantInfo.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Office Location"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-center font-heading text-4xl font-bold text-slate-900 mb-16">{t("contact.faq_title")}</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full px-8 py-6 flex justify-between items-center text-left"
                                >
                                    <span className="font-bold text-slate-800">{faq.q}</span>
                                    <ChevronDown className={`text-slate-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`px-8 overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const MethodCard = ({ icon, title, value, btnText, link, onClick, isGreen = false }: any) => (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-all duration-300">
        <div className={`w-14 h-14 ${isGreen ? 'bg-green-50' : 'bg-sky-50'} rounded-2xl flex items-center justify-center mb-6`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 truncate">{value}</p>
        {link ? (
            <a href={link} className={`w-full block text-center py-3 ${isGreen ? 'bg-green-600 hover:bg-green-700' : 'bg-sky-600 hover:bg-sky-700'} text-white font-bold rounded-xl transition-colors`}>
                {btnText}
            </a>
        ) : (
            <button onClick={onClick} className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors">
                {btnText}
            </button>
        )}
    </div>
);

const FormGroup = ({ label, id, type, placeholder, value, onChange, required }: { label: string, id: string, type: string, placeholder: string, value: string, onChange: (v: string) => void, required?: boolean }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-bold text-slate-700">{label}</label>
        <input
            type={type}
            id={id}
            required={required}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const InfoItem = ({ icon, title, content }: any) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</h4>
            <div className="text-slate-700 font-medium leading-relaxed">{content}</div>
        </div>
    </div>
);

const SocialLink = ({ icon, href }: any) => (
    <a href={href} target="_blank" className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all">
        {icon}
    </a>
);
