import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Search,
    User,
    Calendar,
    MessageSquare,
    ChevronRight,
    SearchX
} from 'lucide-react';

interface Customer {
    phone: string;
    name: string;
    total_bookings: number;
    last_visit: string;
}

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Aggregate customers from appointments table
            const { data, error } = await supabase
                .from('appointments')
                .select('customer_name, customer_phone, appointment_date')
                .order('appointment_date', { ascending: false });

            if (error) throw error;

            // Simple aggregation logic
            const customerMap = new Map<string, Customer>();

            data.forEach(apt => {
                const phone = apt.customer_phone;
                if (!customerMap.has(phone)) {
                    customerMap.set(phone, {
                        phone,
                        name: apt.customer_name,
                        total_bookings: 1,
                        last_visit: apt.appointment_date
                    });
                } else {
                    const existing = customerMap.get(phone)!;
                    existing.total_bookings += 1;
                    // last_visit is already the most recent because we ordered by date desc
                }
            });

            setCustomers(Array.from(customerMap.values()));
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-puro-black tracking-tight">Clientes</h2>
                    <p className="text-gray-500 mt-1">Base de dados centralizada dos clientes do salão.</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-puro-pink transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou telemóvel..."
                        className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-puro-pink/5 focus:border-puro-pink transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Summary Banner */}
            <div className="bg-gradient-to-r from-puro-pink to-[#e03882] rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center gap-10 shadow-lg shadow-puro-pink/20">
                <div className="flex flex-col items-center md:items-start">
                    <span className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">Total de Clientes Únicos</span>
                    <span className="text-5xl font-headline font-bold">{customers.length}</span>
                </div>
                <div className="h-12 w-px bg-white/20 hidden md:block"></div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="text-white" size={24} />
                    </div>
                    <p className="text-white/80 text-sm max-w-xs leading-relaxed">
                        Clientes que agendaram pelo menos um serviço através do website.
                    </p>
                </div>
            </div>

            {/* Customers List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredCustomers.map((customer, i) => (
                    <div
                        key={customer.phone}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-puro-softPink transition-all animate-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-puro-pink text-xl font-bold group-hover:bg-puro-softPink transition-colors">
                                {customer.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-headline font-bold text-puro-black">{customer.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-medium text-gray-400">{customer.phone}</span>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <span className="text-xs font-bold text-puro-pink bg-puro-softPink px-2 py-0.5 rounded-full">
                                        {customer.total_bookings} Agendamentos
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 md:gap-16">
                            <div className="hidden sm:flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-right md:text-left">Última Visita</span>
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold justify-end md:justify-start">
                                    <Calendar size={14} className="text-puro-pink" />
                                    {customer.last_visit}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}`, '_blank')}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                    title="Enviar Mensagem"
                                >
                                    <MessageSquare size={20} />
                                </button>
                                <button className="p-3 bg-gray-50 text-gray-400 hover:text-puro-black hover:bg-gray-100 rounded-2xl transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredCustomers.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <SearchX size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">Nenhum cliente encontrado.</p>
                        <p className="text-sm opacity-60">Tente pesquisar por outro nome ou número.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;
