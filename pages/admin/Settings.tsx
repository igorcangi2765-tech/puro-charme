import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Globe } from 'lucide-react';

interface WebsiteInfo {
    id: string;
    key: string;
    value: any;
}

const Settings: React.FC = () => {
    const [info, setInfo] = useState<WebsiteInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states based on expected keys
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('website_info')
                .select('*');

            if (error) throw error;

            if (data) {
                setInfo(data);
                // Pre-fill form
                data.forEach(item => {
                    switch (item.key) {
                        case 'contact_phone': setContactPhone(item.value); break;
                        case 'contact_email': setContactEmail(item.value); break;
                        case 'instagram_url': setInstagramUrl(item.value); break;
                        case 'address': setAddress(item.value); break;
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching website info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const updates = [
            { key: 'contact_phone', value: contactPhone },
            { key: 'contact_email', value: contactEmail },
            { key: 'instagram_url', value: instagramUrl },
            { key: 'address', value: address },
        ];

        try {
            for (const item of updates) {
                // Upsert logic (need to check if exists first to get ID for update, or just match by key if unique)
                // Since key is unique we can use an RPC or just delete/insert. 
                // For simplicity, let's fetch matching record ID first.
                const existingInfo = info.find(i => i.key === item.key);

                if (existingInfo) {
                    await supabase
                        .from('website_info')
                        .update({ value: item.value, updated_at: new Date().toISOString() })
                        .eq('id', existingInfo.id);
                } else {
                    await supabase
                        .from('website_info')
                        .insert({ key: item.key, value: item.value });
                }
            }

            alert('Configurações salvas com sucesso!');
            fetchInfo(); // Refresh state
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar as configurações.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex justify-center text-puro-pink">
                <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="font-body space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-headline font-bold text-puro-black">Configurações do Site</h2>
                    <p className="text-gray-500 text-sm mt-1">Gerencie as informações de contato e links exibidos no frontend.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold text-puro-black text-lg">Informações Gerais</h3>
                        <p className="text-xs text-gray-400">Estes dados aparecem no Rodapé e na seção de Contato.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Telefone / WhatsApp</label>
                            <input
                                type="text"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="+258 84 892 0837"
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pink focus:ring-1 focus:ring-puro-pink transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">E-mail de Contato</label>
                            <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="info@pcharme.niassa.site"
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pink focus:ring-1 focus:ring-puro-pink transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Link do Instagram</label>
                        <input
                            type="url"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="https://instagram.com/purocharme20229"
                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pink focus:ring-1 focus:ring-puro-pink transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Endereço Físico</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            placeholder="Cuamba, Niassa, Moçambique"
                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pink focus:ring-1 focus:ring-puro-pink transition-all outline-none resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-8 py-3 rounded-xl text-white font-headline font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-puro-black hover:bg-gray-800 shadow-lg shadow-black/10'
                                }`}
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
