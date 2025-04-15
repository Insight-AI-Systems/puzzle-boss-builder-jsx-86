
import React from 'react';
import { useBootstrapStages } from '@/hooks/useBootstrapStages';
import BootstrapError from './BootstrapError';
import BootstrapTimeoutWarning from './BootstrapTimeoutWarning';
import BootstrapProgress from './BootstrapProgress';
import { bootstrapConfig } from '@/config/bootstrapConfig';

const BootstrapLoader = ({ 
  onComplete, 
  children,
  fallback = bootstrapConfig.defaultFallback,
  timeout = bootstrapConfig.defaultTimeout 
}) => {
  const {
    loadingStage,
    loadingSteps,
    currentStepIndex,
    error,
    isComplete,
    elapsedTime,
    timeoutReached,
    stages
  } = useBootstrapStages({ onComplete, timeout });
  
  // Handler for "Continue Anyway" button
  const handleContinueAnyway = () => {
    if (onComplete) onComplete();
  };
  
  // Handler for "Try Minimal Mode" button
  const handleSwitchToMinimal = () => {
    // Use window.appRecovery if available, otherwise direct URL change
    if (window.appRecovery && window.appRecovery.switchMode) {
      window.appRecovery.switchMode('minimal');
    } else {
      window.location = bootstrapConfig.minimalModeUrl;
    }
  };
  
  // If there's an error during bootstrap
  if (error) {
    return (
      <BootstrapError 
        error={error}
        onReload={() => window.location.reload()}
        onSwitchToMinimal={handleSwitchToMinimal}
      />
    );
  }
  
  // When loading is complete, render children
  if (isComplete) {
    return children || null;
  }
  
  // Show timeout warning if loading takes too long
  if (timeoutReached) {
    return (
      <BootstrapTimeoutWarning
        loadingStage={loadingStage}
        loadingSteps={loadingSteps}
        currentStepIndex={currentStepIndex}
        elapsedTime={elapsedTime}
        stages={stages}
        onContinue={handleContinueAnyway}
        onSwitchToMinimal={handleSwitchToMinimal}
      />
    );
  }
  
  // Otherwise show the bootstrap loader with detailed progress
  return fallback || (
    <BootstrapProgress
      currentStepIndex={currentStepIndex}
      stages={stages}
      elapsedTime={elapsedTime}
    />
  );
};

export default BootstrapLoader;
