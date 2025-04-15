
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
    
    // Simulate application stages for better debugging
    const stages = [
      { message: 'Preparing application environment...', time: 200 },
      { message: 'Loading component structure...', time: 300 },
      { message: 'Initializing state management...', time: 200 },
      { message: 'Setting up routing...', time: 300 },
      { message: 'Finalizing application startup...', time: 200 }
    ];
    
    // Progress through simulated startup stages
    let currentStage = 0;
    const progressTimer = setInterval(() => {
      if (currentStage < stages.length) {
        setAppMessage(stages[currentStage].message);
        setAppState('loading-stage-' + (currentStage + 1));
        console.log(`[WRAPPER] ${stages[currentStage].message}`);
        currentStage++;
      } else {
        clearInterval(progressTimer);
        setIsLoading(false);
        setAppState('ready');
        console.log('[WRAPPER] Application ready to render');
      }
    }, 300);
    
    return () => {
      clearInterval(progressTimer);
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
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
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
              onClick={() => window.location.reload()}
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
        <ErrorBoundary fallback={
          <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-xl text-red-500 mb-2">Component Error</h2>
              <p className="text-gray-300 mb-4">A component failed to render properly.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-puzzle-aqua text-black rounded"
              >
                Reload Application
              </button>
            </div>
          </div>
        }>
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
