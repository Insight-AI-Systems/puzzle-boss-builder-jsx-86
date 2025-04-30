
/**
 * Debug utility functions
 */

// Debug levels
export enum DebugLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4
}

// Current app debug level - can be adjusted
let currentDebugLevel: DebugLevel = DebugLevel.INFO;

/**
 * Log a debug message with component name and customizable color
 */
export function debugLog(
  componentName: string, 
  message: string, 
  level: DebugLevel = DebugLevel.INFO,
  data?: any
): void {
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
