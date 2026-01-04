import { useBranding } from '@/hooks/useBrandingConfig';
import LoginLeftPanel from '@/components/LoginLeftPanel';
import LoginForm from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin?: (data: any) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  console.log('[DEBUG] Login Component Mounting');
  const { branding, loading } = useBranding();

  const handleLoginSuccess = (data: any) => {
    if (onLogin) {
      onLogin(data);
    }
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: branding.colors.primary }} />
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: branding.colors.background }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Panel */}
          <LoginLeftPanel />

          {/* Right Panel - Login Form */}
          <div className="flex items-center justify-center p-8 md:p-12">
            <LoginForm
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              isAdmin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
