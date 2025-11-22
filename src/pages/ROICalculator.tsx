import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

export const ROICalculator = () => {
    // Varsayılan Değerler
    const [patientCount, setPatientCount] = useState(100);
    const [visitCount, setVisitCount] = useState(10);
    const [durationMonths, setDurationMonths] = useState(12); // YENİ: Çalışma Süresi
    
    // Sabitler
    const CRA_MONTHLY_COST = 120000;
    const WORK_DAYS = 22;
    const CRA_DAILY_COST = CRA_MONTHLY_COST / WORK_DAYS;
    const CRA_VISIT_EFFORT_DAYS = 0.25; // 1/4 gün (Geleneksel)
    const INVESTIGATOR_FEE = 3000;
    const EXAM_FEE = 3000;
    
    // YENİ: Turp Lisans Bedeli
    const TURP_DAILY_LICENSE_FEE = 69.99;

    // --- 1. GELENEKSEL MALİYET HESABI ---
    const craCostPerVisit = CRA_DAILY_COST * CRA_VISIT_EFFORT_DAYS;
    const siteCostPerVisit = INVESTIGATOR_FEE + EXAM_FEE;
    const traditionalCostPerVisit = craCostPerVisit + siteCostPerVisit;
    
    const totalTraditionalCost = patientCount * visitCount * traditionalCostPerVisit;

    // --- 2. TURP İLE MALİYET HESABI ---
    
    // A. Operasyonel Maliyetler (Yazılım Sayesinde Düşenler)
    const turpCraEffort = CRA_VISIT_EFFORT_DAYS * 0.5; // CRA eforu %50 azalır
    const turpCraCostPerVisit = CRA_DAILY_COST * turpCraEffort;

    // Hibrit Model (%30 Uzaktan)
    const REMOTE_RATIO = 0.30;
    const remoteInvestigatorFee = INVESTIGATOR_FEE * 0.5; 
    // Uzaktan vizitte 'Exam Fee' (Muayene) 0 TL, Hekim ücreti yarı yarıya
    const weightedSiteCost = ((1 - REMOTE_RATIO) * siteCostPerVisit) + (REMOTE_RATIO * remoteInvestigatorFee);
    
    const turpOperationalCostPerVisit = turpCraCostPerVisit + weightedSiteCost;
    const totalTurpOperationalCost = patientCount * visitCount * turpOperationalCostPerVisit;

    // B. Yazılım Lisans Maliyeti (YENİ EKLENDİ)
    const totalDays = durationMonths * 30; // Ayı güne çevir
    const totalLicenseCost = patientCount * totalDays * TURP_DAILY_LICENSE_FEE;

    // C. Toplam Turp Maliyeti
    const totalTurpFinalCost = totalTurpOperationalCost + totalLicenseCost;

    // --- SONUÇLAR ---
    const savings = totalTraditionalCost - totalTurpFinalCost;
    const savingsPercent = ((savings / totalTraditionalCost) * 100).toFixed(1);
    const isProfitable = savings > 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-wider shadow-sm">
                        <Calculator size={16}/> Maliyet Analizi
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Yatırım Getirisi (ROI) Hesaplayıcı</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Yazılım maliyetlerini düştükten sonra bile ne kadar kar edeceğinizi şeffaf bir şekilde görün.
                    </p>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Sol Taraf: Girdiler */}
                    <div className="md:col-span-5 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 h-fit">
                        <h3 className="font-heading text-2xl font-bold text-slate-900 mb-6">Çalışma Parametreleri</h3>
                        
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-bold text-slate-700">Hasta Sayısı</label>
                                    <span className="text-rose-600 font-bold">{patientCount}</span>
                                </div>
                                <input type="range" min="10" max="1000" step="10" value={patientCount} onChange={(e) => setPatientCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"/>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-bold text-slate-700">Hasta Başına Vizit</label>
                                    <span className="text-rose-600 font-bold">{visitCount}</span>
                                </div>
                                <input type="range" min="2" max="50" step="1" value={visitCount} onChange={(e) => setVisitCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"/>
                            </div>

                            {/* YENİ SLIDER: SÜRE */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-bold text-slate-700">Çalışma Süresi (Ay)</label>
                                    <span className="text-rose-600 font-bold">{durationMonths} Ay</span>
                                </div>
                                <input type="range" min="3" max="60" step="1" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"/>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2">
                                <p className="font-bold text-slate-700 mb-2">Varsayımlar:</p>
                                <div className="flex justify-between"><span>CRA Maliyeti (Aylık):</span> <span>120.000 ₺</span></div>
                                <div className="flex justify-between"><span>Site Ödemeleri (Vizit):</span> <span>6.000 ₺</span></div>
                                <div className="flex justify-between border-t pt-2 mt-2 font-bold text-rose-600">
                                    <span>Turp Lisansı (Günlük):</span> <span>{TURP_DAILY_LICENSE_FEE} ₺</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf: Sonuçlar */}
                    <div className="md:col-span-7 space-y-6">
                        {/* Tasarruf Kartı */}
                        <div className={`bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden ${!isProfitable ? 'border-2 border-red-500' : ''}`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20"></div>
                            <div className="relative z-10">
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-2">Net Tasarruf (Lisans Dahil)</h4>
                                <div className={`text-4xl md:text-6xl font-heading font-extrabold mb-4 ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(savings)}
                                </div>
                                {isProfitable ? (
                                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-bold">
                                        <TrendingUp size={20}/> %{savingsPercent} Daha Düşük Maliyet
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg font-bold">
                                        <AlertCircle size={20}/> Maliyet Artışı
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detaylı Karşılaştırma */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h5 className="text-slate-500 font-bold mb-2 text-sm uppercase">Geleneksel Yöntem</h5>
                                <div className="text-2xl font-heading font-bold text-slate-900">{formatCurrency(totalTraditionalCost)}</div>
                                <div className="mt-4 text-xs text-slate-400 space-y-1">
                                    <p>• Fiziksel Vizitler</p>
                                    <p>• Manuel Veri Girişi</p>
                                    <p>• Yüksek CRA Eforu</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">TURP</div>
                                <h5 className="text-slate-500 font-bold mb-2 text-sm uppercase">Turp ile Toplam</h5>
                                <div className="text-2xl font-heading font-bold text-green-600">{formatCurrency(totalTurpFinalCost)}</div>
                                <div className="mt-4 text-xs text-slate-500 space-y-1 border-t pt-2">
                                    <div className="flex justify-between">
                                        <span>Operasyonel Maliyet:</span>
                                        <span className="font-bold">{formatCurrency(totalTurpOperationalCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-rose-600">
                                        <span>+ Yazılım Lisansı:</span>
                                        <span className="font-bold">{formatCurrency(totalLicenseCost)}</span>
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
