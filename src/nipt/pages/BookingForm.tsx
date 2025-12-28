import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TURKEY_CITIES = [
    "ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AMASYA", "ANKARA", "ANTALYA", "ARTVİN", "AYDIN", "BALIKESİR",
    "BİLECİK", "BİNGÖL", "BİTLİS", "BOLU", "BURDUR", "BURSA", "ÇANAKKALE", "ÇANKIRI", "ÇORUM", "DENİZLİ",
    "DİYARBAKIR", "EDİRNE", "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHİR", "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE",
    "HAKKARİ", "HATAY", "ISPARTA", "MERSİN", "İSTANBUL", "İZMİR", "KARS", "KASTAMONU", "KAYSERİ", "KIRKLARELİ",
    "KIRŞEHİR", "KOCAELİ", "KONYA", "KÜTAHYA", "MALATYA", "MANİSA", "KAHRAMANMARAŞ", "MARDİN", "MUĞLA", "MUŞ",
    "NEVŞEHİR", "NİĞDE", "ORDU", "RİZE", "SAKARYA", "SAMSUN", "SİİRT", "SİNOP", "SİVAS", "TEKİRDAĞ", "TOKAT",
    "TRABZON", "TUNCELİ", "ŞANLIURFA", "UŞAK", "VAN", "YOZGAT", "ZONGULDAK", "AKSARAY", "BAYBURT", "KARAMAN",
    "KIRIKKALE", "BATMAN", "ŞIRNAK", "BARTIN", "ARDAHAN", "IĞDIR", "YALOVA", "KARABÜK", "KİLİS", "OSMANİYE", "DÜZCE"
];

interface BookingData {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    date: string;
    time: string;
    pregnancyType: 'singleton' | 'twins';
    referralCode?: string;
    kvkkConsent: boolean;
}

const TESTS = [
    { id: 'momguard', name: 'MomGuard NIPT', price: 'Standard', color: 'emerald', desc: 'Ekonomik ve güvenilir (LabGenomics)' },
    { id: 'verifi', name: 'Verifi NIPT', price: 'Premium', color: 'blue', desc: 'Illumina güvencesiyle en yüksek doğruluk' },
    { id: 'veritas', name: 'Veritas NIPT', price: 'Kapsamlı', color: 'amber', desc: 'Tüm genom (23 çift kromozom) taraması' }
];

export const BookingForm: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // API State
    const [regionStatus, setRegionStatus] = useState<any>(null);
    const [referralStatus, setReferralStatus] = useState<any>(null);

    const [formData, setFormData] = useState<BookingData>({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        date: '',
        time: '09:00',
        pregnancyType: 'singleton',
        referralCode: '',
        kvkkConsent: false
    });

    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    // Initial check for URL param
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const testParam = params.get('test');
        if (testParam && ['momguard', 'verifi', 'veritas'].includes(testParam)) {
            setSelectedTest(testParam);
            // If test is present, maybe auto-advance? Let's just set it so Step 0 shows it selected or skip.
            // Better: If param exists, default to Step 1. If not, Step 0.
            setStep(1);
        } else {
            setStep(0);
        }
    }, []);



    /* API HELPERS */
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const checkRegion = async (city: string) => {
        try {
            const res = await fetch(`${apiBase}/index.php?action=check_region&city=${city}`);
            const data = await res.json();
            setRegionStatus(data);
        } catch (err) {
            console.error("Region check failed", err);
            setRegionStatus({ home_care: false, message: "Bölge kontrolü başarısız oldu." });
        }
    };

    const validateCode = async (code: string) => {
        if (!code) {
            setReferralStatus(null);
            setFormData(prev => ({ ...prev, referralCode: '' }));
            return;
        }
        try {
            const res = await fetch(`${apiBase}/index.php?action=validate_referral`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            setReferralStatus(data);
            if (data.valid) {
                setFormData(prev => ({ ...prev, referralCode: data.code }));
            } else {
                setFormData(prev => ({ ...prev, referralCode: '' }));
            }
        } catch (err) {
            console.error("Referral check failed", err);
            setReferralStatus({ valid: false, message: "Referans kodu kontrolü başarısız oldu." });
            setFormData(prev => ({ ...prev, referralCode: '' }));
        }
    };

    const createBooking = useMutation({
        mutationFn: async (data: BookingData) => {
            const payload = {
                patient_info: {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone
                },
                date: data.date,
                time: data.time,
                location_type: regionStatus?.home_care ? 'home_care' : 'courier', // Use API result
                address: `${data.address}, ${data.city}`,
                clinic_id: null,
                consents: {
                    kvkk: data.kvkkConsent ? 1 : 0,
                    terms: 1 // Implicit for now or add checkbox
                },
                referral_code: data.referralCode, // Send the validated code
                notes: `Gebelik Tipi: ${data.pregnancyType === 'twins' ? 'İkiz' : 'Tekil'}`,
                test_type: selectedTest // Send selected test to API for tenant routing
            };

            const res = await fetch(`${apiBase}/index.php?action=create_booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Randevu oluşturulamadı');
            }
            return res.json();
        },
        onSuccess: (data) => {
            // Navigate to success or show modal
            alert(`Randevunuz başarıyla oluşturuldu! Kayıt No: ${data.booking_id}. \n${data.referral_applied ? 'İndirim uygulandı.' : ''}`);
            navigate('/nipt');
        },
        onError: (err: any) => {
            alert(err.message);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Handle checkboxes
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Custom Handler for City to trigger API
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setFormData(prev => ({ ...prev, city }));
        if (city) checkRegion(city);
        else setRegionStatus(null);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createBooking.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[0, 1, 2, 3].map((s) => (
                            <div key={s} className="flex-1 relative">
                                <div className={`h-2 rounded-full transition-colors ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold bg-white ${step >= s ? 'border-blue-600 text-blue-600' : 'border-slate-200 text-slate-400'
                                    }`}>
                                    {s === 0 ? 'T' : s}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium px-2">
                        <span>Test Seçimi</span>
                        <span>Kişisel Bilgiler</span>
                        <span>Randevu Detayları</span>
                        <span>Onay</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="px-8 py-6 bg-slate-900 text-white">
                        <h2 className="text-2xl font-bold">NIPT Randevu Formu</h2>
                        <p className="text-blue-200 text-sm mt-1">Güvenli ve hızlı başvuru</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {/* STEP 0: Test Selection */}
                        {step === 0 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Hangi testi uygulamak istersiniz?</h3>
                                <div className="grid gap-4">
                                    {TESTS.map((test) => (
                                        <div
                                            key={test.id}
                                            onClick={() => setSelectedTest(test.id)}
                                            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedTest === test.id
                                                ? `border-${test.color}-600 bg-${test.color}-50`
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className={`font-bold text-lg ${selectedTest === test.id ? `text-${test.color}-700` : 'text-slate-800'}`}>
                                                        {test.name}
                                                    </h4>
                                                    <p className="text-slate-500 text-sm mt-1">{test.desc}</p>
                                                </div>
                                                {selectedTest === test.id && (
                                                    <div className={`w-8 h-8 rounded-full bg-${test.color}-600 flex items-center justify-center text-white`}>
                                                        <CheckCircle size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 1: Personal Info */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="pl-10 w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                                placeholder="Adınız Soyadınız"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                            placeholder="05XX XXX XX XX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta Adresi</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                        placeholder="ornek@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Gebelik Durumu</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all ${formData.pregnancyType === 'singleton' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200'}`}>
                                            <input
                                                type="radio"
                                                name="pregnancyType"
                                                value="singleton"
                                                checked={formData.pregnancyType === 'singleton'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="font-semibold text-slate-900">Tekil Gebelik</span>
                                        </label>
                                        <label className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all ${formData.pregnancyType === 'twins' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-slate-200'}`}>
                                            <input
                                                type="radio"
                                                name="pregnancyType"
                                                value="twins"
                                                checked={formData.pregnancyType === 'twins'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="font-semibold text-slate-900">İkiz Gebelik</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Appointment & Address */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Randevu Tarihi</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="pl-10 w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Saat (Tahmini)</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <select
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                className="pl-10 w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                            >
                                                {Array.from({ length: 11 }, (_, i) => i + 8).map(h => (
                                                    <option key={h} value={`${h < 10 ? '0' : ''}${h}:00`}>{`${h < 10 ? '0' : ''}${h}:00`}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Şehir</label>
                                        <select
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleCityChange}
                                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                        >
                                            <option value="">Seçiniz</option>
                                            {TURKEY_CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        {/* Smart Location Badge (API Check) */}
                                        {regionStatus && (
                                            <div className={`mt-2 flex items-center p-2 rounded-lg text-sm border animate-in fade-in ${regionStatus.home_care ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                <span className="font-semibold">{regionStatus.message}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açık Adres (Ev/İş)</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <textarea
                                                name="address"
                                                required
                                                rows={2}
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="pl-10 w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                                placeholder="Mahalle, Cadde, Sokak, No, Daire..."
                                            />
                                        </div>
                                    </div>

                                    {/* REFERRAL CODE SECTION */}
                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">İndirim / Referans Kodu</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Doktorunuzun kodu var mı?"
                                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 uppercase"
                                                    onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (formData.referralCode) validateCode(formData.referralCode);
                                                }}
                                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
                                            >
                                                Uygula
                                            </button>
                                        </div>
                                        {referralStatus && (
                                            <div className={`mt-2 text-sm font-medium ${referralStatus.valid ? 'text-green-600' : 'text-red-500'}`}>
                                                {referralStatus.valid
                                                    ? `✔ ${referralStatus.doctor_name} referansıyla %${referralStatus.discount_percent} indirim!`
                                                    : `❌ ${referralStatus.message}`}
                                            </div>
                                        )}
                                    </div>                </div>
                            </div>
                        )}

                        {/* STEP 3: Confirm */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Bilgilerinizi Kontrol Edin</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Seçilen Test</dt>
                                            <dd className="mt-1 text-sm font-bold text-blue-600 uppercase">{selectedTest}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Ad Soyad</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{formData.fullName}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Telefon</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{formData.phone}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Randevu</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{formData.date} - {formData.time}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Şehir</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{formData.city}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-slate-500">Adres</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{formData.address}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-slate-500">Test Türü</dt>
                                            <dd className="mt-1 text-sm text-slate-900">
                                                {formData.pregnancyType === 'twins' ? 'İkiz Gebelik Analizi' : 'Tekil Gebelik Analizi'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="kvkk"
                                            name="kvkkConsent"
                                            type="checkbox"
                                            required
                                            checked={formData.kvkkConsent}
                                            onChange={handleChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="kvkk" className="font-medium text-slate-700">KVKK Metnini Okudum ve Onaylıyorum</label>
                                        <p className="text-slate-500">Kişisel verilerimin işlenmesine izin veriyorum.</p>
                                    </div>
                                </div>

                                {createBooking.isError && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2" />
                                        {String(createBooking.error)}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t border-slate-100">
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <ChevronLeft className="mr-2 h-5 w-5" />
                                    Geri
                                </button>
                            ) : <div />} {/* Spacer */}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    // Simple validation check before next
                                    disabled={
                                        (step === 0 && !selectedTest) ||
                                        (step === 1 && (!formData.fullName || !formData.phone)) ||
                                        (step === 2 && (!formData.date || !formData.city))
                                    }
                                    className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Devam Et
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={createBooking.isPending || !formData.kvkkConsent}
                                    className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                                >
                                    {createBooking.isPending ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                            İşleniyor...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Randevuyu Onayla
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
