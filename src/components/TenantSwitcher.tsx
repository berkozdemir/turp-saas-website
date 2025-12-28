import { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { ChevronDown, Check, Building2 } from 'lucide-react';

export const TenantSwitcher = () => {
    const { currentTenant, availableTenants, setCurrentTenant } = useTenant();
    const [isOpen, setIsOpen] = useState(false);

    if (!currentTenant) {
        return null;
    }

    // Single tenant view - Static display
    if (availableTenants.length <= 1) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-white text-sm border border-white/10">
                <Building2 size={16} className="text-emerald-400" />
                <span className="font-medium">{currentTenant.name}</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
            >
                <Building2 size={16} />
                <span className="font-medium">{currentTenant.name}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                        <div className="p-2 border-b border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase px-2">Site Değiştir</p>
                        </div>
                        <div className="py-1">
                            {availableTenants.map(tenant => (
                                <button
                                    key={tenant.id}
                                    onClick={() => {
                                        setCurrentTenant(tenant);
                                        setIsOpen(false);
                                        // Reload page to refresh data for new tenant
                                        window.location.href = '/admin';
                                    }}
                                    className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${tenant.code === currentTenant.code ? 'bg-cyan-50' : ''
                                        }`}
                                >
                                    <div>
                                        <div className="font-medium text-slate-900">{tenant.name}</div>
                                        <div className="text-xs text-slate-500">{tenant.primary_domain}</div>
                                    </div>
                                    {tenant.code === currentTenant.code && (
                                        <Check size={16} className="text-cyan-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
