
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
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';

// Remove the automatic admin setup import that was causing issues
// import '@/utils/admin/executeAdminSetup';

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
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin-dashboard" element={<AdminLayout />} />
                <Route path="/admin/*" element={<AdminLayout />} />
                <Route path="/" element={
                  <MainLayout>
                    <Index />
                  </MainLayout>
                } />
                <Route path="/*" element={<MainLayout />} />
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
