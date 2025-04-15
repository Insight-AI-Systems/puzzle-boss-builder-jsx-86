
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { ThemeProvider } from "@/contexts/theme";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import MainHeader from "@/components/header";
import { ROLES } from "@/utils/permissions";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiePolicy from "./pages/CookiePolicy";
import ContestRules from "./pages/ContestRules";
import Support from "./pages/Support";
import Partnerships from "./pages/Partnerships";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import ContentAdmin from "./pages/ContentAdmin";
import AuthDebug from "./pages/AuthDebug";
import AdminPuzzleConfig from "./pages/AdminPuzzleConfig";
import ErrorBoundary from "./components/ErrorBoundary";

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
  console.log("App component rendering with detailed logging");
  
  // Add additional error handling and debugging
  try {
    console.log("App: Setting up providers");
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <AuthProvider>
                <ErrorBoundary>
                  <ThemeProvider>
                    <ErrorBoundary>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <MainHeader />
                        <ErrorBoundary>
                          <Routes>
                            <Route path="/" element={
                              <ErrorBoundary>
                                <Index />
                              </ErrorBoundary>
                            } />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/cookie-policy" element={<CookiePolicy />} />
                            <Route path="/contest-rules" element={<ContestRules />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/partnerships" element={<Partnerships />} />
                            <Route path="/careers" element={<Careers />} />
                            <Route path="/press" element={<Press />} />
                            
                            {/* Protected routes that require authentication */}
                            <Route 
                              path="/profile" 
                              element={
                                <ProtectedRoute>
                                  <Profile />
                                </ProtectedRoute>
                              } 
                            />
                            
                            {/* Admin routes */}
                            <Route 
                              path="/admin" 
                              element={
                                <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                                  <AdminDashboard />
                                </RoleProtectedRoute>
                              }
                            />

                            <Route 
                              path="/admin/content" 
                              element={
                                <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                                  <ContentAdmin />
                                </RoleProtectedRoute>
                              }
                            />
                            
                            <Route 
                              path="/admin/puzzle-config" 
                              element={<AdminPuzzleConfig />}
                            />
                            
                            {/* Debug route */}
                            <Route path="/auth-debug" element={<AuthDebug />} />
                            
                            {/* Catch-all route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </ErrorBoundary>
                      </TooltipProvider>
                    </ErrorBoundary>
                  </ThemeProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Critical error in App component:", error);
    return (
      <div className="min-h-screen bg-puzzle-black text-white flex items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">App Initialization Error</h1>
          <p className="mb-4">{error.message || "Unknown error occurred"}</p>
          <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-48 text-left">
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
};

export default App;
