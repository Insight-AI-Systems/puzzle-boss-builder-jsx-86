
/**
 * Debug utility functions with production-safe logging
 */

// Debug levels
export enum DebugLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4
}

// Current app debug level - can be adjusted based on environment
let currentDebugLevel: DebugLevel = process.env.NODE_ENV === 'development' ? DebugLevel.INFO : DebugLevel.ERROR;

// Feature flags for different types of logging
const debugFlags = {
  auth: process.env.NODE_ENV === 'development',
  admin: process.env.NODE_ENV === 'development',
  puzzles: false, // Usually too verbose
  finance: process.env.NODE_ENV === 'development',
  testing: false, // Only enable when needed
  general: process.env.NODE_ENV === 'development'
};

/**
 * Check if logging is enabled for a specific feature
 */
function isLoggingEnabled(feature: keyof typeof debugFlags): boolean {
  return debugFlags[feature] && process.env.NODE_ENV === 'development';
}

/**
 * Log a debug message with component name and customizable color
 */
export function debugLog(
  componentName: string, 
  message: string, 
  level: DebugLevel = DebugLevel.INFO,
  data?: any,
  feature: keyof typeof debugFlags = 'general'
): void {
  // Skip if logging disabled for this feature
  if (!isLoggingEnabled(feature)) return;
  
  // Only log if level is less than or equal to current debug level
  if (level > currentDebugLevel) return;

  const timestamp = new Date().toISOString();
  
  // Select color based on level
  let consoleStyle = '';
  let logFunction = console.log;
  
  switch (level) {
    case DebugLevel.ERROR:
      consoleStyle = 'background: #FF5555; color: white; padding: 2px 4px; border-radius: 2px;';
      logFunction = console.error;
      break;
    case DebugLevel.WARN:
      consoleStyle = 'background: #FFAA00; color: black; padding: 2px 4px; border-radius: 2px;';
      logFunction = console.warn;
      break;
    case DebugLevel.INFO:
      consoleStyle = 'background: #55AAFF; color: white; padding: 2px 4px; border-radius: 2px;';
      break;
    case DebugLevel.DEBUG:
      consoleStyle = 'background: #55FF55; color: black; padding: 2px 4px; border-radius: 2px;';
      break;
    case DebugLevel.VERBOSE:
      consoleStyle = 'background: #AAAAAA; color: black; padding: 2px 4px; border-radius: 2px;';
      break;
  }
  
  // Log with component name highlighted
  if (data !== undefined) {
    logFunction(`%c${componentName}%c [${timestamp}] ${message}`, consoleStyle, '', data);
  } else {
    logFunction(`%c${componentName}%c [${timestamp}] ${message}`, consoleStyle, '');
  }
}

/**
 * Set the current debug level
 */
export function setDebugLevel(level: DebugLevel): void {
  currentDebugLevel = level;
  debugLog('Debug', `Debug level set to: ${DebugLevel[level]}`, DebugLevel.INFO);
}

/**
 * Enable/disable logging for specific features
 */
export function setDebugFlag(feature: keyof typeof debugFlags, enabled: boolean): void {
  debugFlags[feature] = enabled;
  debugLog('Debug', `${feature} logging ${enabled ? 'enabled' : 'disabled'}`, DebugLevel.INFO);
}

/**
 * Specialized logging functions for different features
 */
export const authLog = (component: string, message: string, level: DebugLevel = DebugLevel.INFO, data?: any) => 
  debugLog(component, message, level, data, 'auth');

export const adminLog = (component: string, message: string, level: DebugLevel = DebugLevel.INFO, data?: any) => 
  debugLog(component, message, level, data, 'admin');

export const puzzleLog = (component: string, message: string, level: DebugLevel = DebugLevel.INFO, data?: any) => 
  debugLog(component, message, level, data, 'puzzles');

export const financeLog = (component: string, message: string, level: DebugLevel = DebugLevel.INFO, data?: any) => 
  debugLog(component, message, level, data, 'finance');

export const testingLog = (component: string, message: string, level: DebugLevel = DebugLevel.INFO, data?: any) => 
  debugLog(component, message, level, data, 'testing');

/**
 * Production-safe console replacement
 * Only logs errors in production, everything else in development
 */
export const safeConsole = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args); // Always log errors
  },
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(message, ...args);
    }
  }
};
