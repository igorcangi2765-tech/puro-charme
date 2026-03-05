import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar as CalendarIcon, Clock, User, Check, X, RefreshCw, Smartphone } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
    id: string;
    customer_name: string;
    customer_phone: string;
    service_type: string;
    appointment_date: string;
    appointment_time: string;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
    notes: string | null;
    created_at: string;
}

export default function Agenda() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow'>('today');

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const fetchAppointments = async () => {
        setLoading(true);
        let query = supabase
            .from('appointments')
            .select('*')
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true });

        if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            query = query.eq('appointment_date', today);
        } else if (filter === 'tomorrow') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            query = query.eq('appointment_date', tomorrowStr);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Error fetching appointments:', error);
        } else {
            setAppointments(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: Appointment['status']) => {
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Erro ao atualizar agendamento');
            console.error(error);
        } else {
            fetchAppointments();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendente': return 'bg-yellow-100 text-yellow-800';
            case 'confirmado': return 'bg-blue-100 text-blue-800';
            case 'concluido': return 'bg-green-100 text-green-800';
            case 'cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAppointmentDate = (dateStr: string) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'Hoje';
        if (isTomorrow(date)) return 'Amanhã';
        return format(date, "dd 'de' MMM", { locale: ptBR });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Agenda do Salão</h1>
                <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1 border">
                    <button
                        onClick={() => setFilter('today')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'today' ? 'bg-puro-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Hoje
                    </button>
                    <button
                        onClick={() => setFilter('tomorrow')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'tomorrow' ? 'bg-puro-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Amanhã
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-puro-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Todos
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Nenhum agendamento encontrado</p>
                    <p className="text-sm mt-1">Ninguém marcou horário para o período selecionado.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-puro-softPink flex flex-col items-center justify-center text-puro-pink shrink-0">
                                    <span className="text-sm font-bold">{formatAppointmentDate(apt.appointment_date)}</span>
                                    <span className="text-xl font-black">{apt.appointment_time.substring(0, 5)}</span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <User size={16} className="text-gray-400" /> {apt.customer_name}
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Smartphone size={14} /> {apt.customer_phone}
                                        </span>
                                        <span className="flex items-center gap-1 font-medium text-puro-pink">
                                            {apt.service_type}
                                        </span>
                                    </div>
                                    {apt.notes && (
                                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border inline-block">
                                            <strong>Obs:</strong> {apt.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${getStatusColor(apt.status)}`}>
                                    {apt.status}
                                </span>

                                <div className="flex gap-2">
                                    {apt.status === 'pendente' && (
                                        <>
                                            <button onClick={() => updateStatus(apt.id, 'confirmado')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Confirmar">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => updateStatus(apt.id, 'cancelado')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Cancelar">
                                                <X size={18} />
                                            </button>
                                        </>
                                    )}
                                    {apt.status === 'confirmado' && (
                                        <button onClick={() => updateStatus(apt.id, 'concluido')} className="px-4 py-2 bg-green-50 text-green-700 font-medium text-sm rounded-lg hover:bg-green-100 transition-colors">
                                            Marcar Concluído
                                        </button>
                                    )}
                                    {apt.status !== 'pendente' && apt.status !== 'confirmado' && (
                                        <button onClick={() => updateStatus(apt.id, 'pendente')} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" title="Reabrir como Pendente">
                                            <RefreshCw size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
