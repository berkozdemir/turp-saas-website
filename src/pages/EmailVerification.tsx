import { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTenantSettings } from '../hooks/useTenantSettings';
import { fetchAPI } from '../lib/contentApi';

interface Props {
    email?: string;
    setView?: (view: string | object) => void;
}

export const EmailVerification = ({ email: initialEmail = '', setView }: Props) => {
    const { settings } = useTenantSettings();
    const [email, setEmail] = useState(initialEmail);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState('');

    // Theme Detection
    const isNipt = window.location.hostname.includes('nipt.tr') || window.location.hostname.includes('omega') || settings?.tenant_id === 'nipt';

    const theme = isNipt ? {
        bgGradient: 'from-slate-50 via-white to-blue-50',
        iconBg: 'bg-gradient-to-br from-[#1a365d] to-[#2c5282]',
        iconShadow: 'shadow-blue-900/30',
        buttonGradient: 'from-[#1a365d] to-[#2b6cb0] hover:from-[#2c5282] hover:to-[#3182ce]',
        buttonShadow: 'shadow-blue-900/30',
        linkText: 'text-blue-600 hover:text-blue-700'
    } : {
        bgGradient: 'from-emerald-50 via-white to-teal-50',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        iconShadow: 'shadow-emerald-300',
        buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
        buttonShadow: 'shadow-emerald-300/50',
        linkText: 'text-emerald-600 hover:text-emerald-700'
    };

    const goToLogin = () => {
        if (setView) {
            setView('enduser-login');
        } else {
            window.location.href = '/login';
        }
    };

    const goHome = () => {
        if (setView) {
            setView('home');
        } else {
            window.location.href = '/';
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError('Lütfen e-posta adresinizi girin');
            return;
        }

        setIsResending(true);
        setError('');
        setResendSuccess(false);

        try {
            const data = await fetchAPI('enduser_resend_verification', {
                method: 'POST',
                body: JSON.stringify({ email })
            });

            if (data.success) {
                setResendSuccess(true);
            } else {
                setError(data.error || 'E-posta gönderilemedi');
            }
        } catch (err) {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center p-4`}>
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                    {/* Icon */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.iconBg} rounded-2xl mb-6 shadow-lg ${theme.iconShadow}`}>
                            <Mail className="text-white" size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">E-postanızı Kontrol Edin</h1>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Hesabınızı doğrulamak için size bir e-posta gönderdik
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-5 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Sonraki adımlar:</h3>
                        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                            <li>E-posta gelen kutunuzu kontrol edin</li>
                            <li>"E-posta Adresimi Doğrula" butonuna tıklayın</li>
                            <li>Hesabınız aktif olacak ve giriş yapabileceksiniz</li>
                        </ol>
                    </div>

                    {/* Email Display/Input */}
                    {initialEmail ? (
                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-slate-500 mb-1">Doğrulama e-postası gönderildi:</p>
                            <p className="text-sm font-medium text-slate-900">{initialEmail}</p>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                E-posta adresiniz
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="ornek@email.com"
                            />
                        </div>
                    )}

                    {/* Success Message */}
                    {resendSuccess && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                            <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm">
                                Doğrulama e-postası tekrar gönderildi! Lütfen gelen kutunuzu kontrol edin.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    {/* Resend Button */}
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg ${theme.buttonShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4`}
                    >
                        <RefreshCw className={isResending ? 'animate-spin' : ''} size={20} />
                        {isResending ? 'Gönderiliyor...' : 'Doğrulama E-postasını Tekrar Gönder'}
                    </button>

                    {/* Help Text */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-xs text-amber-800 leading-relaxed">
                            <strong>E-posta gelmediyse:</strong> Spam/gereksiz klasörünü kontrol edin.
                            Hala bulamıyorsanız, yukarıdaki buton ile tekrar gönderebilirsiniz.
                        </p>
                    </div>

                    {/* Login Link */}
                    <div className="text-center space-y-3">
                        <p className="text-sm text-slate-600">
                            E-postanızı zaten doğruladınız mı?{' '}
                            <button onClick={goToLogin} className={`${theme.linkText} font-semibold`}>
                                Giriş Yap
                            </button>
                        </p>

                        <button
                            onClick={goHome}
                            className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto"
                        >
                            <ArrowLeft size={14} />
                            Ana sayfaya dön
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
                    Bu otomatik bir güvenlik adımıdır. Hesabınızın size ait olduğundan emin olmak için e-posta doğrulaması gereklidir.
                </p>
            </div>
        </div>
    );
};

export default EmailVerification;
