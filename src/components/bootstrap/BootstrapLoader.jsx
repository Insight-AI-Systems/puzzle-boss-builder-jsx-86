import React, { useState, useEffect } from 'react';
import Loading from '@/components/ui/loading';

/**
 * A bootstrap loader component that renders even if the main app fails
 * Provides visibility into the application loading process
 */
const BootstrapLoader = ({ 
  onComplete, 
  children,
  fallback = null,
  timeout = 10000 
}) => {
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Track loading stages
  useEffect(() => {
    console.log(`[Bootstrap] Stage: ${loadingStage}`);
    
    // Update elapsed time periodically
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);
    
    return () => clearInterval(timer);
  }, [loadingStage, startTime]);
  
  // Set up loading stages
  useEffect(() => {
    const stages = [
      { name: 'environment', delay: 100 },
      { name: 'libraries', delay: 200 },
      { name: 'configuration', delay: 300 },
      { name: 'services', delay: 500 },
      { name: 'complete', delay: 700 }
    ];
    
    let currentStageIndex = 0;
    
    const progressLoading = () => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex];
        setLoadingStage(currentStage.name);
        currentStageIndex++;
        
        if (currentStageIndex < stages.length) {
          setTimeout(progressLoading, stages[currentStageIndex - 1].delay);
        } else {
          // Final stage
          setTimeout(() => {
            setIsComplete(true);
            if (onComplete) onComplete();
          }, currentStage.delay);
        }
      }
    };
    
    // Start the loading sequence
    progressLoading();
    
    // Set timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!isComplete) {
        const timeoutError = new Error(`Bootstrap timeout reached after ${timeout}ms`);
        console.error('[Bootstrap] Loading timeout:', timeoutError);
        setError(timeoutError);
      }
    }, timeout);
    
    return () => clearTimeout(timeoutId);
  }, [onComplete, timeout, isComplete]);
  
  // If there's an error during bootstrap
  if (error) {
    return (
      <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center p-4">
        <div className="max-w-md p-6 bg-black/30 rounded-lg border border-red-500 text-center">
          <h2 className="text-xl text-puzzle-gold mb-4">Bootstrap Error</h2>
          <p className="text-white mb-4">There was a problem loading the application:</p>
          <div className="bg-red-900/20 p-3 rounded mb-4">
            <p className="text-red-400">{error.message}</p>
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Stage: {loadingStage}<br />
            Elapsed: {Math.round(elapsedTime / 100) / 10}s
          </div>
          <button
            className="w-full bg-puzzle-aqua text-black px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  
  // When loading is complete, render children
  if (isComplete) {
    return children || null;
  }
  
  // Otherwise show the bootstrap loader
  return fallback || (
    <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center">
      <Loading size="large" color="aqua" message={`Loading ${loadingStage}...`} />
      <div className="mt-4 text-xs text-gray-500">
        Elapsed: {Math.round(elapsedTime / 100) / 10}s
      </div>
    </div>
  );
};

export default BootstrapLoader;
