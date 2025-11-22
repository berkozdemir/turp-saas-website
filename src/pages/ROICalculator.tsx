import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export const ROICalculator = () => {
    const [patientCount, setPatientCount] = useState(100);
    const [visitCount, setVisitCount] = useState(10);
    
    const CRA_MONTHLY_COST = 120000;
    const WORK_DAYS = 22;
    const CRA_DAILY_COST = CRA_MONTHLY_COST / WORK_DAYS;
    const CRA_VISIT_EFFORT_DAYS = 0.25; 
    const INVESTIGATOR_FEE = 3000;
    const EXAM_FEE = 3000;

    const craCostPerVisit = CRA_DAILY_COST * CRA_VISIT_EFFORT_DAYS;
    const siteCostPerVisit = INVESTIGATOR_FEE + EXAM_FEE;
    const traditionalCostPerVisit = craCostPerVisit + siteCostPerVisit;
    const totalTraditionalCost = patientCount * visitCount * traditionalCostPerVisit;

    const turpCraEffort = CRA_VISIT_EFFORT_DAYS * 0.5; 
    const turpCraCostPerVisit = CRA_DAILY_COST * turpCraEffort;

    const REMOTE_RATIO = 0.30;
    const remoteInvestigatorFee = INVESTIGATOR_FEE * 0.5; 
    const weightedSiteCost = ((1 - REMOTE_RATIO) * siteCostPerVisit) + (REMOTE_RATIO * remoteInvestigatorFee);
    
    const turpCostPerVisit = turpCraCostPerVisit + weightedSiteCost;
    const totalTurpCost = patientCount * visitCount * turpCostPerVisit;

    const savings = totalTraditionalCost - totalTurpCost;
    const savingsPercent = ((savings / totalTraditionalCost) * 100).toFixed(1);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-wider shadow-sm">
                        <Calculator size={16}/> Maliyet Analizi
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Yatırım Getirisi (ROI) Hesaplayıcı</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Geleneksel yöntemler ile Turp destekli hibrit model arasındaki maliyet farkını keşfedin.
                    </p>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
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
                                    <label className="font-bold text-slate-700">Hasta Başına Vizit Sayısı</label>
                                    <span className="text-rose-600 font-bold">{visitCount}</span>
                                </div>
                                <input type="range" min="2" max="50" step="1" value={visitCount} onChange={(e) => setVisitCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"/>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-500 space-y-2">
                                <p className="font-bold text-slate-700 mb-2">Hesaplama Varsayımları:</p>
                                <div className="flex justify-between"><span>CRA Maliyeti (Aylık):</span> <span>120.000 ₺</span></div>
                                <div className="flex justify-between"><span>CRA Eforu (Vizit Başı):</span> <span>0.25 Gün</span></div>
                                <div className="flex justify-between"><span>Araştırıcı Ücreti:</span> <span>3.000 ₺</span></div>
                                <div className="flex justify-between"><span>Muayene Ücreti:</span> <span>3.000 ₺</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-7 space-y-6">
                        <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20"></div>
                            <div className="relative z-10">
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-2">Tahmini Toplam Tasarruf</h4>
                                <div className="text-5xl md:text-6xl font-heading font-extrabold text-green-400 mb-4">
                                    {formatCurrency(savings)}
                                </div>
                                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-bold">
                                    <TrendingUp size={20}/> %{savingsPercent} Daha Düşük Maliyet
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h5 className="text-slate-500 font-bold mb-2">Geleneksel Maliyet</h5>
                                <div className="text-2xl font-heading font-bold text-slate-900">{formatCurrency(totalTraditionalCost)}</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">TURP</div>
                                <h5 className="text-slate-500 font-bold mb-2">Turp ile Maliyet</h5>
                                <div className="text-2xl font-heading font-bold text-green-600">{formatCurrency(totalTurpCost)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
