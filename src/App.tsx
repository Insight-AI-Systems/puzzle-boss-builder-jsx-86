import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';
import { 
  Index, 
  Auth, 
  ResetPassword, 
  Dashboard, 
  Account, 
  Contact, 
  Terms, 
  Privacy, 
  Prizes, 
  Partnerships,
  Categories,
  CategoryPuzzles,
  PuzzleDetail,
  DailyPuzzle,
  ClassicPuzzles,
  DevelopmentDashboard,
  CFODashboard
} from '@/pages';
import { 
  MemoryGame,
  WordSearchGamePage,
  SudokuGamePage,
  TriviaGamePage,
  BlockPuzzlePro,
  DailyCrossword
} from '@/pages';
import { 
  AdminLayout
} from '@/components/layouts';
import InitialTestRunner from '@/components/InitialTestRunner';
import GameTesting from '@/pages/GameTesting';
import PuzzleTests from '@/pages/PuzzleTests';
import SudokuTesting from '@/pages/SudokuTesting';
import MemoryGameTesting from '@/pages/MemoryGameTesting';
import GameTestingDashboardPage from '@/pages/GameTestingDashboard';

function App() {
  const { toast } = useToast();
  const { checkAuthentication } = useAuth();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const user = await checkAuthentication();
        if (user) {
          dispatch(setUser(user));
          console.log('Authentication successful');
        } else {
          console.log('No user authenticated');
        }
      } catch (error: any) {
        console.error('Authentication error:', error);
        toast({
          title: 'Authentication Error',
          description: error.message || 'Failed to authenticate user.',
          variant: 'destructive',
        });
      }
    };

    authenticate();
  }, [checkAuthentication, dispatch, toast]);

  // Prevent route caching on specific routes
  useEffect(() => {
    // You can add specific logic here if needed when the location changes
    console.log('Route changed:', location.pathname);
  }, [location]);

  return (
    <>
        <InitialTestRunner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categorySlug" element={<CategoryPuzzles />} />
          <Route path="/puzzles/:puzzleId" element={<PuzzleDetail />} />
          <Route path="/puzzles/daily" element={<DailyPuzzle />} />
          <Route path="/puzzles/classic/:categorySlug" element={<ClassicPuzzles />} />
          <Route path="/puzzles/memory-game" element={<MemoryGame />} />
          <Route path="/puzzles/word-search" element={<WordSearchGamePage />} />
          <Route path="/puzzles/sudoku" element={<SudokuGamePage />} />
          <Route path="/puzzles/trivia" element={<TriviaGamePage />} />
          <Route path="/puzzles/block-puzzle" element={<BlockPuzzlePro />} />
          <Route path="/puzzles/blocks" element={<BlockPuzzlePro />} />
          <Route path="/puzzles/crossword" element={<DailyCrossword />} />
          
          {/* Testing Routes */}
          <Route path="/testing/games" element={<GameTesting />} />
          <Route path="/testing/puzzles" element={<PuzzleTests />} />
          <Route path="/testing/sudoku" element={<SudokuTesting />} />
          <Route path="/testing/memory" element={<MemoryGameTesting />} />
          <Route path="/testing/dashboard" element={<GameTestingDashboardPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/dev-dashboard" element={<DevelopmentDashboard />} />
          <Route path="/cfo" element={<CFODashboard />} />
        </Routes>
      <Toaster />
    </>
  );
}

export default App;
