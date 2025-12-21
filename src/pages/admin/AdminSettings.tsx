import { useState } from "react";
import { Lock, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

interface AdminSettingsProps {
    token: string;
    userName: string;
    userEmail: string;
}

export const AdminSettings = ({ token, userName, userEmail }: AdminSettingsProps) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Validation
        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Yeni şifre en az 8 karakter olmalıdır.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/index.php?action=change_password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage({ type: 'error', text: data.error || 'Şifre güncellenemedi.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="text-cyan-600" /> Hesap Ayarları
                </h2>
                <p className="text-slate-500 text-sm mt-1">Şifrenizi değiştirin ve hesap bilgilerinizi görüntüleyin.</p>
            </div>

            <div className="p-8 max-w-2xl">
                {/* User Info */}
                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-400 text-xs uppercase font-bold">Kullanıcı Adı</span>
                            <p className="font-medium text-slate-900">{userName}</p>
                        </div>
                        <div>
                            <span className="text-slate-400 text-xs uppercase font-bold">E-posta</span>
                            <p className="font-medium text-slate-900">{userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Change Password Form */}
                <h3 className="font-bold text-slate-900 mb-4">Şifre Değiştir</h3>

                {message && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mevcut Şifre</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                className="w-full p-3 pr-12 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="w-full p-3 pr-12 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="En az 8 karakter"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Şifreyi tekrar girin"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
