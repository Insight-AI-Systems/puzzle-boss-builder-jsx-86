
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { MainLayout } from '@/components/MainLayout';
import HomePage from '@/pages/HomePage';
import AccountDashboard from '@/pages/AccountDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Auth from '@/pages/Auth';
import Categories from '@/pages/Categories';
import WordSearchGamePage from '@/pages/games/WordSearchGamePage';
import SupportPage from '@/pages/SupportPage';
import { ClerkProtectedRoute } from '@/components/auth/ClerkProtectedRoute';
import './App.css';

function App() {
  const { isLoading } = useClerkAuth();

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
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/puzzles/word-search" element={<WordSearchGamePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route 
          path="/account" 
          element={
            <ClerkProtectedRoute>
              <AccountDashboard />
            </ClerkProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ClerkProtectedRoute requiredRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ClerkProtectedRoute>
          } 
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
