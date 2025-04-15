
import React, { Suspense, useState, useEffect } from 'react';
import Debug from './components/Debug';
import Loading from './components/ui/loading';
import ErrorBoundary from './components/ErrorBoundary';
import diagnosticConfig from './config/diagnosticSettings';

/**
 * AppWrapper component that provides enhanced error boundary functionality
 * and helps diagnose issues with app rendering
 */
const AppWrapper = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appMessage, setAppMessage] = useState('Initializing application...');
  const [appState, setAppState] = useState('initializing');
  const [initLogs, setInitLogs] = useState([]);
  const [initTimeout, setInitTimeout] = useState(null);
  const [warningDismissed, setWarningDismissed] = useState(
    diagnosticConfig.isWarningDismissed('render-timeout')
  );

  // Log initialization steps for debugging
  const logInit = (message) => {
    console.log(`[WRAPPER] ${message}`);
    setInitLogs(prev => [...prev, { timestamp: new Date().toISOString(), message }]);
  };

  // Initial setup and timeout detection
  useEffect(() => {
    // Load current diagnostic settings
    const settings = diagnosticConfig.load();
    logInit('AppWrapper mounted, checking for children');
    
    // Only set timeout if warning detection is enabled
    if (settings.timeoutDetection.enabled && settings.timeoutDetection.showWarning && !warningDismissed) {
      const timeoutId = setTimeout(() => {
        logInit(`WARNING: Initialization timeout reached after ${settings.timeoutDetection.threshold}ms - application may be stalled`);
        setError(new Error('Application initialization timed out'));
        setAppMessage('Initialization timed out. Check console for details.');
        setAppState('timeout');
      }, settings.timeoutDetection.threshold);
      
      setInitTimeout(timeoutId);
    }
    
    return () => {
      if (initTimeout) clearTimeout(initTimeout);
      logInit('AppWrapper unmounting');
    };
  }, [warningDismissed]);

  // Main initialization logic
  useEffect(() => {
    // Enhanced initialization logic with more detailed logging
    if (!children) {
      logInit('ERROR: AppWrapper has no children - critical error');
      setError(new Error('No application components found'));
      setAppMessage('Critical: No application components found');
      setAppState('error');
      return;
    }
    
    // Check for React components specifically
    let isValidReactElement = React.isValidElement(children);
    logInit(`Children validation: isValidReactElement=${isValidReactElement}`);
    
    if (!isValidReactElement) {
      logInit('ERROR: AppWrapper children are not valid React elements');
      setError(new Error('Invalid React components'));
      setAppMessage('Error: Invalid application structure');
      setAppState('error');
      return;
    }
    
    // Shorter loading simulation for faster rendering
    logInit('Preparing application environment...');
    setAppMessage('Preparing application environment...');
    
    // Quick check for essential dependencies
    if (typeof React === 'undefined') {
      logInit('ERROR: React is undefined - critical dependency missing');
      setError(new Error('Critical dependency missing: React'));
      return;
    }
    
    // Ready to render the application - use a very short delay
    const readyTimer = setTimeout(() => {
      logInit('Application ready to render');
      if (initTimeout) {
        clearTimeout(initTimeout);
        setInitTimeout(null);
      }
      setIsLoading(false);
      setAppState('ready');
    }, 100); // Very short delay to ensure DOM updates
    
    return () => {
      clearTimeout(readyTimer);
    };
  }, [children, initTimeout]);

  // Dismiss timeout warning handler
  const handleDismissWarning = () => {
    if (initTimeout) {
      clearTimeout(initTimeout);
      setInitTimeout(null);
    }
    
    // Check if user wants to permanently dismiss
    const settings = diagnosticConfig.load();
    if (settings.timeoutDetection.persistDismissed) {
      diagnosticConfig.dismissWarning('render-timeout');
    }
    
    setWarningDismissed(true);
    setError(null);
    setIsLoading(false);
    setAppState('user-continue');
  };

  // Configuration toggle handler
  const handleToggleTimeoutDetection = () => {
    const settings = diagnosticConfig.load();
    diagnosticConfig.save({
      ...settings,
      timeoutDetection: {
        ...settings.timeoutDetection,
        enabled: !settings.timeoutDetection.enabled
      }
    });
    
    // Clear timeout if disabling
    if (settings.timeoutDetection.enabled && initTimeout) {
      clearTimeout(initTimeout);
      setInitTimeout(null);
    }
    
    // Continue rendering
    handleDismissWarning();
  };

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
            
            {appState === 'timeout' && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={handleDismissWarning}
                  className="flex-1 px-4 py-2 bg-puzzle-gold text-black rounded hover:bg-puzzle-gold/80 font-medium"
                >
                  Continue Anyway
                </button>
                <button
                  onClick={handleToggleTimeoutDetection}
                  className="flex-1 px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80 font-medium"
                >
                  Disable Timeout
                </button>
              </div>
            )}
            
            <div className="mb-4 p-2 bg-black/50 rounded text-left">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Initialization Log</h3>
              <div className="max-h-[100px] overflow-y-auto text-xs text-gray-400">
                {initLogs.map((log, i) => (
                  <div key={i} className="mb-1">
                    <span className="opacity-70">[{log.timestamp.split('T')[1].split('.')[0]}]</span> {log.message}
                  </div>
                ))}
              </div>
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
          <Loading size="large" color="aqua" message={appMessage} />
          <p className="text-xs text-gray-500 mt-2">State: {appState}</p>
          <div className="mt-4 p-2 bg-black/20 rounded max-w-md w-full">
            <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Initialization Log</h3>
            <div className="max-h-[100px] overflow-y-auto text-xs text-gray-400">
              {initLogs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="opacity-70">[{log.timestamp.split('T')[1].split('.')[0]}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the application with enhanced error boundaries
  try {
    logInit('Rendering AppWrapper children');
    return (
      <div className="app-wrapper" data-state={appState}>
        <Debug message="Application render in progress" />
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
              <Loading size="large" color="aqua" message="Loading application components..." />
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  } catch (renderError) {
    logInit(`Error in AppWrapper render: ${renderError.message}`);
    setError(renderError);
    setAppMessage('Error rendering application content');
    setAppState('render-error');
    return null;
  }
};

export default AppWrapper;
