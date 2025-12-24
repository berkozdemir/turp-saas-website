import { useState, useEffect } from "react";
import { Search, Loader2, Activity } from "lucide-react";
import { adminApi } from "@/iwrs/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const AdminBotLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await adminApi.getLogs(200); // Limit 200
                setLogs(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.endpoint.includes(search) ||
        (log.request_data && log.request_data.includes(search))
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 pb-0">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <Activity className="text-rose-600" /> API & Bot Logları
                </h2>
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Endpoint veya veri ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100 font-sans">
                        <tr>
                            <th className="p-4">Zaman</th>
                            <th className="p-4">Method / Endpoint</th>
                            <th className="p-4">IP</th>
                            <th className="p-4 max-w-xs">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
                        ) : filteredLogs.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-sans">Log kaydı yok.</td></tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-xs whitespace-nowrap text-slate-500">
                                        {format(new Date(log.created_at), "dd MMM HH:mm:ss", { locale: tr })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`font-bold mr-2 ${log.method === 'POST' ? 'text-green-600' : 'text-blue-600'}`}>{log.method}</span>
                                        <span className="text-slate-700">{log.endpoint.replace('api/iwrs_api.php?resource=', '')}</span>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500">{log.ip_address}</td>
                                    <td className="p-4 max-w-lg truncate text-xs text-slate-600" title={log.request_data}>
                                        {log.request_data ? (log.request_data.length > 100 ? log.request_data.substring(0, 100) + '...' : log.request_data) : '-'}
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
