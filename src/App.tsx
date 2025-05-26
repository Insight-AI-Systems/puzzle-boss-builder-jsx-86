
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SecurityProvider } from '@/hooks/useSecurityContext';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import AppRoutes from '@/routes';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <SecurityProvider>
              <div className="min-h-screen bg-puzzle-black text-puzzle-white">
                <Navbar />
                <AppRoutes />
                <Toaster />
              </div>
            </SecurityProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
