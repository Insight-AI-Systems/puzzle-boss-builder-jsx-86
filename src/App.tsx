
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from '@/contexts/AuthContext';
import { GameProvider } from '@/shared/contexts/GameContext';

// Import layouts and components
import MainLayout from '@/components/MainLayout';
import { ClerkProtectedRoute } from '@/components/auth/ClerkProtectedRoute';

// Import pages
import HomePage from '@/pages/HomePage';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
// Puzzles page removed - CodeCanyon system will be added
// PuzzlePlay removed - using new puzzle system
import Leaderboard from '@/pages/Leaderboard';
import PrizesWon from '@/pages/PrizesWon';
import HowItWorks from '@/pages/HowItWorks';
import Categories from '@/pages/Categories';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Terms from '@/pages/legal/Terms';
import Privacy from '@/pages/legal/Privacy';
import AdminDashboard from '@/pages/AdminDashboard';
import Auth from '@/pages/Auth';

// Import game pages
import { 
  MemoryGame, 
  WordSearchGamePage, 
  SudokuGamePage, 
  TriviaGamePage, 
  BlockPuzzlePro, 
  DailyCrossword, 
  MahjongGamePage,
} from '@/pages/games';

// Import jigsaw game
import JigsawGamePage from '@/pages/JigsawGamePage';

// Your Clerk publishable key
const PUBLISHABLE_KEY = "pk_test_ZmFjdHVhbC1kYW5lLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key - please add your key to src/App.tsx");
}

// Create single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen bg-puzzle-black">
        <Routes>
          {/* Public routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            {/* Puzzles route removed - CodeCanyon system will be added */}
            {/* Old puzzle route removed - using new puzzle system */}
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="prizes-won" element={<PrizesWon />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="categories" element={<Categories />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            
            {/* Game routes */}
            <Route path="games/memory" element={<MemoryGame />} />
            <Route path="games/word-search" element={<WordSearchGamePage />} />
            <Route path="games/sudoku" element={<SudokuGamePage />} />
            <Route path="games/trivia" element={<TriviaGamePage />} />
            <Route path="games/block-puzzle" element={<BlockPuzzlePro />} />
            <Route path="games/crossword" element={<DailyCrossword />} />
            <Route path="games/mahjong" element={<MahjongGamePage />} />
            <Route path="games/jigsaw" element={<JigsawGamePage />} />
            
            {/* Old puzzle session route removed - using new puzzle system */}
            
            {/* Protected user routes */}
            <Route path="account" element={
              <ClerkProtectedRoute>
                <Profile />
              </ClerkProtectedRoute>
            } />
            <Route path="settings" element={
              <ClerkProtectedRoute>
                <Settings />
              </ClerkProtectedRoute>
            } />
          </Route>

          {/* Auth route - outside MainLayout for full screen */}
          <Route path="auth" element={<Auth />} />

          {/* Protected admin routes */}
          <Route path="admin" element={
            <ClerkProtectedRoute requiredRoles={['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo']}>
              <AdminDashboard />
            </ClerkProtectedRoute>
          } />
          {/* Game testing route removed - using CodeCanyon Jigsaw Deluxe system only */}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function AppContent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="codecanyon-ui-theme">
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <AppRoutes />
          <Toaster />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </GameProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black',
          card: 'bg-puzzle-gray border border-puzzle-border',
          headerTitle: 'text-puzzle-white',
          headerSubtitle: 'text-puzzle-white/70',
          socialButtonsBlockButton: 'border-puzzle-border hover:bg-puzzle-gray/50',
          formFieldInput: 'bg-puzzle-black border-puzzle-border text-puzzle-white',
          footerActionLink: 'text-puzzle-aqua hover:text-puzzle-aqua/80',
        },
        layout: {
          socialButtonsPlacement: 'top',
          showOptionalFields: false,
        },
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;
