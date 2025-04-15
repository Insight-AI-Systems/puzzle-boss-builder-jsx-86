
/**
 * @typedef {Object} ModeTransition
 * @property {boolean} active - Whether a transition is currently active
 * @property {string|null} target - The target mode ('minimal' or 'full')
 * @property {number|null} startTime - Timestamp when the transition started
 */

/**
 * @typedef {Object} DiagnosticSettings
 * @property {boolean} enabled - Whether diagnostics are enabled
 * @property {boolean} verbose - Whether to show verbose logs
 * @property {Object} timeoutDetection - Timeout detection settings
 * @property {boolean} timeoutDetection.enabled - Whether timeout detection is enabled
 * @property {number} timeoutDetection.threshold - Timeout threshold in milliseconds
 * @property {boolean} timeoutDetection.showWarning - Whether to show timeout warnings
 * @property {boolean} timeoutDetection.persistDismissed - Whether to persist dismissed warnings
 * @property {Object} logging - Logging settings
 * @property {boolean} logging.authEvents - Whether to log auth events
 * @property {boolean} logging.routeChanges - Whether to log route changes
 * @property {boolean} logging.apiCalls - Whether to log API calls
 * @property {boolean} logging.stateChanges - Whether to log state changes
 * @property {Object} display - Display settings
 * @property {boolean} display.showDiagnosticsInUI - Whether to show diagnostics in the UI
 * @property {boolean} display.expandedByDefault - Whether to expand the diagnostics panel by default
 * @property {number} display.maxLogEntries - Maximum number of log entries to display
 * @property {number} display.refreshInterval - Refresh interval in milliseconds
 */

/**
 * @typedef {Object} AppModeContextValue
 * @property {boolean} isMinimal - Whether the app is in minimal mode
 * @property {Function} toggleMode - Function to toggle between minimal and full mode
 * @property {ModeTransition} modeTransition - Mode transition state
 * @property {DiagnosticSettings} diagnosticSettings - Diagnostic settings
 * @property {Function} updateDiagnosticSettings - Function to update diagnostic settings
 * @property {Function} dismissWarning - Function to dismiss a warning
 * @property {Function} isWarningDismissed - Function to check if a warning is dismissed
 */

export {}; // Export empty object to make this a module
