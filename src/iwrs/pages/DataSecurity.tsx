import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";
import { Shield, Lock, Eye, FileText, UserCheck, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import dataSecurityImage from "@/iwrs/assets/data-security.jpg";
import { Helmet } from "react-helmet";
import { CallToAction } from "@/iwrs/components/CallToAction"; // <-- BURASI

const DataSecurity = () => {
  const { t } = useTranslation();

  const securityFeatures = [
    {
      icon: Shield,
      titleKey: "dataSecurity.features.gdpr.title",
      descKey: "dataSecurity.features.gdpr.description"
    },
    {
      icon: Lock,
      titleKey: "dataSecurity.features.encryption.title",
      descKey: "dataSecurity.features.encryption.description"
    },
    {
      icon: Eye,
      titleKey: "dataSecurity.features.access.title",
      descKey: "dataSecurity.features.access.description"
    },
    {
      icon: FileText,
      titleKey: "dataSecurity.features.audit.title",
      descKey: "dataSecurity.features.audit.description"
    },
    {
      icon: UserCheck,
      titleKey: "dataSecurity.features.consent.title",
      descKey: "dataSecurity.features.consent.description"
    },
    {
      icon: Database,
      titleKey: "dataSecurity.features.backup.title",
      descKey: "dataSecurity.features.backup.description"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('dataSecurity.seo.title')}</title>
        <meta name="description" content={t('dataSecurity.seo.description')} />
        <meta name="keywords" content={t('dataSecurity.seo.keywords')} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  {t('dataSecurity.hero.title')}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('dataSecurity.hero.subtitle')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/#contact">
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      {t('dataSecurity.hero.cta')}
                    </button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={dataSecurityImage} 
                  alt="Data Security" 
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {t('dataSecurity.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('dataSecurity.features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">
                        {t(feature.titleKey)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {t(feature.descKey)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Patient Information Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
                {t('dataSecurity.patientInfo.title')}
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dataSecurity.patientInfo.transparency.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('dataSecurity.patientInfo.transparency.description')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dataSecurity.patientInfo.rights.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('dataSecurity.patientInfo.rights.description')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dataSecurity.patientInfo.communication.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('dataSecurity.patientInfo.communication.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
              {t('dataSecurity.compliance.title')}
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>{t('dataSecurity.compliance.description1')}</p>
                  <p>{t('dataSecurity.compliance.description2')}</p>
                  <p>{t('dataSecurity.compliance.description3')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
            <CallToAction />
        <Footer />
      </div>
    </>
  );
};

export default DataSecurity;
