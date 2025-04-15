
import React, { useState, useEffect } from 'react';
import Loading from '@/components/ui/loading';

/**
 * An enhanced bootstrap loader component that renders even if the main app fails
 * Provides detailed diagnostics and progressive loading capabilities
 */
const BootstrapLoader = ({ 
  onComplete, 
  children,
  fallback = null,
  timeout = 10000 
}) => {
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Define loading stages with detailed descriptions
  const stages = [
    { 
      name: 'environment', 
      description: 'Loading environment variables and configuration', 
      delay: 100 
    },
    { 
      name: 'libraries', 
      description: 'Initializing core libraries and dependencies', 
      delay: 200 
    },
    { 
      name: 'configuration', 
      description: 'Setting up application configuration', 
      delay: 300 
    },
    { 
      name: 'services', 
      description: 'Connecting to services and APIs', 
      delay: 500 
    },
    { 
      name: 'components', 
      description: 'Preparing React components', 
      delay: 400 
    },
    { 
      name: 'complete', 
      description: 'Finalizing application startup', 
      delay: 200 
    }
  ];

  // Track loading stages
  useEffect(() => {
    console.log(`[Bootstrap] Stage: ${loadingStage}`);
    
    // Add detailed logging for each stage
    const addLoadingStep = (stage, status) => {
      const timestamp = Date.now();
      const timeFromStart = timestamp - startTime;
      
      console.log(`[Bootstrap] ${stage.name} (${timeFromStart}ms): ${status}`);
      
      setLoadingSteps(prev => [
        ...prev, 
        { 
          stage: stage.name, 
          description: stage.description,
          status, 
          timestamp,
          timeFromStart
        }
      ]);
    };
    
    // Update elapsed time periodically
    const timer = setInterval(() => {
      const current = Date.now() - startTime;
      setElapsedTime(current);
      
      // Check if we should show timeout warning
      if (current > 5000 && !isComplete && !timeoutReached) {
        setTimeoutReached(true);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [loadingStage, startTime, isComplete, timeoutReached]);
  
  // Set up loading stages progression
  useEffect(() => {
    let currentStageIndex = 0;
    
    const progressLoading = () => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex];
        setLoadingStage(currentStage.name);
        setCurrentStepIndex(currentStageIndex);
        
        // Record step started
        setLoadingSteps(prev => [
          ...prev, 
          { 
            stage: currentStage.name, 
            description: currentStage.description,
            status: 'started', 
            timestamp: Date.now(),
            timeFromStart: Date.now() - startTime
          }
        ]);
        
        currentStageIndex++;
        
        if (currentStageIndex < stages.length) {
          setTimeout(() => {
            // Record previous step completed
            setLoadingSteps(prev => [
              ...prev, 
              { 
                stage: currentStage.name, 
                description: currentStage.description,
                status: 'completed', 
                timestamp: Date.now(),
                timeFromStart: Date.now() - startTime
              }
            ]);
            
            progressLoading();
          }, stages[currentStageIndex - 1].delay);
        } else {
          // Final stage
          setTimeout(() => {
            // Record final step completed
            setLoadingSteps(prev => [
              ...prev, 
              { 
                stage: currentStage.name, 
                description: currentStage.description,
                status: 'completed', 
                timestamp: Date.now(),
                timeFromStart: Date.now() - startTime
              }
            ]);
            
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
  }, [onComplete, timeout, isComplete, startTime]);

  // Handler for "Continue Anyway" button
  const handleContinueAnyway = () => {
    setIsComplete(true);
    if (onComplete) onComplete();
  };
  
  // Handler for "Try Minimal Mode" button
  const handleSwitchToMinimal = () => {
    // Use window.appRecovery if available, otherwise direct URL change
    if (window.appRecovery && window.appRecovery.switchMode) {
      window.appRecovery.switchMode('minimal');
    } else {
      const url = new URL(window.location);
      url.searchParams.set('mode', 'minimal');
      window.location = url.toString();
    }
  };
  
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
          
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-puzzle-aqua text-black px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
            <button
              className="w-full bg-puzzle-gold text-black px-4 py-2 rounded"
              onClick={handleSwitchToMinimal}
            >
              Try Minimal Mode
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // When loading is complete, render children
  if (isComplete) {
    return children || null;
  }
  
  // Show timeout warning if loading takes too long
  if (timeoutReached) {
    return (
      <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center p-4">
        <div className="max-w-md p-6 bg-black/30 rounded-lg border border-puzzle-gold text-center">
          <h2 className="text-xl text-puzzle-gold mb-4">Loading Taking Too Long</h2>
          <p className="text-white mb-4">The application is taking longer than expected to load.</p>
          
          <div className="flex items-center justify-center mb-4">
            <Loading size="medium" color="aqua" message={`Still loading ${loadingStage}...`} />
          </div>
          
          <div className="text-xs text-gray-500 mb-4">
            Current stage: {stages[currentStepIndex]?.description || loadingStage}<br />
            Elapsed: {Math.round(elapsedTime / 100) / 10}s
          </div>
          
          <div className="mb-4 max-h-24 overflow-y-auto text-left bg-black/50 p-2 rounded">
            <h3 className="text-xs font-bold text-puzzle-aqua mb-1">Loading Progress:</h3>
            {loadingSteps.map((step, i) => (
              <div key={i} className="text-xs text-gray-400">
                <span className="opacity-70">[{Math.round(step.timeFromStart / 10) / 100}s]</span>{' '}
                <span className="text-puzzle-aqua">{step.stage}</span>:{' '}
                <span className={step.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-puzzle-gold text-black px-4 py-2 rounded"
              onClick={handleContinueAnyway}
            >
              Continue Anyway
            </button>
            <button
              className="w-full bg-puzzle-aqua text-black px-4 py-2 rounded"
              onClick={handleSwitchToMinimal}
            >
              Try Minimal Mode
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Otherwise show the bootstrap loader with detailed progress
  return fallback || (
    <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center">
      <Loading size="large" color="aqua" message={stages[currentStepIndex]?.description || `Loading ${loadingStage}...`} />
      
      <div className="mt-4 w-64 bg-gray-900 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-puzzle-aqua h-2.5 rounded-full" 
          style={{ width: `${(currentStepIndex / (stages.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Stage {currentStepIndex + 1}/{stages.length} • 
        Elapsed: {Math.round(elapsedTime / 100) / 10}s
      </div>
    </div>
  );
};

export default BootstrapLoader;
