import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";
import { Package, Thermometer, BarChart3, Bell, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import inventoryImage from "@/iwrs/assets/inventory-system.jpg";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CallToAction } from "@/iwrs/components/CallToAction";

const InventorySystem = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Package,
      titleKey: "inventorySystem.features.autoStock.title",
      descKey: "inventorySystem.features.autoStock.description"
    },
    {
      icon: Thermometer,
      titleKey: "inventorySystem.features.coldChain.title",
      descKey: "inventorySystem.features.coldChain.description"
    },
    {
      icon: BarChart3,
      titleKey: "inventorySystem.features.reporting.title",
      descKey: "inventorySystem.features.reporting.description"
    },
    {
      icon: Bell,
      titleKey: "inventorySystem.features.alerts.title",
      descKey: "inventorySystem.features.alerts.description"
    },
    {
      icon: CheckCircle,
      titleKey: "inventorySystem.features.compliance.title",
      descKey: "inventorySystem.features.compliance.description"
    },
    {
      icon: TrendingUp,
      titleKey: "inventorySystem.features.optimization.title",
      descKey: "inventorySystem.features.optimization.description"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('inventorySystem.seo.title')}</title>
        <meta name="description" content={t('inventorySystem.seo.description')} />
        <meta name="keywords" content={t('inventorySystem.seo.keywords')} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  {t('inventorySystem.hero.title')}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('inventorySystem.hero.subtitle')}
                </p>
              <div className="flex flex-wrap gap-4">
              <Link to="/#contact">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  {t('inventorySystem.hero.cta')}
                  </button>
                </Link>
              </div>
              
              </div>
              <div className="relative">
                <img 
                  src={inventoryImage} 
                  alt="Inventory Management System" 
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {t('inventorySystem.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('inventorySystem.features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
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

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
                {t('inventorySystem.benefits.title')}
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('inventorySystem.benefits.efficiency.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('inventorySystem.benefits.efficiency.description')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('inventorySystem.benefits.accuracy.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('inventorySystem.benefits.accuracy.description')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('inventorySystem.benefits.transparency.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('inventorySystem.benefits.transparency.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
          <CallToAction />
        <Footer />
      </div>
    </>
  );
};

export default InventorySystem;
