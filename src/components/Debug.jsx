
import React, { useState, useEffect } from 'react';

/**
 * Enhanced Debug component to display runtime information and errors
 * This helps identify where the rendering process might be failing
 */
const Debug = ({ message, error }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [renderInfo, setRenderInfo] = useState({
    renderedAt: new Date().toISOString(),
    componentCount: 0
  });

  useEffect(() => {
    // Count rendered components as a debugging metric
    const domElements = document.querySelectorAll('*');
    setRenderInfo({
      renderedAt: new Date().toISOString(),
      componentCount: domElements.length
    });
    
    console.log('[DEBUG] Debug component mounted', {
      message,
      error: error ? { message: error.message, stack: error.stack } : null,
      renderInfo
    });
    
    return () => {
      console.log('[DEBUG] Debug component unmounted');
    };
  }, [message, error]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isExpanded ? 'p-4' : 'p-2'} bg-black/90 text-white border-b-2 border-puzzle-aqua overflow-auto ${isExpanded ? 'max-h-[70vh]' : 'max-h-[40px]'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-puzzle-aqua">Puzzle Boss Debug Panel</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="px-2 py-1 bg-puzzle-aqua/30 text-white rounded"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          {message && <p className="mb-2 font-medium">{message}</p>}
          
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
            </div>
            
            <div className="p-2 bg-gray-800/50 rounded">
              <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Browser</h3>
              <p className="text-xs text-gray-300">Window: <span className="text-white">{window.innerWidth}x{window.innerHeight}</span></p>
              <p className="text-xs text-gray-300">User Agent: <span className="text-white truncate block">{navigator.userAgent}</span></p>
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
              onClick={() => console.clear()} 
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Clear Console
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
