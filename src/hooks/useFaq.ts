import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface FaqItem {
    id?: number;
    question: string;
    answer: string;
}

interface UseFaqOptions {
    pageSlug: string;
    fallbackFaqs?: FaqItem[];
}

interface UseFaqResult {
    faqs: FaqItem[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook to fetch FAQs from backend with auto-import fallback
 * 
 * If backend has FAQs for tenant+page: returns those
 * If not, and fallbackFaqs provided: imports them and returns them
 */
export function useFaq({ pageSlug, fallbackFaqs = [] }: UseFaqOptions): UseFaqResult {
    const { i18n } = useTranslation();
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFaqs = useCallback(async () => {
        try {
            setLoading(true);
            const lang = i18n.language?.split('-')[0] || 'tr';

            const res = await fetch(
                `/api/index.php?action=get_faqs_by_page&page=${pageSlug}&language=${lang}`
            );
            const data = await res.json();

            if (data.success && data.data?.length > 0) {
                setFaqs(data.data);
                setLoading(false);
                return;
            }

            // No backend FAQs - try to import fallbacks
            if (fallbackFaqs.length > 0) {
                const items = fallbackFaqs.map((f, idx) => ({
                    question: f.question,
                    answer: f.answer,
                    order: idx
                }));

                await fetch('/api/index.php?action=bulk_import_faqs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page_slug: pageSlug, items })
                });

                // Re-fetch after import
                const res2 = await fetch(
                    `/api/index.php?action=get_faqs_by_page&page=${pageSlug}&language=${lang}`
                );
                const data2 = await res2.json();

                if (data2.success && data2.data?.length > 0) {
                    setFaqs(data2.data);
                } else {
                    // Use fallbacks directly if import didn't work
                    setFaqs(fallbackFaqs);
                }
            } else {
                setFaqs([]);
            }
        } catch (err: any) {
            console.error('FAQ fetch error:', err);
            setError(err.message);
            // Use fallbacks on error
            if (fallbackFaqs.length > 0) {
                setFaqs(fallbackFaqs);
            }
        } finally {
            setLoading(false);
        }
    }, [pageSlug, i18n.language, fallbackFaqs]);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    return { faqs, loading, error };
}

export default useFaq;
