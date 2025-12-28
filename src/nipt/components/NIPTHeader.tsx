import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export const NIPTHeader = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/images/omega_genetik_logo.png" alt="Omega Genetik" className="h-12 w-auto object-contain" />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                    <a href="/nipt#sss" className="hover:text-blue-600 transition-colors">S.S.S.</a>
                    <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition-colors">Hakkımızda</button>
                    <a href="/nipt#iletisim" className="hover:text-blue-600 transition-colors">İletişim</a>
                </nav>

                {/* CTA & Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/booking')}
                        className="hidden md:inline-flex bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                    >
                        Randevu Al
                    </button>
                    <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-xl">
                    <nav className="flex flex-col gap-4 text-center">
                        <a href="/nipt#testler" onClick={() => setIsMenuOpen(false)} className="py-2 text-slate-600">Testler</a>
                        <a href="/nipt#nasil-calisir" onClick={() => setIsMenuOpen(false)} className="py-2 text-slate-600">Nasıl Çalışır?</a>
                        <button
                            onClick={() => { navigate('/booking'); setIsMenuOpen(false); }}
                            className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold"
                        >
                            Randevu Al
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};
