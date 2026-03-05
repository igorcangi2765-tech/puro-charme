import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Edit2, Trash2, PackageSearch } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    type: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    base_price: number;
    is_active: boolean;
    category_id: string | null;
    categories?: { name: string } | null;
    variants_count?: number;
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch categories
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (catError) throw catError;
            if (catData) setCategories(catData);

            // Fetch products with their categories
            const { data: prodData, error: prodError } = await supabase
                .from('products')
                .select(`
          *,
          categories:category_id (name)
        `)
                .order('created_at', { ascending: false });

            if (prodError) throw prodError;

            // Enhance products with variants count
            if (prodData) {
                const enrichedProducts = await Promise.all(
                    prodData.map(async (p) => {
                        const { count } = await supabase
                            .from('product_variants')
                            .select('*', { count: 'exact', head: true })
                            .eq('product_id', p.id);
                        return {
                            ...p,
                            variants_count: count || 0
                        };
                    })
                );
                setProducts(enrichedProducts);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="font-body space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-headline font-bold text-puro-black">Produtos & Inventário</h2>
                    <p className="text-gray-500 text-sm mt-1">Gerencie seu catálogo, preços e estoque por variante.</p>
                </div>
                <button className="bg-puro-pink text-white px-5 py-2.5 rounded-xl font-headline font-bold text-xs uppercase tracking-widest hover:bg-puro-pastelPink shadow-lg shadow-puro-pink/30 transition-all flex items-center gap-2">
                    <Plus size={16} />
                    Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4 items-center bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-puro-pink focus:ring-1 focus:ring-puro-pink outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 pl-12 flex justify-center text-puro-pink">
                            <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <PackageSearch size={48} className="text-gray-200 mb-4" strokeWidth={1} />
                            <p className="text-gray-500 font-medium">Nenhum produto encontrado.</p>
                            <p className="text-gray-400 text-sm mt-1">Comece adicionando o primeiro item ao catálogo.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-white border-b border-gray-100 font-headline text-xs uppercase tracking-wider text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Produto</th>
                                    <th className="px-6 py-4 font-semibold">Categoria</th>
                                    <th className="px-6 py-4 font-semibold">Preço Base</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-center">Variantes</th>
                                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-puro-black">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                                {product.categories?.name || 'Sem Categoria'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(product.base_price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {product.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-semibold text-puro-black bg-gray-100 rounded-md px-2 py-1">{product.variants_count}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-puro-pink bg-white hover:bg-puro-softPink rounded-lg border border-transparent hover:border-puro-pink/20 transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all">
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
            </div>
        </div>
    );
};

export default Products;
