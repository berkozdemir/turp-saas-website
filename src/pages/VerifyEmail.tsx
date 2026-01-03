import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { fetchAPI } from '../lib/contentApi';
import { useTenantSettings } from '../hooks/useTenantSettings';

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { settings } = useTenantSettings();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const token = searchParams.get('token');

    // Theme Detection
    const isNipt = window.location.hostname.includes('nipt.tr') || window.location.hostname.includes('omega') || settings?.tenant_id === 'nipt';

    const theme = isNipt ? {
        bgGradient: 'from-slate-50 via-white to-blue-50',
        successGradient: 'from-[#1a365d] to-[#2c5282]',
        buttonGradient: 'from-[#1a365d] to-[#2b6cb0] hover:from-[#2c5282] hover:to-[#3182ce]',
        buttonShadow: 'shadow-blue-900/30'
    } : {
        bgGradient: 'from-emerald-50 via-white to-teal-50',
        successGradient: 'from-emerald-500 to-teal-600',
        buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
        buttonShadow: 'shadow-emerald-300/50'
    };

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Doğrulama linki geçersiz');
                return;
            }

            try {
                const data = await fetchAPI(`enduser_verify_email?token=${encodeURIComponent(token)}`);

                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'E-posta adresiniz başarıyla doğrulandı!');

                    // Auto-redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Doğrulama başarısız');
                    setIsExpired(data.expired || false);
                    setUserEmail(data.email || '');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Doğrulama sırasında bir hata oluştu');
            }
        };

        verifyToken();
    }, [token, navigate]);

    const goToLogin = () => {
        navigate('/login');
    };

    const goToResend = () => {
        navigate(`/email-verification${userEmail ? `?email=${encodeURIComponent(userEmail)}` : ''}`);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center p-4`}>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">

                    {/* Loading State */}
                    {status === 'loading' && (
                        <div className="text-center py-8">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">E-posta Doğrulanıyor...</h2>
                            <p className="text-slate-600">Lütfen bekleyin</p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="text-center py-4">
                            {/* Success Icon */}
                            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${theme.successGradient} rounded-full mb-6 shadow-lg animate-in zoom-in duration-500`}>
                                <CheckCircle className="text-white" size={44} />
                            </div>

                            {/* Success Message */}
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Başarılı!</h2>
                            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                                {message}
                            </p>

                            {/* Checkmark List */}
                            <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-5 mb-6 text-left">
                                <ul className="space-y-2 text-sm text-emerald-800">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                                        <span>E-posta adresiniz doğrulandı</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                                        <span>Hesabınız aktif edildi</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                                        <span>Giriş yapmaya hazırsınız</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Auto-redirect Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    🚀 Otomatik olarak giriş sayfasına yönlendiriliyorsunuz...
                                </p>
                            </div>

                            {/* Manual Login Button */}
                            <button
                                onClick={goToLogin}
                                className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg ${theme.buttonShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}
                            >
                                Giriş Yap
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="text-center py-4">
                            {/* Error Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                                <XCircle className="text-red-600" size={44} />
                            </div>

                            {/* Error Message */}
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">Doğrulama Başarısız</h2>
                            <p className="text-slate-700 mb-6 leading-relaxed">
                                {message}
                            </p>

                            {/* Error Details */}
                            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5 mb-6 text-left">
                                <h3 className="font-semibold text-red-900 mb-2">Ne yapabilirsiniz?</h3>
                                <ul className="text-sm text-red-800 space-y-2">
                                    {isExpired ? (
                                        <>
                                            <li>• Doğrulama linkinizin süresi dolmuş</li>
                                            <li>• Yeni bir doğrulama e-postası talep edin</li>
                                            <li>• E-posta 24 saat geçerlidir</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>• Link'in doğru olduğundan emin olun</li>
                                            <li>• E-postadaki en güncel linki kullanın</li>
                                            <li>• Sorun devam ederse destek ekibimize ulaşın</li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {isExpired && userEmail && (
                                    <button
                                        onClick={goToResend}
                                        className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg ${theme.buttonShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all`}
                                    >
                                        Yeni Doğrulama E-postası Gönder
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Ana Sayfaya Dön
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
