import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/iwrs/lib/api"; // Updated import
import { Button } from "@/iwrs/components/ui/button";
import { Input } from "@/iwrs/components/ui/input";
import { Label } from "@/iwrs/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/iwrs/components/ui/tabs";
import { useToast } from "@/iwrs/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/iwrs/components/ui/alert";
import { Mail, Loader2, ArrowLeft, Building2, User, Lock } from "lucide-react";
import { LanguageSwitcher } from "@/iwrs/components/LanguageSwitcher";

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");

  // Session check
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await authApi.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "login") {
        // --- LOGIN ---
        await authApi.login(email, password);

        toast({
          title: t('auth.loginSuccessTitle'),
          description: t('auth.loginSuccess'),
        });
        navigate("/admin"); // Redirect to admin after login

      } else {
        // --- SIGNUP ---
        await authApi.register({
          email,
          password,
          full_name: fullName,
          institution
        });

        toast({
          title: t('auth.signupSuccessTitle') || "Kayıt Başarılı",
          description: t('auth.signupSuccessDesc') || "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
        });
        setActiveTab("login"); // Switch to login
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: error.message || t('auth.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // LOVABLE TARZI: Modern Gradient Arka Plan
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Dekoratif Arka Plan Yuvarlakları (Blur efektli) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigasyon Butonları */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          className="group flex items-center gap-2 hover:bg-white/50 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-600 group-hover:text-primary">{t('auth.backToHome')}</span>
        </Button>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      {/* Ana Kart */}
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {t('header.brand')}
          </CardTitle>
          <CardDescription className="text-base text-gray-500">
            {t('auth.description')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-gray-100/80 rounded-xl">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                {t('auth.signup')}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleAuth} className="space-y-5">

              {/* KAYIT ÖZEL ALANLARI */}
              {activeTab === "signup" && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">{t('auth.fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        placeholder="Ad Soyad"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium text-gray-700">{t('auth.institution')}</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="institution"
                        placeholder={t('auth.institution')}
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ORTAK ALANLAR */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* ŞİFRE TEKRAR */}
              {activeTab === "signup" && (
                <div className="space-y-2 animate-in slide-in-from-right-4 duration-300">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all ${confirmPassword && password !== confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 font-medium animate-pulse">
                      {t('auth.passwordsDoNotMatch')}
                    </p>
                  )}
                </div>
              )}

              <Button
                className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 mt-6"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('index.loading')}
                  </>
                ) : (
                  activeTab === "login" ? t('auth.loginButton') : t('auth.signupButton')
                )}
              </Button>
            </form>

            {/* Bilgilendirme Kutusu */}
            {activeTab === "signup" && (
              <Alert className="mt-6 bg-blue-50/50 border-blue-200 text-blue-900 animate-in fade-in duration-500">
                <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="ml-2">
                  <AlertTitle className="text-sm font-semibold text-blue-800">
                    {t('auth.verifyEmailAlert') || "E-posta Doğrulama"}
                  </AlertTitle>
                  <AlertDescription className="text-xs text-blue-700/80 mt-1">
                    {t('auth.verifyEmailDesc') || "Güvenliğiniz için kayıt sonrası email adresinize bir doğrulama linki gönderilecektir."}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                {activeTab === "login" ? t('auth.switchToSignup') : t('auth.switchToLogin')}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-bold text-primary hover:text-primary/80 underline-offset-4"
                  onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                >
                  {activeTab === "login" ? t('auth.signup') : t('auth.login')}
                </Button>
              </p>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Alt Bilgi */}
      <div className="absolute bottom-6 text-center text-xs text-gray-400 z-10">
        &copy; {new Date().getFullYear()} {t('header.brand')}. {t('footer.all_rights_reserved')}
      </div>
    </div>
  );
};

export default Auth;