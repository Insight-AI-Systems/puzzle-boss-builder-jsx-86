
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  Auth,
  BetaNotes,
  KnownIssues
} from '@/pages';
import PuzzleTestPlayground from '@/pages/PuzzleTestPlayground';
import Unauthorized from '@/pages/Unauthorized';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import '@/utils/admin/adminTools';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="puzzleboss-theme">
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
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
                      <Route path="/membership" element={
                        <ProtectedRoute>
                          <Membership />
                        </ProtectedRoute>
                      } />
                      <Route path="/about" element={<About />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/contact" element={<Contact />} />
                      
                      {/* Support routes */}
                      <Route path="/support/*" element={<Support />} />
                      
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } />
                      <Route path="/account" element={
                        <ProtectedRoute>
                          <AccountDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/progress" element={
                        <ProtectedRoute>
                          <Progress />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin-dashboard" element={
                        <ProtectedRoute requiredRoles={['super_admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/test-dashboard" element={
                        <ProtectedRoute requiredRoles={['super_admin']}>
                          <DevDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/puzzle-tests" element={
                        <ProtectedRoute requiredRoles={['super_admin']}>
                          <PuzzleTests />
                        </ProtectedRoute>
                      } />
                      <Route path="/puzzle-playground" element={
                        <ProtectedRoute requiredRoles={['super_admin']}>
                          <PuzzleTestPlayground />
                        </ProtectedRoute>
                      } />
                      
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
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      <Route path="/beta-notes" element={
                        <ProtectedRoute>
                          <BetaNotes />
                        </ProtectedRoute>
                      } />
                      
                      {/* Known Issues page */}
                      <Route path="/known-issues" element={<KnownIssues />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                } 
              />
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
