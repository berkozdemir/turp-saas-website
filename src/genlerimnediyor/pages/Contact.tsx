import React from 'react';
import { GNDHeader } from '../components/GNDHeader';
import { GNDFooter } from '../components/GNDFooter';
import GNDSEO from '../components/GNDSEO';
import useContactConfig from '../../hooks/useContactConfig';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const { data: contact, isLoading } = useContactConfig('genlerimnediyor', 'tr');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <GNDSEO page="/iletisim" />
      <GNDHeader />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-50 via-white to-slate-50 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              {contact?.contact_title || 'Bize Ulaşın'}
            </h1>
            <p className="text-xl text-gray-600">
              {contact?.contact_subtitle ||
                'Genetik testlerimiz hakkında sorularınız için bize ulaşın'}
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Phone */}
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Phone size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Telefon</h3>
                <a
                  href={`tel:${contact?.phone}`}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  {contact?.phone}
                </a>
              </div>

              {/* Email */}
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">E-Mail</h3>
                <a
                  href={`mailto:${contact?.email}`}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  {contact?.email}
                </a>
              </div>

              {/* Address */}
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <MapPin size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Adres</h3>
                <p className="text-gray-600">
                  {contact?.address_line1}
                  <br />
                  {contact?.address_line2}
                  <br />
                  {contact?.city}, {contact?.country}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            {contact?.working_hours && (
              <div className="mt-12 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-2">Çalışma Saatleri</h3>
                <p className="text-gray-600">{contact.working_hours}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <GNDFooter />
    </>
  );
};

export default Contact;
