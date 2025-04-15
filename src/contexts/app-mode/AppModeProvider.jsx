
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
 * Enhanced AppModeProvider with progressive loading support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AppModeProvider({ children }) {
  // Determine initial app mode from URL and localStorage with enhanced fallbacks
  const getInitialMode = () => {
    try {
      console.log('[APP_MODE] Determining initial mode');
      
      // First priority: Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('mode')) {
        const mode = urlParams.get('mode');
        if (['minimal', 'normal', 'emergency', 'progressive'].includes(mode)) {
          console.log(`[APP_MODE] Using mode from URL parameter: ${mode}`);
          return mode === 'minimal' || mode === 'progressive';
        }
      }
      
      if (urlParams.has('minimal')) {
        console.log('[APP_MODE] Using minimal mode from URL parameter');
        return true;
      }
      
      // Second priority: Check for recent successful mode
      try {
        const lastSuccessfulMode = localStorage.getItem('app-last-successful-mode');
        if (lastSuccessfulMode) {
          console.log(`[APP_MODE] Found last successful mode: ${lastSuccessfulMode}`);
          return lastSuccessfulMode === 'minimal';
        }
      } catch (e) {
        console.warn('[APP_MODE] Error checking last successful mode:', e);
      }
      
      // Fall back to stored preference
      return determineMinimalMode();
    } catch (error) {
      console.error('[APP_MODE] Error determining initial mode:', error);
      // Default to minimal mode on error for safety
      return true;
    }
  };

  // App mode state with initialization logging
  const [isMinimal, setIsMinimal] = useState(() => {
    const mode = getInitialMode();
    console.log(`[APP_MODE] Initial mode set to: ${mode ? 'minimal' : 'full'}`);
    return mode;
  });

  // Loading stage tracking for progressive mode
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingErrors, setLoadingErrors] = useState([]);
  const [progressiveLoading, setProgressiveLoading] = useState(false);

  // Diagnostic settings with configurable timeout
  const [diagnosticSettings, setDiagnosticSettings] = useState(loadSettings);

  // ModeTransition state for visual indicators
  const [modeTransition, setModeTransition] = useState(createModeTransition(false, null));

  // Set up progressive loading stages if needed
  useEffect(() => {
    // Check if we should use progressive loading
    const urlParams = new URLSearchParams(window.location.search);
    const useProgressiveLoading = urlParams.get('mode') === 'progressive';
    
    if (useProgressiveLoading) {
      console.log('[APP_MODE] Using progressive loading mode');
      setProgressiveLoading(true);
      
      // Define progressive loading stages
      const stages = [
        { name: 'core', description: 'Loading core application' },
        { name: 'ui', description: 'Loading user interface' },
        { name: 'auth', description: 'Initializing authentication' },
        { name: 'data', description: 'Loading data services' },
        { name: 'features', description: 'Loading application features' },
        { name: 'complete', description: 'Finalizing application startup' }
      ];
      
      // Simulate progressive loading - in a real implementation,
      // you would trigger these when actual components load
      let currentStage = 0;
      const progressInterval = setInterval(() => {
        if (currentStage < stages.length - 1) {
          currentStage++;
          setLoadingStage(stages[currentStage].name);
          setLoadingProgress((currentStage / (stages.length - 1)) * 100);
          console.log(`[APP_MODE] Progressive loading: ${stages[currentStage].description} (${Math.round((currentStage / (stages.length - 1)) * 100)}%)`);
        } else {
          clearInterval(progressInterval);
          
          // Once complete, switch to full mode
          setTimeout(() => {
            console.log('[APP_MODE] Progressive loading complete, switching to full mode');
            setIsMinimal(false);
            setProgressiveLoading(false);
          }, 500);
        }
      }, 800);
      
      return () => clearInterval(progressInterval);
    }
  }, []);

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
      } else if (mode === 'progressive') {
        setIsMinimal(true);
        setProgressiveLoading(true);
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
  
  // Log errors during progressive loading
  const logLoadingError = (componentName, error) => {
    console.error(`[APP_MODE] Error loading component "${componentName}":`, error);
    setLoadingErrors(prev => [...prev, { 
      component: componentName, 
      message: error.message, 
      timestamp: new Date().toISOString() 
    }]);
  };

  const contextValue = {
    isMinimal,
    toggleMode,
    switchToMode,
    modeTransition,
    diagnosticSettings,
    updateDiagnosticSettings,
    dismissWarning,
    isWarningDismissed,
    // Progressive loading values
    progressiveLoading,
    loadingStage,
    loadingProgress,
    loadingErrors,
    logLoadingError
  };

  // Show progressive loading UI if in that mode
  if (progressiveLoading) {
    return (
      <AppModeContext.Provider value={contextValue}>
        <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center">
          <div className="max-w-md p-6 bg-black/50 border border-puzzle-aqua rounded-lg text-center">
            <h2 className="text-2xl text-puzzle-gold mb-2">Progressive Loading</h2>
            <p className="text-puzzle-aqua mb-4">{loadingStage}</p>
            
            <div className="w-full bg-gray-900 rounded-full h-2.5 mb-4">
              <div 
                className="bg-puzzle-aqua h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            
            <p className="text-white text-sm mb-4">
              Loading components progressively to ensure stability...
            </p>
            
            {loadingErrors.length > 0 && (
              <div className="mt-4 p-2 bg-black/50 rounded text-left">
                <h3 className="text-red-400 text-sm font-bold mb-1">Loading Errors:</h3>
                <div className="max-h-24 overflow-y-auto">
                  {loadingErrors.map((error, i) => (
                    <div key={i} className="text-xs text-red-300 mb-1">
                      <strong>{error.component}:</strong> {error.message}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => switchToMode('minimal')}
                  className="w-full mt-2 px-2 py-1 bg-puzzle-gold text-black rounded text-sm"
                >
                  Switch to Minimal Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </AppModeContext.Provider>
    );
  }

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
