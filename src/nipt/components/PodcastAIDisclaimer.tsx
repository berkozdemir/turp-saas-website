import { Info } from 'lucide-react';

/**
 * AI-generated content disclaimer for podcast episodes
 * Required for nipt.tr podcast pages
 */
interface Props {
    variant?: 'light' | 'dark';
}

export function PodcastAIDisclaimer({ variant = 'light' }: Props) {
    const isDark = variant === 'dark';

    return (
        <div className={`flex items-start gap-2.5 p-3 rounded-r-lg mt-4 border-l-2 ${isDark
                ? 'bg-white/10 border-white/30 text-white/90'
                : 'bg-slate-50 border-slate-300 text-slate-500'
            }`}>
            <Info size={16} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-white/80' : 'text-slate-400'}`} />
            <p className="text-xs leading-relaxed opacity-90">
                Bu podcast bölümü yapay zekâ desteğiyle hazırlanmıştır. İçerikte yer alan
                ifadelerde zaman zaman eksiklikler veya dilsel hatalar bulunabilir.
                Buradaki bilgiler genel bilgilendirme amaçlıdır; tanı ve tedavi önerisi
                niteliği taşımaz. Sağlık durumunuzla ilgili her türlü değerlendirme ve
                karar için mutlaka hekiminize veya Omega Genetik Tanı Değerlendirme
                Merkezimize başvurabilirsiniz.
            </p>
        </div>
    );
}

export default PodcastAIDisclaimer;
