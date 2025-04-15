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
  // Determine initial app mode from URL and localStorage
  const getInitialMode = () => {
    try {
      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('mode')) {
        const mode = urlParams.get('mode');
        if (['minimal', 'normal', 'emergency'].includes(mode)) {
          console.log(`[APP_MODE] Using mode from URL parameter: ${mode}`);
          return mode === 'minimal';
        }
      }
      
      if (urlParams.has('minimal')) {
        console.log('[APP_MODE] Using minimal mode from URL parameter');
        return true;
      }
      
      // Fall back to stored preference
      return determineMinimalMode();
    } catch (error) {
      console.error('[APP_MODE] Error determining initial mode:', error);
      return false; // Default to full mode on error
    }
  };

  // App mode state
  const [isMinimal, setIsMinimal] = useState(getInitialMode);

  // Diagnostic settings with configurable timeout
  const [diagnosticSettings, setDiagnosticSettings] = useState(loadSettings);

  // ModeTransition state for visual indicators
  const [modeTransition, setModeTransition] = useState(createModeTransition(false, null));

  // Persist mode changes and track successful modes
  useEffect(() => {
    try {
      localStorage.setItem('app-mode', isMinimal ? 'minimal' : 'full');
      console.log(`[APP_MODE] Switched to ${isMinimal ? 'minimal' : 'full'} mode`);
      
      // Update last successful mode after a delay to ensure it rendered
      const successTimeoutId = setTimeout(() => {
        try {
          localStorage.setItem(
            'app-last-successful-mode', 
            isMinimal ? 'minimal' : 'normal'
          );
          console.log(`[APP_MODE] Marked ${isMinimal ? 'minimal' : 'normal'} mode as successful`);
        } catch (error) {
          console.error('[APP_MODE] Error saving successful mode:', error);
        }
      }, 2000);
      
      // Trigger mode transition animation
      setModeTransition(createModeTransition(true, isMinimal ? 'minimal' : 'full'));
      
      // Clear transition state after animation completes
      const transitionTimeoutId = setTimeout(() => {
        setModeTransition(prev => ({ ...prev, active: false }));
      }, 1000);
      
      return () => {
        clearTimeout(transitionTimeoutId);
        clearTimeout(successTimeoutId);
      };
    } catch (error) {
      console.error('[APP_MODE] Failed to save app mode to localStorage:', error);
    }
  }, [isMinimal]);

  // Persist diagnostic settings
  useEffect(() => {
    saveSettings(diagnosticSettings);
  }, [diagnosticSettings]);

  // Switch between minimal and full mode
  const toggleMode = () => {
    console.log('[APP_MODE] Toggling mode...');
    
    // Use direct mode switching if available
    if (window.appRecovery && window.appRecovery.switchMode) {
      const newMode = isMinimal ? 'normal' : 'minimal';
      console.log(`[APP_MODE] Switching to ${newMode} mode using appRecovery`);
      window.appRecovery.switchMode(newMode);
      return;
    }
    
    // Otherwise use state toggle
    setIsMinimal(prev => !prev);
  };

  // Function to switch to a specific mode
  const switchToMode = (mode) => {
    console.log(`[APP_MODE] Switching to ${mode} mode...`);
    
    // Use direct mode switching if available
    if (window.appRecovery && window.appRecovery.switchMode) {
      console.log(`[APP_MODE] Using appRecovery to switch to ${mode} mode`);
      window.appRecovery.switchMode(mode);
      return;
    }
    
    // Handle by URL updating
    try {
      const url = new URL(window.location);
      url.searchParams.set('mode', mode);
      window.location = url.toString();
    } catch (error) {
      console.error(`[APP_MODE] Error switching to ${mode} mode:`, error);
      
      // Fallback to basic toggle for minimal/normal
      if (mode === 'minimal') {
        setIsMinimal(true);
      } else if (mode === 'normal') {
        setIsMinimal(false);
      }
    }
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
    switchToMode,
    modeTransition,
    diagnosticSettings,
    updateDiagnosticSettings,
    dismissWarning,
    isWarningDismissed
  };

  return (
    <AppModeContext.Provider value={contextValue}>
      <div 
        className={`app-container ${modeTransition.active ? 'mode-transition' : ''}`} 
        data-mode={isMinimal ? 'minimal' : 'full'}
      >
        {children}
        
        {/* Only show DiagnosticLog in full mode when enabled */}
        {!isMinimal && diagnosticSettings?.display?.showDiagnosticsInUI && (
          <DiagnosticLog 
            maxEntries={diagnosticSettings?.display?.maxLogEntries || 20} 
            expanded={diagnosticSettings?.display?.expandedByDefault} 
          />
        )}
      </div>
    </AppModeContext.Provider>
  );
}

export default AppModeProvider;
