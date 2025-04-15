
import React, { useState, useEffect, useRef } from 'react';

/**
 * Enhanced Debug component to display runtime information and errors
 * This helps identify where the rendering process might be failing
 */
const Debug = ({ message, error }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [renderInfo, setRenderInfo] = useState({
    renderedAt: new Date().toISOString(),
    componentCount: 0,
    routePath: window.location.pathname,
    timeSinceLoad: 0
  });
  const startTimeRef = useRef(Date.now());
  const [logs, setLogs] = useState([]);
  const [appStateInfo, setAppStateInfo] = useState({
    moduleLoaded: {
      react: typeof React !== 'undefined',
      reactDOM: typeof document !== 'undefined' && document.getElementById('root') !== null,
      router: window.location && window.location.pathname !== undefined,
    },
    environment: process.env.NODE_ENV || 'unknown'
  });
  
  // Track console logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const captureLog = (type, args) => {
      const logEntry = {
        type,
        message: Array.from(args).map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '),
        timestamp: new Date().toISOString()
      };
      
      setLogs(prevLogs => [logEntry, ...prevLogs.slice(0, 29)]);
      
      // Call original console method
      return type === 'error' 
        ? originalConsoleError(...args) 
        : type === 'warn'
          ? originalConsoleWarn(...args)
          : originalConsoleLog(...args);
    };
    
    console.log = (...args) => captureLog('log', args);
    console.error = (...args) => captureLog('error', args);
    console.warn = (...args) => captureLog('warn', args);
    
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);
  
  // Update render info periodically
  useEffect(() => {
    const updateInfo = () => {
      const domElements = document.querySelectorAll('*');
      setRenderInfo({
        renderedAt: new Date().toISOString(),
        componentCount: domElements.length,
        routePath: window.location.pathname,
        timeSinceLoad: Math.round((Date.now() - startTimeRef.current) / 1000)
      });
      
      // Check for script loading errors
      const scriptTags = document.querySelectorAll('script');
      let allScriptsLoaded = true;
      scriptTags.forEach(script => {
        if (script.src && !script.loaded) {
          allScriptsLoaded = false;
        }
      });
      
      setAppStateInfo(prev => ({
        ...prev,
        allScriptsLoaded,
        moduleLoaded: {
          ...prev.moduleLoaded,
          app: typeof App !== 'undefined',
          router: typeof window.location !== 'undefined'
        }
      }));
    };
    
    updateInfo();
    const intervalId = setInterval(updateInfo, 2000);
    
    console.log('[DEBUG] Debug component mounted', {
      message,
      error: error ? { message: error.message, stack: error.stack } : null,
      renderInfo
    });
    
    return () => {
      clearInterval(intervalId);
      console.log('[DEBUG] Debug component unmounted');
    };
  }, [message, error]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isExpanded ? 'p-4' : 'p-2'} bg-black/90 text-white border-b-2 border-puzzle-aqua overflow-auto ${isExpanded ? 'max-h-[80vh]' : 'max-h-[40px]'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-puzzle-aqua">
          Puzzle Boss Debug Panel
          <span className="ml-2 text-sm text-gray-400">
            ({renderInfo.timeSinceLoad}s)
          </span>
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => console.clear()} 
            className="px-2 py-1 bg-gray-700 text-white rounded text-xs"
          >
            Clear Console
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="px-2 py-1 bg-puzzle-aqua/30 text-white rounded"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <>
          {message && <p className="mb-2 font-medium text-yellow-300">{message}</p>}
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded mb-3">
              <p className="font-bold text-red-400">Error Detected:</p>
              <p className="text-red-200">{error.message || String(error)}</p>
              {error.stack && (
                <details open>
                  <summary className="cursor-pointer text-gray-400 text-sm mt-2">Stack trace</summary>
                  <pre className="text-xs mt-2 p-2 bg-black/50 rounded overflow-x-auto">{error.stack}</pre>
                </details>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="p-2 bg-gray-800/50 rounded">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Environment</h3>
              <p className="text-xs text-gray-300">Mode: <span className="text-white">{process.env.NODE_ENV}</span></p>
              <p className="text-xs text-gray-300">Rendered at: <span className="text-white">{renderInfo.renderedAt}</span></p>
              <p className="text-xs text-gray-300">DOM Elements: <span className="text-white">{renderInfo.componentCount}</span></p>
              <p className="text-xs text-gray-300">Current route: <span className="text-white">{renderInfo.routePath}</span></p>
            </div>
            
            <div className="p-2 bg-gray-800/50 rounded">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Application State</h3>
              <p className="text-xs text-gray-300">React loaded: <span className={appStateInfo.moduleLoaded.react ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.react ? "Yes" : "No"}</span></p>
              <p className="text-xs text-gray-300">Root element: <span className={appStateInfo.moduleLoaded.reactDOM ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.reactDOM ? "Found" : "Not found"}</span></p>
              <p className="text-xs text-gray-300">Router: <span className={appStateInfo.moduleLoaded.router ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.router ? "Working" : "Not working"}</span></p>
              <p className="text-xs text-gray-300">App module: <span className={appStateInfo.moduleLoaded.app ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.app ? "Loaded" : "Not loaded"}</span></p>
            </div>
            
            <div className="p-2 bg-gray-800/50 rounded">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Browser</h3>
              <p className="text-xs text-gray-300">Window: <span className="text-white">{window.innerWidth}x{window.innerHeight}</span></p>
              <p className="text-xs text-gray-300">User Agent: <span className="text-white truncate block">{navigator.userAgent}</span></p>
            </div>
            
            <div className="p-2 bg-gray-800/50 rounded">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Resources</h3>
              <p className="text-xs text-gray-300">Scripts loaded: <span className={appStateInfo.allScriptsLoaded ? "text-green-400" : "text-yellow-400"}>{appStateInfo.allScriptsLoaded ? "All loaded" : "Some pending"}</span></p>
              <p className="text-xs text-gray-300">Navigator online: <span className={navigator.onLine ? "text-green-400" : "text-red-400"}>{navigator.onLine ? "Yes" : "No"}</span></p>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-gray-800/50 rounded">
            <h3 className="text-sm font-bold text-puzzle-aqua mb-1 flex justify-between">
              <span>Console Logs</span>
              <span className="text-xs text-gray-400">(Recent {logs.length})</span>
            </h3>
            
            <div className="text-xs max-h-[200px] overflow-y-auto">
              {logs.length === 0 && (
                <p className="text-gray-500 italic">No logs captured yet</p>
              )}
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`p-1 border-l-2 mb-1 ${
                    log.type === 'error' 
                      ? 'border-red-500 text-red-300 bg-red-900/20' 
                      : log.type === 'warn'
                        ? 'border-yellow-500 text-yellow-300 bg-yellow-900/20'
                        : 'border-gray-500 text-white'
                  }`}
                >
                  <span className="text-gray-400 mr-1">{log.timestamp.split('T')[1].split('.')[0]}</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80"
            >
              Reload Page
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Storage cleared');
              }} 
              className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600"
            >
              Clear Storage
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Debug;
