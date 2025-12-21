import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Contact } from "@/iwrs/components/Contact";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t('contact.title')} | {t('header.brand')}</title>
        <meta name="description" content={t('contact.subtitle')} />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-16"> {/* Header fixed olduğu için padding ekledik */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;