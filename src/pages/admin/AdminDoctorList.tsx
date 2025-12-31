import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2, Download, Upload, CheckCircle, XCircle } from "lucide-react";
import { useConfirm } from "../../components/ConfirmProvider";
import { useNotification } from "../../components/NotificationProvider";
import { getTenantHeader } from "../../context/TenantContext";

interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
    clinic: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
}

interface AdminDoctorListProps {
    token: string;
}

const TURKISH_CITIES = [
    'Adana', 'Ankara', 'Antalya', 'Bursa', 'Diyarbakır', 'Erzurum', 'Eskişehir',
    'Gaziantep', 'İstanbul', 'İzmir', 'Kayseri', 'Kocaeli', 'Konya', 'Malatya',
    'Mersin', 'Samsun', 'Şanlıurfa', 'Tekirdağ', 'Trabzon', 'Van', 'Diğer'
];

export const AdminDoctorList = ({ token }: AdminDoctorListProps) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', clinic: '', notes: '' });
    const [importData, setImportData] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    const confirm = useConfirm();
    const notify = useNotification();
    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/index.php?action=admin_list_doctors`, {
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() }
            });
            const data = await response.json();
            if (data.success) {
                setDoctors(data.data);
            }
        } catch (err) {
            notify.error("Doktorlar yüklenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.clinic && doc.clinic.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const openAddModal = () => {
        setEditingDoctor(null);
        setFormData({ name: '', email: '', phone: '', city: '', clinic: '', notes: '' });
        setShowModal(true);
    };

    const openEditModal = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            city: doctor.city,
            clinic: doctor.clinic || '',
            notes: doctor.notes || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingDoctor
                ? `${API_URL}/index.php?action=admin_update_doctor`
                : `${API_URL}/index.php?action=admin_create_doctor`;

            const method = editingDoctor ? 'PUT' : 'POST';
            const body = editingDoctor ? { ...formData, id: editingDoctor.id } : formData;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (data.success) {
                notify.success(editingDoctor ? 'Doktor güncellendi' : 'Doktor eklendi');
                setShowModal(false);
                fetchDoctors();
            } else {
                notify.error(data.error || 'İşlem başarısız');
            }
        } catch (err) {
            notify.error('Bağlantı hatası');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (doctor: Doctor) => {
        const confirmed = await confirm({
            title: 'Doktoru Sil',
            message: `"${doctor.name}" isimli doktoru silmek istediğinize emin misiniz?`,
            confirmLabel: 'Sil',
            cancelLabel: 'İptal',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/index.php?action=admin_delete_doctor&id=${doctor.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() }
            });
            const data = await response.json();
            if (data.success) {
                notify.success('Doktor silindi');
                fetchDoctors();
            } else {
                notify.error(data.error || 'Silme işlemi başarısız');
            }
        } catch (err) {
            notify.error('Bağlantı hatası');
        }
    };

    // CSV Import
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

            const parsed = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                const obj: any = {};
                headers.forEach((h, i) => { obj[h] = values[i] || ''; });
                return obj;
            });

            setImportData(parsed);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (importData.length === 0) return;
        setSaving(true);

        try {
            const response = await fetch(`${API_URL}/index.php?action=admin_import_doctors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({ doctors: importData })
            });

            const data = await response.json();
            if (data.success) {
                notify.success(`${data.imported} doktor içe aktarıldı`);
                if (data.errors?.length > 0) {
                    notify.warning(`${data.errors.length} satırda hata var`);
                }
                setShowImportModal(false);
                setImportData([]);
                fetchDoctors();
            } else {
                notify.error(data.error || 'İçe aktarma başarısız');
            }
        } catch (err) {
            notify.error('Bağlantı hatası');
        } finally {
            setSaving(false);
        }
    };

    // CSV Export
    const handleExport = () => {
        const headers = ['name', 'email', 'phone', 'city', 'clinic', 'notes'];
        const rows = doctors.filter(d => d.is_active).map(doc => [
            doc.name, doc.email, doc.phone, doc.city, doc.clinic || '', doc.notes || ''
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv; charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `omega_doctors_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const downloadTemplate = () => {
        const csv = 'name,email,phone,city,clinic,notes\nDr. Örnek,ornek@email.com,+905551234567,Ankara,Örnek Klinik,NIPT uzmanı';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'doctors_template.csv';
        link.click();
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">🏥 Doktor Yönetimi</h1>
                <p className="text-slate-500 mt-1">Hekimleri ekleyin, düzenleyin ve yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Adı, e-postası veya şehir ile ara..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors">
                    <Plus size={18} /> Yeni Doktor
                </button>
                <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                    <Upload size={18} /> CSV İçe Aktar
                </button>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                    <Download size={18} /> CSV Dışa Aktar
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-rose-500" size={32} />
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-medium text-slate-600">Henüz doktor yok</h3>
                        <p className="text-slate-400 mt-1">Başlamak için ilk doktoru ekleyin</p>
                        <button onClick={openAddModal} className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium">
                            + Yeni Doktor Ekle
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-rose-50/50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Adı</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">E-posta</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Telefon</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Şehir</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Klinik</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Durum</th>
                                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className="border-b border-slate-100 hover:bg-rose-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900">{doctor.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{doctor.email}</td>
                                    <td className="px-4 py-3 text-slate-600">{doctor.phone}</td>
                                    <td className="px-4 py-3 text-slate-600">{doctor.city}</td>
                                    <td className="px-4 py-3 text-slate-500">{doctor.clinic || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${doctor.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {doctor.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {doctor.is_active ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEditModal(doctor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(doctor)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingDoctor ? 'Doktoru Düzenle' : 'Yeni Doktor Ekle'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Adı Soyadı *</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" placeholder="Dr. Aylin Yılmaz" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta *</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" placeholder="aylin@clinic.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
                                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" placeholder="+90 555 123 4567" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Şehir *</label>
                                <select required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none">
                                    <option value="">-- Şehir Seçiniz --</option>
                                    {TURKISH_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Muayenehane/Hastane</label>
                                <input type="text" value={formData.clinic} onChange={(e) => setFormData({ ...formData, clinic: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" placeholder="Örnek Klinik" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notlar</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" rows={3} placeholder="İç kullanım notları..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">İptal</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                                    {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">CSV'den İçe Aktar</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-500">
                                Beklenen sütunlar: <code className="bg-slate-100 px-1 rounded">name, email, phone, city, clinic, notes</code>
                            </p>
                            <button onClick={downloadTemplate} className="text-rose-600 font-medium text-sm hover:underline">
                                📄 Örnek CSV İndir
                            </button>
                            <div>
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                            </div>
                            {importData.length > 0 && (
                                <p className="text-sm text-green-600 font-medium">
                                    ✓ {importData.length} doktor içe aktarılmaya hazır
                                </p>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowImportModal(false); setImportData([]); }} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">İptal</button>
                                <button onClick={handleImport} disabled={importData.length === 0 || saving} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium disabled:opacity-50">
                                    {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'İçe Aktar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctorList;
