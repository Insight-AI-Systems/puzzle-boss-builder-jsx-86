
import React, { createContext, useContext, useState, useEffect } from 'react';
import DiagnosticLog from '@/components/DiagnosticLog';

// Create the context with default values
const AppModeContext = createContext({
  isMinimal: false,
  toggleMode: () => {}
});

export function AppModeProvider({ children }) {
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

  // Persist mode changes
  useEffect(() => {
    try {
      localStorage.setItem('app-mode', isMinimal ? 'minimal' : 'full');
      console.log(`[APP_MODE] Switched to ${isMinimal ? 'minimal' : 'full'} mode`);
    } catch (error) {
      console.error('Failed to save app mode to localStorage:', error);
    }
  }, [isMinimal]);

  const toggleMode = () => {
    setIsMinimal(prev => !prev);
  };

  const contextValue = {
    isMinimal,
    toggleMode
  };

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
      {/* Always show DiagnosticLog, but make it collapsible in full mode */}
      {!isMinimal && <DiagnosticLog maxEntries={5} />}
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
      }
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
