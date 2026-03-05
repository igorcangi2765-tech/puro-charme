import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, ShoppingBag, ClipboardList, Settings, LogOut, Store } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const { profile, signOut } = useAuthStore();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Orders (WhatsApp)', path: '/admin/orders', icon: ClipboardList },
        { name: 'Website Config', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-body">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-puro-pink flex items-center justify-center shadow-lg shadow-puro-pink/30 group-hover:scale-110 transition-transform">
                            <Store size={18} className="text-white" />
                        </div>
                        <span className="font-headline font-bold text-puro-black">Puro Charme</span>
                    </Link>
                </div>

                <div className="p-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                            ? 'bg-puro-softPink text-puro-pink'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-puro-black'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <div className="mb-4 px-4">
                        <p className="text-sm font-semibold text-puro-black truncate">{profile?.full_name || 'Admin User'}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 sticky top-0 z-10">
                    <h1 className="font-headline font-semibold text-puro-black">
                        {navItems.find(i => i.path === location.pathname)?.name || 'Admin Portal'}
                    </h1>
                </header>
                <div className="p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
