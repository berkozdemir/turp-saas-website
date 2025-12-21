import { Shield, FileCheck, Lock, Clock } from "lucide-react";
import { Card } from "@/iwrs/components/ui/card";
import { useTranslation } from "react-i18next";

export const Compliance = () => {
  const { t } = useTranslation();
  
  const complianceFeatures = [
    {
      icon: Shield,
      title: t('compliance.fda.title'),
      description: t('compliance.fda.description'),
    },
    {
      icon: FileCheck,
      title: t('compliance.ema.title'),
      description: t('compliance.ema.description'),
    },
    {
      icon: Lock,
      title: t('compliance.dataSecurity.title'),
      description: t('compliance.dataSecurity.description'),
    },
    {
      icon: Clock,
      title: t('compliance.auditTrails.title'),
      description: t('compliance.auditTrails.description'),
    },
  ];
  return (
    <section id="compliance" className="py-24 px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold">
            {t('compliance.title')}
            <span className="block mt-2 text-primary">{t('compliance.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('compliance.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 text-center hover:shadow-xl transition-all duration-300 border-border/50 bg-card hover:border-primary/20 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50 animate-fade-in-up">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">{t('compliance.cta.title')}</h3>
            <p className="text-muted-foreground">
              {t('compliance.cta.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
