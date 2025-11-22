import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calculator, TrendingUp, AlertCircle, Settings, ChevronDown, ChevronUp, DollarSign, Users, Calendar, Activity, Clock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CURRENCY_CONFIG = {
    TRY: { label: 'TRY (₺)', locale: 'tr-TR' },
    USD: { label: 'USD ($)', locale: 'en-US' },
    EUR: { label: 'EUR (€)', locale: 'de-DE' }
};

export const ROICalculator = ({ initialCurrency = 'TRY' }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(initialCurrency);
    const [showSettings, setShowSettings] = useState(false);

    // --- HAM VERİ (VERİTABANINDAN GELEN) ---
    const [baseSettings, setBaseSettings] = useState(null);

    // --- KAPSAM ---
    const [patientCount, setPatientCount] = useState(100);
    const [visitCount, setVisitCount] = useState(10);
    const [durationMonths, setDurationMonths] = useState(12);

    // --- MALİYETLER (Seçili kura göre değişen state'ler) ---
    const [craMonthlySalary, setCraMonthlySalary] = useState(0);
    const [craDailyExpense, setCraDailyExpense] = useState(0);
    const [tradCraMinutes, setTradCraMinutes] = useState(0);
    
    const [sdcMonthlySalary, setSdcMonthlySalary] = useState(0);
    const [tradSdcMinutes, setTradSdcMinutes] = useState(0);

    const [investigatorFee, setInvestigatorFee] = useState(0);
    const [examFee, setExamFee] = useState(0);
    const [patientTravelFee, setPatientTravelFee] = useState(0);

    const [turpDailyLicense, setTurpDailyLicense] = useState(0);
    const [turpCraMinutes, setTurpCraMinutes] = useState(0);
    const [turpSdcMinutes, setTurpSdcMinutes] = useState(0);

    // --- 1. VERİLERİ ÇEK ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('roi_settings').select('*').single();
                
                if (error) throw error;
                
                if (data) {
                    setBaseSettings(data);
                    // İlk açılışta varsayılan para birimine göre doldur
                    updateCurrencyValues(initialCurrency, data);
                }
            } catch (err) {
                console.error("Veri çekme hatası:", err);
                alert("Veriler yüklenemedi, lütfen sayfayı yenileyin.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- 2. PARA BİRİMİ DEĞİŞTİRME MANTIĞI ---
    const updateCurrencyValues = (targetCurrency, sourceData = baseSettings) => {
        if (!sourceData) return;
        
        setCurrency(targetCurrency);
        
        // Kuru belirle (TL ise 1, değilse DB'den gelen oran)
        let rate = 1;
        if (targetCurrency === 'USD') rate = sourceData.usd_rate || 45;
        if (targetCurrency === 'EUR') rate = sourceData.eur_rate || 50;

        // Tüm maliyetleri kura böl
        setCraMonthlySalary(sourceData.cra_monthly_salary / rate);
        setCraDailyExpense(sourceData.cra_daily_expense / rate);
        
        setSdcMonthlySalary(sourceData.sdc_monthly_salary / rate);
        
        setInvestigatorFee(sourceData.investigator_fee / rate);
        setExamFee(sourceData.exam_fee / rate);
        setPatientTravelFee(sourceData.patient_travel_fee / rate);
        
        setTurpDailyLicense(sourceData.turp_daily_license / rate);

        // Süreler (Dakika) para biriminden etkilenmez, direkt set et
        setTradCraMinutes(sourceData.trad_cra_minutes);
        setTradSdcMinutes(sourceData.trad_sdc_minutes);
        setTurpCraMinutes(sourceData.turp_cra_minutes);
        setTurpSdcMinutes(sourceData.turp_sdc_minutes);
    };

    // --- 3. HESAPLAMALAR ---
    const WORK_DAYS = 22; 
    const WORK_HOURS = 8; 
    const MINUTES_IN_HOUR = 60; 
    const MINUTES_IN_DAY = WORK_HOURS * MINUTES_IN_HOUR;
    
    // Birim Dakika Maliyetleri
    const craMinuteCost = craMonthlySalary / WORK_DAYS / WORK_HOURS / MINUTES_IN_HOUR;
    const sdcMinuteCost = sdcMonthlySalary / WORK_DAYS / WORK_HOURS / MINUTES_IN_HOUR;

    // A. GELENEKSEL MALİYET
    // CRA: (Dakika Maliyeti * Süre) + Harcırah
    const craCostPerVisit_Trad = (craMinuteCost * tradCraMinutes) + craDailyExpense;
    // SDC: Dakika Maliyeti * Süre
    const sdcCostPerVisit_Trad = sdcMinuteCost * tradSdcMinutes;
    
    const traditionalCostPerVisit = craCostPerVisit_Trad + sdcCostPerVisit_Trad + investigatorFee + examFee + patientTravelFee;
    const totalTraditionalCost = patientCount * visitCount * traditionalCostPerVisit;

    // B. TURP İLE MALİYET
    // CRA: Harcırah yok, sadece süre
    const turpCraCostPerVisit = craMinuteCost * turpCraMinutes; 
    // SDC: Sadece süre
    const turpSdcCostPerVisit = sdcMinuteCost * turpSdcMinutes; 
    
    // Hibrit Site Maliyeti (%30 Uzaktan Tasarrufu)
    const REMOTE_RATIO = 0.30;
    const remoteInvestigatorFee = investigatorFee * 0.5; 
    const weightedSiteCost = ((1 - REMOTE_RATIO) * (investigatorFee + examFee + patientTravelFee)) + (REMOTE_RATIO * remoteInvestigatorFee);
    
    const turpOperationalCostPerVisit = turpCraCostPerVisit + turpSdcCostPerVisit + weightedSiteCost;
    
    // Lisans
    const totalDays = durationMonths * 30;
    const totalLicenseCost = patientCount * totalDays * turpDailyLicense;

    // Toplam
    const totalTurpFinalCost = (patientCount * visitCount * turpOperationalCostPerVisit) + totalLicenseCost;

    // Sonuçlar
    const savings = totalTraditionalCost - totalTurpFinalCost;
    const savingsPercent = totalTraditionalCost > 0 ? ((savings / totalTraditionalCost) * 100).toFixed(1) : 0;
    const isProfitable = savings > 0;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat(CURRENCY_CONFIG[currency].locale, { 
            style: 'currency', 
            currency: currency, 
            maximumFractionDigits: 0 
        }).format(val);
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={48}/></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-12 relative">
                    {/* Para Birimi Seçici (Desktop) */}
                    <div className="absolute right-0 top-0 hidden md:block">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                            {Object.keys(CURRENCY_CONFIG).map((curr) => (
                                <button key={curr} onClick={() => updateCurrencyValues(curr)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currency === curr ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{curr}</button>
                            ))}
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-wider shadow-sm"><Calculator size={16}/> {t("roi_badge")}</div>
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 text-center">{t("roi_title")}</h1>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto text-center">{t("roi_desc")}</p>
                    
                    {/* Para Birimi Seçici (Mobil) */}
                    <div className="mt-6 md:hidden flex gap-2">{Object.keys(CURRENCY_CONFIG).map((curr) => (<button key={curr} onClick={() => updateCurrencyValues(curr)} className={`px-4 py-2 text-sm font-bold rounded-lg border ${currency === curr ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>{curr}</button>))}</div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200">
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={20} className="text-rose-600"/> {t("roi_scope_title")}</h3>
                            <div className="space-y-6">
                                <div><div className="flex justify-between mb-2 text-sm font-bold text-slate-700"><label>{t("roi_patient_count")}</label><span className="text-rose-600">{patientCount}</span></div><input type="range" min="10" max="2000" step="10" value={patientCount} onChange={(e) => setPatientCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-rose-600"/></div>
                                <div><div className="flex justify-between mb-2 text-sm font-bold text-slate-700"><label>{t("roi_visit_count")}</label><span className="text-rose-600">{visitCount}</span></div><input type="range" min="2" max="50" step="1" value={visitCount} onChange={(e) => setVisitCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-rose-600"/></div>
                                <div><div className="flex justify-between mb-2 text-sm font-bold text-slate-700"><label>{t("roi_duration")}</label><span className="text-rose-600">{durationMonths}</span></div><input type="range" min="3" max="60" step="1" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-rose-600"/></div>
                            </div>
                        </div>
                        
                        {/* Ayarlar */}
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                            <button onClick={() => setShowSettings(!showSettings)} className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"><span className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2"><Settings size={20} className="text-slate-500"/> {t("roi_settings_title")}</span>{showSettings ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}</button>
                            {showSettings && (
                                <div className="p-6 space-y-5 border-t border-slate-200 text-sm">
                                    <div className="space-y-3 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> {t("roi_trad_times")}</p>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_cra")}</label><input type="number" value={tradCraMinutes} onChange={e=>setTradCraMinutes(Number(e.target.value))} className="p-2 border border-rose-200 rounded text-right font-bold text-rose-700"/></div>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_sdc")}</label><input type="number" value={tradSdcMinutes} onChange={e=>setTradSdcMinutes(Number(e.target.value))} className="p-2 border border-rose-200 rounded text-right font-bold text-rose-700"/></div>
                                    </div>
                                    <div className="space-y-3 bg-green-50/50 p-2 rounded-lg border border-green-100">
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> {t("roi_turp_times")}</p>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_cra")}</label><input type="number" value={turpCraMinutes} onChange={e=>setTurpCraMinutes(Number(e.target.value))} className="p-2 border border-green-200 rounded text-right font-bold text-green-700"/></div>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_sdc")}</label><input type="number" value={turpSdcMinutes} onChange={e=>setTurpSdcMinutes(Number(e.target.value))} className="p-2 border border-green-200 rounded text-right font-bold text-green-700"/></div>
                                    </div>
                                    <hr/>
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("roi_salaries")} ({currency})</p>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_cra_monthly")}</label><input type="number" value={craMonthlySalary} onChange={e=>setCraMonthlySalary(Number(e.target.value))} className="p-2 border rounded text-right"/></div>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_cra_daily")}</label><input type="number" value={craDailyExpense} onChange={e=>setCraDailyExpense(Number(e.target.value))} className="p-2 border rounded text-right"/></div>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_sdc_monthly")}</label><input type="number" value={sdcMonthlySalary} onChange={e=>setSdcMonthlySalary(Number(e.target.value))} className="p-2 border rounded text-right"/></div>
                                    </div>
                                    <hr/>
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("roi_others")}</p>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_inv_fee")}</label><input type="number" value={investigatorFee} onChange={e=>setInvestigatorFee(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/></div>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_exam_fee")}</label><input type="number" value={examFee} onChange={e=>setExamFee(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/></div>
                                        <div className="grid grid-cols-2 gap-2 items-center"><label className="text-slate-600">{t("roi_travel_fee")}</label><input type="number" value={patientTravelFee} onChange={e=>setPatientTravelFee(Number(e.target.value))} className="p-2 border rounded text-right font-bold"/></div>
                                    </div>
                                    <hr/>
                                    <div className="grid grid-cols-2 gap-2 items-center bg-green-50 p-2 rounded-lg">
                                        <label className="text-green-800 font-bold">{t("roi_license")}</label>
                                        <div className="p-2 border border-green-200 rounded text-right font-bold text-slate-500 bg-slate-100 cursor-not-allowed">{Number(turpDailyLicense).toFixed(2)} {currency}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className={`bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden ${!isProfitable ? 'border-4 border-red-500' : ''}`}>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-[120px] opacity-20"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div><h4 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">{t("roi_saving_title")}</h4><div className={`text-5xl md:text-7xl font-heading font-extrabold ${isProfitable ? 'text-green-400' : 'text-red-500'}`}>{formatCurrency(savings)}</div></div>
                                    {isProfitable ? (<div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 animate-pulse-slow"><TrendingUp size={24}/> %{savingsPercent} {t("roi_profitable")}</div>) : (<div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"><AlertCircle size={24}/> {t("roi_loss")}</div>)}
                                </div>
                                <p className="text-slate-400 text-lg max-w-2xl">{t("roi_result_desc")}</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg relative">
                                <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase">{t("roi_trad_label")}</div>
                                <h5 className="text-2xl font-heading font-bold text-slate-900 mb-6">{t("roi_trad_sub")}</h5>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 flex gap-2"><Activity size={16}/> {t("roi_cra")} ({tradCraMinutes} dk)</span><span className="font-bold">{formatCurrency(patientCount * visitCount * craCostPerVisit_Trad)}</span></div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 flex gap-2"><Users size={16}/> {t("roi_sdc")} ({tradSdcMinutes} dk)</span><span className="font-bold">{formatCurrency(patientCount * visitCount * sdcCostPerVisit_Trad)}</span></div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 flex gap-2"><Calendar size={16}/> {t("roi_others")}</span><span className="font-bold">{formatCurrency(patientCount * visitCount * (investigatorFee + examFee + patientTravelFee))}</span></div>
                                    <div className="flex justify-between pt-2"><span className="font-extrabold text-lg">{t("roi_total")}</span><span className="font-extrabold text-xl">{formatCurrency(totalTraditionalCost)}</span></div>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-xl text-xs font-bold uppercase">{t("roi_turp_label")}</div>
                                <h5 className="text-2xl font-heading font-bold text-white mb-6">{t("roi_turp_sub")}</h5>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400 flex gap-2"><Activity size={16}/> {t("roi_cra")} ({turpCraMinutes} dk)</span><span className="font-bold text-green-400">{formatCurrency(patientCount * visitCount * turpCraCostPerVisit)}</span></div>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400 flex gap-2"><Users size={16}/> {t("roi_sdc")} ({turpSdcMinutes} dk)</span><span className="font-bold text-green-400">{formatCurrency(patientCount * visitCount * turpSdcCostPerVisit)}</span></div>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400 flex gap-2"><Calendar size={16}/> {t("roi_others")}</span><span className="font-bold text-green-400">{formatCurrency(patientCount * visitCount * weightedSiteCost)}</span></div>
                                    <div className="flex justify-between border-b border-slate-800 pb-2 bg-white/5 p-2 rounded-lg"><span className="text-white font-bold flex gap-2"><DollarSign size={16}/> {t("roi_license")}</span><span className="font-bold text-white">{formatCurrency(totalLicenseCost)}</span></div>
                                    <div className="flex justify-between pt-2"><span className="font-extrabold text-lg text-white">{t("roi_total")}</span><span className="font-extrabold text-xl text-green-400">{formatCurrency(totalTurpFinalCost)}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
