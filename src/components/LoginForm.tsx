import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { useBranding } from '@/hooks/useBrandingConfig';
import { useTranslation } from 'react-i18next';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

type ViewType = 'login' | 'forgot-password' | 'success';

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin')
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const { branding } = useBranding();
  const { i18n } = useTranslation();
  const [view, setView] = useState<ViewType>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Forgot password form
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onLogin = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/index.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          remember_me: data.rememberMe || false
        })
      });

      const result = await response.json();

      if (result.error) {
        const errorMsg = result.error || 'Giriş başarısız oldu';
        setError(errorMsg);
        onError?.(errorMsg);
      } else if (result.success) {
        // Store token
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', JSON.stringify(result.user));

        resetLogin();
        onSuccess?.(result);
      }
    } catch (err) {
      const errorMsg = 'Bağlantı hatası oluştu';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async (data: ForgotPasswordData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/index.php?action=forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      const result = await response.json();

      if (result.message) {
        setSuccessMessage(result.message);
        setView('success');
        resetForgot();
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setView('login');
    setError('');
    resetForgot();
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        {branding.logo.light && (
          <div className="flex justify-center mb-6">
            <img
              src={branding.logo.light}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        )}

        {view === 'login' && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Giriş Yap</h2>
            <p className="text-slate-600 text-sm">
              Yönetim paneline erişmek için bilgilerinizi girin
            </p>
          </>
        )}

        {view === 'forgot-password' && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Şifremi Unuttum</h2>
            <p className="text-slate-600 text-sm">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
            </p>
          </>
        )}

        {view === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ backgroundColor: `${branding.colors.primary}20` }}>
              <CheckCircle size={32} style={{ color: branding.colors.primary }} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">E-posta Gönderildi!</h2>
          </>
        )}
      </div>

      {/* Login Form */}
      {view === 'login' && (
        <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="admin@turp.health"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 transition-all outline-none"
                style={{
                  '--tw-ring-color': `${branding.colors.primary}40`,
                  '--focus-border': branding.colors.primary
                } as any}
                {...registerLogin('email')}
                disabled={isLoading}
              />
            </div>
            {loginErrors.email && (
              <p className="text-sm text-red-600">{loginErrors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 transition-all outline-none"
                style={{
                  '--tw-ring-color': `${branding.colors.primary}40`
                } as any}
                {...registerLogin('password')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {loginErrors.password && (
              <p className="text-sm text-red-600">{loginErrors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 transition-all"
                style={{ accentColor: branding.colors.primary }}
                {...registerLogin('rememberMe')}
              />
              <span className="text-sm text-slate-700">Beni hatırla</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setView('forgot-password');
                setError('');
              }}
              className="text-sm font-medium transition-colors"
              style={{ color: branding.colors.primary }}
            >
              Şifremi unuttum
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: branding.colors.primary,
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Giriş yapılıyor...
              </>
            ) : (
              <>
                Giriş Yap
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Forgot Password Form */}
      {view === 'forgot-password' && (
        <form onSubmit={handleForgotSubmit(onForgotPassword)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="admin@turp.health"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 transition-all outline-none"
                {...registerForgot('email')}
                disabled={isLoading}
              />
            </div>
            {forgotErrors.email && (
              <p className="text-sm text-red-600">{forgotErrors.email.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{ backgroundColor: branding.colors.primary }}
          >
            {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
          </button>

          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full font-medium py-2 transition-colors"
            style={{ color: branding.colors.primary }}
          >
            ← Giriş ekranına dön
          </button>
        </form>
      )}

      {/* Success View */}
      {view === 'success' && (
        <div className="text-center py-4 space-y-6">
          <p className="text-slate-600">{successMessage}</p>
          <button
            onClick={handleBackToLogin}
            className="font-medium transition-colors"
            style={{ color: branding.colors.primary }}
          >
            ← Giriş ekranına dön
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 text-center">
          🔒 Bu panel yalnızca yetkili kullanıcılar içindir. Tüm giriş denemeleri kaydedilmektedir.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
