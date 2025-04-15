
import React, { useEffect } from 'react';
import StandaloneApp from '../StandaloneApp';
import diagnostics from '../utils/diagnostics';

/**
 * StandaloneModeHandler detects if the application should run in standalone mode
 * based on URL parameters and renders the appropriate component
 */
const StandaloneModeHandler = () => {
  // Handle standalone mode from URL
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  useEffect(() => {
    // Log environment information when component mounts
    console.log('[StandaloneModeHandler] Initializing in standalone mode');
    console.log('[StandaloneModeHandler] Environment:', diagnostics.checkEnvironment());
    
    // Add to diagnostic log if available
    if (window.__addDiagnosticLog) {
      window.__addDiagnosticLog('StandaloneModeHandler mounted');
    }
    
    return () => {
      console.log('[StandaloneModeHandler] Unmounting');
      if (window.__addDiagnosticLog) {
        window.__addDiagnosticLog('StandaloneModeHandler unmounted');
      }
    };
  }, []);
  
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
