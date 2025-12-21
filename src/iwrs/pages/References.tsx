import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Badge } from "@/iwrs/components/ui/badge";
import { CheckCircle, Building2, Users, TrendingUp } from "lucide-react";
import referencesImage from "@/iwrs/assets/references-hero.jpg";
import { Helmet } from "react-helmet";

const References = () => {
  const { t } = useTranslation();

  const phases = ["phase1", "phase2", "phase3", "phase4"];
  const caseStudies = ["case1", "case2", "case3"];
  const stats = [
    { iconComponent: Building2, valueKey: "references.stats.clients.value", labelKey: "references.stats.clients.label" },
    { iconComponent: Users, valueKey: "references.stats.patients.value", labelKey: "references.stats.patients.label" },
    { iconComponent: TrendingUp, valueKey: "references.stats.trials.value", labelKey: "references.stats.trials.label" }
  ];

  return (
    <>
      <Helmet>
        <title>{t('references.seo.title')}</title>
        <meta name="description" content={t('references.seo.description')} />
        <meta name="keywords" content={t('references.seo.keywords')} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  {t('references.hero.title')}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('references.hero.subtitle')}
                </p>
              </div>
              <div className="relative">
                <img 
                  src={referencesImage} 
                  alt="Clinical Trial References" 
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.iconComponent;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-4xl font-bold text-foreground mb-2">
                        {t(stat.valueKey)}
                      </div>
                      <div className="text-muted-foreground">
                        {t(stat.labelKey)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Phase Examples */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {t('references.phases.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('references.phases.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {phases.map((phase, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="default" className="text-sm">
                        {t(`references.phases.${phase}.badge`)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {t(`references.phases.${phase}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {t(`references.phases.${phase}.description`)}
                    </CardDescription>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {t(`references.phases.${phase}.feature1`)}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {t(`references.phases.${phase}.feature2`)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {t('references.caseStudies.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('references.caseStudies.subtitle')}
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {caseStudies.map((caseStudy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        {t(`references.caseStudies.${caseStudy}.type`)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {t(`references.caseStudies.${caseStudy}.year`)}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">
                      {t(`references.caseStudies.${caseStudy}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {t(`references.caseStudies.${caseStudy}.description`)}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {t('references.caseStudies.labels.sites')}
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {t(`references.caseStudies.${caseStudy}.sites`)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {t('references.caseStudies.labels.patients')}
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {t(`references.caseStudies.${caseStudy}.patients`)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {t('references.caseStudies.labels.duration')}
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {t(`references.caseStudies.${caseStudy}.duration`)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {t('references.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('references.cta.description')}
            </p>
            <a href="/#contact">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {t('references.cta.button')}
              </button>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default References;
