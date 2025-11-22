import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, Settings, ChevronDown, ChevronUp, DollarSign, Users, Calendar, Activity } from 'lucide-react';

export const ROICalculator = () => {
    // --- 1. ÇALIŞMA KAPSAMI (Temel Girdiler) ---
    const [patientCount, setPatientCount] = useState(100);
    const [visitCount, setVisitCount] = useState(10);
    const [durationMonths, setDurationMonths] = useState(12);

    // --- 2. MALİYET VARSAYIMLARI (Kullanıcı Değiştirebilir) ---
    const [showSettings, setShowSettings] = useState(false); // Ayarları gizle/göster

    // CRA (Klinik Araştırma İzleyicisi)
    const [craMonthlySalary, setCraMonthlySalary] = useState(160000);
    const [craDailyExpense, setCraDailyExpense] = useState(6000); // Yol, Yemek, Konaklama
    const [craVisitEffort, setCraVisitEffort] = useState(0.25); // Gün cinsinden (0.25 = 2 saat)

    // SDC (Saha Veri Koordinatörü)
    const [sdcMonthlySalary, setSdcMonthlySalary] = useState(120000);
    const [sdcHoursPerVisit, setSdcHoursPerVisit] = useState(3); // Saat cinsinden

    // Merkez & Araştırıcı & Gönüllü Masrafları
    const [investigatorFee, setInvestigatorFee] = useState(3000);
    const [examFee, setExamFee] = useState(3000);
    const [patientTravelFee, setPatientTravelFee] = useState(800);

    // --- TURP SABİT FİYATI (Değiştirilemez) ---
    const turpDailyLicense = 69.99;

    // --- HESAPLAMALAR ---
    
    // Sabitler
    const WORK_DAYS = 22;
    const WORK_HOURS = 8;

    // 1. GELENEKSEL MALİYETLER (Birim Hesapları)
    
    // CRA Maliyeti: (Günlük Maaş x Efor) + Günlük Harcırah
    const craDailySalary = craMonthlySalary / WORK_DAYS;
    const craCostPerVisit = (craDailySalary * craVisitEffort) + craDailyExpense;

    // SDC Maliyeti: (Saatlik Maaş x Harcanan Saat)
    const sdcHourlySalary = sdcMonthlySalary / WORK_DAYS / WORK_HOURS;
    const sdcCostPerVisit = sdcHourlySalary * sdcHoursPerVisit;

    // Toplam Geleneksel Birim Maliyet (Vizit Başına)
    const traditionalCostPerVisit = 
        craCostPerVisit + 
        sdcCostPerVisit + 
        investigatorFee + 
        examFee + 
        patientTravelFee;

    // TOPLAM GELENEKSEL PROJE MALİYETİ
    const totalTraditionalCost = patientCount * visitCount * traditionalCostPerVisit;


    // 2. TURP İLE MALİYETLER
    // Varsayım: Turp ile operasyonel maliyetler (CRA, SDC, Muayene, Yol) 0'a iner.
    // Sadece Lisans Bedeli ödenir.
    
    const totalDays = durationMonths * 30;
    const totalLicenseCost = patientCount * totalDays * turpDailyLicense;
    
    const totalTurpCost = totalLicenseCost; // Operasyonel maliyet 0 kabul edildiği için.

    // --- SONUÇLAR ---
    const savings = totalTraditionalCost - totalTurpCost;
    const savingsPercent = totalTraditionalCost > 0 ? ((savings / totalTraditionalCost) * 100).toFixed(1) : 0;
    const isProfitable = savings > 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* ÜST BAŞLIK */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-wider shadow-sm">
                        <Calculator size={16}/> Gelişmiş Maliyet Analizi
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Yatırım Getirisi (ROI)</h1>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto">
                        Saha operasyonlarını dijitalleştirerek elde edeceğiniz devasa tasarrufu hesaplayın.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    
                    {/* SOL KOLON: AYARLAR VE GİRDİLER */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* 1. Çalışma Kapsamı */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200">
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Users size={20} className="text-rose-600"/> Çalışma Kapsamı
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                                        <label>Gönüllü Sayısı</label>
                                        <span className="text-rose-600">{patientCount}</span>
                                    </div>
                                    <input type="range" min="10" max="2000" step="10" value={patientCount} onChange={(e) => setPatientCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-rose-600"/>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                                        <label>Vizit Sayısı</label>
                                        <span className="text-rose-600">{visitCount}</span>
                                    </div>
                                    <input type="range" min="2" max="36" step="1" value={visitCount} onChange={(e) => setVisitCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-rose-600"/>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                                        <label>Süre (Ay)</label>
                                        <span className="text-rose-600">{durationMonths} Ay</span>
                                    </div>
                                    <input type="range" min="3" max="36" step="1" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-rose-600"/>
                                </div>
                            </div>
                        </div>

                        {/* 2. Gelişmiş Maliyet Ayarları (Accordion) */}
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                            <button 
                                onClick={() => setShowSettings(!showSettings)}
                                className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                            >
                                <span className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Settings size={20} className="text-slate-500"/> Maliyet Varsayımları
                                </span>
                                {showSettings ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>
                            
                            {showSettings && (
                                <div className="p-6 space-y-5 border-t border-slate-200 text-sm">
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">CRA (Saha İzleme)</p>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Aylık Brüt (TL)</label>
                                            <input type="number" value={craMonthlySalary} onChange={e=>setCraMonthlySalary(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Günlük Masraf (TL)</label>
                                            <input type="number" value={craDailyExpense} onChange={e=>setCraDailyExpense(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Saha & Veri (SDC)</p>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Saha Görevlisi Aylık (TL)</label>
                                            <input type="number" value={sdcMonthlySalary} onChange={e=>setSdcMonthlySalary(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Vizit Başına Saha Görevlisi Eforu (Saat)</label>
                                            <input type="number" value={sdcHoursPerVisit} onChange={e=>setSdcHoursPerVisit(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Diğer Giderler (Vizit Başı)</p>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Araştırıcı Ücreti (TL)</label>
                                            <input type="number" value={investigatorFee} onChange={e=>setInvestigatorFee(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Muayene Ücreti (TL)</label>
                                            <input type="number" value={examFee} onChange={e=>setExamFee(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <label className="text-slate-600">Gönüllü Yol/Yemek (TL)</label>
                                            <input type="number" value={patientTravelFee} onChange={e=>setPatientTravelFee(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/>
                                        </div>
                                    </div>
                                    <hr/>
                                    {/* SABİT TURP LİSANS BEDELİ */}
                                    <div className="grid grid-cols-2 gap-2 items-center bg-green-50 p-2 rounded-lg">
                                        <label className="text-green-800 font-bold">Turp Lisans (Gün)</label>
                                        <div className="p-2 border border-green-200 rounded text-right font-bold text-slate-500 bg-slate-100 cursor-not-allowed">
                                            {turpDailyLicense} ₺
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SAĞ KOLON: SONUÇLAR */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Ana Tasarruf Kartı */}
                        <div className={`bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden ${!isProfitable ? 'border-4 border-red-500' : ''}`}>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-[120px] opacity-20"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div>
                                        <h4 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Toplam Net Tasarruf</h4>
                                        <div className={`text-5xl md:text-7xl font-heading font-extrabold ${isProfitable ? 'text-green-400' : 'text-red-500'}`}>
                                            {formatCurrency(savings)}
                                        </div>
                                    </div>
                                    {isProfitable ? (
                                        <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 animate-pulse-slow">
                                            <TrendingUp size={24}/> %{savingsPercent} Daha Karlı
                                        </div>
                                    ) : (
                                        <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                                            <AlertCircle size={24}/> Maliyet Artışı
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-400 text-lg max-w-2xl">
                                    Turp kullanarak saha operasyonunu tamamen dijitalleştirdiğinizde, yazılım lisans bedelini ödedikten sonra bile bütçenizde devasa bir kaynak açılır.
                                </p>
                            </div>
                        </div>

                        {/* Detaylı Karşılaştırma Grid'i */}
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Geleneksel Kutu */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg relative">
                                <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Geleneksel</div>
                                <h5 className="text-2xl font-heading font-bold text-slate-900 mb-6">Mevcut Durum</h5>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <span className="text-slate-500 flex items-center gap-2"><Activity size={16}/> CRA Eforu</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(patientCount * visitCount * craCostPerVisit)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <span className="text-slate-500 flex items-center gap-2"><Users size={16}/> Saha (SDC) Eforu</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(patientCount * visitCount * sdcCostPerVisit)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <span className="text-slate-500 flex items-center gap-2"><Calendar size={16}/> Hastane & Yol</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(patientCount * visitCount * (investigatorFee + examFee + patientTravelFee))}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-slate-900 font-extrabold text-lg">Toplam</span>
                                        <span className="text-slate-900 font-extrabold text-xl">{formatCurrency(totalTraditionalCost)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Turp Kutu */}
                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-xl text-xs font-bold uppercase">Turp Yöntemi</div>
                                <h5 className="text-2xl font-heading font-bold text-white mb-6">Yeni Nesil</h5>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-slate-400 flex items-center gap-2"><Activity size={16}/> CRA Eforu</span>
                                        <span className="font-bold text-green-400">0 ₺</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-slate-400 flex items-center gap-2"><Users size={16}/> Saha (SDC) Eforu</span>
                                        <span className="font-bold text-green-400">0 ₺</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-slate-400 flex items-center gap-2"><Calendar size={16}/> Hastane & Yol</span>
                                        <span className="font-bold text-green-400">0 ₺</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 bg-white/5 p-2 rounded-lg">
                                        <span className="text-white font-bold flex items-center gap-2"><DollarSign size={16}/> Turp Lisans</span>
                                        <span className="font-bold text-white">{formatCurrency(totalLicenseCost)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-white font-extrabold text-lg">Toplam</span>
                                        <span className="text-green-400 font-extrabold text-xl">{formatCurrency(totalTurpCost)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
