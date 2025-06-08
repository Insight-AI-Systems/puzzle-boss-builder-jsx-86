
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ClerkProvider } from '@clerk/clerk-react';
import { GameProvider } from '@/shared/contexts/GameContext';
import { Toaster } from '@/components/ui/toaster';
import App from './App.tsx';
import './index.css';

// Use your actual Clerk publishable key
const clerkPublishableKey = 'pk_test_ZmFjdHVhbC1kYW5lLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ';

console.log('Clerk publishable key:', clerkPublishableKey ? 'Found' : 'Missing');

if (!clerkPublishableKey) {
  console.error('Clerk publishable key is missing.');
  throw new Error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.');
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

class ErrorFallback extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-lg text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorFallback>
      <ClerkProvider 
        publishableKey={clerkPublishableKey}
        appearance={{
          elements: {
            formButtonPrimary: 'bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black',
            card: 'bg-puzzle-gray border border-puzzle-border',
            headerTitle: 'text-puzzle-white',
            headerSubtitle: 'text-puzzle-white/70',
            socialButtonsBlockButton: 'border-puzzle-border hover:bg-puzzle-gray/50',
            formFieldInput: 'bg-puzzle-black border-puzzle-border text-puzzle-white',
            footerActionLink: 'text-puzzle-aqua hover:text-puzzle-aqua/80',
          },
          layout: {
            socialButtonsPlacement: 'top',
            showOptionalFields: false,
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <GameProvider>
            <BrowserRouter>
              <Toaster />
              <App />
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </BrowserRouter>
          </GameProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorFallback>
  </React.StrictMode>
);
