import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "@/iwrs/integrations/supabase/client"; // Removed
import { Header } from "@/iwrs/components/Header";
import { Hero } from "@/iwrs/components/Hero";
import { Features } from "@/iwrs/components/Features";
import { Platform } from "@/iwrs/components/Platform";
import { AIModule } from "@/iwrs/components/AIModule";
import { Modules } from "@/iwrs/components/Modules";
import { Compliance } from "@/iwrs/components/Compliance";
import { PhoneServices } from "@/iwrs/components/PhoneServices";
import { Contact } from "@/iwrs/components/Contact";
import { Footer } from "@/iwrs/components/Footer";
import { RandomizationBot } from "@/iwrs/components/RandomizationBot";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
// Supabase'den gelen tipleri kaldırdık, çünkü mock yapıda 'any' kullanıyoruz
import { useTranslation } from "react-i18next";

import { authApi } from "@/iwrs/lib/api";

// ...

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkSession = async () => {
      const { session } = await authApi.getSession();
      if (session) {
        setUser(session.user);
        setUser(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    checkSession();
  }, [navigate]);

  const handleSignOut = async () => {
    await authApi.logout();
    setUser(null);
    window.location.reload();
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('index.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Welcome Card for Authenticated Users */}
      {user && (
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                {/* user.full_name varsa onu kullan, yoksa email kullan */}
                {t('index.welcome', { name: user.full_name || user.email })}
              </CardTitle>
              <CardDescription>
                {t('index.welcomeDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={handleSignOut} variant="outline">
                {t('index.signOut')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Login Prompt for Non-Authenticated Users */}
      {!user && (
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('index.aiAssistantTitle')}
              </CardTitle>
              <CardDescription>
                {t('index.aiAssistantDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLoginClick} className="w-full sm:w-auto">
                {t('index.loginSignup')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Hero />
      <Features />
      <Platform />
      <AIModule />
      <Modules />
      <PhoneServices />
      <Compliance />
      <Contact />
      <Footer />

      {/* Only show RandomizationBot to authenticated users */}
      {user && <RandomizationBot />}
    </div>
  );
};

export default Index;