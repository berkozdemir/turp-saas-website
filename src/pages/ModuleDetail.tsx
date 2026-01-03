import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle, FileText } from "lucide-react";
import { getModuleContentTranslated } from "../data/content";
import { OptimizedImage } from "../components/OptimizedImage";

import { AppView } from "../types/view";

interface ModuleDetailProps {
  moduleId: string;
  setView: (view: AppView) => void;
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({ moduleId, setView }) => {
  const { t } = useTranslation();
  const allModules = getModuleContentTranslated(t) as Record<string, any>;
  const data = allModules ? allModules[moduleId] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

  if (!data) {
    return <div className="p-20 text-center">Modül bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> {t("module_back")}
          </button>
          <div className="flex items-center gap-3">
            {moduleId === "education" && (
              <button
                onClick={() => setView("case-education")}
                className="px-5 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-bold hover:bg-sky-200 transition-colors border border-sky-200 shadow-sm flex items-center gap-2"
              >
                <FileText size={16} /> {t("case_edu.badge")}
              </button>
            )}
            <button
              onClick={() =>
                document
                  .getElementById("contact-module")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg"
            >
              {t("module_btn_detail")}
            </button>
          </div>
        </div>
      </div>

      <section className="relative py-32 px-6 overflow-hidden flex items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={data.image}
            alt={data.title}
            width={1200}
            height={600}
            className="w-full h-full object-cover object-center"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-90 mix-blend-multiply`}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 text-white">
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8">
            {React.createElement(data.icon, { size: 48 })}
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-2xl text-white/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed">
            {data.short}
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">
            {t("module_why")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-slate-900 pl-6">
            {data.heroDesc}
          </p>
          <div className="space-y-6">
            {data.details?.map((detail: string, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-slate-900 shrink-0"></div>
                <p className="text-slate-600 leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <h3 className="font-heading text-2xl font-bold text-slate-900 mb-8">
            {t("module_tech")}
          </h3>
          <div className="grid gap-6">
            {data.features?.map((feat: any, i: number) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4"
              >
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${data.color} text-white shrink-0`}
                >
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{feat.t}</h4>
                  <p className="text-sm text-slate-500">{feat.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact-module"
        className="py-24 bg-slate-900 text-white text-center px-6"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl font-bold mb-6">
            {t("module_cta_title")}
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            {t("module_cta_desc")}
          </p>
          <button
            onClick={() => setView({ type: "home", scrollTo: "contact" })}
            className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            {t("module_cta_btn")}
          </button>
        </div>
      </section>
    </div>
  );
};
