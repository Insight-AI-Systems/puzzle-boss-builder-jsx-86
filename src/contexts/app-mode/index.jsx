
import React, { createContext, useContext, useState, useEffect } from 'react';
import DiagnosticLog from '@/components/DiagnosticLog';

// Create the context with extended default values
const AppModeContext = createContext({
  isMinimal: false,
  toggleMode: () => {},
  diagnosticSettings: {
    enabled: true,
    timeout: 5000,
    showWarnings: true
  },
  updateDiagnosticSettings: () => {},
  dismissWarning: () => {}
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
  const [diagnosticSettings, setDiagnosticSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem('diagnostic-settings');
      return storedSettings ? JSON.parse(storedSettings) : {
        enabled: true,
        timeout: 5000, // Default timeout in ms
        showWarnings: true
      };
    } catch (error) {
      console.error('Error loading diagnostic settings:', error);
      return {
        enabled: true,
        timeout: 5000,
        showWarnings: true
      };
    }
  });

  // Warning dismissal state
  const [dismissedWarnings, setDismissedWarnings] = useState(() => {
    try {
      const stored = localStorage.getItem('dismissed-warnings');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading dismissed warnings:', error);
      return [];
    }
  });

  // Persist mode changes
  useEffect(() => {
    try {
      localStorage.setItem('app-mode', isMinimal ? 'minimal' : 'full');
      console.log(`[APP_MODE] Switched to ${isMinimal ? 'minimal' : 'full'} mode`);
    } catch (error) {
      console.error('Failed to save app mode to localStorage:', error);
    }
  }, [isMinimal]);

  // Persist diagnostic settings
  useEffect(() => {
    try {
      localStorage.setItem('diagnostic-settings', JSON.stringify(diagnosticSettings));
    } catch (error) {
      console.error('Failed to save diagnostic settings:', error);
    }
  }, [diagnosticSettings]);

  // Persist dismissed warnings
  useEffect(() => {
    try {
      localStorage.setItem('dismissed-warnings', JSON.stringify(dismissedWarnings));
    } catch (error) {
      console.error('Failed to save dismissed warnings:', error);
    }
  }, [dismissedWarnings]);

  // Toggle between minimal and full mode
  const toggleMode = () => {
    setIsMinimal(prev => !prev);
  };

  // Update diagnostic settings
  const updateDiagnosticSettings = (updates) => {
    setDiagnosticSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Dismiss a specific warning
  const dismissWarning = (warningId) => {
    if (!dismissedWarnings.includes(warningId)) {
      setDismissedWarnings(prev => [...prev, warningId]);
    }
  };

  // Check if a warning is dismissed
  const isWarningDismissed = (warningId) => {
    return dismissedWarnings.includes(warningId);
  };

  const contextValue = {
    isMinimal,
    toggleMode,
    diagnosticSettings,
    updateDiagnosticSettings,
    dismissWarning,
    isWarningDismissed
  };

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
      {/* Always show DiagnosticLog in full mode, but make it collapsible */}
      {!isMinimal && diagnosticSettings.enabled && <DiagnosticLog maxEntries={5} />}
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
      diagnosticSettings: {
        enabled: true,
        timeout: 5000,
        showWarnings: true
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
