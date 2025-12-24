import { useState, useEffect } from "react";
import { Lock, Save, Loader2, Mail, Eye, EyeOff, Building } from "lucide-react";
import { settingsApi } from "@/iwrs/lib/api";
import { useToast } from "@/iwrs/hooks/use-toast";

interface AdminSettingsProps {
    token?: string;
    userName: string;
    userEmail: string;
}

export const AdminSettings = ({ userName, userEmail }: AdminSettingsProps) => {
    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Email settings state
    const [notificationEmails, setNotificationEmails] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);

    // Contact Settings State
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactAddress, setContactAddress] = useState("");
    const [contactLoading, setContactLoading] = useState(false);

    const [loadingSettings, setLoadingSettings] = useState(true);

    const { toast } = useToast();

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await settingsApi.get();
                if (data) {
                    setNotificationEmails(data.notification_emails || "berko@omega-cro.com.tr");
                    setCompanyName(data.company_name || "");
                    setContactEmail(data.contact_email || "");
                    setContactPhone(data.contact_phone || "");
                    setContactAddress(data.contact_address || "");
                }
            } catch (err) {
                console.error("Settings load error:", err);
            } finally {
                setLoadingSettings(false);
            }
        };
        loadSettings();
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast({ title: "Hata", description: "Yeni şifre en az 8 karakter olmalıdır.", variant: "destructive" });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({ title: "Hata", description: "Yeni şifreler eşleşmiyor.", variant: "destructive" });
            return;
        }

        setPasswordLoading(true);

        try {
            await settingsApi.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });

            toast({ title: "Başarılı", description: "Şifreniz başarıyla güncellendi." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast({ title: "Hata", description: err.message || 'Şifre güncellenemedi.', variant: "destructive" });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSaveEmailSettings = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate emails
        const emails = notificationEmails.split(',').map(e => e.trim());
        const invalidEmails = emails.filter(e => e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

        if (invalidEmails.length > 0) {
            toast({ title: "Hata", description: `Geçersiz e-posta: ${invalidEmails.join(', ')}`, variant: "destructive" });
            return;
        }

        setEmailLoading(true);

        try {
            await settingsApi.update({
                notification_emails: notificationEmails,
            });
            toast({ title: "Başarılı", description: "E-posta ayarları kaydedildi." });
        } catch (err: any) {
            toast({ title: "Hata", description: err.message || 'Ayarlar kaydedilemedi.', variant: "destructive" });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleSaveContactInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            await settingsApi.update({
                company_name: companyName,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                contact_address: contactAddress,
            });
            toast({ title: "Başarılı", description: "İletişim bilgileri kaydedildi." });
        } catch (err: any) {
            toast({ title: "Hata", description: "İletişim bilgileri kaydedilemedi.", variant: "destructive" });
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Contact Information Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building className="text-emerald-600" /> İletişim Bilgileri
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Platformun genel iletişim bilgilerini buradan yönetin.</p>
                </div>
                <div className="p-8 max-w-2xl">
                    {loadingSettings ? (
                        <Loader2 className="animate-spin text-slate-400" />
                    ) : (
                        <form onSubmit={handleSaveContactInfo} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Şirket Adı</label>
                                    <input
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                                        value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Omega CRO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">İletişim E-posta</label>
                                    <input
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                                        value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="info@omegacro.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Telefon</label>
                                    <input
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                                        value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+90 555 ..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Adres</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none resize-none h-20"
                                        value={contactAddress} onChange={e => setContactAddress(e.target.value)} placeholder="Full address..."
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={contactLoading}
                                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {contactLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {contactLoading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

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
        </div>
    );
};
