
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { ROLES } from "@/utils/permissions";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AuthDebug from "./pages/AuthDebug";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public routes that don't require authentication */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Protected routes - temporarily disabling strict protection for development */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/auth-debug" element={<AuthDebug />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
