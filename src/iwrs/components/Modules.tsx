import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Button } from "@/iwrs/components/ui/button";
import { Shuffle, EyeOff, Package, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import iwrsImage from "@/iwrs/assets/iwrs-interface.jpg";
import unblindingImage from "@/iwrs/assets/emergency-unblinding.jpg";
import inventoryImage from "@/iwrs/assets/inventory-system.jpg";
import securityImage from "@/iwrs/assets/data-security.jpg";

export const Modules = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const modules = [
    {
      icon: Shuffle,
      titleKey: "modules.iwrs.title",
      descKey: "modules.iwrs.description",
      buttonKey: "modules.iwrs.button",
      link: "/iwrs-mockup",
      image: iwrsImage,
      color: "text-blue-600"
    },
    {
      icon: EyeOff,
      titleKey: "modules.unblinding.title",
      descKey: "modules.unblinding.description",
      buttonKey: "modules.unblinding.button",
      link: "/emergency-unblinding",
      image: unblindingImage,
      color: "text-red-600"
    },
    {
      icon: Package,
      titleKey: "modules.inventory.title",
      descKey: "modules.inventory.description",
      buttonKey: "modules.inventory.button",
      link: "/inventory-system",
      image: inventoryImage,
      color: "text-green-600"
    },
    {
      icon: Shield,
      titleKey: "modules.security.title",
      descKey: "modules.security.description",
      buttonKey: "modules.security.button",
      link: "/data-security",
      image: securityImage,
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">{t('modules.subtitle')}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {t('modules.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('modules.description')}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={module.image} 
                    alt={t(module.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {t(module.titleKey)}
                  </CardTitle>
                  <CardDescription className="text-base pt-2">
                    {t(module.descKey)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    onClick={() => navigate(module.link)}
                    className="w-full"
                    variant="default"
                  >
                    {t(module.buttonKey)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
