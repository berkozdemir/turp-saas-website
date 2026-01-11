import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Dna, Heart, Baby, ArrowRight } from 'lucide-react';

import { GNDHeader } from '../components/GNDHeader';
import { GNDFooter } from '../components/GNDFooter';
import GNDSEO from '../components/GNDSEO';
import useLandingConfig from '../../hooks/useLandingConfig';
import { useFaq } from '../../hooks/useFaq';

// Icon mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  Dna: <Dna size={32} />,
  Heart: <Heart size={32} />,
  Baby: <Baby size={32} />,
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Fetch database-driven content
  const { data: landing, isLoading: landingLoading, error: landingError } = useLandingConfig(
    'genlerimnediyor',
    'tr'
  );

  // Fetch FAQs
  const { faqs } = useFaq({ pageSlug: 'home' });

  // Handle loading
  if (landingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (landingError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Sayfa yükleme hatası</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">İçerik yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GNDSEO page="/" />

      <div className="bg-white">
        <GNDHeader />

        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-red-50/20 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            {/* Badge */}
            {landing.hero_badge && (
              <div className="flex justify-center mb-6">
                <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                  {landing.hero_badge}
                </span>
              </div>
            )}

            {/* Heading */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                {landing.hero_title}
                <span className="text-red-500">?</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                {landing.hero_subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(landing.hero_cta_link || '/iletisim')}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center justify-center gap-2 group"
                >
                  {landing.hero_cta_text}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-8 py-4 rounded-lg font-semibold text-lg transition"
                >
                  Paketleri İncele
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        {landing.features_json && landing.features_json.length > 0 && (
          <section id="features" className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  {landing.features_title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {landing.features_json.map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-l-4 border-red-500 p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                    onClick={() => navigate(feature.link)}
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-200 transition">
                      <div className="text-red-500">{ICON_MAP[feature.icon] || <Dna size={32} />}</div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>

                    <a
                      href={feature.link}
                      className="inline-flex items-center gap-2 text-red-500 font-semibold hover:gap-3 transition-all"
                    >
                      Detaylı Bilgi
                      <ArrowRight size={18} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STATS SECTION */}
        {landing.stats_json && landing.stats_json.length > 0 && (
          <section className="bg-slate-900 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {landing.stats_json.map((stat, idx) => (
                  <div key={idx} className="text-center border-l border-red-500 pl-6 last:border-l-0 last:pl-0">
                    <div className="text-red-400 text-3xl md:text-4xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIALS SECTION */}
        {landing.testimonials_json && landing.testimonials_json.length > 0 && (
          <section className="py-20 md:py-32 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Müşteri Yorumları
                </h2>
                <p className="text-lg text-gray-600">
                  Gerçek insanlar, gerçek deneyimler
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {landing.testimonials_json.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-l-4 border-red-500 p-8 rounded-lg hover:shadow-lg transition"
                  >
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={18} className="text-red-500 fill-red-500" />
                      ))}
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ SECTION */}
        {faqs && faqs.length > 0 && (
          <section id="sss" className="py-20 md:py-32 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Sıkça Sorulan Sorular
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-red-500 transition"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full px-6 py-4 text-left font-semibold text-slate-900 hover:bg-red-50 transition flex items-center justify-between group"
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`text-red-500 transition-transform ${
                          expandedFaq === idx ? 'rotate-180' : ''
                        }`}
                      >
                        <ArrowRight size={20} className="rotate-90" />
                      </span>
                    </button>

                    {expandedFaq === idx && (
                      <div className="px-6 py-4 bg-slate-50 border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        {landing.cta_title && (
          <section className="bg-gradient-to-r from-red-500 to-red-600 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {landing.cta_title}
              </h2>

              {landing.cta_description && (
                <p className="text-lg text-red-50 mb-8">
                  {landing.cta_description}
                </p>
              )}

              <button
                onClick={() => navigate(landing.cta_button_link || '/iletisim')}
                className="bg-white hover:bg-slate-100 text-red-600 px-10 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center gap-2 group"
              >
                {landing.cta_button_text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          </section>
        )}

        <GNDFooter />
      </div>
    </>
  );
};

export default HomePage;