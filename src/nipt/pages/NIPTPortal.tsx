import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const NIPTPortal: React.FC = () => {
    const navigate = useNavigate();

    const tests = [
        {
            slug: 'momguard',
            name: 'MomGuard',
            tech: 'LabGenomics Teknolojisi',
            description: 'Güvenilir, hızlı ve kapsamlı anne kanından bebek DNA analizi.',
            features: ['%99.9 Doğruluk Oranı', '10. Haftadan İtibaren', 'Genel Taramalar'],
            color: 'bg-blue-600',
            logo: 'MG'
        },
        {
            slug: 'verifi',
            name: 'Verifi',
            tech: 'Illumina Teknolojisi',
            description: 'Dünya standartlarında, en geniş kapsamlı NIPT testi.',
            features: ['Tüm Kromozonlar', 'İkiz Gebelik Uyumu', 'Yüksek Hassasiyet'],
            color: 'bg-emerald-600',
            logo: 'VF'
        },
        {
            slug: 'veritas',
            name: 'Veritas',
            tech: 'Veritas Genetics',
            description: 'Genetik uzmanlığın doruk noktası ile bebeğinizin sağlığını keşfedin.',
            features: ['Detaylı Raporlama', 'Genetik Danışmanlık', 'Premium Servis'],
            color: 'bg-amber-500',
            logo: 'VT'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                        <span className="block">Bebeğinizin Sağlığı İçin</span>
                        <span className="block text-blue-600">En Güvenilir Seçim</span>
                    </h1>
                    <p className="mt-4 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Türkiye'nin en kapsamlı NIPT platformunda, size en uygun testi seçin ve güvenle sürecinizi başlatın.
                    </p>
                </div>
            </div>

            {/* Test Selection Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {tests.map((test) => (
                        <div
                            key={test.slug}
                            onClick={() => navigate(`/${test.slug}`)}
                            className="relative group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className={`h-2 w-full ${test.color}`} />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl ${test.color} text-white flex items-center justify-center font-bold text-xl shadow-lg`}>
                                        {test.logo}
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                        {test.tech}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {test.name}
                                </h3>

                                <p className="mt-2 text-sm text-slate-500 h-10">
                                    {test.description}
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {test.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="ml-3 text-sm text-slate-600">{feature}</p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8">
                                    <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-900 group-hover:bg-blue-600 transition-colors">
                                        Detayları İncele
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-slate-100 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-4">
                        GÜVENCESİYLE
                    </p>
                    <div className="flex justify-center items-center gap-2 text-xl font-bold text-slate-700">
                        <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs">Ω</span>
                        OMEGA GENETİK
                    </div>
                </div>
            </div>
        </div>
    );
};
