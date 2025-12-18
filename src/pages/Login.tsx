import { useState } from "react";
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff, CheckCircle } from "lucide-react";

interface LoginProps {
  onLogin: (data: any) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [view, setView] = useState<"login" | "forgot-password" | "success">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/index.php?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        // Save token to localStorage
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        onLogin(data);
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/index.php?action=forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setSuccessMessage(data.message);
      setView("success");
    } catch (err) {
      setError("Bağlantı hatası oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Column - Illustration & Info */}
          <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 text-white">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Turp Admin Panel</h1>
              <p className="text-cyan-100 text-lg leading-relaxed">
                Klinik çalışma ve veri yönetimi platformuna hoş geldiniz.
                Site yönetimi, kullanıcı kontrolü ve içerik düzenleme araçlarına buradan erişebilirsiniz.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-cyan-300 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Güvenli Erişim</h3>
                  <p className="text-sm text-cyan-200">Şifreli bağlantı ve kimlik doğrulama</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-cyan-300 mt-0.5" />
                <div>
                  <h3 className="font-semibold">İçerik Yönetimi</h3>
                  <p className="text-sm text-cyan-200">Blog yazıları ve sistem ayarları</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-cyan-300 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Veri Analizi</h3>
                  <p className="text-sm text-cyan-200">Kullanıcı aktivitesi ve raporlama</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="p-8 md:p-12">
            {view === "login" && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Giriş Yap</h2>
                  <p className="text-slate-600">Yönetim paneline erişmek için bilgilerinizi girin</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      E-posta Adresi
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring focus:ring-cyan-200 transition-all outline-none"
                        placeholder="admin@turp.health"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring focus:ring-cyan-200 transition-all outline-none"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-700">Beni hatırla</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot-password")}
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
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
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    {!isLoading && <ArrowRight size={20} />}
                  </button>
                </form>

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 text-center">
                    🔒 Bu panel yalnızca yetkili kullanıcılar içindir. Tüm giriş denemeleri kaydedilmektedir.
                  </p>
                </div>
                <p className="mt-4 text-center text-xs text-slate-300 font-mono">Build: v2.1 (Deploy Debug)</p>
              </>
            )}

            {view === "forgot-password" && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Şifremi Unuttum</h2>
                  <p className="text-slate-600">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      E-posta Adresi
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring focus:ring-cyan-200 transition-all outline-none"
                        placeholder="admin@turp.health"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="w-full text-cyan-600 hover:text-cyan-700 font-medium py-2"
                  >
                    ← Giriş ekranına dön
                  </button>
                </form>
              </>
            )}

            {view === "success" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">E-posta Gönderildi!</h2>
                <p className="text-slate-600 mb-8">{successMessage}</p>
                <button
                  onClick={() => setView("login")}
                  className="text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  ← Giriş ekranına dön
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
