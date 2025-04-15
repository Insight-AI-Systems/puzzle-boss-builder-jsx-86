
import React from 'react';
import StandaloneApp from '../StandaloneApp';

/**
 * StandaloneModeHandler detects if the application should run in standalone mode
 * based on URL parameters and renders the appropriate component
 */
const StandaloneModeHandler = () => {
  // Handle standalone mode from URL
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  console.log('[StandaloneModeHandler] Standalone mode:', isStandalone);
  
  // Only return StandaloneApp in standalone mode
  if (isStandalone) {
    return <StandaloneApp />;
  }
  
  // Return null if not in standalone mode
  // This should never happen because this component should only
  // be rendered when standalone=true
  console.warn('[StandaloneModeHandler] Not in standalone mode but handler was rendered');
  return null;
};

export default StandaloneModeHandler;
