// Dosya: src/components/CallToAction.tsx

import { Button } from "@/iwrs/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CallToAction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // '/contact' sayfasına yönlendirme
    navigate("/contact");
  };

  return (
    <section className="py-16 px-4 bg-primary/10">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-foreground">
          {t('contact.title')}
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
          {t('contact.subtitle')}
        </p>
        <Button
          size="lg"
          // GÜNCELLEME: Rengi bozuk çıkan 'default' yerine 'secondary' (Mavi) kullanıldı.
          variant="secondary" 
          // Yazı rengini white olarak garanti ediyoruz
          className="shadow-lg hover:bg-secondary/90 text-white font-bold text-lg px-8 transition-transform hover:scale-105"
          onClick={handleClick}
        >
          {t('contact.send')}
        </Button>
      </div>
    </section>
  );
};