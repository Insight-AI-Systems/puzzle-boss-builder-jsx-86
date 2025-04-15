
import React, { useState, useEffect } from 'react';

export const ErrorCatcher = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleError = (event) => {
      console.error('Error caught by ErrorCatcher:', event);
      setHasError(true);
      setError(event.error || new Error('Unknown error'));
      event.preventDefault();
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div style={{ padding: '10px', background: '#800020', color: 'white', borderRadius: '4px' }}>
        <h4>Error Caught:</h4>
        <p>{error?.message || 'Unknown error'}</p>
        <button 
          onClick={() => setHasError(false)}
          style={{ background: '#333', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '2px', marginTop: '8px' }}
        >
          Reset
        </button>
      </div>
    );
  }
  
  return children;
};
