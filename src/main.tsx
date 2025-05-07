
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { EnhancedAuthProvider } from './contexts/EnhancedAuthContext';
import { AuthProvider } from './contexts/AuthContext';  // Keep for backward compatibility
import { SecurityProvider } from './hooks/useSecurityContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { startSessionRefresher, stopSessionRefresher } from './utils/auth/sessionRefresher';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

// Root component to handle app-level side effects
function Root() {
  // Start and stop the session refresher
  useEffect(() => {
    startSessionRefresher();
    return () => stopSessionRefresher();
  }, []);
  
  return (
    <App />
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <EnhancedAuthProvider>
        <AuthProvider>
          <SecurityProvider>
            <Root />
          </SecurityProvider>
        </AuthProvider>
      </EnhancedAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
