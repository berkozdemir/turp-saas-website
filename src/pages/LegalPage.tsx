import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Calendar } from 'lucide-react';

interface LegalPageProps {
    docKey: string;
    setView: (view: any) => void;
}

export const LegalPage = ({ docKey, setView }: LegalPageProps) => {
    const { i18n, t } = useTranslation();
    const [doc, setDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    useEffect(() => {
        const fetchDoc = async () => {
            setLoading(true);
            setError(null);
            try {
                // We fetch the document by key. The API returns all languages.
                // We could implement language filtering on API, but caching full doc is better for client language switching.
                const response = await fetch(`${API_URL}/index.php?action=get_legal_doc_public&key=${docKey}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setDoc(data.data);
                } else {
                    setError("Doküman bulunamadı.");
                }
            } catch (err) {
                setError("Bağlantı hatası.");
            } finally {
                setLoading(false);
            }
        };

        if (docKey) {
            fetchDoc();
        }
    }, [docKey]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [docKey]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-rose-600" size={40} />
            </div>
        );
    }

    if (error || !doc) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Üzgünüz</h2>
                <p className="text-slate-500 mb-8">{error || "Bu doküman şu anda erişilebilir değil."}</p>
                <button
                    onClick={() => setView('home')}
                    className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        );
    }

    // Determine content based on current language
    const lang = i18n.language; // 'tr', 'en', 'zh'

    const getLocalizedContent = () => {
        if (lang === 'zh' && doc.title_zh) {
            return { title: doc.title_zh, content: doc.content_zh };
        }
        if (lang === 'en' && doc.title_en) {
            return { title: doc.title_en, content: doc.content_en };
        }
        // Fallback to TR
        return { title: doc.title_tr, content: doc.content_tr };
    };

    const { title, content } = getLocalizedContent();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setView('home')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-6"
                    >
                        <ArrowLeft size={20} /> {t("back_home") || "Ana Sayfa"}
                    </button>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">{title}</h1>

                    {doc.effective_date && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Calendar size={16} />
                            <span>
                                {lang === 'tr' ? 'Yürürlük Tarihi:' : lang === 'zh' ? '生效日期:' : 'Effective Date:'} {doc.effective_date}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-lg prose-slate max-w-none">
                    {/* Render Markdown or plain text */}
                    {/* We use ReactMarkdown if content has markdown, or just whitespace-pre-wrap if plain */}
                    <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};
