import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, ClipboardList, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockVariants: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Fetch total active products
                const { count: productsCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true);

                // Fetch low stock variants (e.g., stock < 5)
                const { count: lowStockCount } = await supabase
                    .from('product_variants')
                    .select('*', { count: 'exact', head: true })
                    .lt('stock_quantity', 5);

                // Fetch pending orders
                const { count: ordersCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'PENDING');

                setStats({
                    totalProducts: productsCount || 0,
                    lowStockVariants: lowStockCount || 0,
                    pendingOrders: ordersCount || 0,
                });

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-gray-400 font-body text-sm animate-pulse">Carregando painel...</div>;
    }

    return (
        <div className="font-body space-y-8">
            <div>
                <h2 className="text-2xl font-headline font-bold text-puro-black mb-2">Bem-vindo(a) de volta!</h2>
                <p className="text-gray-500">Aqui está o resumo do que está acontecendo na Puro Charme hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col pt-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ClipboardList size={64} className="text-amber-500" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Pedidos Pendentes</h3>
                    <p className="text-4xl font-headline font-bold text-puro-black">{stats.pendingOrders}</p>
                    <div className="mt-6">
                        <Link to="/admin/orders" className="text-xs font-semibold text-amber-600 flex items-center gap-1 hover:gap-2 transition-all">
                            Ver Pedidos <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col pt-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={64} className="text-puro-pink" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Produtos Ativos</h3>
                    <p className="text-4xl font-headline font-bold text-puro-black">{stats.totalProducts}</p>
                    <div className="mt-6">
                        <Link to="/admin/products" className="text-xs font-semibold text-puro-pink flex items-center gap-1 hover:gap-2 transition-all">
                            Gerir Produtos <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col pt-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={64} className="text-red-500" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Estoque Baixo</h3>
                    <p className="text-4xl font-headline font-bold text-puro-black">{stats.lowStockVariants}</p>
                    <div className="mt-6">
                        <Link to="/admin/products" className="text-xs font-semibold text-red-600 flex items-center gap-1 hover:gap-2 transition-all">
                            Ajustar Estoque <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
