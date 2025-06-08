
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/MainLayout';
import Home from '@/pages/Home';
import Account from '@/pages/Account';
import AdminPage from '@/pages/AdminPage';
import AuthPage from '@/pages/AuthPage';
import WordSearchGamePage from '@/pages/games/WordSearchGamePage';
import SupportPage from '@/pages/SupportPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import './App.css';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/puzzles/word-search" element={<WordSearchGamePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
