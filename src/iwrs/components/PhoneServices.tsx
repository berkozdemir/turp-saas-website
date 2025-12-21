import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Button } from "@/iwrs/components/ui/button";
import { Badge } from "@/iwrs/components/ui/badge";
import { Phone, MessageSquare, Calendar, FileText } from "lucide-react";

export const PhoneServices = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Phone,
      title: t('phoneServices.adverseEvents.title'),
      description: t('phoneServices.adverseEvents.description'),
      link: '/adverse-events-call',
      color: 'text-red-500'
    },
    {
      icon: MessageSquare,
      title: t('phoneServices.medicationReminder.title'),
      description: t('phoneServices.medicationReminder.description'),
      link: '/medication-reminder',
      color: 'text-blue-500'
    },
    {
      icon: Calendar,
      title: t('phoneServices.appointmentReminder.title'),
      description: t('phoneServices.appointmentReminder.description'),
      link: '/appointment-reminder',
      color: 'text-green-500'
    },
    {
      icon: FileText,
      title: t('phoneServices.patientSurvey.title'),
      description: t('phoneServices.patientSurvey.description'),
      link: '/patient-survey',
      color: 'text-purple-500'
    }
  ];

  return (
    <section id="phone-services" className="py-24 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('phoneServices.badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('phoneServices.title')}{" "}
            <span className="text-primary">{t('phoneServices.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('phoneServices.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 ${service.color}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-sm">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => window.location.href = service.link}
                >
                  {t('phoneServices.adverseEvents.learnMore')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
