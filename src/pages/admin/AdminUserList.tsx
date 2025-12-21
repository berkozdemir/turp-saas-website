import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Loader2, Shield, Users, Eye } from "lucide-react";
import { useConfirm } from "../../components/ConfirmProvider";
import { useNotification } from "../../components/NotificationProvider";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
}

interface AdminUserListProps {
    token: string;
    userRole: string;
    onEdit: (user: AdminUser) => void;
    onCreate: () => void;
}

const roleColors: Record<string, string> = {
    admin: "bg-rose-100 text-rose-700",
    editor: "bg-blue-100 text-blue-700",
    viewer: "bg-slate-100 text-slate-700"
};

const roleLabels: Record<string, string> = {
    admin: "Admin",
    editor: "Editör",
    viewer: "İzleyici"
};

const roleIcons: Record<string, React.ReactNode> = {
    admin: <Shield size={14} />,
    editor: <Edit size={14} />,
    viewer: <Eye size={14} />
};

export const AdminUserList = ({ token, userRole, onEdit, onCreate }: AdminUserListProps) => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const confirm = useConfirm();
    const notify = useNotification();

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ role: roleFilter, status: statusFilter, search: searchQuery });
            const response = await fetch(`${API_URL}/index.php?action=get_admin_users&${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (err) {
            console.error("User fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userRole === 'admin') {
            fetchUsers();
        }
    }, [roleFilter, statusFilter, searchQuery]);

    const handleDelete = async (user: AdminUser) => {
        const confirmed = await confirm({
            title: 'Kullanıcı Sil',
            message: `"${user.name}" kullanıcısını silmek istediğinize emin misiniz?`,
            confirmLabel: 'Sil',
            cancelLabel: 'İptal',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/index.php?action=delete_admin_user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id: user.id })
            });
            const data = await response.json();
            if (data.success) {
                notify.success('Kullanıcı başarıyla silindi');
                fetchUsers();
            } else {
                notify.error(data.error || "Silme işlemi başarısız");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        }
    };

    const handleToggleActive = async (user: AdminUser) => {
        try {
            const response = await fetch(`${API_URL}/index.php?action=update_admin_user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...user, is_active: !user.is_active })
            });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (userRole !== 'admin') {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <Shield className="mx-auto text-slate-300 mb-4" size={64} />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Erişim Engellendi</h2>
                <p className="text-slate-500">Kullanıcı yönetimi için admin yetkisi gereklidir.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                        <Users className="text-rose-600" size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Kullanıcılar</h2>
                        <p className="text-sm text-slate-500">{users.length} kayıtlı kullanıcı</p>
                    </div>
                </div>
                <button onClick={onCreate} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors">
                    <Plus size={18} /> Yeni Kullanıcı
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Ad veya e-posta ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 outline-none bg-white"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-rose-500"
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                >
                    <option value="all">Tüm Roller</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editör</option>
                    <option value="viewer">İzleyici</option>
                </select>
                <select
                    className="p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-rose-500"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Devre Dışı</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="p-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Yükleniyor...
                </div>
            ) : users.length === 0 ? (
                <div className="p-12 text-center text-slate-500">Kullanıcı bulunamadı.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-left text-sm text-slate-500">
                            <tr>
                                <th className="p-4 font-medium">Kullanıcı</th>
                                <th className="p-4 font-medium">Rol</th>
                                <th className="p-4 font-medium">Durum</th>
                                <th className="p-4 font-medium">Son Giriş</th>
                                <th className="p-4 font-medium">Kayıt</th>
                                <th className="p-4 font-medium text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{user.name}</div>
                                        <div className="text-sm text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${roleColors[user.role]}`}>
                                            {roleIcons[user.role]}
                                            {roleLabels[user.role]}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {user.is_active ? <UserCheck size={12} /> : <UserX size={12} />}
                                            {user.is_active ? 'Aktif' : 'Devre Dışı'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('tr-TR') : '-'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user)}
                                                className={`p-2 rounded-lg transition-colors ${user.is_active ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                                                title={user.is_active ? 'Devre dışı bırak' : 'Aktifleştir'}
                                            >
                                                {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
