import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/iwrs/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet";

const FAQ = () => {
  const { t } = useTranslation();

  const faqCategories = [
    {
      categoryKey: "faq.categories.randomization",
      questions: ["q1", "q2", "q3"]
    },
    {
      categoryKey: "faq.categories.iwrs",
      questions: ["q4", "q5", "q6"]
    },
    {
      categoryKey: "faq.categories.inventory",
      questions: ["q7", "q8", "q9"]
    },
    {
      categoryKey: "faq.categories.security",
      questions: ["q10", "q11", "q12"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('faq.seo.title')}</title>
        <meta name="description" content={t('faq.seo.description')} />
        <meta name="keywords" content={t('faq.seo.keywords')} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {t('faq.hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('faq.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {t(category.categoryKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((questionKey, questionIndex) => (
                        <AccordionItem key={questionIndex} value={`item-${categoryIndex}-${questionIndex}`}>
                          <AccordionTrigger className="text-left">
                            {t(`faq.questions.${questionKey}.question`)}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {t(`faq.questions.${questionKey}.answer`)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {t('faq.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('faq.cta.description')}
            </p>
            <a href="/#contact">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {t('faq.cta.button')}
              </button>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
