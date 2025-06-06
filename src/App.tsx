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
import PuzzleGame from "./pages/PuzzleGame";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import PuzzleEnginePlayground from "./pages/PuzzleEnginePlayground";
import Support from "./pages/Support";
import Partnerships from "./pages/Partnerships";
import { DevelopmentDashboard } from "@/components/DevelopmentDashboard";

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
        <Route path="/puzzle/:id" element={<PuzzleGame />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/playground" element={<PuzzleEnginePlayground />} />
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
