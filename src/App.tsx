
import * as React from 'react';
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InitialTestRunner from "@/components/InitialTestRunner";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Lazy load components for code splitting
const Auth = lazy(() => import('./pages/Auth'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Membership = lazy(() => import('./pages/Membership'));
const AccountDashboard = lazy(() => import('./pages/AccountDashboard'));
const Puzzles = lazy(() => import('./pages/Puzzles'));
const PuzzleDemo = lazy(() => import('./pages/PuzzleDemo'));
const Prizes = lazy(() => import('./pages/Prizes'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Settings = lazy(() => import('./pages/Settings'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const ContestRules = lazy(() => import('./pages/legal/ContestRules'));
const Support = lazy(() => import('./pages/Support'));
const Partnerships = lazy(() => import('./pages/Partnerships'));
const Careers = lazy(() => import('./pages/Careers'));
const Press = lazy(() => import('./pages/Press'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));

// Lazy load guide pages
const GettingStartedGuide = lazy(() => import('./pages/guides/GettingStartedGuide'));
const PuzzleTechniques = lazy(() => import('./pages/guides/PuzzleTechniques'));
const PrizeClaimProcess = lazy(() => import('./pages/guides/PrizeClaimProcess'));
const AccountManagement = lazy(() => import('./pages/guides/AccountManagement'));

// Create a new QueryClient instance at the module level to avoid recreation on renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <InitialTestRunner />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/dev-dashboard" element={<DevDashboard />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/account" element={<AccountDashboard />} />
              <Route path="/puzzles" element={<Puzzles />} />
              <Route path="/prizes" element={<Prizes />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/puzzle-demo" element={<PuzzleDemo />} />
              
              {/* New Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Legal Pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contest-rules" element={<ContestRules />} />
              
              {/* Support & Company Pages */}
              <Route path="/support" element={<Support />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              
              {/* Guide Pages */}
              <Route path="/guides/getting-started-guide" element={<GettingStartedGuide />} />
              <Route path="/guides/puzzle-techniques" element={<PuzzleTechniques />} />
              <Route path="/guides/prize-claim-process" element={<PrizeClaimProcess />} />
              <Route path="/guides/account-management" element={<AccountManagement />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
