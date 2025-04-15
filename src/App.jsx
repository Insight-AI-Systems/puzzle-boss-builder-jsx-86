import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AppModeProvider, useAppMode } from '@/contexts/app-mode';
import { SimpleAuthProvider } from '@/contexts/simple-auth';
import MinimalApp from './MinimalApp';
import SimpleHome from './pages/simple/Home';
import SimpleAbout from './pages/simple/About';
import SimpleAuth from './pages/simple/Auth';
import ErrorBoundary from './components/ErrorBoundary';

// QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  }
});

// Router wrapper that checks for minimal mode
const AppRouter = () => {
  const { isMinimal } = useAppMode();

  if (isMinimal) {
    return <MinimalApp />;
  }

  return (
    <SimpleAuthProvider>
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="/about" element={<SimpleAbout />} />
        <Route path="/auth" element={<SimpleAuth />} />
      </Routes>
    </SimpleAuthProvider>
  );
};

const App = () => {
  // Check for standalone mode from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  // In standalone mode, render MinimalApp directly without contexts
  if (isStandalone) {
    return <MinimalApp isStandalone={true} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <AppModeProvider>
              <ErrorBoundary>
                <Toaster />
                <Sonner />
                <AppRouter />
              </ErrorBoundary>
            </AppModeProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
