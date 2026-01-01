import { useState, useEffect } from 'react';
import { Users, Save, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { fetchAPI } from '../../lib/contentApi';

interface Props {
    tenantId: string;
}

export const AdminEndUserSettings = ({ tenantId }: Props) => {
    const [allowLogin, setAllowLogin] = useState(false);
    const [allowSignup, setAllowSignup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, [tenantId]);

    async function loadSettings() {
        setLoading(true);
        try {
            const data = await fetchAPI('get_tenant_auth_settings', { tenant_id: tenantId });
            if (data.success) {
                setAllowLogin(data.allow_login);
                setAllowSignup(data.allow_signup);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setMessage(null);
        try {
            const data = await fetchAPI('update_tenant_auth_settings', {
                tenant_id: tenantId,
                allow_login: allowLogin,
                allow_signup: allowSignup
            });
            if (data.success) {
                setMessage({ type: 'success', text: 'Ayarlar kaydedildi' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Kayıt başarısız' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-slate-400" size={24} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Users className="text-violet-600" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">End-User Portal</h3>
                    <p className="text-sm text-slate-500">Kullanıcı giriş ve kayıt ayarları</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Allow Login Toggle */}
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                        <span className="font-medium text-slate-700">Kullanıcı Girişi (Login)</span>
                        <p className="text-sm text-slate-500">Kayıtlı kullanıcıların giriş yapmasına izin ver</p>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={allowLogin}
                            onChange={(e) => setAllowLogin(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-violet-600 transition-colors"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                    </div>
                </label>

                {/* Allow Signup Toggle */}
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                        <span className="font-medium text-slate-700">Kullanıcı Kaydı (Signup)</span>
                        <p className="text-sm text-slate-500">Yeni kullanıcıların kayıt olmasına izin ver</p>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={allowSignup}
                            onChange={(e) => setAllowSignup(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-emerald-600 transition-colors"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                    </div>
                </label>
            </div>

            {/* Preview Links */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-2">Önizleme Linkleri</p>
                <div className="flex flex-wrap gap-3 text-sm">
                    <a href="/login" target="_blank" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                        <ExternalLink size={14} /> /login
                    </a>
                    <a href="/signup" target="_blank" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                        <ExternalLink size={14} /> /signup
                    </a>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {message.text}
                </div>
            )}

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
                {saving ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Kaydediliyor...
                    </>
                ) : (
                    <>
                        <Save size={18} />
                        Ayarları Kaydet
                    </>
                )}
            </button>
        </div>
    );
};
