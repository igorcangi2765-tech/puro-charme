import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    ClipboardList,
    Users,
    UserCheck,
    Calendar,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        bookingsToday: 0,
        pendingBookings: 0,
        totalClients: 0,
        activeStaff: 0,
    });
    const [latestBookings, setLatestBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const todayStr = format(new Date(), 'yyyy-MM-dd');

                // 1. Bookings Today
                const { count: todayCount } = await supabase
                    .from('appointments')
                    .select('*', { count: 'exact', head: true })
                    .eq('appointment_date', todayStr);

                // 2. Pending Bookings
                const { count: pendingCount } = await supabase
                    .from('appointments')
                    .select('*', { count: 'exact', head: true })
                    .ilike('status', 'pendente'); // Adjusting to the status in the DB

                // 3. Total Clients (Unique phones)
                // Note: Supabase count(distinct) isn't directly exposed in this syntax easily, 
                // but for a salon, counting total rows in a dedicated customers table is better.
                // Since we don't have a customers table yet, we'll count total appointments or unique names for now.
                const { count: totalAppointments } = await supabase
                    .from('appointments')
                    .select('*', { count: 'exact', head: true });

                // 4. Active Staff
                const { count: staffCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .not('role', 'is', null)
                    .eq('is_active', true);

                setStats({
                    bookingsToday: todayCount || 0,
                    pendingBookings: pendingCount || 0,
                    totalClients: totalAppointments || 0,
                    activeStaff: staffCount || 0,
                });

                // Fetch Latest 5 Bookings
                const { data: bookings } = await supabase
                    .from('appointments')
                    .select('*, profiles(full_name)')
                    .order('created_at', { ascending: false })
                    .limit(5);

                setLatestBookings(bookings || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'confirmado' || s === 'confirmed') return 'bg-green-50 text-green-600 border-green-100';
        if (s === 'pendente' || s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
        if (s === 'cancelado' || s === 'rejected' || s === 'rejeitado') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-puro-black">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Visão geral do sistema de agendamentos Puro Charme.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 shadow-sm flex items-center gap-2">
                        <Clock size={16} className="text-puro-pink" />
                        {format(new Date(), 'dd MMM, yyyy')}
                    </span>
                    <Link
                        to="/admin/calendar"
                        className="px-5 py-2.5 bg-puro-pink text-white rounded-xl text-sm font-semibold shadow-lg shadow-puro-pink/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
                    >
                        <Calendar size={16} />
                        Ver Agenda
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Agendamentos hoje</p>
                            <h3 className="text-3xl font-headline font-bold text-puro-black">{stats.bookingsToday}</h3>
                        </div>
                        <div className="p-3 bg-puro-softPink rounded-2xl text-puro-pink">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center text-xs text-green-500 font-semibold gap-1">
                        <ArrowUpRight size={14} />
                        <span>Pronto para o dia</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Pendentes</p>
                            <h3 className="text-3xl font-headline font-bold text-puro-black">{stats.pendingBookings}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                            <ClipboardList size={20} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Link to="/admin/bookings" className="text-xs font-bold text-amber-600 hover:underline">Aguardando resposta</Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Clientes</p>
                            <h3 className="text-3xl font-headline font-bold text-puro-black">{stats.totalClients}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center text-xs text-gray-400 font-medium">
                        <span>Base de dados ativa</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Equipa Ativa</p>
                            <h3 className="text-3xl font-headline font-bold text-puro-black">{stats.activeStaff}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-2xl text-green-500">
                            <UserCheck size={20} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center text-xs text-gray-400 font-medium">
                        <span>Especialistas online</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Bookings */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h4 className="font-headline font-bold text-lg text-puro-black">Últimos Agendamentos</h4>
                        <p className="text-sm text-gray-400">Clique para gerir o estado ou contactar o cliente.</p>
                    </div>
                    <Link to="/admin/bookings" className="text-sm font-bold text-puro-pink hover:underline">Ver Todos</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Serviço</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Staff Assign.</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data / Hora</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {latestBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-puro-black text-sm">{booking.customer_name}</span>
                                            <span className="text-xs text-gray-400">{booking.customer_phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-gray-600 font-medium">{booking.service_type}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                                {booking.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm text-gray-600">{booking.profiles?.full_name || 'Não atribuído'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-puro-black font-medium">{booking.appointment_date}</span>
                                            <span className="text-xs text-gray-400 font-mono tracking-tight">{booking.appointment_time}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-puro-pink hover:bg-puro-softPink rounded-lg transition-colors" title="Contact WhatsApp">
                                                <MessageSquare size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-puro-black hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {latestBookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-gray-400 text-sm">
                                        Nenhum agendamento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
