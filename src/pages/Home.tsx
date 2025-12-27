// src/pages/Home.tsx
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getModuleContentTranslated } from '../data/content';
import { useLandingConfig } from '../hooks/useLandingConfig';
import { useContactConfig } from '../hooks/useContactConfig';
// Calculator ikonunu ekledik
import { ShieldCheck, ArrowRight, XCircle, CheckCircle, Loader2, Send, Calculator, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FAQItem } from '../components/FAQItem';
import { useNotification } from '../components/NotificationProvider';

// ---> 1. EmailJS import edildi
import emailjs from '@emailjs/browser';

interface HomeProps {
    setView: (view: any) => void;
    scrollTo?: string;
}

export const Home: React.FC<HomeProps> = ({ setView, scrollTo }) => {
    const { t, i18n } = useTranslation();
    const notify = useNotification();
    const { config: landingConfig } = useLandingConfig();
    const { config: contactConfig } = useContactConfig();

    // Auto-scroll effect
    useEffect(() => {
        if (scrollTo) {
            // Small timeout to ensure DOM is ready and layout is stable
            setTimeout(() => {
                const element = document.getElementById(scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [scrollTo]);

    // Dil değiştiğinde modül içeriklerini yeniden hesapla
    const modules = getModuleContentTranslated(t);

    // Hero content - prefer landing config, fallback to i18n
    const heroBadge = landingConfig?.hero_badge || t("hero_badge");
    const heroTitle = landingConfig?.hero_title || `${t("hero_title_1")} ${t("hero_title_2")}`;
    const heroSubtitle = landingConfig?.hero_subtitle || t("hero_desc");
    const primaryCtaLabel = landingConfig?.primary_cta_label || t("btn_demo");
    const primaryCtaUrl = landingConfig?.primary_cta_url || "#contact";
    const secondaryCtaLabel = landingConfig?.secondary_cta_label || t("btn_discover");
    const secondaryCtaUrl = landingConfig?.secondary_cta_url || "#features";

    // Contact Form State
    const [contactForm, setContactForm] = useState({
        full_name: '',
        email: '',
        organization: '',
        subject: '',
        message_body: '',
        consent: false
    });
    const [contactStatus, setContactStatus] = useState('idle');
    const [showcaseFaqs, setShowcaseFaqs] = useState<Array<{ id: number, question: string, answer: string }>>([]);

    // Fetch showcased FAQs
    useEffect(() => {
        const fetchShowcaseFaqs = async () => {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            try {
                const response = await fetch(`${API_URL}/index.php?action=get_faqs_showcase&language=${i18n.language}&limit=4`);
                const data = await response.json();
                if (data.success && data.data) {
                    setShowcaseFaqs(data.data);
                }
            } catch (err) {
                console.error('FAQ fetch error:', err);
            }
        };
        fetchShowcaseFaqs();
    }, [i18n.language]);

    // Backend API Contact Submit
    const handleContactSubmit = async (e: any) => {
        e.preventDefault();

        if (!contactForm.consent) {
            notify.error(t("form_consent_error") || "Lütfen KVKK metnini onaylayınız.");
            return;
        }

        setContactStatus('loading');
        const API_URL = import.meta.env.VITE_API_URL || '/api';

        try {
            const response = await fetch(`${API_URL}/index.php?action=contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm)
            });
            const data = await response.json();

            if (data.success) {
                setContactStatus('success');
                setContactForm({ full_name: '', email: '', organization: '', subject: '', message_body: '', consent: false });
            } else {
                console.error("API Error:", data.error);
                notify.error(data.error || "Bir hata oluştu.");
                setContactStatus('error');
            }
        } catch (err) {
            console.error("Network Error:", err);
            notify.error("Bağlantı hatası.");
            setContactStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">

            {/* 1. HERO SECTION */}
            <section
                className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6"
                style={landingConfig?.hero_use_gradient_background ? {
                    background: `linear-gradient(${landingConfig.hero_gradient_bg_angle || 180}deg, ${landingConfig.hero_gradient_bg_from || '#1E293B'}, ${landingConfig.hero_gradient_bg_to || '#0F172A'})`,
                } : undefined}
            >
                <div className={`absolute inset-0 z-0 ${landingConfig?.hero_use_gradient_background ? '' : 'bg-slate-900'} overflow-hidden`}>
                    <img src={landingConfig?.hero_image_url || "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover opacity-20 blur-sm scale-105 animate-pulse-slow" />
                    {!landingConfig?.hero_use_gradient_background && (
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-50"></div>
                    )}
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-2xl tracking-wide uppercase">
                        <ShieldCheck size={14} /> {heroBadge}
                    </div>
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                        {landingConfig?.hero_title_line1 ? (
                            <>
                                {/* Line 1 */}
                                <span
                                    style={landingConfig.hero_line1_use_gradient_text ? {
                                        background: `linear-gradient(${landingConfig.hero_line1_gradient_angle || 90}deg, ${landingConfig.hero_line1_gradient_from || '#4F46E5'}, ${landingConfig.hero_line1_gradient_to || '#22C55E'})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    } : { color: landingConfig.hero_line1_solid_color || '#FFFFFF' }}
                                >
                                    {landingConfig.hero_title_line1}
                                </span>
                                {landingConfig.hero_title_line2 && (
                                    <>
                                        <br />
                                        {/* Line 2 */}
                                        <span
                                            style={landingConfig.hero_line2_use_gradient_text ? {
                                                background: `linear-gradient(${landingConfig.hero_line2_gradient_angle || 90}deg, ${landingConfig.hero_line2_gradient_from || '#EC4899'}, ${landingConfig.hero_line2_gradient_to || '#8B5CF6'})`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            } : { color: landingConfig.hero_line2_solid_color || '#EC4899' }}
                                        >
                                            {landingConfig.hero_title_line2}
                                        </span>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <span className="text-white">{t("hero_title_1")}</span> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">{t("hero_title_2")}</span>
                            </>
                        )}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
                        {heroSubtitle}
                    </p>

                    {/* Omega Trust Line */}
                    <div className="flex items-center justify-center gap-2 mb-10 opacity-80">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Supported by</span>
                        <img src="/omega_logo.png" alt="Omega CRO" className="h-4 w-auto grayscale opacity-60" />
                        <span className="text-sm text-slate-500 font-medium">Omega Araştırma’nın 25+ yıllık klinik araştırma tecrübesi</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => {
                            const target = primaryCtaUrl.startsWith('#') ? primaryCtaUrl.slice(1) : 'contact';
                            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
                        }} className="px-8 py-4 bg-rose-600 text-white font-bold rounded-xl shadow-xl hover:bg-rose-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            {primaryCtaLabel} <ArrowRight size={18} />
                        </button>
                        <button onClick={() => {
                            const target = secondaryCtaUrl.startsWith('#') ? secondaryCtaUrl.slice(1) : 'features';
                            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
                        }} className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all">
                            {secondaryCtaLabel}
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. PARTNERLER */}
            <section className="py-10 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{t("partners_title")}</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        <img src="/partner_turkbic.png" alt="TURKBIC" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />
                        <img src="/partner_hacettepe.png" alt="Hacettepe Romatoloji" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />
                        <img src="/partner_tihud.png" alt="TIHUD" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
                        <img src="/partner_sinovac.png" alt="Sinovac" className="h-8 w-auto object-contain hover:scale-105 transition-transform" />
                    </div>
                </div>
            </section>

            {/* 3. KARŞILAŞTIRMA (PROBLEM/ÇÖZÜM) + ROI BUTTON */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="text-center mb-8 md:col-span-2">
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t("prob_title")}</h2>
                            <p className="text-slate-500">{t("prob_desc")}</p>
                        </div>

                        {/* Geleneksel */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-4 py-1 rounded-bl-2xl text-xs font-bold">{t("roi_trad_label")}</div>
                            <ul className="space-y-4 mt-4">
                                <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0" /> <span>{t("bad_1")}</span></li>
                                <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0" /> <span>{t("bad_2")}</span></li>
                                <li className="flex items-start gap-3 text-slate-600"><XCircle className="text-red-500 shrink-0" /> <span>{t("bad_3")}</span></li>
                            </ul>
                        </div>

                        {/* Turp Yöntemi */}
                        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden transform md:scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold">{t("roi_turp_label")}</div>
                            <ul className="space-y-4 mt-4">
                                <li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0" /> <span className="text-white font-medium">{t("good_1")}</span></li>
                                <li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0" /> <span className="text-white font-medium">{t("good_2")}</span></li>
                                <li className="flex items-start gap-3 text-slate-300"><CheckCircle className="text-green-400 shrink-0" /> <span className="text-white font-medium">{t("good_3")}</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* ---> ROI BUTONU <--- */}
                    <div className="text-center mt-12 bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
                        <p className="text-slate-500 mb-4 text-sm font-medium">{t("roi_desc")}</p>
                        <button
                            onClick={() => setView({ type: 'roi' })}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-100 rounded-full text-slate-700 font-bold hover:border-rose-500 hover:text-rose-600 hover:shadow-lg transition-all"
                        >
                            <Calculator size={20} />
                            {t("roi_title")}
                        </button>
                    </div>

                </div>
            </section>

            {/* 4. BENTO GRID (MODÜLLER - ÇEVİRİ UYUMLU) */}
            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">{t("modules_title")}</h2>
                    <p className="text-lg text-slate-500">{t("modules_desc")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {Object.entries(modules).map(([key, val], i) => {
                        const isBig = i === 0 || i === 6;
                        const colors = isBig ? 'md:col-span-2 bg-gradient-to-br from-rose-600 to-purple-700 text-white' : 'bg-white border border-slate-200 text-slate-900 shadow-lg hover:border-rose-400';
                        return (
                            <div key={key} onClick={() => setView({ type: 'module', id: key })} className={`cursor-pointer ${colors} rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isBig ? 'bg-white/20 backdrop-blur' : 'bg-green-100 text-green-600'}`}>
                                        {React.createElement(val.icon, { size: 24 })}
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold mb-3">{val.title}</h3>
                                    <p className={`text-lg ${isBig ? 'text-rose-100' : 'text-slate-500'}`}>{val.short}</p>
                                </div>
                                {isBig && <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>}
                                <ArrowRight className={`absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity ${isBig ? 'text-white' : 'text-slate-900'}`} />
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* 5. WORKFLOW (AKIŞ) */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16"><h2 className="font-heading text-3xl font-bold text-slate-900">{t("flow_title")}</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {['1', '2', '3', '4'].map(num => (
                            <div key={num}>
                                <div className="w-20 h-20 mx-auto bg-slate-50 border-4 border-white rounded-full flex items-center justify-center text-xl font-bold text-rose-600 mb-4 shadow-sm">{num}</div>
                                <h3 className="font-bold text-slate-900">{t(`flow_${num}_t`)}</h3>
                                <p className="text-xs text-slate-500 px-4">{t(`flow_${num}_d`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. İSTATİSTİKLER */}
            <section className="py-20 bg-rose-600 text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {['1', '2', '3', '4'].map(num => (
                        <div key={num}>
                            <div className="text-4xl md:text-5xl font-heading font-extrabold mb-2">
                                {num === '1' ? '%45' : num === '2' ? '%99.8' : num === '3' ? '%30' : '7/24'}
                            </div>
                            <div className="text-rose-200 text-sm font-medium uppercase tracking-wide">{t(`stat_${num}`)}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. FAQ & İLETİŞİM FORMU (ÇEVİRİ UYUMLU) */}
            <section id="contact" className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">
                            {contactConfig?.contact_title || t("contact_title")}
                        </h2>
                        {contactConfig?.contact_subtitle && (
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                                {contactConfig.contact_subtitle}
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Left: Contact Info + FAQ */}
                        <div>
                            {/* Contact Information Card */}
                            {contactConfig && (
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
                                    <h3 className="font-semibold text-slate-900 mb-4">İletişim Bilgileri</h3>
                                    <div className="space-y-4">
                                        {(contactConfig.address_line1 || contactConfig.city) && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                                    <MapPin size={18} className="text-rose-600" />
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    {contactConfig.address_line1 && <div>{contactConfig.address_line1}</div>}
                                                    {contactConfig.address_line2 && <div>{contactConfig.address_line2}</div>}
                                                    <div>{contactConfig.city}{contactConfig.country && `, ${contactConfig.country}`}</div>
                                                </div>
                                            </div>
                                        )}
                                        {contactConfig.phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <Phone size={18} className="text-blue-600" />
                                                </div>
                                                <a href={`tel:${contactConfig.phone}`} className="text-sm text-slate-600 hover:text-rose-600">
                                                    {contactConfig.phone}
                                                </a>
                                            </div>
                                        )}
                                        {contactConfig.email && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                    <Mail size={18} className="text-emerald-600" />
                                                </div>
                                                <a href={`mailto:${contactConfig.email}`} className="text-sm text-slate-600 hover:text-rose-600">
                                                    {contactConfig.email}
                                                </a>
                                            </div>
                                        )}
                                        {contactConfig.working_hours && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                    <Clock size={18} className="text-purple-600" />
                                                </div>
                                                <span className="text-sm text-slate-600">{contactConfig.working_hours}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* FAQ */}
                            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-6">{t("faq_title")}</h3>
                            <div className="space-y-2">
                                {showcaseFaqs.length > 0
                                    ? showcaseFaqs.map(faq => <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />)
                                    : ['1', '2', '3'].map(num => <FAQItem key={num} question={t(`faq_${num}_q`)} answer={t(`faq_${num}_a`)} />)
                                }
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
                            {contactStatus === 'success' ? (
                                <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} /></div>
                                    <h3 className="font-heading text-3xl font-bold text-slate-900 mb-2">{contactConfig?.success_message || t("form_success_title")}</h3>
                                    <p className="text-slate-500 mb-8">{t("form_success_desc")}</p>
                                    <button onClick={() => setContactStatus('idle')} className="text-rose-600 font-bold hover:underline">{t("form_new")}</button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">İletişim Formu</h3>
                                    <p className="text-slate-500 mb-8 text-sm">{t("contact_desc")}</p>

                                    <form className="space-y-4" onSubmit={handleContactSubmit}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder={t("form_name")} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all font-medium text-slate-900"
                                                value={contactForm.full_name} onChange={e => setContactForm({ ...contactForm, full_name: e.target.value })} required />
                                            <input type="text" placeholder={t("form_company")} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all font-medium text-slate-900"
                                                value={contactForm.organization} onChange={e => setContactForm({ ...contactForm, organization: e.target.value })} />
                                        </div>
                                        <input type="email" placeholder={t("form_email")} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all font-medium text-slate-900"
                                            value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} required />

                                        <select
                                            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all font-medium ${contactForm.subject === "" ? "text-slate-400" : "text-slate-900"}`}
                                            value={contactForm.subject}
                                            onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                                            required
                                        >
                                            <option value="" disabled>{t("form_select")}</option>
                                            <option value="RWE - Real World Evidence">RWE - Real World Evidence</option>
                                            <option value="Phase III/IV Studies">Phase III/IV Studies</option>
                                            <option value="Medical Device Registries">Medical Device Registries</option>
                                            <option value="Other / General Inquiry">Diğer / Genel İletişim</option>
                                        </select>

                                        <textarea
                                            placeholder={t("form_message") || "Mesajınız..."}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-all h-32 resize-none font-medium text-slate-900"
                                            value={contactForm.message_body}
                                            onChange={e => setContactForm({ ...contactForm, message_body: e.target.value })}
                                            required
                                        ></textarea>

                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 transition-all"
                                                checked={contactForm.consent}
                                                onChange={e => setContactForm({ ...contactForm, consent: e.target.checked })}
                                            />
                                            <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors leading-snug">
                                                {t("form_consent_text") || "Kişisel verilerimin KVKK kapsamında işlenmesini ve tarafıma geri dönüş yapılmasını kabul ediyorum."}
                                            </span>
                                        </label>

                                        <button disabled={contactStatus === 'loading'} type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-rose-600 flex justify-center gap-2 shadow-lg shadow-slate-200 hover:shadow-rose-200 transition-all">
                                            {contactStatus === 'loading' ? <Loader2 className="animate-spin" /> : <> {t("form_send")} <Send size={18} /></>}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Map Embed */}
                    {contactConfig?.map_embed_url && (
                        <div className="mt-12 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                            <iframe
                                src={contactConfig.map_embed_url}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};