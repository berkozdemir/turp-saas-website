import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Contact } from "@/iwrs/components/Contact";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Badge } from "@/iwrs/components/ui/badge";
import { Calendar, Bell, CheckCircle2, RefreshCw } from "lucide-react";
import appointmentReminderImage from "@/iwrs/assets/appointment-reminder.jpg";
import { CallToAction } from "@/iwrs/components/CallToAction"; // <-- BURASI

const AppointmentReminder = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Bell,
      title: t('appointmentReminder.features.multipleReminders.title'),
      description: t('appointmentReminder.features.multipleReminders.description')
    },
    {
      icon: Calendar,
      title: t('appointmentReminder.features.calendarIntegration.title'),
      description: t('appointmentReminder.features.calendarIntegration.description')
    },
    {
      icon: CheckCircle2,
      title: t('appointmentReminder.features.confirmationRequest.title'),
      description: t('appointmentReminder.features.confirmationRequest.description')
    },
    {
      icon: RefreshCw,
      title: t('appointmentReminder.features.reschedulingSupport.title'),
      description: t('appointmentReminder.features.reschedulingSupport.description')
    }
  ];

  const workflow = [
    {
      step: "1",
      title: t('appointmentReminder.workflow.step1.title'),
      description: t('appointmentReminder.workflow.step1.description')
    },
    {
      step: "2",
      title: t('appointmentReminder.workflow.step2.title'),
      description: t('appointmentReminder.workflow.step2.description')
    },
    {
      step: "3",
      title: t('appointmentReminder.workflow.step3.title'),
      description: t('appointmentReminder.workflow.step3.description')
    },
    {
      step: "4",
      title: t('appointmentReminder.workflow.step4.title'),
      description: t('appointmentReminder.workflow.step4.description')
    }
  ];

  const statistics = [
    {
      label: t('appointmentReminder.statistics.showUpRate.label'),
      value: t('appointmentReminder.statistics.showUpRate.value')
    },
    {
      label: t('appointmentReminder.statistics.noShowReduction.label'),
      value: t('appointmentReminder.statistics.noShowReduction.value')
    },
    {
      label: t('appointmentReminder.statistics.satisfaction.label'),
      value: t('appointmentReminder.statistics.satisfaction.value')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('appointmentReminder.seo.title')}</title>
        <meta name="description" content={t('appointmentReminder.seo.description')} />
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
                {t('appointmentReminder.hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {t('appointmentReminder.hero.subtitle')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t('appointmentReminder.hero.description')}
              </p>
              <Button size="lg" onClick={() => window.location.href = '/#contact'}>
                {t('appointmentReminder.cta.button')}
              </Button>
            </div>
            <div className="relative">
              <img 
                src={appointmentReminderImage} 
                alt="Appointment Reminder System" 
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
            {t('appointmentReminder.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
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
            {t('appointmentReminder.workflow.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold mb-4">
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

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('appointmentReminder.statistics.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {statistics.map((stat, index) => (
              <Card key={index} className="text-center border-green-500/20 bg-gradient-to-br from-background to-green-500/5">
                <CardHeader>
                  <div className="text-5xl font-bold text-green-500 mb-2">
                    {stat.value}
                  </div>
                  <CardTitle className="text-lg">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-500/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('appointmentReminder.cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('appointmentReminder.cta.description')}
          </p>
          <Button size="lg" onClick={() => window.location.href = '/#contact'}>
            {t('appointmentReminder.cta.button')}
          </Button>
        </div>
      </section>

      <Contact />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default AppointmentReminder;
