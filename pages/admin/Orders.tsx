import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Package, Clock, CheckCircle2, XCircle, SearchX } from 'lucide-react';

interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    total_amount: number;
    status: 'PENDING' | 'OVER_WHATSAPP' | 'COMPLETED' | 'CANCELLED';
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setOrders(data as Order[]);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Erro ao atualizar status do pedido.');
        }
    };

    const filteredOrders = orders.filter(o =>
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_phone.includes(searchTerm) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'OVER_WHATSAPP': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-200';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'OVER_WHATSAPP': return 'No WhatsApp';
            case 'COMPLETED': return 'Concluído';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="font-body space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-headline font-bold text-puro-black">Pedidos (WhatsApp)</h2>
                    <p className="text-gray-500 text-sm mt-1">Gerencie as intenções de compra enviadas para o seu WhatsApp.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4 items-center bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, telefone ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-puro-pink focus:ring-1 focus:ring-puro-pink outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center text-puro-pink">
                            <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <SearchX size={48} className="text-gray-200 mb-4" strokeWidth={1} />
                            <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
                            <p className="text-gray-400 text-sm mt-1">Os pedidos feitos pela loja aparecerão aqui.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-white border-b border-gray-100 font-headline text-xs uppercase tracking-wider text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">ID / Data</th>
                                    <th className="px-6 py-4 font-semibold">Cliente</th>
                                    <th className="px-6 py-4 font-semibold">Total</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Ações Rápidas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-gray-500 mb-1" title={order.id}>
                                                #{order.id.split('-')[0]}
                                            </div>
                                            <div className="text-gray-400 text-xs flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(order.created_at).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-puro-black">{order.customer_name}</div>
                                            <div className="text-gray-400 text-xs mt-1">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-puro-black">
                                            {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} inline-block`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {order.status !== 'COMPLETED' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-100 transition-all"
                                                        title="Marcar como Concluído"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                )}
                                                {order.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                                                        title="Cancelar Pedido"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                                <a href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all ml-2" title="Conversar no WhatsApp">
                                                    <Package size={18} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
