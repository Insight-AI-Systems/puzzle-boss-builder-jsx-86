import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CFODashboard from "@/pages/CFODashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Auth from "@/pages/Auth";
import FinancialErrorBoundary from "@/components/finance/FinancialErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SecurityProvider } from "@/hooks/useSecurityContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy-loaded components
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const PuzzlePlay = lazy(() => import("@/pages/PuzzlePlay"));
const PuzzleCreate = lazy(() => import("@/pages/PuzzleCreate"));
const PuzzleEdit = lazy(() => import("@/pages/PuzzleEdit"));
const PuzzleList = lazy(() => import("@/pages/PuzzleList"));
const CategoryManagement = lazy(() => import("@/pages/CategoryManagement"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const SupportAdmin = lazy(() => import("@/pages/SupportAdmin"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/legal/TermsOfService"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="puzzle-boss-theme">
        <AuthProvider>
          <SecurityProvider>
            <Router>
              <Suspense
                fallback={
                  <div className="flex h-screen w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/puzzles"
                    element={
                      <ProtectedRoute>
                        <PuzzleList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/puzzles/play/:id"
                    element={
                      <ProtectedRoute>
                        <PuzzlePlay />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/puzzles/create"
                    element={
                      <ProtectedRoute requiredRoles={["category_manager", "admin"]}>
                        <PuzzleCreate />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/puzzles/edit/:id"
                    element={
                      <ProtectedRoute requiredRoles={["category_manager", "admin"]}>
                        <PuzzleEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      <ProtectedRoute requiredRoles={["category_manager", "admin"]}>
                        <CategoryManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard/*"
                    element={
                      <ProtectedRoute requiredRoles={["super_admin", "admin", "category_manager", "social_media_manager", "partner_manager", "cfo"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/cfo-dashboard/*" 
                    element={
                      <FinancialErrorBoundary>
                        <CFODashboard />
                      </FinancialErrorBoundary>
                    } 
                  />
                  <Route
                    path="/support-admin/*"
                    element={
                      <ProtectedRoute requiredRoles={["super_admin", "admin"]}>
                        <SupportAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
            <Toaster />
          </SecurityProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
