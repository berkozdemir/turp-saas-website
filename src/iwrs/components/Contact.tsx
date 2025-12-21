import { useState, useMemo } from "react";
import { contactApi } from "@/iwrs/lib/api"; // Added
import { Button } from "@/iwrs/components/ui/button";
import { Input } from "@/iwrs/components/ui/input";
import { Textarea } from "@/iwrs/components/ui/textarea";
import { Card } from "@/iwrs/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/iwrs/hooks/use-toast";
// import { supabase } from "@/iwrs/integrations/supabase/client"; // Removed
import { z } from "zod";
import { useTranslation } from "react-i18next";

export const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const contactSchema = useMemo(() => z.object({
    name: z.string().trim().min(1, t('contact.validation.name')).max(100, t('contact.validation.nameMax')),
    email: z.string().trim().email(t('contact.validation.email')).max(255, t('contact.validation.emailMax')),
    phone: z.string().trim().max(20, t('contact.validation.phoneMax')).optional(),
    message: z.string().trim().min(1, t('contact.validation.message')).max(1000, t('contact.validation.messageMax')),
  }), [t]);

  type ContactFormData = z.infer<typeof contactSchema>;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = contactSchema.parse(formData);
      setIsSubmitting(true);

      await contactApi.send(validatedData);

      toast({
        title: t('contact.success'),
        description: t('contact.successDescription'),
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: t('contact.errorTitle'),
          description: t('contact.error'),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{t('contact.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
          {/* Sol Taraf: İletişim Bilgileri */}
          <div className="space-y-6 animate-fade-in-up">
            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.emailLabel')}</h3>
                  <p className="text-muted-foreground">info@omega-cro.com.tr</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.phoneLabel')}</h3>
                  <p className="text-muted-foreground">+90 (312) 426-7722</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.addressLabel')}</h3>
                  <p className="text-muted-foreground">
                    Piri Reis Caddesi
                    <br />
                    No:2/4 Beytepe Çankaya Ankara Türkiye
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sağ Taraf: İletişim Formu */}
          <Card className="p-8 bg-card border-border animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                  {t('contact.name')} *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('contact.name')}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                  {t('contact.email')} *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('contact.email')}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground">
                  {t('contact.phoneOptional')}
                </label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('contact.phonePlaceholder')}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                  {t('contact.message')} *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.message')}
                  rows={5}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('contact.sending') : t('contact.send')}
              </Button>
            </form>
          </Card>
        </div>

        {/* Harita Bölümü */}
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-border animate-fade-in-up">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3062.268713204928!2d32.73867637651034!3d39.86821397126139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d347003058221b%3A0x628006900222067e!2sPiri%20Reis%20Cd.%20No%3A2%2C%2006800%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1716900000000!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Omega CRO Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};