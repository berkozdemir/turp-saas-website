import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Contact } from "@/iwrs/components/Contact";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Badge } from "@/iwrs/components/ui/badge";
import { FileText, MessageSquare, Database, Shield } from "lucide-react";
import patientSurveyImage from "@/iwrs/assets/patient-survey.jpg";
import { CallToAction } from "@/iwrs/components/CallToAction"; // <-- BURASI

const PatientSurvey = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageSquare,
      title: t('patientSurvey.features.automatedSurveys.title'),
      description: t('patientSurvey.features.automatedSurveys.description')
    },
    {
      icon: FileText,
      title: t('patientSurvey.features.multipleFormats.title'),
      description: t('patientSurvey.features.multipleFormats.description')
    },
    {
      icon: Database,
      title: t('patientSurvey.features.realTimeData.title'),
      description: t('patientSurvey.features.realTimeData.description')
    },
    {
      icon: Shield,
      title: t('patientSurvey.features.privacyCompliant.title'),
      description: t('patientSurvey.features.privacyCompliant.description')
    }
  ];

  const surveyTypes = [
    {
      title: t('patientSurvey.surveyTypes.satisfaction.title'),
      description: t('patientSurvey.surveyTypes.satisfaction.description')
    },
    {
      title: t('patientSurvey.surveyTypes.therapyResponse.title'),
      description: t('patientSurvey.surveyTypes.therapyResponse.description')
    },
    {
      title: t('patientSurvey.surveyTypes.qualityOfLife.title'),
      description: t('patientSurvey.surveyTypes.qualityOfLife.description')
    },
    {
      title: t('patientSurvey.surveyTypes.adherence.title'),
      description: t('patientSurvey.surveyTypes.adherence.description')
    }
  ];

  const workflow = [
    {
      step: "1",
      title: t('patientSurvey.workflow.step1.title'),
      description: t('patientSurvey.workflow.step1.description')
    },
    {
      step: "2",
      title: t('patientSurvey.workflow.step2.title'),
      description: t('patientSurvey.workflow.step2.description')
    },
    {
      step: "3",
      title: t('patientSurvey.workflow.step3.title'),
      description: t('patientSurvey.workflow.step3.description')
    },
    {
      step: "4",
      title: t('patientSurvey.workflow.step4.title'),
      description: t('patientSurvey.workflow.step4.description')
    }
  ];

  const benefits = [
    {
      title: t('patientSurvey.benefits.responseRate.title'),
      description: t('patientSurvey.benefits.responseRate.description')
    },
    {
      title: t('patientSurvey.benefits.realTimeInsights.title'),
      description: t('patientSurvey.benefits.realTimeInsights.description')
    },
    {
      title: t('patientSurvey.benefits.reducedBurden.title'),
      description: t('patientSurvey.benefits.reducedBurden.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('patientSurvey.seo.title')}</title>
        <meta name="description" content={t('patientSurvey.seo.description')} />
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
                {t('patientSurvey.hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {t('patientSurvey.hero.subtitle')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t('patientSurvey.hero.description')}
              </p>
              <Button size="lg" onClick={() => window.location.href = '/#contact'}>
                {t('patientSurvey.cta.button')}
              </Button>
            </div>
            <div className="relative">
              <img 
                src={patientSurveyImage} 
                alt="Patient Survey System" 
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
            {t('patientSurvey.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
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

      {/* Survey Types Section */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('patientSurvey.surveyTypes.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {surveyTypes.map((survey, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{survey.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{survey.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('patientSurvey.workflow.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-xl font-bold mb-4">
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
      <section className="py-20 px-4 bg-accent/5">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('patientSurvey.benefits.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-purple-500/20 bg-gradient-to-br from-background to-purple-500/5">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-500/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('patientSurvey.cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('patientSurvey.cta.description')}
          </p>
          <Button size="lg" onClick={() => window.location.href = '/#contact'}>
            {t('patientSurvey.cta.button')}
          </Button>
        </div>
      </section>

      <Contact />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default PatientSurvey;
