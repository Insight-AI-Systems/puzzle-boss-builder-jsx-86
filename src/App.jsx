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

// Configure the Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { 
      retry: 1, 
      refetchOnWindowFocus: false 
    }
  }
});

// AppRouter component that respects the app mode
const AppRouter = () => {
  const { isMinimal } = useAppMode();

  // Render minimal app if in minimal mode
  if (isMinimal) {
    return <MinimalApp />;
  }

  // Otherwise render the regular app routes
  return (
    <Routes>
      <Route path="/" element={<SimpleHome />} />
      <Route path="/about" element={<SimpleAbout />} />
      <Route path="/auth" element={<SimpleAuth />} />
    </Routes>
  );
};

// Main App component with proper provider hierarchy
const App = () => {
  // Handle standalone mode from URL
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  // If in standalone mode, render StandaloneApp directly
  if (isStandalone) {
    return <MinimalApp isStandalone={true} />;
  }

  // Otherwise render the full app with proper provider hierarchy
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppModeProvider>
            <SimpleAuthProvider>
              {/* Toast notifications */}
              <Toaster />
              <Sonner />
              {/* Main app content */}
              <AppRouter />
            </SimpleAuthProvider>
          </AppModeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
