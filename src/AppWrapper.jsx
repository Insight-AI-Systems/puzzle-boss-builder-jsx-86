
import React, { Suspense, useState, useEffect } from 'react';
import Debug from './components/Debug';
import Loading from './components/ui/loading';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * AppWrapper component that provides enhanced error boundary functionality
 * and helps diagnose issues with app rendering
 */
const AppWrapper = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appMessage, setAppMessage] = useState('Initializing application...');
  const [appState, setAppState] = useState('initializing');

  useEffect(() => {
    // Enhanced initialization logic with more detailed logging
    console.log('[WRAPPER] AppWrapper mounted, checking for children');
    
    if (!children) {
      console.error('[WRAPPER] AppWrapper has no children - critical error');
      setError(new Error('No application components found'));
      setAppMessage('Critical: No application components found');
      setAppState('error');
      return;
    }
    
    // Check for React components specifically
    let isValidReactElement = React.isValidElement(children);
    console.log('[WRAPPER] Children validation:', { isValidReactElement });
    
    if (!isValidReactElement) {
      console.error('[WRAPPER] AppWrapper children are not valid React elements');
      setError(new Error('Invalid React components'));
      setAppMessage('Error: Invalid application structure');
      setAppState('error');
      return;
    }
    
    // Shorter loading simulation for faster rendering
    setTimeout(() => {
      console.log('[WRAPPER] Preparing application environment...');
      setAppMessage('Preparing application environment...');
      
      setTimeout(() => {
        console.log('[WRAPPER] Application ready to render');
        setIsLoading(false);
        setAppState('ready');
      }, 500);
    }, 300);
    
    return () => {
      console.log('[WRAPPER] AppWrapper unmounting');
    };
  }, [children]);

  // Global error handler for runtime errors
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('[WRAPPER] Global error caught:', event);
      if (event.error) {
        setError(event.error);
        setAppMessage('Runtime error detected');
        setAppState('global-error');
      }
      // Prevent default browser error handling
      event.preventDefault();
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[WRAPPER] Unhandled promise rejection:', event.reason);
      setError(new Error(`Promise error: ${event.reason?.message || 'Unknown promise error'}`));
      setAppMessage('Unhandled promise rejection');
      setAppState('promise-error');
    });
    
    // Monitor DOM changes to detect rendering issues
    try {
      const observer = new MutationObserver((mutations) => {
        console.log('[WRAPPER] DOM mutation detected:', mutations.length);
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => {
        window.removeEventListener('error', handleGlobalError);
        window.removeEventListener('unhandledrejection', handleGlobalError);
        observer.disconnect();
      };
    } catch (err) {
      console.error('[WRAPPER] Error setting up observers:', err);
      return () => {
        window.removeEventListener('error', handleGlobalError);
        window.removeEventListener('unhandledrejection', handleGlobalError);
      };
    }
  }, []);

  // If there's an error, show it using our Debug component with a fallback UI
  if (error) {
    return (
      <div className="min-h-screen bg-puzzle-black text-white" data-state={appState}>
        <Debug message={`Error: ${appMessage}`} error={error} />
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md p-6 border border-red-500 bg-black/80 rounded-lg text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Application Error</h1>
            <p className="mb-4 text-gray-300">Sorry, something went wrong while loading the application.</p>
            <div className="p-3 bg-red-900/20 rounded mb-4">
              <p className="text-red-400">{error.message || String(error)}</p>
            </div>
            <button
              onClick={() => {
                try {
                  // Clear any cached state
                  localStorage.removeItem('supabase.auth.token');
                  sessionStorage.clear();
                } catch (e) {
                  console.error('Error clearing storage:', e);
                }
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80 font-medium"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show enhanced loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black text-white" data-state={appState}>
        <Debug message={appMessage} />
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Loading size="large" color="aqua" />
          <p className="mt-4 text-puzzle-aqua animate-pulse">{appMessage}</p>
          <p className="text-xs text-gray-500 mt-2">State: {appState}</p>
        </div>
      </div>
    );
  }

  // Render the application with enhanced error boundaries
  try {
    console.log('[WRAPPER] Rendering AppWrapper children');
    return (
      <div className="app-wrapper" data-state={appState}>
        <Debug message="Application render in progress" />
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
              <Loading size="large" color="aqua" />
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  } catch (renderError) {
    console.error('[WRAPPER] Error in AppWrapper render:', renderError);
    setError(renderError);
    setAppMessage('Error rendering application content');
    setAppState('render-error');
    return null;
  }
};

export default AppWrapper;
