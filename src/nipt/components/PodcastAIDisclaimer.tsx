import { Info } from 'lucide-react';

/**
 * AI-generated content disclaimer for podcast episodes
 * Required for nipt.tr podcast pages
 */
export function PodcastAIDisclaimer() {
    return (
        <div className="flex items-start gap-2.5 p-3 bg-slate-50 border-l-2 border-slate-300 rounded-r-lg mt-4">
            <Info size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
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
