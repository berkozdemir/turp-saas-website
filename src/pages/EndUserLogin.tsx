import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useEndUserAuth } from '../hooks/useEndUserAuth';
import { useTenantSettings } from '../hooks/useTenantSettings';

interface Props {
    setView?: (view: string | object) => void;
}

export const EndUserLogin = ({ setView }: Props) => {
    const { login } = useEndUserAuth();
    const { settings, loading: settingsLoading } = useTenantSettings();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const goToSignup = () => {
        if (setView) {
            setView('enduser-signup');
        } else {
            window.location.href = '/signup';
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
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Redirect to portal or home
            goHome();
        } else {
            setError(result.error || 'Giriş başarısız');
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
                        <h1 className="text-2xl font-bold text-slate-900">Hoş Geldiniz</h1>
                        <p className="text-slate-500 mt-1">Hesabınıza giriş yapın</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                E-posta
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="ornek@email.com"
                                    required
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${theme.inputFocus} focus:ring-2 transition-all outline-none`}
                                    placeholder="••••••••"
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
                            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    {/* Signup Link */}
                    {settings?.allow_enduser_signup && (
                        <p className="text-center text-slate-600 mt-6">
                            Hesabınız yok mu?{' '}
                            <button onClick={goToSignup} className={`${theme.linkText} font-semibold`}>
                                Kayıt Ol
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
