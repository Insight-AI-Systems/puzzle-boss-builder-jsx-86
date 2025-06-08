
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { MainLayout } from '@/components/MainLayout';
import HomePage from '@/pages/HomePage';
import AccountDashboard from '@/pages/AccountDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Auth from '@/pages/Auth';
import Categories from '@/pages/Categories';
import CategoryPuzzles from '@/pages/CategoryPuzzles';
import Puzzles from '@/pages/Puzzles';
import Leaderboard from '@/pages/Leaderboard';
import PrizesWon from '@/pages/PrizesWon';
import HowItWorks from '@/pages/HowItWorks';
import WordSearchGamePage from '@/pages/games/WordSearchGamePage';
import SudokuGamePage from '@/pages/games/SudokuGamePage';
import MemoryGamePage from '@/pages/games/MemoryGamePage';
import TriviaGamePage from '@/pages/games/TriviaGamePage';
import BlocksGamePage from '@/pages/games/BlocksGamePage';
import CrosswordGamePage from '@/pages/games/CrosswordGamePage';
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
        <Route path="/category/:categoryId" element={<CategoryPuzzles />} />
        <Route path="/puzzles" element={<Puzzles />} />
        <Route path="/puzzle/:puzzleId" element={<div>Individual Puzzle Page - Coming Soon</div>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/prizes-won" element={<PrizesWon />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/puzzles/word-search" element={<WordSearchGamePage />} />
        <Route path="/puzzles/sudoku" element={<SudokuGamePage />} />
        <Route path="/puzzles/memory" element={<MemoryGamePage />} />
        <Route path="/puzzles/trivia" element={<TriviaGamePage />} />
        <Route path="/puzzles/blocks" element={<BlocksGamePage />} />
        <Route path="/puzzles/crossword" element={<CrosswordGamePage />} />
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
        <Route 
          path="/admin-dashboard" 
          element={
            <ClerkProtectedRoute requiredRoles={['admin', 'super_admin', 'category_manager', 'partner_manager', 'cfo']}>
              <AdminDashboard />
            </ClerkProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard/finance" 
          element={
            <ClerkProtectedRoute requiredRoles={['admin', 'super_admin', 'cfo']}>
              <AdminDashboard />
            </ClerkProtectedRoute>
          } 
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
