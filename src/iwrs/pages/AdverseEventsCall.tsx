import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Contact } from "@/iwrs/components/Contact";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Badge } from "@/iwrs/components/ui/badge";
import { Phone, Shield, Bell, Activity } from "lucide-react";
import adverseEventsImage from "@/iwrs/assets/adverse-events.jpg";
import { CallToAction } from "@/iwrs/components/CallToAction"; // <-- BURASI

const AdverseEventsCall = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Phone,
      title: t('adverseEventsCall.features.automaticCalls.title'),
      description: t('adverseEventsCall.features.automaticCalls.description')
    },
    {
      icon: Bell,
      title: t('adverseEventsCall.features.smsReminders.title'),
      description: t('adverseEventsCall.features.smsReminders.description')
    },
    {
      icon: Shield,
      title: t('adverseEventsCall.features.secureRecording.title'),
      description: t('adverseEventsCall.features.secureRecording.description')
    },
    {
      icon: Activity,
      title: t('adverseEventsCall.features.realTimeAlerts.title'),
      description: t('adverseEventsCall.features.realTimeAlerts.description')
    }
  ];

  const workflow = [
    {
      step: "1",
      title: t('adverseEventsCall.workflow.step1.title'),
      description: t('adverseEventsCall.workflow.step1.description')
    },
    {
      step: "2",
      title: t('adverseEventsCall.workflow.step2.title'),
      description: t('adverseEventsCall.workflow.step2.description')
    },
    {
      step: "3",
      title: t('adverseEventsCall.workflow.step3.title'),
      description: t('adverseEventsCall.workflow.step3.description')
    },
    {
      step: "4",
      title: t('adverseEventsCall.workflow.step4.title'),
      description: t('adverseEventsCall.workflow.step4.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('adverseEventsCall.seo.title')}</title>
        <meta name="description" content={t('adverseEventsCall.seo.description')} />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-background via-background to-accent/10">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                {t('phoneServices.badge')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('adverseEventsCall.hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {t('adverseEventsCall.hero.subtitle')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t('adverseEventsCall.hero.description')}
              </p>
              <Button size="lg" onClick={() => window.location.href = '/#contact'}>
                {t('adverseEventsCall.cta.button')}
              </Button>
            </div>
            <div className="relative">
              <img 
                src={adverseEventsImage} 
                alt="Adverse Events Reporting System" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('adverseEventsCall.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('adverseEventsCall.workflow.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-4">
                {t('adverseEventsCall.security.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground">
                {t('adverseEventsCall.security.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('adverseEventsCall.cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('adverseEventsCall.cta.description')}
          </p>
          <Button size="lg" onClick={() => window.location.href = '/#contact'}>
            {t('adverseEventsCall.cta.button')}
          </Button>
        </div>
      </section>

      <Contact />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default AdverseEventsCall;
