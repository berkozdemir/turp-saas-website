import {
  ClipboardList,
  Bell,
  HeartPulse,
  Calendar,
  AlertTriangle,
  BookOpen,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { TFunction } from "i18next";

export const COMPANY_INFO = {
  address: "Omega Araştırma Cyberpark C Blok Kat: 1 No:146 Bilkent, Çankaya / Ankara",
  phone: "+90 312 426 77 22",
  email: "info@turp.app",
  copyright: "© 2025 Turp & Omega Araştırma.",
} as const;

// Hangi modüller var:
export type ModuleId =
  | "survey"
  | "medication"
  | "vital"
  | "appointment"
  | "adverse"
  | "education"
  | "webinar";

type ModuleFeatureConfig = {
  t: string; // başlık (hardcoded TR kısa label)
  d: string; // i18n key
};

type ModuleConfig = {
  titleKey: string;
  shortKey: string;
  heroDescKey: string;
  details: string[];
  features: ModuleFeatureConfig[];
  icon: LucideIcon;
  color: string;
  image: string;
  // istersen fallback için title/short/heroDesc da ekleyebilirsin
  title?: string;
  short?: string;
  heroDesc?: string;
};

export const MODULE_CONTENT: Record<ModuleId, ModuleConfig> = {
  survey: {
    titleKey: "mod_survey_title",
    icon: ClipboardList,
    color: "from-blue-600 to-indigo-600",
    image:
      "/uploads/senior-woman-eye-exam-and-vision-for-snellen-test-2025-04-06-12-48-50-utc.jpg",
    shortKey: "mod_survey_short",
    heroDescKey: "mod_survey_desc",
    details: ["mod_survey_d1", "mod_survey_d2", "mod_survey_d3"],
    features: [
      { t: "Dinamik Mantık", d: "mod_survey_d3" },
      { t: "Zaman Damgası", d: "mod_survey_d1" },
      { t: "Çoklu Dil", d: "mod_survey_d1" },
      { t: "Validasyon", d: "mod_survey_d3" },
    ],
  },
  medication: {
    titleKey: "mod_med_title",
    icon: Bell,
    color: "from-green-500 to-emerald-700",
    image:
      "/uploads/a-pile-of-pills-in-blister-packs-close-up-2025-10-18-13-17-21-utc.jpg",
    shortKey: "mod_med_short",
    heroDescKey: "mod_med_desc",
    details: ["mod_med_d1", "mod_med_d2", "mod_med_d3"],
    features: [
      { t: "Görsel Teyit", d: "mod_med_d1" },
      { t: "Akıllı Erteleme", d: "mod_med_d2" },
      { t: "Stok Takibi", d: "mod_med_d3" },
      { t: "Oyunlaştırma", d: "mod_med_d1" },
    ],
  },
  vital: {
    titleKey: "mod_vital_title",
    icon: HeartPulse,
    color: "from-rose-500 to-red-700",
    image:
      "/uploads/woman-taking-blood-pressure-test-on-smartwatches-2025-08-11-15-24-28-utc.jpg",
    shortKey: "mod_vital_short",
    heroDescKey: "mod_vital_desc",
    details: ["mod_vital_d1", "mod_vital_d2", "mod_vital_d3"],
    features: [
      { t: "Cihaz Entegrasyonu", d: "mod_vital_d1" },
      { t: "Trend Analizi", d: "mod_vital_d3" },
      { t: "Apple/Google Health", d: "mod_vital_d2" },
      { t: "Veri Temizliği", d: "mod_vital_d3" },
    ],
  },
  appointment: {
    titleKey: "mod_appt_title",
    icon: Calendar,
    color: "from-purple-600 to-violet-800",
    image:
      "/uploads/appointment-consulting-doctor-visit-on-mobile-app-2024-11-26-02-03-22-utc.jpg",
    shortKey: "mod_appt_short",
    heroDescKey: "mod_appt_desc",
    details: ["mod_appt_d1", "mod_appt_d2", "mod_appt_d3"],
    features: [
      { t: "Otomatik Hatırlatıcı", d: "mod_appt_d1" },
      { t: "Takvim Senk.", d: "mod_appt_d2" },
      { t: "Navigasyon", d: "mod_appt_d3" },
      { t: "Esnek Planlama", d: "mod_appt_d3" },
    ],
  },
  adverse: {
    titleKey: "mod_adv_title",
    icon: AlertTriangle,
    color: "from-orange-500 to-amber-600",
    image:
      "/uploads/doctor-presenting-report-of-diagnosis-2025-01-09-06-41-33-utc.jpg",
    shortKey: "mod_adv_short",
    heroDescKey: "mod_adv_desc",
    details: ["mod_adv_d1", "mod_adv_d2", "mod_adv_d3"],
    features: [
      { t: "Tek Tuşla Bildirim", d: "mod_adv_d1" },
      { t: "Görsel Kanıt", d: "mod_adv_d2" },
      { t: "CTCAE Derecelendirme", d: "mod_adv_d3" },
      { t: "Anlık Alarm", d: "mod_adv_d3" },
    ],
  },
  education: {
    titleKey: "mod_edu_title",
    icon: BookOpen,
    color: "from-sky-500 to-cyan-600",
    image:
      "/uploads/chairs-on-empty-building-2025-01-27-22-50-08-utc.jpg",
    shortKey: "mod_edu_short",
    heroDescKey: "mod_edu_desc",
    details: ["mod_edu_d1", "mod_edu_d2", "mod_edu_d3"],
    features: [
      { t: "eConsent", d: "mod_edu_d1" },
      { t: "Multimedya", d: "mod_edu_d2" },
      { t: "Bilgi Sınaması", d: "mod_edu_d3" },
      { t: "Canlı Kütüphane", d: "mod_edu_d3" },
    ],
  },
  webinar: {
    titleKey: "mod_web_title",
    icon: Video,
    color: "from-fuchsia-600 to-pink-600",
    image:
      "/uploads/virtual-doctor-working-from-home-on-a-video-call-2025-11-02-01-48-10-utc.jpg",
    shortKey: "mod_web_short",
    heroDescKey: "mod_web_desc",
    details: ["mod_web_d1", "mod_web_d2", "mod_web_d3"],
    features: [
      { t: "Uçtan Uca Şifreleme", d: "mod_web_d1" },
      { t: "Ekran Paylaşımı", d: "mod_web_d2" },
      { t: "Sanal Bekleme", d: "mod_web_d3" },
      { t: "Oturum Logları", d: "mod_web_d3" },
    ],
  },
};

// UI'nin kullandığı, çevrilmiş versiyon:
export type TranslatedModule = {
  id: ModuleId;
  title: string;
  short: string;
  heroDesc: string;
  icon: LucideIcon;
  color: string;
  image: string;
  details: string[];
  features: { t: string; d: string }[];
};

export const getModuleContentTranslated = (
  t: TFunction
): Record<ModuleId, TranslatedModule> => {
  return Object.entries(MODULE_CONTENT)
    .map(([id, data]) => {
      const title =
        t(data.titleKey) !== data.titleKey
          ? (t(data.titleKey) as string)
          : data.title || data.titleKey;
      const short =
        t(data.shortKey) !== data.shortKey
          ? (t(data.shortKey) as string)
          : data.short || data.shortKey;
      const heroDesc =
        t(data.heroDescKey) !== data.heroDescKey
          ? (t(data.heroDescKey) as string)
          : data.heroDesc || data.heroDescKey;

      return {
        id: id as ModuleId,
        title,
        short,
        heroDesc,
        icon: data.icon,
        color: data.color,
        image: data.image,
        details: data.details.map((key) => t(key) as string),
        features: data.features.map((f) => ({
          t: f.t,
          d: t(f.d) as string,
        })),
      };
    })
    .reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {} as Record<ModuleId, TranslatedModule>
    );
};
