import { useBranding } from '@/hooks/useBrandingConfig';
import { CheckCircle, Shield } from 'lucide-react';
import { useMemo } from 'react';

interface LoginLeftPanelProps {
  features?: string[];
  tagline?: string;
}

export const LoginLeftPanel = ({
  features = [],
  tagline = 'Yönetim Paneline Hoş Geldiniz'
}: LoginLeftPanelProps) => {
  const { branding } = useBranding();

  // Fallback features if none provided
  const defaultFeatures = [
    'Güvenli Erişim',
    'İçerik Yönetimi',
    'Veri Analizi'
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  // Create gradient from primary color if no hero image
  const backgroundStyle = useMemo(() => {
    if (branding.loginHeroImage) {
      return {
        backgroundImage: `url(${branding.loginHeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    // Fallback gradient based on primary color
    return {
      background: `linear-gradient(135deg, ${branding.colors.primary}cc 0%, ${branding.colors.secondary}cc 100%)`
    };
  }, [branding.loginHeroImage, branding.colors.primary, branding.colors.secondary]);

  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative text-white flex-col justify-between p-12"
      style={backgroundStyle}
    >
      {/* Dark overlay if background image exists */}
      {branding.loginHeroImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Logo */}
        {branding.logo.light && (
          <div className="mb-8">
            <img
              src={branding.logo.light}
              alt="Logo"
              className="h-10 w-auto object-contain filter brightness-0 invert"
            />
          </div>
        )}

        {/* Center content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              {tagline}
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Klinik çalışma ve veri yönetimi platformuna hoş geldiniz.
              Site yönetimi, kullanıcı kontrolü ve içerik düzenleme araçlarına buradan erişebilirsiniz.
            </p>
          </div>

          {/* Features */}
          {displayFeatures.length > 0 && (
            <div className="space-y-3 mt-8 pt-6 border-t border-white/20">
              {displayFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-white/80 mt-0.5 flex-shrink-0" />
                  <span className="text-base font-medium text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-white/60 text-sm border-t border-white/20 pt-6">
          © 2026 Turp. Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
};

export default LoginLeftPanel;
