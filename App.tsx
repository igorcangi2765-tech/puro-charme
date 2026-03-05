import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainSite from './pages/MainSite';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;