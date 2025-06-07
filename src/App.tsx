
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { FinancialDataProvider } from "@/contexts/FinancialDataContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import PuzzlePlay from "./pages/PuzzlePlay";
import Puzzles from "./pages/Puzzles";
import Categories from "./pages/Categories";
import CategoryPuzzles from "./pages/CategoryPuzzles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Partnerships from "./pages/Partnerships";
import WordSearchArena from "./pages/WordSearchArena";
import SpeedSudoku from "./pages/SpeedSudoku";
import MemoryMaster from "./pages/MemoryMaster";
import DevelopmentDashboard from "@/components/DevelopmentDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  // Activity tracker to keep users showing as online
  useActivityTracker();
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/puzzle/:puzzleId" element={<PuzzlePlay />} />
        <Route path="/puzzles" element={<Puzzles />} />
        <Route path="/puzzles/word-search" element={<WordSearchArena />} />
        <Route path="/puzzles/sudoku" element={<SpeedSudoku />} />
        <Route path="/puzzles/memory" element={<MemoryMaster />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryId" element={<CategoryPuzzles />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/development" element={<DevelopmentDashboard />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <FinancialDataProvider>
              <AppContent />
              <Toaster />
              <Sonner />
            </FinancialDataProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
