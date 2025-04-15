
/**
 * Diagnostic settings configuration
 * Centralized configuration for all diagnostic and debugging features
 */

// Default settings - can be overridden via localStorage
export const defaultDiagnosticSettings = {
  // General settings
  enabled: true,
  verbose: false,
  
  // Timeout settings
  timeoutDetection: {
    enabled: true,
    threshold: 8000, // 8 seconds before warning (increased from previous 5s)
    showWarning: true,
    persistDismissed: true
  },
  
  // Console logging settings
  logging: {
    authEvents: true,
    routeChanges: true,
    apiCalls: false,
    stateChanges: false
  },
  
  // UI display settings
  display: {
    showDiagnosticsInUI: true,
    expandedByDefault: false,
    maxLogEntries: 20,
    refreshInterval: 2000
  }
};

/**
 * Loads diagnostic settings from localStorage or uses defaults
 */
export const loadDiagnosticSettings = () => {
  try {
    const storedSettings = localStorage.getItem('diagnostic-settings');
    return storedSettings ? 
      { ...defaultDiagnosticSettings, ...JSON.parse(storedSettings) } : 
      defaultDiagnosticSettings;
  } catch (error) {
    console.error('Error loading diagnostic settings:', error);
    return defaultDiagnosticSettings;
  }
};

/**
 * Saves diagnostic settings to localStorage
 */
export const saveDiagnosticSettings = (settings) => {
  try {
    localStorage.setItem('diagnostic-settings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving diagnostic settings:', error);
    return false;
  }
};

/**
 * Dismisses a specific warning permanently
 */
export const dismissWarning = (warningId) => {
  try {
    const dismissedWarnings = JSON.parse(localStorage.getItem('dismissed-warnings') || '[]');
    if (!dismissedWarnings.includes(warningId)) {
      dismissedWarnings.push(warningId);
      localStorage.setItem('dismissed-warnings', JSON.stringify(dismissedWarnings));
    }
    return true;
  } catch (error) {
    console.error('Error dismissing warning:', error);
    return false;
  }
};

/**
 * Checks if a warning has been dismissed
 */
export const isWarningDismissed = (warningId) => {
  try {
    const dismissedWarnings = JSON.parse(localStorage.getItem('dismissed-warnings') || '[]');
    return dismissedWarnings.includes(warningId);
  } catch (error) {
    console.error('Error checking dismissed warnings:', error);
    return false;
  }
};

// Export a global diagnostic configuration object
const diagnosticConfig = {
  settings: loadDiagnosticSettings(),
  load: loadDiagnosticSettings,
  save: saveDiagnosticSettings,
  dismissWarning,
  isWarningDismissed,
  
  // Utility for developers
  reset: () => {
    try {
      localStorage.removeItem('diagnostic-settings');
      localStorage.removeItem('dismissed-warnings');
      console.log('Diagnostic settings reset to defaults');
      return true;
    } catch (error) {
      console.error('Error resetting diagnostic settings:', error);
      return false;
    }
  }
};

// Expose configuration globally in development mode
if (process.env.NODE_ENV === 'development') {
  window.__diagnosticConfig = diagnosticConfig;
}

export default diagnosticConfig;
