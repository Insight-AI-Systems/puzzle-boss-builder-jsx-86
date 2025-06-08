
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Index, 
  Auth, 
  Categories,
  CategoryPuzzles,
  Prizes, 
  Partnerships,
  Contact,
  Terms,
  Privacy,
  CFODashboard
} from '@/pages';
import { 
  MemoryGame,
  WordSearchGamePage,
  SudokuGamePage,
  TriviaGamePage,
  BlockPuzzlePro,
  DailyCrossword
} from '@/pages/games';
import { 
  AdminLayout
} from '@/components';
import InitialTestRunner from '@/components/InitialTestRunner';
import GameTesting from '@/pages/GameTesting';
import PuzzleTests from '@/pages/PuzzleTests';
import SudokuTesting from '@/pages/SudokuTesting';
import MemoryGameTesting from '@/pages/MemoryGameTesting';
import GameTestingDashboardPage from '@/pages/GameTestingDashboard';

function App() {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Route changed:', location.pathname);
  }, [location]);

  return (
    <>
        <InitialTestRunner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categorySlug" element={<CategoryPuzzles />} />
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
          <Route path="/cfo" element={<CFODashboard />} />
        </Routes>
      <Toaster />
    </>
  );
}

export default App;
