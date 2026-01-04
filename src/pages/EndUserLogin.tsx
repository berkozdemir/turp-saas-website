import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useEndUserAuth } from '../hooks/useEndUserAuth';
import { useTenantSettings } from '../hooks/useTenantSettings';

import { AppView } from '../types/view';

interface Props {
    setView?: (view: AppView) => void;
}

export const EndUserLogin = ({ setView }: Props) => {
    const { login } = useEndUserAuth();
    const { settings, loading: settingsLoading } = useTenantSettings();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResendLink, setShowResendLink] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');

    // Theme Detection
    const isNipt = window.location.hostname.includes('nipt.tr') || window.location.hostname.includes('omega') || settings?.tenant_id === 'nipt';

    // Theme Config
    const theme = isNipt ? {
        bgGradient: 'from-slate-50 via-white to-blue-50',
        cardBorder: 'border-slate-200',
        cardShadow: 'shadow-slate-200/50',
        iconBg: 'bg-gradient-to-br from-[#1a365d] to-[#2c5282]', // Omega Navy
        iconShadow: 'shadow-blue-900/30',
        inputFocus: 'focus:border-blue-500 focus:ring-blue-200',
        buttonGradient: 'from-[#1a365d] to-[#2b6cb0] hover:from-[#2c5282] hover:to-[#3182ce]',
        buttonShadow: 'shadow-blue-900/30',
        linkText: 'text-blue-600 hover:text-blue-700'
    } : {
        bgGradient: 'from-violet-50 via-white to-purple-50',
        cardBorder: 'border-violet-100',
        cardShadow: 'shadow-violet-200/50',
        iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
        iconShadow: 'shadow-violet-300',
        inputFocus: 'focus:border-violet-500 focus:ring-violet-200',
        buttonGradient: 'from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
        buttonShadow: 'shadow-violet-300/50',
        linkText: 'text-violet-600 hover:text-violet-700'
    };

    const goHome = () => {
        if (setView) {
            setView('home');
        } else {
            window.location.href = '/';
        }
    };



    // If login not allowed, show message
    if (!settingsLoading && !settings?.allow_enduser_login) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center p-4`}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Giriş Aktif Değil</h1>
                    <p className="text-slate-600 mb-6">Bu site için kullanıcı girişi şu an aktif değil.</p>
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShowResendLink(false);
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Redirect to portal or home
            goHome();
        } else {
            setError(result.error || 'Giriş başarısız');

            // If email not verified, show resend link
            if (result.email_not_verified) {
                setShowResendLink(true);
                setUnverifiedEmail(result.email || email);
            }
        }
        setIsLoading(false);
    };

    const handleResendVerification = () => {
        window.location.href = `/email-verification?email=${encodeURIComponent(unverifiedEmail)}`;
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT SIDE: Hero / Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                    alt="Clinical Research"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-blue-900/40"></div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full text-white">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                            Omega IWRS
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl xl:text-5xl font-bold mb-6 leading-tight text-white">
                        AI Destekli <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-400">
                            Randomizasyon Platformu
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed font-light">
                        Omega IWRS, klinik çalışmalarınızda randomizasyon ve ilaç yönetimini güvenli ve izlenebilir şekilde yürütmenize yardımcı olur.
                    </p>

                    <div className="flex flex-col gap-4 text-sm text-slate-400 font-medium">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            Gerçek zamanlı randomizasyon takibi
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 16v.01"></path><path d="M12 12v.01"></path></svg>
                            </div>
                            AI tabanlı karar desteği
                        </div>
                    </div>

                    <div className="absolute bottom-12 left-12 right-12 opacity-50 text-xs">
                        &copy; {new Date().getFullYear()} Omega CRO. All rights reserved. Professional use only.
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {/* Mobile Hero (Top) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-rose-600 lg:hidden"></div>

                <div className="w-full max-w-md">
                    {/* Logo / Header Mobile */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-flex items-center gap-2 font-bold text-xl text-slate-900">
                            <img src="/omega_logo.png" alt="Omega" className="h-8" />
                            <span>Omega IWRS</span>
                        </div>
                    </div>

                    <div className="bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-xl lg:shadow-none p-8 lg:p-0 border border-slate-100 lg:border-none">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Giriş Yap</h2>
                            <p className="text-slate-500">Yetkili hesabınızla oturum açın.</p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <div>
                                    <p className="font-medium">{error}</p>
                                    {showResendLink && (
                                        <button onClick={handleResendVerification} className="text-red-700 underline mt-1 hover:text-red-800">
                                            Doğrulama kodunu tekrar gönder
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                                        placeholder="ornek@kurum.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <a href="/reset-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">Şifremi Unuttum?</a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Giriş Yapılıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Giriş Yap</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-center text-xs text-slate-400 font-medium">
                                Yalnızca yetkilendirilmiş araştırma ekibi üyeleri için erişim.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
