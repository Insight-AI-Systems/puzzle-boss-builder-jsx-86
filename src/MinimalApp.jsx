
import React, { useState, useEffect } from 'react';
import ReactErrorBoundary from './components/ReactErrorBoundary';
import ReactTester from './components/ReactTester';
import DiagnosticLog from './components/DiagnosticLog';
import { useToast } from '@/components/ui/use-toast';

// Helper function to safely use the context
const safelyUseAppMode = () => {
  try {
    // Dynamically import to avoid issues if the module fails
    const { useAppMode } = require('@/contexts/app-mode');
    return useAppMode();
  } catch (error) {
    console.warn('AppMode context not available, using fallback mode', error);
    // Provide a fallback implementation
    return {
      isMinimal: true,
      toggleMode: () => {
        console.log('Mode toggle attempted but context not available');
        // Attempt to reload with full mode
        window.location.href = window.location.pathname.replace(/[?&]minimal=true/, '');
      },
      diagnosticSettings: {
        enabled: true,
        timeout: 5000,
        showWarnings: true
      }
    };
  }
};

const MinimalApp = ({ isStandalone = false }) => {
  const { toast } = useToast();
  
  // Only try to use the context if not in standalone mode
  const appMode = isStandalone
    ? { 
        isMinimal: true, 
        toggleMode: () => window.location.href = window.location.pathname,
        diagnosticSettings: {
          enabled: true,
          timeout: 5000,
          showWarnings: true
        }
      }
    : safelyUseAppMode();
  
  // Simple state to verify React hooks are working
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [showError, setShowError] = useState(false);
  const [timeoutWarningShown, setTimeoutWarningShown] = useState(false);
  
  // Log when the component mounts to track lifecycle
  useEffect(() => {
    console.log('MinimalApp mounted successfully');
    const mountTime = new Date().toLocaleTimeString();
    logEvent(`Component mounted at ${mountTime}`);
    
    // Add a simple timer to verify that effects are working
    const timer = setTimeout(() => {
      console.log('MinimalApp timer fired');
      
      // Update state inside the timer
      setCount(prevCount => {
        console.log('Updating count from:', prevCount, 'to:', prevCount + 1);
        return prevCount + 1;
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
      logEvent('Timer incremented count');
    }, 1000);
    
    // Clear the timeout on unmount
    return () => {
      console.log('MinimalApp unmounting, clearing timer');
      clearTimeout(timer);
      logEvent('Component cleanup function executed');
    };
  }, []);
  
  // Additional effect to track count changes
  useEffect(() => {
    if (count > 0) {
      console.log('Count changed to:', count);
      logEvent(`Count changed to: ${count}`);
    }
  }, [count]);
  
  // Clear the render timeout if it exists on mount
  useEffect(() => {
    if (window.__clearMinimalAppTimeout) {
      window.__clearMinimalAppTimeout();
    }
    return () => {
      if (window.__clearMinimalAppTimeout) {
        window.__clearMinimalAppTimeout();
      }
    };
  }, []);
  
  // Function to log events to the UI
  const logEvent = (message) => {
    setEventLog(prev => {
      const newLog = [...prev, { id: Date.now(), message, time: new Date().toLocaleTimeString() }];
      
      // Keep only the last 5 events
      if (newLog.length > 5) {
        return newLog.slice(newLog.length - 5);
      }
      return newLog;
    });
    
    // Also log to diagnostic log if available
    if (window.__addDiagnosticLog) {
      window.__addDiagnosticLog(message);
    }
  };

  // Dismiss timeout warning
  const dismissTimeoutWarning = () => {
    setTimeoutWarningShown(false);
    // If we have the app mode context, dismiss the warning there too
    if (appMode && appMode.dismissWarning) {
      appMode.dismissWarning('render-timeout');
    }
    // Remove the message from DOM if it exists
    const timeoutMsg = document.querySelector('.minimal-app-timeout-message');
    if (timeoutMsg) {
      timeoutMsg.remove();
    }
  };
  
  // Component to intentionally throw an error for testing the error boundary
  const ErrorThrower = () => {
    if (showError) {
      throw new Error('This is an intentional error for testing the error boundary');
    }
    return <div className="p-1 text-xs text-gray-400">Error test component (not throwing)</div>;
  };
  
  // Get React version for diagnostics
  const reactVersion = React.version || 'unknown';
  
  // Determine button text based on standalone mode
  const buttonText = isStandalone 
    ? "Return to Normal App" 
    : "Switch to Full Mode";

  // Mode indicator styles
  const modeIndicatorStyle = isStandalone
    ? "bg-red-900 text-white"
    : appMode.isMinimal
      ? "bg-puzzle-burgundy text-white"
      : "bg-puzzle-aqua text-black";
  
  return (
    <div className="min-h-screen bg-puzzle-black text-white flex flex-col items-center justify-center p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold text-puzzle-aqua">The Puzzle Boss</h1>
          <span className={`px-2 py-1 text-xs rounded-full ${modeIndicatorStyle}`}>
            {isStandalone ? 'Standalone' : (appMode.isMinimal ? 'Minimal' : 'Full')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={appMode.toggleMode}
            className="px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
          >
            {buttonText}
          </button>
          <button
            onClick={() => window.appRecovery.switchMode('emergency')}
            className="px-4 py-2 bg-puzzle-gold text-black rounded hover:bg-puzzle-gold/80"
          >
            Emergency Mode
          </button>
        </div>
      </div>
      
      <p className="text-xl mb-2">Minimal Application Testing</p>
      <p className="text-sm text-gray-400 mb-6">React version: {reactVersion}</p>
      
      <div className="bg-black/30 p-6 rounded-lg border border-puzzle-aqua max-w-md w-full">
        <ReactErrorBoundary>
          <p className="mb-4">
            This is a diagnostic version of the application to verify React functionality.
          </p>
          
          <div className="text-center p-4 bg-puzzle-aqua/10 rounded mb-4">
            <p className="text-xl font-bold">Counter: {count}</p>
            <p className="text-sm text-gray-400">
              {lastUpdated 
                ? `Last updated at ${lastUpdated}` 
                : "Should increase after 1 second"}
            </p>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              className="flex-1 bg-puzzle-aqua text-black py-2 rounded hover:bg-puzzle-aqua/80 transition-colors"
              onClick={() => {
                logEvent('Manual increment clicked');
                setCount(c => {
                  console.log('Manual increment from:', c, 'to:', c + 1);
                  return c + 1;
                });
                setLastUpdated(new Date().toLocaleTimeString());
              }}
            >
              Increment Counter
            </button>
            
            <button
              className="flex-1 bg-puzzle-gold text-black py-2 rounded hover:bg-puzzle-gold/80 transition-colors"
              onClick={() => {
                logEvent('Reset counter clicked');
                setCount(0);
                setLastUpdated(new Date().toLocaleTimeString());
              }}
            >
              Reset Counter
            </button>
          </div>
          
          <div className="p-3 border border-gray-700 rounded bg-black/50 mb-4">
            <h3 className="text-sm font-bold text-puzzle-gold mb-2">Component Event Log:</h3>
            <div className="text-xs space-y-1 max-h-[100px] overflow-y-auto">
              {eventLog.length === 0 ? (
                <p className="text-gray-500 italic">No events logged yet</p>
              ) : (
                eventLog.map(event => (
                  <div key={event.id} className="text-gray-300">
                    <span className="text-gray-500">[{event.time}]</span> {event.message}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <button
              className="w-full bg-puzzle-burgundy text-white py-2 rounded hover:bg-puzzle-burgundy/80 transition-colors"
              onClick={() => {
                logEvent('Error test button clicked');
                setShowError(!showError);
              }}
            >
              {showError ? 'Hide Error Test' : 'Test Error Boundary'}
            </button>
          </div>
          
          <ErrorThrower />
          
          {/* Diagnostic settings */}
          {!isStandalone && (
            <div className="mt-4 p-3 border border-gray-700 rounded bg-black/50">
              <h3 className="text-sm font-bold text-puzzle-gold mb-2">Diagnostic Settings:</h3>
              <div className="grid gap-2">
                <label className="flex items-center justify-between text-xs">
                  <span>Enable diagnostics:</span>
                  <input 
                    type="checkbox" 
                    checked={appMode.diagnosticSettings?.enabled} 
                    onChange={(e) => appMode.updateDiagnosticSettings?.({ enabled: e.target.checked })}
                    className="ml-2"
                  />
                </label>
                <label className="flex items-center justify-between text-xs">
                  <span>Show timeout warnings:</span>
                  <input 
                    type="checkbox" 
                    checked={appMode.diagnosticSettings?.showWarnings} 
                    onChange={(e) => appMode.updateDiagnosticSettings?.({ showWarnings: e.target.checked })}
                    className="ml-2"
                  />
                </label>
                <label className="flex items-center justify-between text-xs">
                  <span>Timeout threshold (ms):</span>
                  <input 
                    type="number" 
                    min="1000" 
                    max="30000" 
                    step="1000"
                    value={appMode.diagnosticSettings?.timeout || 5000} 
                    onChange={(e) => appMode.updateDiagnosticSettings?.({ timeout: parseInt(e.target.value, 10) })}
                    className="ml-2 bg-black text-white border border-gray-700 rounded px-2 py-1 w-24"
                  />
                </label>
              </div>
            </div>
          )}
          
          {/* React feature tests */}
          <ReactTester />
        </ReactErrorBoundary>
      </div>
      
      {/* Add the diagnostic log directly in the component */}
      <div className="w-full max-w-4xl mt-4">
        <DiagnosticLog maxEntries={20} />
      </div>
      
      {/* Timeout warning - only shown if enabled */}
      {timeoutWarningShown && appMode.diagnosticSettings?.showWarnings && (
        <div className="fixed bottom-4 right-4 bg-puzzle-gold text-black p-4 rounded-lg shadow-lg z-50 max-w-xs">
          <h4 className="font-bold mb-1">Rendering Timeout Warning</h4>
          <p className="text-sm mb-2">The application took longer than expected to render.</p>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => dismissTimeoutWarning()}
              className="px-3 py-1 bg-black text-white text-sm rounded"
            >
              Dismiss
            </button>
            <button 
              onClick={() => {
                dismissTimeoutWarning();
                appMode.updateDiagnosticSettings?.({ showWarnings: false });
                toast({
                  title: "Timeout warnings disabled",
                  description: "You can re-enable them in diagnostic settings."
                });
              }}
              className="px-3 py-1 bg-puzzle-burgundy text-white text-sm rounded"
            >
              Don't Show Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalApp;
