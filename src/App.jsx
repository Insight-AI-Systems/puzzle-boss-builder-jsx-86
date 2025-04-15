
import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AppModeProvider } from '@/contexts/app-mode';
import { AuthProvider } from '@/contexts/auth';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppRouter from '@/components/AppRouter';
import StandaloneModeHandler from '@/components/StandaloneModeHandler';
import { queryClient } from '@/config/queryClient';
import Loading from '@/components/ui/loading';

/**
 * Main application component with properly structured provider hierarchy
 */
const App = () => {
  // Check for standalone mode first
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  // If in standalone mode, return the standalone app
  if (isStandalone) {
    return <StandaloneModeHandler />;
  }

  // Otherwise render the full app with proper provider hierarchy
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppModeProvider>
            <AuthProvider>
              {/* Toast notifications */}
              <Toaster />
              <Sonner />
              
              {/* Main app content */}
              <Suspense fallback={<Loading color="aqua" message="Loading application..." />}>
                <AppRouter />
              </Suspense>
            </AuthProvider>
          </AppModeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
