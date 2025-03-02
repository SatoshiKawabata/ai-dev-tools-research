import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, loading, getUser } = useAuthStore();
  
  useEffect(() => {
    getUser();
  }, [getUser]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" replace /> : <Auth />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;