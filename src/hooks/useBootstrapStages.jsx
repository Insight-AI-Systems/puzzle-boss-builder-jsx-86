
import { useState, useEffect } from 'react';
import { bootstrapStages, bootstrapConfig } from '@/config/bootstrapConfig';
import {
  logBootstrapStage,
  createLoadingStep,
  shouldShowTimeoutWarning
} from '@/utils/bootstrapUtils';

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
    // Update elapsed time periodically
    const timer = setInterval(() => {
      const current = Date.now() - startTime;
      setElapsedTime(current);
      
      // Check if we should show timeout warning
      if (shouldShowTimeoutWarning(current, timeout, isComplete)) {
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
        
        // Log and record step started
        logBootstrapStage(currentStage, 'started', startTime);
        setLoadingSteps(prev => [...prev, createLoadingStep(currentStage, 'started', startTime)]);
        
        currentStageIndex++;
        
        if (currentStageIndex < bootstrapStages.length) {
          setTimeout(() => {
            // Log and record previous step completed
            logBootstrapStage(currentStage, 'completed', startTime);
            setLoadingSteps(prev => [...prev, createLoadingStep(currentStage, 'completed', startTime)]);
            
            progressLoading();
          }, currentStage.delay);
        } else {
          // Final stage
          setTimeout(() => {
            // Log and record final step completed
            logBootstrapStage(currentStage, 'completed', startTime);
            setLoadingSteps(prev => [...prev, createLoadingStep(currentStage, 'completed', startTime)]);
            
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

