import iwrsInterface from "@/iwrs/assets/iwrs-interface.jpg";
import { Badge } from "@/iwrs/components/ui/badge";
import { useTranslation } from "react-i18next";

export const Platform = () => {
  const { t } = useTranslation();
  return (
    <section id="platform" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <Badge variant="outline" className="border-secondary text-secondary">
              {t('platform.badge')}
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              {t('platform.title')}
              <span className="block mt-2 text-secondary">{t('platform.titleHighlight')}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('platform.description')}
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('platform.smartRecommendations.title')}</h4>
                  <p className="text-muted-foreground">{t('platform.smartRecommendations.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('platform.predictiveAnalytics.title')}</h4>
                  <p className="text-muted-foreground">{t('platform.predictiveAnalytics.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('platform.realTimeMonitoring.title')}</h4>
                  <p className="text-muted-foreground">{t('platform.realTimeMonitoring.description')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in-up">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/10 blur-2xl" />
            <img 
              src={iwrsInterface} 
              alt="IWRS Platform Interface"
              className="relative rounded-2xl shadow-2xl border border-border/50"
            />
            
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-xl animate-float">
              <div className="text-sm text-muted-foreground mb-1">AI Recommendation</div>
              <div className="font-semibold text-foreground">Stratification: Factors X, Y, Z</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-sm text-muted-foreground mb-1">Supply Forecast</div>
              <div className="font-semibold text-foreground">Center A: 50 boxes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
