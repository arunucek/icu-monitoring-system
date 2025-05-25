
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';
import Patients from '@/views/Patients';
import Monitoring from '@/views/Monitoring';
import MLModels from '@/views/MLModels';
import Analytics from '@/views/Analytics';
import DataSources from '@/views/DataSources';
import Reports from '@/views/Reports';
import Integrations from '@/views/Integrations';
import Settings from '@/views/Settings';
import Notifications from '@/views/Notifications';
import Chatbot from '@/components/chat/Chatbot';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedPatientData');
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginForm onLogin={handleLogin} />
        } />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={null} /> {/* This will render the Dashboard's home content */}
          <Route path="dashboard" element={null} /> {/* Also renders Dashboard's home content */}
          <Route path="patients" element={<Patients />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="ml-models" element={<MLModels />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="data-sources" element={<DataSources />} />
          <Route path="reports" element={<Reports />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && <Chatbot />}
      <Toaster />
    </Router>
  );
};

export default App;
