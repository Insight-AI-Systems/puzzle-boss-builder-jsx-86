
import React from 'react';

/**
 * A minimal application component with no dependencies on complex features
 * Used to verify that the basic React setup is working correctly
 */
const MinimalApp = () => {
  console.log('MinimalApp rendering');
  
  // Simple state to verify React hooks are working
  const [count, setCount] = React.useState(0);
  
  // Log when the component mounts to track lifecycle
  React.useEffect(() => {
    console.log('MinimalApp mounted successfully');
    
    // Add a simple timer to verify that effects are working
    const timer = setTimeout(() => {
      console.log('MinimalApp timer fired');
      setCount(c => c + 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-puzzle-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-puzzle-aqua mb-4">The Puzzle Boss</h1>
      <p className="text-xl mb-6">Minimal Application Running</p>
      
      <div className="bg-black/30 p-6 rounded-lg border border-puzzle-aqua max-w-md w-full">
        <p className="mb-4">
          This is a minimal version of the application to diagnose loading issues.
        </p>
        <p className="mb-4">
          React is successfully running if you can see this message and the counter below.
        </p>
        <div className="text-center p-4 bg-puzzle-aqua/10 rounded mb-4">
          <p className="text-xl font-bold">Counter: {count}</p>
          <p className="text-sm text-gray-400">Should increase after 1 second</p>
        </div>
        <button
          className="w-full bg-puzzle-aqua text-black py-2 rounded hover:bg-puzzle-aqua/80 transition-colors"
          onClick={() => setCount(c => c + 1)}
        >
          Increment Counter
        </button>
      </div>
    </div>
  );
};

export default MinimalApp;
