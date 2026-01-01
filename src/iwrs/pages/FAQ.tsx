import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/iwrs/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { HelpCircle, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";

interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  category?: string;
}

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Define i18n based FAQ structure for fallback
  const getFallbackFaqs = (): FaqItem[] => {
    const faqCategories = [
      { categoryKey: "faq.categories.randomization", questions: ["q1", "q2", "q3"] },
      { categoryKey: "faq.categories.iwrs", questions: ["q4", "q5", "q6"] },
      { categoryKey: "faq.categories.inventory", questions: ["q7", "q8", "q9"] },
      { categoryKey: "faq.categories.security", questions: ["q10", "q11", "q12"] }
    ];

    const items: FaqItem[] = [];

    faqCategories.forEach(category => {
      category.questions.forEach(questionKey => {
        items.push({
          question: t(`faq.questions.${questionKey}.question`),
          answer: t(`faq.questions.${questionKey}.answer`),
          category: t(category.categoryKey)
        });
      });
    });

    return items;
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const lang = i18n.language?.split('-')[0] || 'en';
        const res = await fetch(`/api/index.php?action=get_faqs_by_page&page=iwrs-faq&language=${lang}`);
        const data = await res.json();

        if (data.success && data.data?.length > 0) {
          setFaqs(data.data);
          setLoading(false);
          return;
        }

        // No backend FAQs - import from i18n
        const fallbackFaqs = getFallbackFaqs();

        if (fallbackFaqs.length > 0) {
          const items = fallbackFaqs.map((f, idx) => ({
            question: f.question,
            answer: f.answer,
            order: idx
          }));

          await fetch('/api/index.php?action=bulk_import_faqs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page_slug: 'iwrs-faq', items })
          });

          // Re-fetch after import
          const res2 = await fetch(`/api/index.php?action=get_faqs_by_page&page=iwrs-faq&language=${lang}`);
          const data2 = await res2.json();

          if (data2.success && data2.data?.length > 0) {
            setFaqs(data2.data);
          } else {
            setFaqs(fallbackFaqs);
          }
        }
      } catch (err) {
        console.error('FAQ fetch error:', err);
        setFaqs(getFallbackFaqs());
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [i18n.language, t]);

  // Group FAQs by category
  const groupedFaqs: { [key: string]: FaqItem[] } = {};
  faqs.forEach((faq, idx) => {
    const cat = faq.category || 'General';
    if (!groupedFaqs[cat]) groupedFaqs[cat] = [];
    groupedFaqs[cat].push({ ...faq, id: faq.id || idx });
  });

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedFaqs).map(([category, items], categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="text-2xl">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {items.map((faq, questionIndex) => (
                          <AccordionItem key={faq.id || questionIndex} value={`item-${categoryIndex}-${questionIndex}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
