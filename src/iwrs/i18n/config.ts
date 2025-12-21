// Dosya: src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import tr from '../locales/tr.json';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

export const initIwrsI18n = () => {
  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          tr: { translation: tr },
          en: { translation: en },
          zh: { translation: zh }
        },
        fallbackLng: 'en', // Hata olursa İngilizce'ye dön
        debug: true,       // <--- BU ÇOK ÖNEMLİ: Konsolda hatayı görmek için açtık
        interpolation: {
          escapeValue: false
        },
        detection: {
          // DİKKAT: 'caches' satırını sildik. Artık tarayıcı dile yapışıp kalmayacak.
          order: ['localStorage', 'navigator'],
          lookupLocalStorage: 'preferredLanguage'
        }
      });
  }
  return i18n;
};

export const detectAndSetLanguage = async () => {
  const savedLang = localStorage.getItem('preferredLanguage');

  if (savedLang) {
    return; // Kullanıcı zaten seçim yapmışsa dokunma
  }

  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;

    let detectedLang = 'en';

    if (countryCode === 'TR') {
      detectedLang = 'tr';
    } else if (countryCode === 'CN') {
      detectedLang = 'zh';
    }

    if (detectedLang !== 'en') {
      i18n.changeLanguage(detectedLang);
      localStorage.setItem('preferredLanguage', detectedLang);
    }
  } catch (error) {
    console.error('Country detection failed:', error);
  }
};

export default i18n;