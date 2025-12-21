import { Brain, Scale, PackageCheck, TrendingUp, Shield, Zap } from "lucide-react";
import { Card } from "@/iwrs/components/ui/card";
import { useTranslation } from "react-i18next";

export const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Brain,
      title: t('features.aiDrivenOptimization.title'),
      description: t('features.aiDrivenOptimization.description'),
    },
    {
      icon: Scale,
      title: t('features.balancedRandomization.title'),
      description: t('features.balancedRandomization.description'),
    },
    {
      icon: PackageCheck,
      title: t('features.supplyChainIntelligence.title'),
      description: t('features.supplyChainIntelligence.description'),
    },
    {
      icon: TrendingUp,
      title: t('features.scenarioSimulation.title'),
      description: t('features.scenarioSimulation.description'),
    },
    {
      icon: Shield,
      title: t('features.regulatoryCompliance.title'),
      description: t('features.regulatoryCompliance.description'),
    },
    {
      icon: Zap,
      title: t('features.rapidDeployment.title'),
      description: t('features.rapidDeployment.description'),
    },
  ];
  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold">
            {t('features.mainTitle')}
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('features.mainTitleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.mainSubtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 border-border/50 bg-card hover:border-primary/20 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
