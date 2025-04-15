
import React, { useState, useEffect } from 'react';
import LogViewer from './debug/LogViewer';
import SystemInfo from './debug/SystemInfo';
import DebugControls from './debug/DebugControls';

const Debug = ({ message, error }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [renderInfo, setRenderInfo] = useState({
    renderedAt: new Date().toISOString(),
    componentCount: 0,
    routePath: window.location.pathname,
    timeSinceLoad: 0
  });
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
  
  // Update render info
  useEffect(() => {
    const updateInfo = () => {
      const domElements = document.querySelectorAll('*');
      setRenderInfo({
        renderedAt: new Date().toISOString(),
        componentCount: domElements.length,
        routePath: window.location.pathname,
        timeSinceLoad: 0
      });
    };
    
    updateInfo();
    const interval = setInterval(updateInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClearConsole = () => {
    console.clear();
    setLogs([]);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isExpanded ? 'p-4' : 'p-2'} bg-black/90 text-white border-b-2 border-puzzle-aqua overflow-auto ${isExpanded ? 'max-h-[80vh]' : 'max-h-[40px]'}`}>
      <DebugControls 
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onClearConsole={handleClearConsole}
      />
      
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
          
          <SystemInfo renderInfo={renderInfo} appStateInfo={appStateInfo} />
          
          <div className="mt-3 p-2 bg-gray-800/50 rounded">
            <h3 className="text-sm font-bold text-puzzle-aqua mb-1 flex justify-between">
              <span>Console Logs</span>
              <span className="text-xs text-gray-400">(Recent {logs.length})</span>
            </h3>
            <LogViewer logs={logs} />
          </div>
        </>
      )}
    </div>
  );
};

export default Debug;
