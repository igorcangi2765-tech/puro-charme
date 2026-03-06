import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Search,
    Filter,
    MoreHorizontal,
    Check,
    X,
    MessageSquare,
    Calendar,
    User,
    ChevronDown,
    Clock,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

type BookingStatus = 'pendente' | 'confirmado' | 'cancelado' | 'concluído';

interface Booking {
    id: string;
    customer_name: string;
    customer_phone: string;
    service_type: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    notes: string | null;
    staff_id: string | null;
    profiles: { full_name: string | null } | null;
}

const Bookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, [filterStatus]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('appointments')
                .select('*, profiles(full_name)')
                .order('appointment_date', { ascending: false })
                .order('appointment_time', { ascending: false });

            if (filterStatus !== 'all') {
                query = query.ilike('status', filterStatus);
            }

            const { data, error } = await query;

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string, booking: Booking) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Trigger WhatsApp if needed
            if (newStatus === 'Confirmado' || newStatus === 'confirmado') {
                sendWhatsApp(booking, 'confirm');
            } else if (newStatus === 'Cancelado' || newStatus === 'cancelado') {
                sendWhatsApp(booking, 'reject');
            }

            // Refresh local state
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const sendWhatsApp = (booking: Booking, type: 'confirm' | 'reject' | 'direct') => {
        const phone = booking.customer_phone.replace(/\D/g, '');
        let message = '';

        if (type === 'confirm') {
            message = `Olá ${booking.customer_name} 😊\n\nO seu agendamento no Puro Charme foi confirmado.\n\nServiço: ${booking.service_type}\nData: ${booking.appointment_date}\nHora: ${booking.appointment_time}\n\nEsperamos por si!`;
        } else if (type === 'reject') {
            message = `Olá ${booking.customer_name}.\n\nInfelizmente não conseguimos confirmar o seu agendamento para o horário selecionado.\n\nPor favor, escolha outro horário disponível no nosso site.\n\nObrigado,\nPuro Charme`;
        } else {
            message = `Olá ${booking.customer_name}, falo do Puro Charme sobre o seu agendamento de ${booking.service_type}.`;
        }

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'confirmado' || s === 'confirmed') return 'bg-green-50 text-green-600 border-green-100';
        if (s === 'pendente' || s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
        if (s === 'cancelado' || s === 'rejected' || s === 'rejeitado') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    const filteredBookings = bookings.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer_phone.includes(searchTerm) ||
        b.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-puro-black tracking-tight">Agendamentos</h2>
                    <p className="text-gray-500 mt-1">Gerencie, confirme ou cancele os pedidos de serviço.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-puro-pink transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Procurar cliente ou serviço..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-puro-pink/10 focus:border-puro-pink transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white p-1 border border-gray-100 rounded-xl shadow-sm">
                        {(['all', 'pendente', 'confirmado', 'cancelado'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === s
                                        ? 'bg-puro-pink text-white shadow-md'
                                        : 'text-gray-400 hover:text-puro-pink'
                                    }`}
                            >
                                {s === 'all' ? 'Todos' : s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_40px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Cliente</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Serviço</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Staff Atribuído</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Data & Hora</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-6">
                                            <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/60 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-puro-softPink flex items-center justify-center text-puro-pink font-bold">
                                                {booking.customer_name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-puro-black text-[15px]">{booking.customer_name}</span>
                                                <span className="text-xs text-gray-400 font-medium">{booking.customer_phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700 font-semibold">{booking.service_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase border border-white">
                                                {booking.profiles?.full_name?.charAt(0) || <User size={12} />}
                                            </div>
                                            <span className="text-sm text-gray-600">{booking.profiles?.full_name || 'A aguardar...'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-sm text-puro-black font-bold">
                                                <Calendar size={14} className="text-puro-pink" />
                                                {booking.appointment_date}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <Clock size={14} />
                                                {booking.appointment_time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {updatingId === booking.id ? (
                                                <div className="w-5 h-5 border-2 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    {booking.status.toLowerCase() === 'pendente' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(booking.id, 'confirmado', booking)}
                                                                className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all shadow-sm active:scale-95"
                                                                title="Confirmar"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(booking.id, 'cancelado', booking)}
                                                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm active:scale-95"
                                                                title="Rejeitar"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => sendWhatsApp(booking, 'direct')}
                                                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-95"
                                                        title="WhatsApp"
                                                    >
                                                        <MessageSquare size={18} />
                                                    </button>
                                                    <button className="p-2.5 text-gray-400 hover:text-puro-black hover:bg-gray-100 rounded-xl transition-all">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredBookings.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <AlertCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">Nenhum agendamento encontrado.</p>
                        <p className="text-sm opacity-60">Tente ajustar os filtros ou a sua pesquisa.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
