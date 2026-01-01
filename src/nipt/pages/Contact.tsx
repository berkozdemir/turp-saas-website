import React, { useState, useEffect } from 'react';
import {
    Phone, Mail,
    MapPin, Clock, CheckCircle2,
    ChevronRight, ChevronLeft, Stethoscope, Baby, Home, FileText, User
} from 'lucide-react';
import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import NIPTSEO from '../components/NIPTSEO';
import { fetchContactConfig } from '../../lib/contentApi';
import { useTranslation } from 'react-i18next';

export const Contact = () => {
    const { i18n } = useTranslation();

    // Form State
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        // Step 1: Test Selection
        test_type: '', // momguard, verifi, veritas, consult

        // Step 2: Home Service
        home_service: null as boolean | null,
        city: '',
        address: '',

        // Step 3: Pregnancy
        pregnancy_week: '',

        // Step 4: Doctor
        has_doctor: null as boolean | null,
        doctor_id: '',
        doctor_name: '', // manual input

        // Step 5: Contact
        name: '',
        email: '',
        phone: '',
        message: '',
        consent: false
    });

    const [tenantInfo, setTenantInfo] = useState({
        name: "Omega Genetik Tanı Değerlendirme Mer",
        address: "Beytepe, Piri Reis Cd. No:2, 06800 Çankaya/Ankara",
        phone: "0312 920 13 62",
        email: "nipttesti@omega-gen.com",
        whatsapp: "+905077438688",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3062.4006888171143!2d32.7149779768172!3d39.86526178901753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d338a78e430393%3A0x4c487482bb230c3!2sBeytepe%2C%20Piri%20Reis%20Cd.%20No%3A2%2C%2006800%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1766942085088!5m2!1str!2str"
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        // Load Config
        const loadConfig = async () => {
            const lang = (i18n.language || 'tr').split('-')[0] as any;
            const config = await fetchContactConfig(lang, 'nipt');
            if (config) {
                setTenantInfo(prev => ({
                    ...prev,
                    name: config.contact_title || prev.name,
                    address: config.address_line1 || prev.address,
                    phone: config.phone || prev.phone,
                    email: config.email || prev.email,
                }));
            }
        };
        loadConfig();

        // Load Doctors
        const loadDoctors = async () => {
            try {
                const res = await fetch('/api/index.php?action=get_doctors');
                const data = await res.json();
                if (data.success || Array.isArray(data.data)) { // handle both array or wrapped
                    setDoctors(Array.isArray(data) ? data : (data.data || []));
                } else if (Array.isArray(data)) {
                    setDoctors(data);
                }
            } catch (err) {
                console.error("Failed to load doctors", err);
            }
        };
        loadDoctors();
    }, [i18n.language]);

    const formRef = React.useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        if (formRef.current) {
            const yOffset = -100; // Offset for header/sticky elements
            const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Toast State
    const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({ show: false, type: 'success', message: '' });

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    };

    const handleNext = () => {
        // Validation per step
        if (step === 1 && !formData.test_type) return showToast('error', 'Lütfen ilgilendiğiniz testi seçiniz.');
        if (step === 2 && formData.home_service === null) return showToast('error', 'Lütfen hizmet yeri tercihinizi belirtiniz.');
        if (step === 2 && formData.home_service && (!formData.address || !formData.city)) return showToast('error', 'Lütfen şehir ve adres bilgilerinizi eksiksiz giriniz.');
        if (step === 3 && (!formData.pregnancy_week || parseInt(formData.pregnancy_week) < 1 || parseInt(formData.pregnancy_week) > 42)) return showToast('error', 'Lütfen geçerli bir hamilelik haftası giriniz.');
        if (step === 4 && formData.has_doctor === null) return showToast('error', 'Lütfen doktor durumunuzu belirtiniz.');
        if (step === 4 && formData.has_doctor && !formData.doctor_id && !formData.doctor_name) return showToast('error', 'Lütfen doktorunuzu listeden seçin veya ismini girin.');

        setStep(prev => prev + 1);
        setTimeout(scrollToForm, 100);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        setTimeout(scrollToForm, 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.consent) {
            return showToast('error', 'Lütfen tüm zorunlu alanları doldurun.');
        }

        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch('/api/index.php?action=submit_nipt_contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // Check for non-JSON content type or empty response
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Non-JSON response:", text);
                throw new Error("Sunucu hatası: Geçersiz yanıt alındı.");
            }

            const result = await res.json();

            if (result.success) {
                setStatus('success');
                window.scrollTo(0, 0);
            } else {
                throw new Error(result.error || 'Bir hata oluştu.');
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message);
            showToast('error', err.message);
        }
    };

    const steps = [
        { id: 1, title: "Test Seçimi", icon: <FileText /> },
        { id: 2, title: "Hizmet Yeri", icon: <Home /> },
        { id: 3, title: "Hamilelik", icon: <Baby /> },
        { id: 4, title: "Doktor", icon: <Stethoscope /> },
        { id: 5, title: "İletişim", icon: <User /> },
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFC] font-sans relative">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slideDown border ${toast.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 text-white border-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={32} /> : <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold">!</div>}
                    <div>
                        <h4 className="font-bold text-lg">{toast.type === 'success' ? 'Harika!' : 'Dikkat'}</h4>
                        <p className="text-sm text-white/90">{toast.message}</p>
                    </div>
                </div>
            )}

            <NIPTSEO />
            <NIPTHeader />

            {/* Hero Section */}
            <section className="relative py-12 px-6 bg-blue-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-transparent"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">NIPT Randevu ve Bilgi Formu</h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Size en uygun çözümü sunabilmemiz için lütfen aşağıdaki adımları tamamlayın.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section ref={formRef} className="py-12 px-4 max-w-5xl mx-auto">
                {status === 'success' ? (
                    <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={64} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Talebiniz Başarıyla Alındı!</h2>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg">
                            Bilgileriniz uzman ekibimize iletilmiştir. En kısa sürede sizinle iletişime geçeceğiz.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => { setStatus('idle'); setStep(1); }}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                            >
                                Yeni Form Doldur
                            </button>
                            <a
                                href="/nipt"
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                            >
                                Ana Sayfaya Dön
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <div className="flex justify-between items-center max-w-3xl mx-auto relative">
                                {steps.map((s) => (
                                    <div key={s.id} className="flex flex-col items-center relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold ${step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                                            {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                                        </div>
                                        <span className={`text-[10px] md:text-xs font-bold mt-2 uppercase tracking-wide ${step >= s.id ? 'text-blue-600' : 'text-slate-400'}`}>{s.title}</span>
                                    </div>
                                ))}
                                {/* Line */}
                                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0">
                                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8 md:p-12">
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Test Selection */}
                                {step === 1 && (
                                    <div className="space-y-8 animate-fadeIn">
                                        <div className="text-center max-w-2xl mx-auto">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Hangi test ile ilgileniyorsunuz?</h3>
                                            <p className="text-slate-500">Size en uygun NIPT testini seçin veya uzmanlarımızdan danışmanlık talep edin.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                            <SelectionCard
                                                label="MomGuard NIPT"
                                                description="Temel ve güvenilir tarama."
                                                features={['Trizomi 21 (Down), 18, 13', 'Cinsiyet Kromozomları', 'Tekil ve İkiz Gebelikler']}
                                                selected={formData.test_type === 'MomGuard'}
                                                onClick={() => setFormData({ ...formData, test_type: 'MomGuard' })}
                                            />
                                            <SelectionCard
                                                label="Verifi NIPT"
                                                description="Standart kapsamlı analiz."
                                                features={['Tüm Kromozom Anöploidileri', 'Opsiyonel Mikrodelasyonlar', 'Yüksek Doğruluk Oranı']}
                                                selected={formData.test_type === 'Verifi'}
                                                onClick={() => setFormData({ ...formData, test_type: 'Verifi' })}
                                            />
                                            <SelectionCard
                                                label="Veritas NIPT"
                                                description="En kapsamlı genetik inceleme."
                                                features={['Tüm Genom İncelemesi', 'Tüm Mikrodelasyonlar', 'Detaylı Genetik Rapor']}
                                                selected={formData.test_type === 'Veritas'}
                                                onClick={() => setFormData({ ...formData, test_type: 'Veritas' })}
                                            />
                                            <SelectionCard
                                                label="Emin Değilim / Danışmak İstiyorum"
                                                description="Birlikte karar verelim."
                                                features={['Genetik Danışman Görüşmesi', 'Size Özel Test Önerisi', 'Ücretsiz Bilgilendirme']}
                                                selected={formData.test_type === 'consult'}
                                                onClick={() => setFormData({ ...formData, test_type: 'consult' })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Home Service */}
                                {step === 2 && (
                                    <div className="space-y-8 max-w-2xl mx-auto animate-fadeIn">
                                        <h3 className="text-2xl font-bold text-slate-900 text-center">Evde kan alımı istiyor musunuz?</h3>

                                        <div className="flex gap-6 justify-center">
                                            <RadioCard
                                                label="Evet, istiyorum"
                                                subLabel="Adresinize hemşire yönlendireceğiz."
                                                selected={formData.home_service === true}
                                                onClick={() => setFormData({ ...formData, home_service: true })}
                                            />
                                            <RadioCard
                                                label="Hayır"
                                                subLabel="Kliniğe geleceğim."
                                                selected={formData.home_service === false}
                                                onClick={() => setFormData({ ...formData, home_service: false, address: '' })}
                                            />
                                        </div>

                                        {formData.home_service === true && (
                                            <div className="pt-4 animate-slideDown space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Şehir</label>
                                                    <select
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    >
                                                        <option value="">-- Şehir Seçiniz --</option>
                                                        {['Adana', 'Ankara', 'Antalya', 'Bursa', 'Diyarbakır', 'Erzurum', 'Eskişehir', 'Gaziantep', 'İstanbul', 'İzmir', 'Kayseri', 'Kocaeli', 'Konya', 'Malatya', 'Mersin', 'Samsun', 'Şanlıurfa', 'Tekirdağ', 'Trabzon', 'Van', 'Diğer'].map(c => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Açık Adres</label>
                                                    <textarea
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                                        rows={3}
                                                        placeholder="Mahalle, sokak, kapı no..."
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Pregnancy Week */}
                                {step === 3 && (
                                    <div className="space-y-8 max-w-xl mx-auto text-center animate-fadeIn">
                                        <h3 className="text-2xl font-bold text-slate-900">Kaç haftalık gebesiniz?</h3>

                                        <div className="flex items-center justify-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                max="42"
                                                className="w-32 text-center text-4xl font-bold text-blue-600 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                placeholder="0"
                                                value={formData.pregnancy_week}
                                                onChange={(e) => setFormData({ ...formData, pregnancy_week: e.target.value })}
                                            />
                                            <span className="text-2xl font-bold text-slate-400">Hafta</span>
                                        </div>
                                        <p className="text-slate-500 text-sm">NIPT testi için en az 10. hafta önerilmektedir.</p>
                                    </div>
                                )}

                                {/* Step 4: Doctor Referral */}
                                {step === 4 && (
                                    <div className="space-y-8 max-w-2xl mx-auto animate-fadeIn">
                                        <h3 className="text-2xl font-bold text-slate-900 text-center">Sizi yönlendiren bir doktor var mı?</h3>

                                        <div className="flex gap-6 justify-center">
                                            <RadioCard
                                                label="Evet"
                                                selected={formData.has_doctor === true}
                                                onClick={() => setFormData({ ...formData, has_doctor: true })}
                                            />
                                            <RadioCard
                                                label="Hayır"
                                                selected={formData.has_doctor === false}
                                                onClick={() => setFormData({ ...formData, has_doctor: false, doctor_id: '', doctor_name: '' })}
                                            />
                                        </div>

                                        {formData.has_doctor === true && (
                                            <div className="pt-4 space-y-4 animate-slideDown">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Doktor Seçiniz</label>
                                                    <select
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none"
                                                        value={formData.doctor_id}
                                                        onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value, doctor_name: '' })}
                                                    >
                                                        <option value="">-- Listeden Seçiniz --</option>
                                                        {doctors.map((doc: any) => (
                                                            <option key={doc.id} value={doc.id}>{doc.name} ({doc.city})</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="relative flex items-center gap-4 py-2">
                                                    <div className="h-px bg-slate-200 flex-1"></div>
                                                    <span className="text-slate-400 text-sm font-medium">VEYA</span>
                                                    <div className="h-px bg-slate-200 flex-1"></div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Doktor Adı (Listede yoksa)</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                                        placeholder="Doktor Adı Soyadı"
                                                        value={formData.doctor_name}
                                                        disabled={!!formData.doctor_id}
                                                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 5: Contact Info */}
                                {step === 5 && (
                                    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
                                        <h3 className="text-2xl font-bold text-slate-900 text-center mb-6">İletişim Bilgileri</h3>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Telefon</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                                    placeholder="05xx..."
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">E-Posta</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Ek Mesajınız (Opsiyonel)</label>
                                            <textarea
                                                rows={3}
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div className="flex items-start gap-3 py-2 bg-blue-50/50 p-4 rounded-xl">
                                            <input
                                                type="checkbox"
                                                id="consent"
                                                className="mt-1 w-5 h-5 rounded text-blue-600"
                                                checked={formData.consent}
                                                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                                required
                                            />
                                            <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
                                                KVKK kapsamında kişisel verilerimin işlenmesini ve tarafımla iletişime geçilmesini onaylıyorum.
                                            </label>
                                        </div>

                                        {status === 'error' && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                                                Hata: {errorMsg}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="mt-10 flex justify-between pt-6 border-t border-slate-100 max-w-2xl mx-auto">
                                    {step > 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-6 py-3 text-slate-500 font-bold hover:text-slate-800 flex items-center gap-2 transition-colors"
                                        >
                                            <ChevronLeft size={20} /> Geri
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {step < 5 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                                        >
                                            Devam Et <ChevronRight size={20} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={status === 'sending'}
                                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {status === 'sending' ? 'Gönderiliyor...' : 'Randevu Oluştur'} <CheckCircle2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </section>

            {/* Additional Info Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl">
                        <Phone className="text-blue-600 mb-4 h-8 w-8" />
                        <h3 className="font-bold mb-2">Telefon</h3>
                        <p className="text-slate-600 text-sm">{tenantInfo.phone}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl">
                        <Mail className="text-blue-600 mb-4 h-8 w-8" />
                        <h3 className="font-bold mb-2">E-Posta</h3>
                        <p className="text-slate-600 text-sm">{tenantInfo.email}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl">
                        <MapPin className="text-blue-600 mb-4 h-8 w-8" />
                        <h3 className="font-bold mb-2">Adres</h3>
                        <p className="text-slate-600 text-sm">{tenantInfo.address}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl">
                        <Clock className="text-blue-600 mb-4 h-8 w-8" />
                        <h3 className="font-bold mb-2">Çalışma Saatleri</h3>
                        <p className="text-slate-600 text-sm">Pzt-Cum: 08:00-18:00</p>
                    </div>
                </div>

                {/* Google Map */}
                <div className="w-full h-96 bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                    <iframe
                        src={tenantInfo.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};

// UI Components
// Enhanced SelectionCard Component
const SelectionCard = ({ label, description, features, selected, onClick }: any) => (
    <div
        onClick={onClick}
        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4 h-full ${selected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white hover:shadow-sm'}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <h4 className={`text-lg font-bold ${selected ? 'text-blue-900' : 'text-slate-900'}`}>{label}</h4>
                {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            </div>
            {selected && <CheckCircle2 className="text-blue-600 shrink-0" size={24} />}
        </div>

        {features && (
            <ul className="space-y-2 mt-2">
                {features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-blue-400' : 'bg-slate-300'}`} />
                        {feature}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const RadioCard = ({ label, subLabel, selected, onClick }: any) => (
    <div
        onClick={onClick}
        className={`px-8 py-6 rounded-2xl border-2 cursor-pointer transition-all min-w-[140px] text-center ${selected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
    >
        <div className={`font-bold text-lg ${selected ? 'text-blue-900' : 'text-slate-900'}`}>{label}</div>
        {subLabel && <div className="text-xs text-slate-500 mt-1">{subLabel}</div>}
    </div>
);
