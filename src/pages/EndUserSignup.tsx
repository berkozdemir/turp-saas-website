import { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useEndUserAuth } from '../hooks/useEndUserAuth';
import { useTenantSettings } from '../hooks/useTenantSettings';

import { AppView } from '../types/view';

interface Props {
    setView?: (view: AppView) => void;
}

export const EndUserSignup = ({ setView }: Props) => {
    const { signup } = useEndUserAuth();
    const { settings, loading: settingsLoading } = useTenantSettings();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Theme Detection
    const isNipt = window.location.hostname.includes('nipt.tr') || window.location.hostname.includes('omega') || settings?.tenant_id === 'nipt';

    // Theme Config
    const theme = isNipt ? {
        bgGradient: 'from-slate-50 via-white to-blue-50',
        cardBorder: 'border-slate-200',
        cardShadow: 'shadow-slate-200/50',
        iconBg: 'bg-gradient-to-br from-[#1a365d] to-[#2c5282]', // Omega Navy
        iconShadow: 'shadow-blue-900/30',
        featureBadge: 'bg-blue-50 text-blue-700',
        inputFocus: 'focus:border-blue-500 focus:ring-blue-200',
        buttonGradient: 'from-[#1a365d] to-[#2b6cb0] hover:from-[#2c5282] hover:to-[#3182ce]',
        buttonShadow: 'shadow-blue-900/30',
        linkText: 'text-blue-600 hover:text-blue-700'
    } : {
        bgGradient: 'from-emerald-50 via-white to-teal-50',
        cardBorder: 'border-emerald-100',
        cardShadow: 'shadow-emerald-200/50',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        iconShadow: 'shadow-emerald-300',
        featureBadge: 'bg-emerald-50 text-emerald-700',
        inputFocus: 'focus:border-emerald-500 focus:ring-emerald-200',
        buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
        buttonShadow: 'shadow-emerald-300/50',
        linkText: 'text-emerald-600 hover:text-emerald-700'
    };

    const goHome = () => {
        if (setView) {
            setView('home');
        } else {
            window.location.href = '/';
        }
    };

    const goToLogin = () => {
        if (setView) {
            setView('enduser-login');
        } else {
            window.location.href = '/login';
        }
    };

    // If signup not allowed, show message
    if (!settingsLoading && !settings?.allow_enduser_signup) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center p-4`}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Kayıt Aktif Değil</h1>
                    <p className="text-slate-600 mb-6">Bu site için kullanıcı kaydı şu an aktif değil.</p>
                    <button
                        onClick={goHome}
                        className={`${theme.linkText} hover:underline`}
                    >
                        Ana sayfaya dön
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }
        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalı');
            return;
        }

        setIsLoading(true);
        const result = await signup({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (result.success) {
            // Redirect to email verification page instead of home
            window.location.href = `/email-verification?email=${encodeURIComponent(formData.email)}`;
        } else {
            setError(result.error || 'Kayıt başarısız');
        }
        setIsLoading(false);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center p-4`}>
            <div className="w-full max-w-md">
                {/* Card */}
                <div className={`bg-white rounded-3xl shadow-2xl ${theme.cardShadow} p-8 border ${theme.cardBorder}`}>
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.iconBg} rounded-2xl mb-4 shadow-lg ${theme.iconShadow}`}>
                            <Sparkles className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Hesap Oluşturun</h1>
                        <p className="text-slate-500 mt-1">Hizmetlerimize erişmek için kayıt olun</p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {['Hızlı Kayıt', 'Güvenli', 'Ücretsiz'].map((feature) => (
                            <span
                                key={feature}
                                className={`inline-flex items-center gap-1 text-xs ${theme.featureBadge} px-3 py-1 rounded-full`}
                            >
                                <CheckCircle size={12} /> {feature}
                            </span>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Ad Soyad
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="Adınız Soyadınız"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                E-posta
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Telefon <span className="text-slate-400">(Opsiyonel)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="05XX XXX XX XX"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="En az 6 karakter"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Şifre Tekrar
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="Şifrenizi tekrar girin"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg ${theme.buttonShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    {/* Login Link */}
                    {settings?.allow_enduser_login && (
                        <p className="text-center text-slate-600 mt-6">
                            Zaten hesabınız var mı?{' '}
                            <button onClick={goToLogin} className={`${theme.linkText} font-semibold`}>
                                Giriş Yap
                            </button>
                        </p>
                    )}

                    {/* Back to home */}
                    <div className="text-center mt-4">
                        <button
                            onClick={goHome}
                            className="text-sm text-slate-400 hover:text-slate-600"
                        >
                            ← Ana sayfaya dön
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
