
import React, { useState, useEffect } from 'react';
import DiagnosticLog from '@/components/DiagnosticLog';
import { AppModeContext } from './AppModeContext';
import { 
  determineMinimalMode, 
  loadSettings, 
  saveSettings, 
  dismissWarning, 
  isWarningDismissed,
  createModeTransition
} from './utils';

/**
 * Provider component for AppMode context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AppModeProvider({ children }) {
  // App mode state
  const [isMinimal, setIsMinimal] = useState(determineMinimalMode);

  // Diagnostic settings with configurable timeout
  const [diagnosticSettings, setDiagnosticSettings] = useState(loadSettings);

  // ModeTransition state for visual indicators
  const [modeTransition, setModeTransition] = useState(createModeTransition(false, null));

  // Persist mode changes
  useEffect(() => {
    try {
      localStorage.setItem('app-mode', isMinimal ? 'minimal' : 'full');
      console.log(`[APP_MODE] Switched to ${isMinimal ? 'minimal' : 'full'} mode`);
      
      // Trigger mode transition animation
      setModeTransition(createModeTransition(true, isMinimal ? 'minimal' : 'full'));
      
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
    saveSettings(diagnosticSettings);
  }, [diagnosticSettings]);

  // Toggle between minimal and full mode
  const toggleMode = () => {
    setIsMinimal(prev => !prev);
  };

  // Update diagnostic settings
  const updateDiagnosticSettings = (updates) => {
    setDiagnosticSettings(prev => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
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

export default AppModeProvider;
