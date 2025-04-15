
import { useContext } from 'react';
import { AppModeContext } from './AppModeContext';

/**
 * Hook for accessing the AppMode context
 * @returns {import('./types').AppModeContextValue} The app mode context value
 */
export const useAppMode = () => {
  const context = useContext(AppModeContext);
  
  if (!context) {
    console.warn('useAppMode called outside of AppModeProvider - using default values');
    // Provide default implementation when context is missing
    return {
      isMinimal: false,
      toggleMode: () => {
        console.log('Toggle mode called but context is not available');
        // Try to set URL parameter as fallback
        const url = new URL(window.location.href);
        url.searchParams.set('minimal', 'true');
        window.location.href = url.toString();
      },
      diagnosticSettings: {
        enabled: true,
        verbose: false,
        timeoutDetection: {
          enabled: true,
          threshold: 8000,
          showWarning: true,
          persistDismissed: true
        },
        logging: {
          authEvents: true,
          routeChanges: true,
          apiCalls: false,
          stateChanges: false
        },
        display: {
          showDiagnosticsInUI: true,
          expandedByDefault: false,
          maxLogEntries: 20,
          refreshInterval: 2000
        }
      },
      updateDiagnosticSettings: () => {
        console.warn('updateDiagnosticSettings called outside provider');
      },
      dismissWarning: () => {
        console.warn('dismissWarning called outside provider');
      },
      isWarningDismissed: () => false
    };
  }
  
  return context;
};

export default useAppMode;
