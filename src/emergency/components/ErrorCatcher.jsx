
import React, { useState, useEffect } from 'react';

export const ErrorCatcher = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  
  useEffect(() => {
    const handleError = (event) => {
      console.error('Error caught by ErrorCatcher:', event);
      setHasError(true);
      setError(event.error || new Error('Unknown error'));
      setErrorInfo({
        message: event.message || 'Unknown error',
        source: event.filename || 'Unknown source',
        line: event.lineno || 'Unknown line'
      });
      event.preventDefault();
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="p-4 bg-puzzle-burgundy/70 border border-puzzle-burgundy rounded-lg text-white">
        <h4 className="text-xl font-bold mb-2">Error Caught:</h4>
        <p className="mb-2">{error?.message || 'Unknown error'}</p>
        
        {errorInfo && (
          <div className="bg-black/40 p-2 rounded mb-2">
            <p>Source: {errorInfo.source}</p>
            <p>Line: {errorInfo.line}</p>
          </div>
        )}
        
        <button 
          onClick={() => {
            setHasError(false);
            setError(null);
            setErrorInfo(null);
          }}
          className="bg-puzzle-aqua text-black px-4 py-2 rounded hover:bg-puzzle-aqua/80 transition-colors"
        >
          Reset
        </button>
      </div>
    );
  }
  
  return children;
};
