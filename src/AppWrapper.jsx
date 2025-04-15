
import React, { Suspense, useState, useEffect } from 'react';
import Debug from './components/Debug';
import Loading from './components/ui/loading';

/**
 * AppWrapper component that provides error boundary functionality
 * and helps diagnose issues with app rendering
 */
const AppWrapper = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appMessage, setAppMessage] = useState('Initializing application...');

  useEffect(() => {
    // Simulate initialization process for debugging
    console.log('AppWrapper mounted');
    
    // Check if we have any children
    if (!children) {
      console.error('AppWrapper has no children');
      setAppMessage('No application components found');
    }
    
    // Add a timeout to show loading state transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('Loading state completed');
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      console.log('AppWrapper unmounted');
    };
  }, [children]);

  // If there's an error, show it using our Debug component
  if (error) {
    return (
      <div className="min-h-screen bg-puzzle-black text-white">
        <Debug message="Error rendering application" error={error} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md p-6 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Application Error</h1>
            <p className="mb-4">Sorry, something went wrong while loading the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black text-white">
        <Debug message={appMessage} />
        <Loading size="large" color="aqua" />
      </div>
    );
  }

  // Wrap the app in a try-catch to catch runtime errors
  try {
    console.log('Attempting to render AppWrapper children');
    return (
      <div className="app-wrapper">
        <Debug message="App rendering in progress" />
        <Suspense fallback={<Loading size="large" color="aqua" />}>
          {children}
        </Suspense>
      </div>
    );
  } catch (renderError) {
    console.error('Error rendering app content:', renderError);
    setError(renderError);
    return null;
  }
};

export default AppWrapper;
