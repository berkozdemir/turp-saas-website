import React from 'react';
import { GNDHeader } from '../components/GNDHeader';
import { GNDFooter } from '../components/GNDFooter';
import GNDSEO from '../components/GNDSEO';
import { Check } from 'lucide-react';

const About: React.FC = () => {
  const highlights = [
    '25 Yıllık Tecrübe',
    'Ruhsatlı Genetik Laboratuvar',
    'NGS Tabanlı Testler',
    'Uzman Danışman Kadro',
    'Türkiye Geneli Hizmet',
    'Kişiye Özel Raporlama',
  ];

  return (
    <>
      <GNDSEO page="/hakkimizda" />
      <GNDHeader />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-50 via-white to-slate-50 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl text-gray-600">
              Genetik bilimini halkın hizmetine sunmak
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 md:py-32 max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Genlerim Ne Diyor?</h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Genlerim Ne Diyor?, 2018 yılından bu yana faaliyet gösteren ruhsatlı genetik
              laboratuvarımızın bireylere yönelik geliştirdiği, yaşam genetiği ve koruyucu
              sağlık odaklı bir hizmet platformudur.
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Arkamızda, 1997 yılından bu yana sağlık araştırmaları alanında faaliyet gösteren
              köklü kuruluşumuz Omega Araştırma bulunuyor. 25 yılı aşkın süredir klinik
              araştırmalar, biyoteknoloji ve sağlık teknolojileri alanında edindiğimiz deneyimi
              şimdi bireylerin genetik potansiyellerini anlamalarına ve yaşam kalitelerini
              artırmalarına yardımcı olmak için kullanıyoruz.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">Vizyon ve Misyon</h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              <strong className="text-slate-900">Misyon:</strong> Genetik bilimini açık,
              anlaşılır ve erişilebilir hale getirerek, bireylerin kendi genetik yapılarını
              anlamalarını ve sağlıklı yaşam kararları almalarını sağlamak.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              <strong className="text-slate-900">Vizyon:</strong> Türkiye'de genetik
              danışmanlığı standart sağlık hizmetinin bir parçası haline getirmek, halkın
              genetik farkındalığını artırmak ve preventif tıbbı yaygınlaştırmak.
            </p>

            {/* Highlights */}
            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Neden Biz?</h3>
              <ul className="space-y-3">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-900">
                    <Check size={24} className="text-red-500 flex-shrink-0" />
                    <span className="font-semibold">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">Kalitesi Garantili</h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Tüm testlerimiz Sağlık Bakanlığı ruhsatlı laboratuvarımızda uluslararası
              standartlarda yapılmaktadır. KVKK uyumlu bilgi güvenliği protokolü ile verileriniz
              tamamen güvenceli ve şifreli bir şekilde işlenmektedir.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Uzman genetik danışmanlarımız, test sonuçlarınızı detaylı şekilde yorumlar,
              sizinle paylaşır ve sonuçlarınıza göre kişiselleştirilmiş öneriler sunarlar.
            </p>
          </div>
        </section>
      </main>

      <GNDFooter />
    </>
  );
};

export default About;
