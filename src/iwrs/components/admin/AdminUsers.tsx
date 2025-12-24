import { useState, useEffect } from "react";
import { Search, Loader2, User } from "lucide-react";
import { adminApi } from "@/iwrs/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminApi.getUsers();
                setUsers(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 pb-0">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <User className="text-rose-600" /> Kayıtlı Kullanıcılar
                </h2>
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="İsim veya E-posta ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4">Kullanıcı</th>
                            <th className="p-4">Kurum</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Kayıt Tarihi</th>
                            <th className="p-4">Son Giriş</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Kullanıcı bulunamadı.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{user.full_name}</div>
                                        <div className="text-sm text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{user.institution || "-"}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {user.created_at ? format(new Date(user.created_at), "d MMMM yyyy", { locale: tr }) : "-"}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {user.last_login_at ? format(new Date(user.last_login_at), "d MMM HH:mm", { locale: tr }) : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
