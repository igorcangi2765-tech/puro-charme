import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    UserPlus,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    Edit2,
    Shield,
    Clock,
    Calendar as CalendarIcon,
    MoreVertical,
    Check
} from 'lucide-react';

const Staff: React.FC = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .not('role', 'is', null)
                .order('role', { ascending: true }) // Managers first
                .order('full_name', { ascending: true });

            if (error) throw error;
            setStaffList(data || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            setStaffList(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
        } catch (error) {
            console.error('Error toggling status:', error);
            fetchStaff(); // Refresh on error
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-puro-black">Equipa & Staff</h2>
                    <p className="text-gray-500 mt-1">Gerencie os membros da equipa, cargos e horários.</p>
                </div>

                <button
                    disabled
                    className="px-5 py-2.5 bg-puro-pink/10 text-puro-pink rounded-xl text-sm font-semibold border border-puro-pink/20 flex items-center gap-2 opacity-50 cursor-not-allowed"
                >
                    <UserPlus size={18} />
                    Adicionar Membro
                </button>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map((member) => (
                    <div key={member.id} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 relative group overflow-hidden transition-all hover:shadow-[0_12px_45px_rgb(0,0,0,0.04)]">
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${member.is_active
                                ? 'bg-green-50 text-green-600 border-green-100'
                                : 'bg-gray-50 text-gray-400 border-gray-100'
                                }`}>
                                {member.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[28px] bg-puro-softPink flex items-center justify-center text-puro-pink text-2xl font-bold mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                {member.full_name?.charAt(0) || '?'}
                            </div>

                            <h3 className="text-xl font-headline font-bold text-puro-black">{member.full_name || 'Sem nome'}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-puro-pink">
                                <Shield size={14} />
                                <span className="text-xs font-bold uppercase tracking-widest">{member.role}</span>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-2xl border border-gray-50 group-hover:border-puro-softPink transition-colors">
                                <Mail size={16} className="text-puro-pink/60" />
                                <span className="truncate">{member.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-2xl border border-gray-50 group-hover:border-puro-softPink transition-colors">
                                <Phone size={16} className="text-puro-pink/60" />
                                <span>{member.phone || 'Telemóvel não definido'}</span>
                            </div>
                        </div>

                        {/* Services & Availability Tags */}
                        <div className="mt-6">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Serviços & Disponibilidade</p>
                            <div className="flex flex-wrap gap-2">
                                {(member.services_provided || ['Corte', 'Unhas']).map((service: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] text-gray-500 font-medium">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons Overlay */}
                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <button className="text-xs font-bold text-gray-400 hover:text-puro-pink flex items-center gap-2 transition-colors">
                                <Edit2 size={14} />
                                Editar Perfil
                            </button>
                            <button
                                onClick={() => toggleStatus(member.id, member.is_active)}
                                className={`p-2 rounded-xl transition-all ${member.is_active
                                    ? 'text-red-400 hover:bg-red-50'
                                    : 'text-green-500 hover:bg-green-50'
                                    }`}
                                title={member.is_active ? 'Desativar' : 'Ativar'}
                            >
                                {member.is_active ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Staff;
