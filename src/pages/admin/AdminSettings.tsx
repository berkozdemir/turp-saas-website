import { useState, useEffect } from "react";
import { Lock, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Settings } from "lucide-react";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminSettingsProps {
    token: string;
    userName: string;
    userEmail: string;
}

export const AdminSettings = ({ token, userName, userEmail }: AdminSettingsProps) => {
    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Email settings state
    const [notificationEmails, setNotificationEmails] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith('/index.php') ? API_URL : `${API_URL}/index.php`;

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}?action=get_settings`, {
                    headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() }
                });
                const data = await response.json();
                if (data.success && data.data) {
                    setNotificationEmails(data.data.notification_emails || "berko@omega-cro.com.tr");
                }
            } catch (err) {
                console.error("Settings load error:", err);
            } finally {
                setLoadingSettings(false);
            }
        };
        loadSettings();
    }, [token, API_URL]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Yeni şifre en az 8 karakter olmalıdır.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}?action=change_password`, {
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
                setPasswordMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPasswordMessage({ type: 'error', text: data.error || 'Şifre güncellenemedi.' });
            }
        } catch (err) {
            setPasswordMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSaveEmailSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailMessage(null);

        // Validate emails
        const emails = notificationEmails.split(',').map(e => e.trim());
        const invalidEmails = emails.filter(e => e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

        if (invalidEmails.length > 0) {
            setEmailMessage({ type: 'error', text: `Geçersiz e-posta: ${invalidEmails.join(', ')}` });
            return;
        }

        setEmailLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}?action=update_settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    notification_emails: notificationEmails,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setEmailMessage({ type: 'success', text: 'E-posta ayarları kaydedildi.' });
            } else {
                setEmailMessage({ type: 'error', text: data.error || 'Ayarlar kaydedilemedi.' });
            }
        } catch (err) {
            setEmailMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Email Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-rose-50 to-pink-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Mail className="text-rose-600" /> E-posta Bildirimleri
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">İletişim formu mesajlarının gönderileceği e-posta adreslerini ayarlayın.</p>
                </div>

                <div className="p-8 max-w-2xl">
                    {loadingSettings ? (
                        <div className="flex items-center gap-2 text-slate-500">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Ayarlar yükleniyor...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveEmailSettings} className="space-y-4">
                            {emailMessage && (
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${emailMessage.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {emailMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span className="font-medium">{emailMessage.text}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Bildirim E-postaları
                                </label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none resize-none h-24"
                                    value={notificationEmails}
                                    onChange={e => setNotificationEmails(e.target.value)}
                                    placeholder="email1@example.com, email2@example.com"
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    Birden fazla e-posta adresi için virgül ile ayırın. İletişim formundan gelen mesajlar bu adreslere gönderilir.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={emailLoading}
                                className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {emailLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {emailLoading ? 'Kaydediliyor...' : 'E-posta Ayarlarını Kaydet'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-blue-50">
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

                    {passwordMessage && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${passwordMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {passwordMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span className="font-medium">{passwordMessage.text}</span>
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
                            disabled={passwordLoading}
                            className="mt-6 px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {passwordLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {passwordLoading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Database Maintenance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="text-emerald-600" /> Veritabanı Bakımı
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Gerekli durumlarda veritabanı tablolarını güncelleyin.</p>
                </div>
                <div className="p-8 max-w-2xl">
                    <button
                        onClick={async () => {
                            if (!confirm("Veritabanı güncellemesi başlatılsın mı?")) return;
                            try {
                                const res = await fetch(`${API_BASE_URL}?action=migrate_db`, {
                                    headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() }
                                });
                                const txt = await res.text();
                                alert("Sonuç: " + txt);
                            } catch (e) {
                                alert("Hata: " + e);
                            }
                        }}
                        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <Settings size={20} />
                        Veritabanını Güncelle / Onar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
