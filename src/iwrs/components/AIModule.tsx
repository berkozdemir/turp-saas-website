import aiModuleCore from "@/iwrs/assets/ai-module-core.jpg";
import { Badge } from "@/iwrs/components/ui/badge";
import { Brain, Activity, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AIModule = () => {
  const { t } = useTranslation();
  return (
    <section id="ai-module" className="py-24 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative animate-fade-in-up order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-bl from-primary/20 to-secondary/20 blur-3xl animate-pulse-glow" />
            <img 
              src={aiModuleCore} 
              alt="AI Core Module Integration"
              className="relative rounded-2xl shadow-2xl border border-border/50"
            />
            
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-xl animate-float">
              <div className="text-sm text-muted-foreground mb-1">AI Module Status</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Active & Learning
              </div>
            </div>
            
            <div className="absolute -top-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-sm text-muted-foreground mb-1">Processing</div>
              <div className="font-semibold text-foreground">1.2M data points</div>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in-up order-1 lg:order-2">
            <Badge variant="outline" className="border-primary text-primary">
              {t('aiModule.badge')}
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              {t('aiModule.title')}
              <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('aiModule.titleHighlight')}
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('aiModule.description')}
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('aiModule.adaptiveRandomization.title')}</h4>
                  <p className="text-muted-foreground">{t('aiModule.adaptiveRandomization.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('aiModule.predictiveDosing.title')}</h4>
                  <p className="text-muted-foreground">{t('aiModule.predictiveDosing.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('aiModule.realTimeMonitoring.title')}</h4>
                  <p className="text-muted-foreground">{t('aiModule.realTimeMonitoring.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
