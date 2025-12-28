import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    Truck,
    Building2,
    Tag,
    Phone,
    Mail
} from 'lucide-react';

import { useTenant, getTenantHeader } from '../../context/TenantContext';

interface Booking {
    id: number;
    patient_name: string;
    patient_phone: string;
    patient_email: string;
    booking_date: string;
    booking_time: string;
    sample_collection_method: 'home_care' | 'clinic' | 'courier' | 'lab';
    sample_collection_address: string;
    status: 'pending' | 'confirmed' | 'sample_collected' | 'in_lab' | 'completed' | 'cancelled';
    referral_code?: string;
    referrer_name?: string;
    notes?: string;
    tenant_name?: string;
    indication_type?: string; // Trombofili specific
}

export const AdminNIPTBookings: React.FC<{ token: string }> = ({ token }) => {
    const { currentTenant } = useTenant();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const action = currentTenant?.code === 'trombofili' ? 'get_trombofili_bookings' : 'get_bookings';

            const res = await fetch(`${API_URL}/index.php?action=${action}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...getTenantHeader()
                }
            });
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        if (!confirm('Statü güncellensin mi?')) return;

        try {
            const res = await fetch(`${API_URL}/index.php?action=update_booking_status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchBookings(); // Refresh
            } else {
                alert('Hata: ' + data.error);
            }
        } catch (err) {
            alert('İşlem başarısız');
        }
    };

    const filteredBookings = statusFilter === 'all'
        ? bookings
        : bookings.filter(b => b.status === statusFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'sample_collected': return 'bg-purple-100 text-purple-800';
            case 'in_lab': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusLabel = (status: string) => {
        const map: any = {
            'pending': 'Bekliyor',
            'confirmed': 'Onaylandı',
            'sample_collected': 'Numune Alındı',
            'in_lab': 'Labda İşleniyor',
            'completed': 'Sonuçlandı',
            'cancelled': 'İptal'
        };
        return map[status] || status;
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Yeni Randevu</p>
                            <h3 className="text-2xl font-bold text-slate-900">{bookings.filter(b => b.status === 'pending').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">İşlemde (Lab)</p>
                            <h3 className="text-2xl font-bold text-slate-900">{bookings.filter(b => b.status === 'in_lab').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Sonuçlanan</p>
                            <h3 className="text-2xl font-bold text-slate-900">{bookings.filter(b => b.status === 'completed').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Evde Alım</p>
                            <h3 className="text-2xl font-bold text-slate-900">{bookings.filter(b => b.sample_collection_method === 'home_care').length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                    {['all', 'pending', 'confirmed', 'sample_collected', 'in_lab', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {status === 'all' ? 'Tümü' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>
                <div className="w-full md:w-auto min-w-[300px]">
                    {/* Search logic to be wired up or handled via client-side filter for MVP */}
                    <input
                        type="text"
                        placeholder="Hasta adı, telefon veya kod ara..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Yükleniyor...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${booking.sample_collection_method === 'home_care' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {booking.sample_collection_method === 'home_care' ? <Truck size={24} /> : <Building2 size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-900">{booking.patient_name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${booking.tenant_name?.toLowerCase().includes('momguard') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                booking.tenant_name?.toLowerCase().includes('verifi') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    booking.tenant_name?.toLowerCase().includes('veritas') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {booking.tenant_name || 'NIPT'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Phone size={14} /> {booking.patient_phone}</span>
                                            <span className="flex items-center gap-1"><Mail size={14} /> {booking.patient_email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                                        {getStatusLabel(booking.status)}
                                    </span>
                                    <select
                                        className="text-sm border-slate-200 rounded-lg p-1.5 bg-slate-50"
                                        value={booking.status}
                                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                                    >
                                        <option value="pending">Bekliyor</option>
                                        <option value="confirmed">Onayla</option>
                                        <option value="sample_collected">Numune Alındı</option>
                                        <option value="in_lab">Lab'a Gönder</option>
                                        <option value="completed">Tamamla</option>
                                        <option value="cancelled">İptal Et</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg text-sm">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span className="font-medium">Randevu Tarihi:</span>
                                        <span>{booking.booking_date} / {booking.booking_time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span className="font-medium">Adres:</span>
                                        <span className="truncate max-w-[300px]" title={booking.sample_collection_address}>{booking.sample_collection_address}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {booking.referral_code && (
                                        <div className="flex items-center gap-2 text-indigo-600">
                                            <Tag size={16} />
                                            <span className="font-medium">Referans:</span>
                                            <b>{booking.referral_code}</b> ({booking.referrer_name})
                                            <span className="text-xs bg-indigo-100 px-1.5 py-0.5 rounded ml-1">İndirimli</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <AlertCircle size={16} />
                                        <span className="font-medium">Notlar:</span>
                                        {booking.notes || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                            <p className="text-slate-500">Bu filtrede randevu bulunamadı.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
