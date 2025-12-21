import { Button } from "@/iwrs/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVisual from "@/iwrs/assets/hero-visual.jpg";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();
  return <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {t('hero.title')}
              <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                {t('hero.getStarted')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                {t('hero.watchDemo')}
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">FDA</div>
                <div className="text-sm text-muted-foreground">{t('hero.fdaCompliant')}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">EMA</div>
                <div className="text-sm text-muted-foreground">{t('hero.emaCompliant')}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">{t('hero.support247')}</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in-up lg:block hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl" />
            <img src={heroVisual} alt={t('hero.imageAlt')} className="relative rounded-2xl shadow-2xl border border-border/50" />
          </div>
        </div>
      </div>
    </section>;
};