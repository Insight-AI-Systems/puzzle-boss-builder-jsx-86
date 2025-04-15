
import diagnosticConfig, { 
  loadDiagnosticSettings, 
  saveDiagnosticSettings,
  isWarningDismissed as checkWarningDismissed,
  dismissWarning as dismissWarningAction
} from '@/config/diagnosticSettings';

/**
 * Determines if the app is in minimal mode from URL or localStorage
 * @returns {boolean} True if the app is in minimal mode
 */
export function determineMinimalMode() {
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
}

/**
 * Loads diagnostic settings from localStorage or uses defaults
 * @returns {Object} The diagnostic settings
 */
export function loadSettings() {
  return loadDiagnosticSettings();
}

/**
 * Saves diagnostic settings to localStorage
 * @param {Object} settings - The settings to save
 * @returns {boolean} True if save was successful
 */
export function saveSettings(settings) {
  return saveDiagnosticSettings(settings);
}

/**
 * Dismisses a specific warning permanently
 * @param {string} warningId - The ID of the warning to dismiss
 * @returns {boolean} True if dismissal was successful
 */
export function dismissWarning(warningId) {
  return dismissWarningAction(warningId);
}

/**
 * Checks if a warning has been dismissed
 * @param {string} warningId - The ID of the warning to check
 * @returns {boolean} True if the warning has been dismissed
 */
export function isWarningDismissed(warningId) {
  return checkWarningDismissed(warningId);
}

/**
 * Gets the default diagnostic settings
 * @returns {Object} The default diagnostic settings
 */
export function getDefaultSettings() {
  return diagnosticConfig.settings;
}

/**
 * Creates a mode transition object
 * @param {boolean} active - Whether the transition is active
 * @param {string|null} target - The target mode
 * @returns {Object} The mode transition object
 */
export function createModeTransition(active, target) {
  return {
    active,
    target,
    startTime: active ? Date.now() : null
  };
}
