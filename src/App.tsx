
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import {
  Index,
  Puzzles,
  Prizes,
  HowItWorks,
  PuzzleDemo,
  Membership,
  About,
  FAQ,
  Contact,
  Support,
  Profile,
  Settings,
  AccountDashboard,
  Progress,
  AdminDashboard,
  DevDashboard,
  PuzzleTests,
  GettingStartedGuide,
  AccountManagement,
  PuzzleTechniques,
  PrizeClaimProcess,
  Terms,
  Privacy,
  ContestRules,
  CookiePolicy,
  Careers,
  Press,
  Partnerships,
  NotFound,
  Auth
} from '@/pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/components/layouts/MainLayout';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="puzzleboss-theme">
          <Routes>
            <Route 
              path="/*" 
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/puzzles" element={<Puzzles />} />
                    <Route path="/prizes" element={<Prizes />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/puzzle-demo" element={<PuzzleDemo />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/account" element={<AccountDashboard />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/test-dashboard" element={<DevDashboard />} />
                    <Route path="/puzzle-tests" element={<PuzzleTests />} />
                    
                    {/* Guides */}
                    <Route path="/guides">
                      <Route path="getting-started-guide" element={<GettingStartedGuide />} />
                      <Route path="account-management" element={<AccountManagement />} />
                      <Route path="puzzle-techniques" element={<PuzzleTechniques />} />
                      <Route path="prize-claim-process" element={<PrizeClaimProcess />} />
                    </Route>
                    
                    {/* Legal pages */}
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/contest-rules" element={<ContestRules />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    
                    {/* Additional pages */}
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/press" element={<Press />} />
                    <Route path="/partnerships" element={<Partnerships />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              } 
            />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
