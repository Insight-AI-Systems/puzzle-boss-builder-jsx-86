
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/MainLayout';
import AdminLayout from '@/components/AdminLayout';
import { PageDebugger } from '@/components/debug/PageDebugger';

// Import all pages
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Puzzles from '@/pages/Puzzles';
import PuzzleDemo from '@/pages/PuzzleDemo';
import PuzzlePlay from '@/pages/PuzzlePlay';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Support from '@/pages/Support';
import FAQ from '@/pages/FAQ';
import Membership from '@/pages/Membership';
import HowItWorks from '@/pages/HowItWorks';
import Prizes from '@/pages/Prizes';
import AccountDashboard from '@/pages/AccountDashboard';
import Progress from '@/pages/Progress';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import Terms from '@/pages/legal/Terms';
import Privacy from '@/pages/legal/Privacy';
import ContestRules from '@/pages/legal/ContestRules';
import CookiePolicy from '@/pages/legal/CookiePolicy';
import GettingStartedGuide from '@/pages/guides/GettingStartedGuide';
import AccountManagement from '@/pages/guides/AccountManagement';
import PuzzleTechniques from '@/pages/guides/PuzzleTechniques';
import PrizeClaimProcess from '@/pages/guides/PrizeClaimProcess';
import Careers from '@/pages/Careers';
import Press from '@/pages/Press';
import Partnerships from '@/pages/Partnerships';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-puzzle-black">
            <Suspense fallback={<div className="min-h-screen bg-puzzle-black flex items-center justify-center text-white">Loading...</div>}>
              <Routes>
                {/* Auth Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<AdminLayout />} />
                <Route path="/admin/*" element={<AdminLayout />} />
                
                {/* Main App Routes with Layout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Index />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="puzzles" element={<Puzzles />} />
                  <Route path="puzzle/:puzzleId" element={<PuzzlePlay />} />
                  <Route path="puzzle-demo" element={<PuzzleDemo />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="support" element={<Support />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="membership" element={<Membership />} />
                  <Route path="how-it-works" element={<HowItWorks />} />
                  <Route path="prizes" element={<Prizes />} />
                  <Route path="account-dashboard" element={<AccountDashboard />} />
                  <Route path="progress" element={<Progress />} />
                  
                  {/* Legal Pages */}
                  <Route path="terms" element={<Terms />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="contest-rules" element={<ContestRules />} />
                  <Route path="cookie-policy" element={<CookiePolicy />} />
                  
                  {/* Guide Pages */}
                  <Route path="guides/getting-started" element={<GettingStartedGuide />} />
                  <Route path="guides/account-management" element={<AccountManagement />} />
                  <Route path="guides/puzzle-techniques" element={<PuzzleTechniques />} />
                  <Route path="guides/prize-claim-process" element={<PrizeClaimProcess />} />
                  
                  {/* Company Pages */}
                  <Route path="careers" element={<Careers />} />
                  <Route path="press" element={<Press />} />
                  <Route path="partnerships" element={<Partnerships />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
            <PageDebugger componentName="App" />
          </div>
          <Toaster />
          <Sonner />
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
