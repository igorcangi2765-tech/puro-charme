import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { initialize, user, isAdmin } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && isAdmin) {
            navigate('/admin');
        }
    }, [user, isAdmin, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Initialize store to fetch profile
            await initialize();

            // Check if successful login corresponds to an admin account
            const state = useAuthStore.getState();
            if (!state.isAdmin) {
                // Not an admin, sign out immediately and clear state to avoid being semi-logged in
                await supabase.auth.signOut();
                await initialize();
                throw new Error('Acesso negado: Este e-mail não tem credenciais de administrador.');
            }

            // Success: Navigate to the admin portal
            navigate('/admin');

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro durante o login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-body px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <img src="/assets/img/logo-pink.png" alt="Puro Charme" className="h-12 mx-auto mb-6" />
                    <h2 className="text-2xl font-headline font-bold text-puro-black">Admin Portal</h2>
                    <p className="text-sm text-gray-500 mt-2 tracking-wide">Enter your credentials to manage the platform</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-headline font-bold tracking-widest uppercase transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-puro-pink hover:bg-puro-pastelPink shadow-lg shadow-puro-pink/30'
                            }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
