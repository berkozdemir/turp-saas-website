import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Contact } from "@/iwrs/components/Contact";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Badge } from "@/iwrs/components/ui/badge";
import { Clock, Pill, CheckCircle, AlertCircle } from "lucide-react";
import medicationReminderImage from "@/iwrs/assets/medication-reminder.jpg";
import { CallToAction } from "@/iwrs/components/CallToAction"; // <-- BURASI

const MedicationReminder = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Clock,
      title: t('medicationReminder.features.scheduledReminders.title'),
      description: t('medicationReminder.features.scheduledReminders.description')
    },
    {
      icon: Pill,
      title: t('medicationReminder.features.doseInformation.title'),
      description: t('medicationReminder.features.doseInformation.description')
    },
    {
      icon: CheckCircle,
      title: t('medicationReminder.features.confirmationTracking.title'),
      description: t('medicationReminder.features.confirmationTracking.description')
    },
    {
      icon: AlertCircle,
      title: t('medicationReminder.features.missedDoseAlerts.title'),
      description: t('medicationReminder.features.missedDoseAlerts.description')
    }
  ];

  const workflow = [
    {
      step: "1",
      title: t('medicationReminder.workflow.step1.title'),
      description: t('medicationReminder.workflow.step1.description')
    },
    {
      step: "2",
      title: t('medicationReminder.workflow.step2.title'),
      description: t('medicationReminder.workflow.step2.description')
    },
    {
      step: "3",
      title: t('medicationReminder.workflow.step3.title'),
      description: t('medicationReminder.workflow.step3.description')
    },
    {
      step: "4",
      title: t('medicationReminder.workflow.step4.title'),
      description: t('medicationReminder.workflow.step4.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('medicationReminder.seo.title')}</title>
        <meta name="description" content={t('medicationReminder.seo.description')} />
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
                {t('medicationReminder.hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {t('medicationReminder.hero.subtitle')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t('medicationReminder.hero.description')}
              </p>
              <Button size="lg" onClick={() => window.location.href = '/#contact'}>
                {t('medicationReminder.cta.button')}
              </Button>
            </div>
            <div className="relative">
              <img 
                src={medicationReminderImage} 
                alt="Medication Reminder System" 
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
            {t('medicationReminder.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
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
            {t('medicationReminder.workflow.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4">
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

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-blue-500/20 bg-gradient-to-br from-background to-blue-500/5">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-2xl mb-4">
                {t('medicationReminder.benefits.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground">
                {t('medicationReminder.benefits.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('medicationReminder.cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('medicationReminder.cta.description')}
          </p>
          <Button size="lg" onClick={() => window.location.href = '/#contact'}>
            {t('medicationReminder.cta.button')}
          </Button>
        </div>
      </section>

      <Contact />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default MedicationReminder;
