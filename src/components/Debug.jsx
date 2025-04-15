
import React from 'react';

/**
 * Debug component to display the current state of the application
 * This helps identify where the rendering process might be failing
 */
const Debug = ({ message, error }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/90 text-white border-b border-puzzle-aqua overflow-auto max-h-[50vh]">
      <h2 className="text-xl font-bold text-puzzle-aqua mb-2">Debug Panel</h2>
      {message && <p className="mb-2">{message}</p>}
      
      {error && (
        <div className="p-2 bg-red-900/30 border border-red-500 rounded mb-2">
          <p className="font-bold text-red-400">Error:</p>
          <p>{error.message || String(error)}</p>
          {error.stack && (
            <details>
              <summary className="cursor-pointer text-gray-400 text-sm">Stack trace</summary>
              <pre className="text-xs mt-2 overflow-x-auto">{error.stack}</pre>
            </details>
          )}
        </div>
      )}
      
      <div className="mt-2">
        <p className="text-sm text-gray-400">Environment: {process.env.NODE_ENV}</p>
        <p className="text-sm text-gray-400">Window Size: {window.innerWidth}x{window.innerHeight}</p>
        <p className="text-sm text-gray-400">User Agent: {navigator.userAgent}</p>
      </div>
      
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-3 py-1 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80"
      >
        Reload Page
      </button>
    </div>
  );
};

export default Debug;
