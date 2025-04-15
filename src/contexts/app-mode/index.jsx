
import React, { createContext, useContext, useState, useEffect } from 'react';
import DiagnosticLog from '@/components/DiagnosticLog';
import diagnosticConfig, { 
  loadDiagnosticSettings, 
  saveDiagnosticSettings, 
  isWarningDismissed,
  dismissWarning as dismissWarningUtil
} from '@/config/diagnosticSettings';

// Create the context with extended default values
const AppModeContext = createContext({
  isMinimal: false,
  toggleMode: () => {},
  diagnosticSettings: diagnosticConfig.settings,
  updateDiagnosticSettings: () => {},
  dismissWarning: () => {},
  isWarningDismissed: () => false
});

export function AppModeProvider({ children }) {
  // App mode state
  const [isMinimal, setIsMinimal] = useState(() => {
    try {
      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('minimal')) {
        return urlParams.get('minimal') === 'true';
      }
      // Then check localStorage
      const stored = localStorage.getItem('app-mode');
      return stored ? stored === 'minimal' : false;
    } catch (error) {
      console.error('Error determining app mode:', error);
      // Default to false if there's an error
      return false;
    }
  });

  // Diagnostic settings with configurable timeout
  const [diagnosticSettings, setDiagnosticSettings] = useState(loadDiagnosticSettings);

  // ModeTransition state for visual indicators
  const [modeTransition, setModeTransition] = useState({
    active: false,
    target: null,
    startTime: null
  });

  // Persist mode changes
  useEffect(() => {
    try {
      localStorage.setItem('app-mode', isMinimal ? 'minimal' : 'full');
      console.log(`[APP_MODE] Switched to ${isMinimal ? 'minimal' : 'full'} mode`);
      
      // Trigger mode transition animation
      setModeTransition({
        active: true,
        target: isMinimal ? 'minimal' : 'full',
        startTime: Date.now()
      });
      
      // Clear transition state after animation completes
      const timeoutId = setTimeout(() => {
        setModeTransition(prev => ({ ...prev, active: false }));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Failed to save app mode to localStorage:', error);
    }
  }, [isMinimal]);

  // Persist diagnostic settings
  useEffect(() => {
    saveDiagnosticSettings(diagnosticSettings);
  }, [diagnosticSettings]);

  // Toggle between minimal and full mode
  const toggleMode = () => {
    setIsMinimal(prev => !prev);
  };

  // Update diagnostic settings
  const updateDiagnosticSettings = (updates) => {
    setDiagnosticSettings(prev => {
      const newSettings = { ...prev, ...updates };
      saveDiagnosticSettings(newSettings);
      return newSettings;
    });
  };

  // Dismiss a specific warning
  const dismissWarning = (warningId) => {
    dismissWarningUtil(warningId);
  };

  const contextValue = {
    isMinimal,
    toggleMode,
    modeTransition,
    diagnosticSettings,
    updateDiagnosticSettings,
    dismissWarning,
    isWarningDismissed
  };

  return (
    <AppModeContext.Provider value={contextValue}>
      <div className={`app-container ${modeTransition.active ? 'mode-transition' : ''}`} data-mode={isMinimal ? 'minimal' : 'full'}>
        {children}
        {/* Only show DiagnosticLog in full mode when enabled */}
        {!isMinimal && diagnosticSettings.display.showDiagnosticsInUI && (
          <DiagnosticLog 
            maxEntries={diagnosticSettings.display.maxLogEntries} 
            expanded={diagnosticSettings.display.expandedByDefault}
          />
        )}
      </div>
    </AppModeContext.Provider>
  );
}

// Higher-order component for wrapping components that need app mode
export function withAppMode(Component) {
  return function WrappedComponent(props) {
    // Try to use context, fall back to default values if not available
    const context = useContext(AppModeContext);
    return <Component {...props} appMode={context} />;
  };
}

// Safe hook version that provides fallback values
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
      diagnosticSettings: diagnosticConfig.settings,
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

// Create a standalone function to check the current mode without using hooks
export function getAppMode() {
  try {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('minimal')) {
      return urlParams.get('minimal') === 'true';
    }
    // Then check localStorage
    const stored = localStorage.getItem('app-mode');
    return stored ? stored === 'minimal' : false;
  } catch (error) {
    console.error('Error checking app mode:', error);
    return false;
  }
}
