
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AppModeProvider } from '@/contexts/app-mode';
import { useAppMode } from '@/contexts/app-mode';
import MinimalApp from './MinimalApp';
import SimpleHome from './pages/simple/Home';
import SimpleAbout from './pages/simple/About';
import Auth from './pages/Auth';
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
    <Routes>
      <Route path="/" element={<SimpleHome />} />
      <Route path="/about" element={<SimpleAbout />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

const App = () => {
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
