
import { useState, useEffect } from 'react';
import { bootstrapStages, bootstrapConfig } from '@/config/bootstrapConfig';

export const useBootstrapStages = ({ onComplete, timeout = bootstrapConfig.defaultTimeout }) => {
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Track loading stages
  useEffect(() => {
    if (bootstrapConfig.debugEnabled) {
      console.log(`[Bootstrap] Stage: ${loadingStage}`);
    }
    
    // Add detailed logging for each stage
    const addLoadingStep = (stage, status) => {
      const timestamp = Date.now();
      const timeFromStart = timestamp - startTime;
      
      if (bootstrapConfig.debugEnabled) {
        console.log(`[Bootstrap] ${stage.name} (${timeFromStart}ms): ${status}`);
      }
      
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
      if (current > timeout/2 && !isComplete && !timeoutReached) {
        setTimeoutReached(true);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [loadingStage, startTime, isComplete, timeoutReached, timeout]);
  
  // Set up loading stages progression
  useEffect(() => {
    let currentStageIndex = 0;
    
    const progressLoading = () => {
      if (currentStageIndex < bootstrapStages.length) {
        const currentStage = bootstrapStages[currentStageIndex];
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
        
        if (currentStageIndex < bootstrapStages.length) {
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
          }, currentStage.delay);
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

  return {
    loadingStage,
    loadingSteps,
    currentStepIndex,
    error,
    isComplete,
    elapsedTime,
    timeoutReached,
    stages: bootstrapStages
  };
};
