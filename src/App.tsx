
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth';
import { SecurityProvider } from '@/hooks/useSecurityContext';
import { ThemeProvider } from '@/components/theme-provider';
// Create a simple AppRoutes component until we have proper routes
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages';

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

// Simple AppRoutes component until we have proper routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <SecurityProvider>
              <AppRoutes />
              <Toaster />
            </SecurityProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
