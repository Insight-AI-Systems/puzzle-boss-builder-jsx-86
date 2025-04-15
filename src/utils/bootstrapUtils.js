
/**
 * Utility functions for managing bootstrap stages and logging
 */

// Debug logger for bootstrap process
export const logBootstrapStage = (stage, status, startTime) => {
  if (process.env.NODE_ENV === 'development') {
    const timeFromStart = Date.now() - startTime;
    console.log(`[Bootstrap] ${stage.name} (${timeFromStart}ms): ${status}`);
  }
};

// Create a loading step entry
export const createLoadingStep = (stage, status, startTime) => ({
  stage: stage.name,
  description: stage.description,
  status,
  timestamp: Date.now(),
  timeFromStart: Date.now() - startTime
});

// Check if timeout warning should be shown
export const shouldShowTimeoutWarning = (elapsedTime, timeout, isComplete) => {
  return elapsedTime > timeout/2 && !isComplete;
};

// Get current stage info
export const getCurrentStageInfo = (stages, currentStepIndex) => {
  return stages[currentStepIndex] || { name: 'unknown', description: 'Loading...' };
};

// Format elapsed time for display
export const formatElapsedTime = (elapsedTime) => {
  return `${Math.round(elapsedTime / 100) / 10}s`;
};

// Calculate bootstrap progress percentage
export const calculateProgress = (currentStepIndex, totalStages) => {
  return (currentStepIndex / (totalStages - 1)) * 100;
};

