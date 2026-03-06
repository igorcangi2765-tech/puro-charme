import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainSite from './pages/MainSite';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import { useAuthStore } from './store/authStore';

import Bookings from './pages/admin/Bookings';
import CalendarView from './pages/admin/CalendarView';
import Staff from './pages/admin/Staff';
import Customers from './pages/admin/Customers';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isManager, isStaff, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || (!isManager && !isStaff)) {
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
          <Route path="bookings" element={<Bookings />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="customers" element={<Customers />} />
          <Route path="staff" element={<Staff />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;