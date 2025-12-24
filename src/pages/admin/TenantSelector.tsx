import { useEffect } from 'react';
import { useTenant, Tenant } from '../../context/TenantContext';
import { Building2, ArrowRight } from 'lucide-react';

interface TenantSelectorProps {
    tenants: Tenant[];
    onSelect: (tenant: Tenant) => void;
}

export const TenantSelector = ({ tenants, onSelect }: TenantSelectorProps) => {
    const { setAvailableTenants } = useTenant();

    useEffect(() => {
        setAvailableTenants(tenants);
    }, [tenants, setAvailableTenants]);

    // If only one tenant, auto-select
    useEffect(() => {
        if (tenants.length === 1) {
            onSelect(tenants[0]);
        }
    }, [tenants, onSelect]);

    if (tenants.length === 1) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Building2 className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Site Seçin</h1>
                    <p className="text-slate-500">Yönetmek istediğiniz siteyi seçin</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {tenants.map(tenant => (
                        <button
                            key={tenant.id}
                            onClick={() => onSelect(tenant)}
                            className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-cyan-500 group"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-cyan-600 transition-colors">
                                        {tenant.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm">{tenant.primary_domain}</p>
                                    <span
                                        className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase"
                                        style={{
                                            backgroundColor: tenant.primary_color ? `${tenant.primary_color}20` : '#0891b220',
                                            color: tenant.primary_color || '#0891b2'
                                        }}
                                    >
                                        {tenant.tenant_role}
                                    </span>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-cyan-500 transition-colors" size={24} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
