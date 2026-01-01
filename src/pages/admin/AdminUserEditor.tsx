import { useState } from "react";
import { ArrowLeft, Save, Loader2, Mail, User, Shield, Eye, Key } from "lucide-react";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminUser {
    id?: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    is_active: boolean;
}

interface AdminUserEditorProps {
    token: string;
    user: AdminUser | null;
    onCancel: () => void;
    onSave: () => void;
}

export const AdminUserEditor = ({ token, user, onCancel, onSave }: AdminUserEditorProps) => {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>(user?.role || "editor");
    const [isActive, setIsActive] = useState(user?.is_active ?? true);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const isEditing = Boolean(user?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim() || !email.trim()) {
            setError("Ad ve e-posta zorunludur");
            return;
        }

        if (!isEditing && password.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır");
            return;
        }

        setSaving(true);

        try {
            const action = isEditing ? 'update_admin_user' : 'create_admin_user';
            const payload: any = { name, email, role, is_active: isActive };
            if (isEditing) payload.id = user!.id;
            if (!isEditing) payload.password = password;

            const response = await fetch(`${API_BASE_URL}?action=${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                onSave();
            } else {
                setError(data.error || "Kayıt başarısız");
            }
        } catch (err) {
            setError("Bağlantı hatası");
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async () => {
        if (!password || password.length < 8) {
            setError("Yeni şifre en az 8 karakter olmalıdır");
            return;
        }

        setResetting(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}?action=reset_user_password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({ id: user!.id, new_password: password }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess("Şifre başarıyla güncellendi");
                setPassword("");
            } else {
                setError(data.error || "Şifre güncellenemedi");
            }
        } catch (err) {
            setError("Bağlantı hatası");
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="text-slate-500" />
                </button>
                <div>
                    <h2 className="text-xl font-bold">
                        {isEditing ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {isEditing ? user?.email : "Yeni admin paneli kullanıcısı ekleyin"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 max-w-2xl space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium">
                        {success}
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <User size={14} /> Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Kullanıcı adı"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail size={14} /> E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Shield size={14} /> Rol
                    </label>
                    <select
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none bg-white"
                        value={role}
                        onChange={e => setRole(e.target.value as any)}
                    >
                        <option value="admin">Admin - Tam yetki</option>
                        <option value="editor">Editör - İçerik yönetimi</option>
                        <option value="viewer">İzleyici - Salt okunur</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-2">
                        Admin: Tüm yetkilere sahip. Editör: Blog, SSS ve mesajları yönetir. İzleyici: Sadece görüntüler.
                    </p>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Key size={14} /> {isEditing ? "Yeni Şifre (opsiyonel)" : "Şifre"} {!isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="flex-1 p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={isEditing ? "Değiştirmek için yeni şifre girin" : "En az 8 karakter"}
                            minLength={isEditing ? 0 : 8}
                            required={!isEditing ? false : undefined}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            <Eye size={18} className="text-slate-600" />
                        </button>
                        {isEditing && password && (
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                disabled={resetting}
                                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors font-medium disabled:opacity-50"
                            >
                                {resetting ? <Loader2 className="animate-spin" size={18} /> : "Şifreyi Güncelle"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={isActive}
                        onChange={e => setIsActive(e.target.checked)}
                        className="w-5 h-5 accent-green-600"
                    />
                    <label htmlFor="is_active" className="cursor-pointer">
                        <span className="font-medium text-slate-700">Aktif Kullanıcı</span>
                        <p className="text-xs text-slate-500">Devre dışı kullanıcılar giriş yapamaz</p>
                    </label>
                </div>

                {/* Submit */}
                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kullanıcı Oluştur'}
                    </button>
                </div>
            </form>
        </div>
    );
};
