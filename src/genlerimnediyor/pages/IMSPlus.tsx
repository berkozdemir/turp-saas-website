import React from 'react';
import { GNDHeader } from '../components/GNDHeader';
import { GNDFooter } from '../components/GNDFooter';
import GNDSEO from '../components/GNDSEO';

const IMSPlus: React.FC = () => {
  return (
    <>
      <GNDSEO page="/yenidogan-tarama" />
      <GNDHeader />
      <main className="bg-white">
        <section className="bg-gradient-to-br from-red-50 via-white to-slate-50 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              IMSPlus
              <span className="text-red-500"> Yenidoğan Tarama Testi</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Yenidoğanda 27 genetik hastalığı erkenden tarayın. Erken tanı, erken müdahale imkanı.
            </p>
          </div>
        </section>
        <section className="py-20 md:py-32 max-w-4xl mx-auto px-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Bu Sayfa Yakında Gelecek</h2>
            <p className="text-gray-600">
              IMSPlus testinin detaylı bilgileri yakında yayına alınacaktır.
            </p>
          </div>
        </section>
      </main>
      <GNDFooter />
    </>
  );
};

export default IMSPlus;
