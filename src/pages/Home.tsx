// src/pages/Home.tsx
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getModuleContentTranslated } from '../data/content';
// Calculator ikonunu ekledik
import { ShieldCheck, ArrowRight, XCircle, CheckCircle, Loader2, Send, Calculator } from 'lucide-react';
import { FAQItem } from '../components/FAQItem';

// ---> 1. EmailJS import edildi
import emailjs from '@emailjs/browser';

interface HomeProps {
    setView: (view: any) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
    const { t, i18n } = useTranslation();

    // Dil değiştiğinde modül içeriklerini yeniden hesapla
    const modules = getModuleContentTranslated(t);

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
            alert(t("form_consent_error") || "Lütfen KVKK metnini onaylayınız.");
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
                alert(data.error || "Bir hata oluştu.");
                setContactStatus('error');
            }
        } catch (err) {
            console.error("Network Error:", err);
            alert("Bağlantı hatası.");
            setContactStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 blur-sm scale-105 animate-pulse-slow" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-50"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-2xl tracking-wide uppercase">
                        <ShieldCheck size={14} /> {t("hero_badge")}
                    </div>
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                        <span className="text-white">{t("hero_title_1")}</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">{t("hero_title_2")}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        {t("hero_desc")}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-rose-600 text-white font-bold rounded-xl shadow-xl hover:bg-rose-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            {t("btn_demo")} <ArrowRight size={18} />
                        </button>
                        <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all">
                            {t("btn_discover")}
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. PARTNERLER */}
            <section className="py-10 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{t("partners_title")}</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-2xl font-heading font-bold text-slate-800">PharmaCo</span>
                        <span className="text-2xl font-heading font-bold text-slate-800">NovusBio</span>
                        <span className="text-2xl font-heading font-bold text-slate-800">MED-DATA</span>
                        <span className="text-2xl font-heading font-bold text-slate-800">GenHealth</span>
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
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-8">{t("faq_title")}</h2>
                        <div className="space-y-2">
                            {showcaseFaqs.length > 0
                                ? showcaseFaqs.map(faq => <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />)
                                : ['1', '2', '3'].map(num => <FAQItem key={num} question={t(`faq_${num}_q`)} answer={t(`faq_${num}_a`)} />)
                            }
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
                        {contactStatus === 'success' ? (
                            <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} /></div>
                                <h3 className="font-heading text-3xl font-bold text-slate-900 mb-2">{t("form_success_title")}</h3>
                                <p className="text-slate-500 mb-8">{t("form_success_desc")}</p>
                                <button onClick={() => setContactStatus('idle')} className="text-rose-600 font-bold hover:underline">{t("form_new")}</button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">{t("contact_title")}</h3>
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
            </section>
        </div>
    );
};