
import React, { Suspense, useState, useEffect } from 'react';
import Debug from './components/Debug';
import Loading from './components/ui/loading';
import ErrorBoundary from './components/ErrorBoundary';
import BootstrapLoader from './components/bootstrap/BootstrapLoader';
import diagnosticConfig from './config/diagnosticSettings';
import diagnostics from './utils/diagnostics';

/**
 * Enhanced AppWrapper component with progressive loading and improved error handling
 */
const AppWrapper = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appMessage, setAppMessage] = useState('Initializing application...');
  const [appState, setAppState] = useState('initializing');
  const [initLogs, setInitLogs] = useState([]);
  const [warningDismissed, setWarningDismissed] = useState(
    diagnosticConfig.isWarningDismissed('render-timeout')
  );
  const [environmentInfo, setEnvironmentInfo] = useState(null);
  const [loadingStages, setLoadingStages] = useState([
    { name: 'environment', status: 'pending', error: null },
    { name: 'react', status: 'pending', error: null },
    { name: 'components', status: 'pending', error: null },
    { name: 'services', status: 'pending', error: null }
  ]);

  // Log initialization steps for debugging
  const logInit = (message, isError = false) => {
    console.log(`[WRAPPER] ${message}`);
    const newLog = { timestamp: new Date().toISOString(), message, isError };
    setInitLogs(prev => [...prev, newLog]);
    return newLog;
  };

  // Update loading stage status
  const updateStage = (stageName, status, error = null) => {
    setLoadingStages(prev => 
      prev.map(stage => 
        stage.name === stageName 
          ? { ...stage, status, error } 
          : stage
      )
    );
  };

  // Collect environment information for diagnostics
  useEffect(() => {
    try {
      const envInfo = diagnostics.checkEnvironment();
      setEnvironmentInfo(envInfo);
      updateStage('environment', 'complete');
      logInit(`Environment check complete: ${envInfo.isDev ? 'Development' : 'Production'} mode`);
    } catch (e) {
      logInit(`Error checking environment: ${e.message}`, true);
      updateStage('environment', 'error', e.message);
    }
  }, []);

  // Initial setup and progressive loading
  useEffect(() => {
    // Load current diagnostic settings
    const settings = diagnosticConfig.load();
    logInit('AppWrapper mounted, checking application state');
    
    // Check for React components specifically
    try {
      updateStage('react', 'loading');
      let isValidReactElement = React.isValidElement(children);
      logInit(`React validation: isValidReactElement=${isValidReactElement}`);
      
      if (!isValidReactElement && children) {
        logInit('WARNING: children are not valid React elements, but continuing', true);
      } else if (!children) {
        logInit('ERROR: AppWrapper has no children - critical error', true);
        setError(new Error('No application components found'));
        setAppMessage('Critical: No application components found');
        setAppState('error');
        updateStage('react', 'error', 'No application components found');
        return;
      }
      
      updateStage('react', 'complete');
    } catch (e) {
      logInit(`Error validating React: ${e.message}`, true);
      setError(e);
      setAppMessage('Error validating React components');
      setAppState('error');
      updateStage('react', 'error', e.message);
      return;
    }
    
    // Update loading stages progressively
    const progressStages = async () => {
      try {
        // Quick check for essential dependencies
        logInit('Checking essential services...');
        setAppMessage('Checking essential services...');
        updateStage('services', 'loading');
        
        // Check local storage
        const storageCheck = diagnostics.checkStorage();
        if (!storageCheck.available) {
          logInit(`WARNING: LocalStorage not available: ${storageCheck.error}`, true);
        } else {
          logInit('LocalStorage check passed');
        }
        
        // More service checks could be added here
        
        updateStage('services', 'complete');
        logInit('Services check complete');
      
        // Ready to render the application
        logInit('Starting component initialization');
        setAppMessage('Initializing components...');
        updateStage('components', 'loading');
        
        // Simulate checking components (can be extended with real checks)
        setTimeout(() => {
          updateStage('components', 'complete');
          logInit('Application ready to render');
          setIsLoading(false);
          setAppState('ready');
        }, 100);
      } catch (e) {
        logInit(`Error in initialization: ${e.message}`, true);
        setError(e);
        updateStage('components', 'error', e.message);
      }
    };
    
    progressStages();
  }, [children]);

  // Dismiss error/warning handler
  const handleDismissWarning = () => {
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

  // Switch to minimal mode
  const handleSwitchToMinimal = () => {
    if (window.appRecovery && window.appRecovery.switchMode) {
      window.appRecovery.switchMode('minimal');
    } else {
      try {
        const url = new URL(window.location);
        url.searchParams.set('mode', 'minimal');
        window.location = url.toString();
      } catch (e) {
        logInit(`Error switching to minimal mode: ${e.message}`, true);
      }
    }
  };

  // If there's an error, show it using our enhanced error UI
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
            
            <div className="mb-4 flex gap-2">
              <button
                onClick={handleDismissWarning}
                className="flex-1 px-4 py-2 bg-puzzle-gold text-black rounded hover:bg-puzzle-gold/80 font-medium"
              >
                Continue Anyway
              </button>
              <button
                onClick={handleSwitchToMinimal}
                className="flex-1 px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80 font-medium"
              >
                Try Minimal Mode
              </button>
            </div>
            
            <div className="mb-4 p-2 bg-black/50 rounded text-left">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Loading Stage Status</h3>
              <div className="max-h-[100px] overflow-y-auto text-xs">
                {loadingStages.map((stage, i) => (
                  <div key={i} className="mb-1 flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      stage.status === 'complete' ? 'bg-green-500' : 
                      stage.status === 'error' ? 'bg-red-500' : 
                      stage.status === 'loading' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="text-gray-300 flex-1">{stage.name}</span>
                    <span className={`text-xs ${
                      stage.status === 'complete' ? 'text-green-400' : 
                      stage.status === 'error' ? 'text-red-400' : 
                      stage.status === 'loading' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {stage.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4 p-2 bg-black/50 rounded text-left">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Initialization Log</h3>
              <div className="max-h-[100px] overflow-y-auto text-xs text-gray-400">
                {initLogs.map((log, i) => (
                  <div key={i} className={`mb-1 ${log.isError ? 'text-red-400' : ''}`}>
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
          
          <div className="mt-4 w-64 bg-gray-900 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-puzzle-aqua h-2.5 rounded-full" 
              style={{ width: `${(loadingStages.filter(s => s.status === 'complete').length / loadingStages.length) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {loadingStages.filter(s => s.status === 'complete').length}/{loadingStages.length} stages complete
          </p>
          
          <div className="mt-4 p-2 bg-black/20 rounded max-w-md w-full">
            <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Loading Stage Status</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {loadingStages.map((stage, i) => (
                <div key={i} className="flex items-center text-xs">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    stage.status === 'complete' ? 'bg-green-500' : 
                    stage.status === 'error' ? 'bg-red-500' : 
                    stage.status === 'loading' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                  }`}></span>
                  <span className="text-gray-300 flex-1">{stage.name}</span>
                  <span className={`text-xs ${
                    stage.status === 'complete' ? 'text-green-400' : 
                    stage.status === 'error' ? 'text-red-400' : 
                    stage.status === 'loading' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {stage.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="max-h-[100px] overflow-y-auto text-xs text-gray-400">
              {initLogs.slice(-5).map((log, i) => (
                <div key={i} className={`mb-1 ${log.isError ? 'text-red-400' : ''}`}>
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
        <BootstrapLoader
          onComplete={() => logInit('Bootstrap complete')}
          timeout={15000}
        >
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
                <Loading size="large" color="aqua" message="Loading application components..." />
              </div>
            }>
              {children}
            </Suspense>
          </ErrorBoundary>
        </BootstrapLoader>
      </div>
    );
  } catch (renderError) {
    logInit(`Error in AppWrapper render: ${renderError.message}`, true);
    setError(renderError);
    setAppMessage('Error rendering application content');
    setAppState('render-error');
    return null;
  }
};

export default AppWrapper;
